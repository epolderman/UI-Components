import {
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  format,
  getMonth,
  getYear,
  addMonths,
  isSameDay,
  isSameMonth,
  isSameYear,
  isValid,
  parse,
  differenceInCalendarMonths,
  differenceInCalendarDays
} from 'date-fns';
import { findIndex, range, forEach } from 'lodash';

/* Utility Functions / Types for Date Components */

const DAY_NAME_FORMAT: string = 'dddd';
export const DEFAULT_DATE_FORMAT = 'dddd, MMMM D, YYYY';
export const MONTH_DAY_YEAR_FORMAT = 'M/D/YY';

export const MAX_NUMBER_WEEKS_SHOWN: number = 6;
export const CALENDAR_DIMENSIONS: number = 300;
export const MAX_TIME_SPAN: number = 1000;
export const MIDDLE_INDEX: number = 500;
export const CALENDAR_DAY_FORMAT = 'D';
export const DAYS: string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];
/* Used in DateSelector, DateTextField */
export const ENTER_KEY: number = 13;
export const isValidDateObjectFromString = (date: string) =>
  isValid(parse(date));

export const formatDate = (
  value: Date,
  isSmall: boolean,
  dateFormat?: string
) => {
  return format(
    value,
    isSmall ? MONTH_DAY_YEAR_FORMAT : dateFormat || DEFAULT_DATE_FORMAT
  );
};

interface CalendarMonthData {
  endIndex: number;
  beginIndex: number;
  daysInMonth: number;
  month: number;
  year: number;
  beginDay: string;
}

export type DateMatrix = Date[][];

const getIndexOfDay = (day: string): number =>
  findIndex(DAYS, name => day === name);

const constructDate = (monthData: CalendarMonthData, day: number) =>
  new Date(monthData.year, monthData.month, day);

const calculateMonthData = (incomingDate: Date): CalendarMonthData => ({
  endIndex: getIndexOfDay(format(endOfMonth(incomingDate), DAY_NAME_FORMAT)),
  beginIndex: getIndexOfDay(
    format(startOfMonth(incomingDate), DAY_NAME_FORMAT)
  ),
  daysInMonth: getDaysInMonth(incomingDate),
  month: getMonth(incomingDate),
  year: getYear(incomingDate),
  beginDay: format(incomingDate, DAY_NAME_FORMAT)
});

/*
      Creates a Matrix of weeks [2D array] and fills with prev, next, current dates
    [
      [prev sun, mon, ..]
      [..., 1, 2]
      [..., null, null]
      [..., null, null]
      [..., nextMonth Sun, ...]
    ]
  */
const fillMonthMatrix = (
  prevMonth: CalendarMonthData,
  currentMonth: CalendarMonthData,
  nextMonth: CalendarMonthData
): DateMatrix => {
  const endingRow =
    currentMonth.beginIndex >= 5 && currentMonth.daysInMonth >= 30
      ? 5
      : currentMonth.beginIndex === 0 && currentMonth.daysInMonth === 28
      ? 3
      : 4;
  const beginDayPrevMonth =
    currentMonth.beginIndex !== 0
      ? currentMonth.beginIndex - 1
      : currentMonth.beginIndex;

  let prevMonthDayIterator = prevMonth.daysInMonth - beginDayPrevMonth;
  let nextMonthDayIterator = 1;
  let currentMonthDayIterator = 1;

  // fill matrix
  return range(0, MAX_NUMBER_WEEKS_SHOWN).map(index => {
    const week = new Array(DAYS.length).fill(null);

    // prev month days
    if (index === 0) {
      forEach(week, (_, index) => {
        if (index < currentMonth.beginIndex) {
          week[index] = constructDate(prevMonth, prevMonthDayIterator);
          prevMonthDayIterator++;
        } else {
          week[index] = constructDate(currentMonth, currentMonthDayIterator);
          currentMonthDayIterator++;
        }
      });
      // next month days
    } else if (index === endingRow) {
      forEach(week, (_, index) => {
        if (index <= currentMonth.endIndex) {
          week[index] = constructDate(currentMonth, currentMonthDayIterator);
          currentMonthDayIterator++;
        } else {
          week[index] = constructDate(nextMonth, nextMonthDayIterator);
          nextMonthDayIterator++;
        }
      });
      // combination of current and next month days
    } else {
      if (index < endingRow) {
        forEach(week, (_, index) => {
          week[index] = constructDate(currentMonth, currentMonthDayIterator);
          currentMonthDayIterator++;
        });
      } else {
        forEach(week, (_, index) => {
          week[index] = constructDate(nextMonth, nextMonthDayIterator);
          nextMonthDayIterator++;
        });
      }
    }

    return week;
  });
};

/*
  Builds matrix of dates including prev, current, next month dates
*/
export const buildDateMatrix = (incomingDate: Date): DateMatrix => {
  const prevMonth = calculateMonthData(addMonths(incomingDate, -1));
  const nextMonth = calculateMonthData(addMonths(incomingDate, 1));
  const currentMonth = calculateMonthData(incomingDate);
  const activeMonth = fillMonthMatrix(prevMonth, currentMonth, nextMonth);
  return activeMonth;
};

export const calculateMonthOffset = (
  date: Date,
  monthOffset: number,
  dateChange: Date
): number =>
  differenceInCalendarMonths(dateChange, addMonths(date, monthOffset));

export const isSameDate = (currentDate: Date, selectedDate: Date) =>
  isSameDay(currentDate, selectedDate) &&
  isSameMonth(currentDate, selectedDate) &&
  isSameYear(currentDate, selectedDate);

/* Protection Functions */
export const hasDateReachedLimit = (initialDate: Date, newDate: Date) => {
  const changeInMonth = getMonthOffset(initialDate, newDate);
  return changeInMonth > MIDDLE_INDEX || changeInMonth < -MIDDLE_INDEX;
};

export const getMonthOffset = (firstDate: Date, secondDate: Date) =>
  differenceInCalendarMonths(firstDate, secondDate);

export const getDayOffset = (firstDate: Date, secondDate: Date) =>
  differenceInCalendarDays(firstDate, secondDate);

export const hasDateChanged = (oldDate: Date, newDate: Date) => {
  // month will capture change in years
  const changeInMonth = getMonthOffset(oldDate, newDate);
  const changeInDays = getDayOffset(oldDate, newDate);
  return changeInMonth !== 0 || changeInDays !== 0;
};
