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
  isSameYear
} from 'date-fns';
import { findIndex, range, forEach } from 'lodash';

/* Utility Functions/Types for Date Components */

const DAY_NAME_FORMAT: string = 'dddd';
export const MAX_NUMBER_WEEKS_SHOWN: number = 6;
export const CALENDAR_DIMENSIONS: number = 500;
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

type CalendarMonthData = {
  endIndex: number;
  beginIndex: number;
  daysInMonth: number;
  month: number;
  year: number;
  beginDay: string;
};

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

export const isSameDate = (currentDate: Date, selectedDate: Date) => {
  return (
    isSameDay(currentDate, selectedDate) &&
    isSameMonth(currentDate, selectedDate) &&
    isSameYear(currentDate, selectedDate)
  );
};
