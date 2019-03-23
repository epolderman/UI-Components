import {
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  format,
  getMonth,
  getYear,
  addMonths
} from 'date-fns';
import { findIndex, range, forEach } from 'lodash';

/* Utility Functions/Types for Date Components */

const DAY_NAME_FORMAT: string = 'dddd';
const MAX_NUMBER_WEEKS_SHOWN: number = 6;
export const CALENDAR_DAY_FORMAT = 'D';
const DAYS: string[] = [
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

const getIndexOfDay = (day: string): number => findIndex(DAYS, name => day === name);

const constructDate = (monthData: CalendarMonthData, day: number) =>
  new Date(monthData.year, monthData.month, day);

const calculateMonthData = (incomingDate: Date): CalendarMonthData => ({
  endIndex: getIndexOfDay(format(endOfMonth(incomingDate), DAY_NAME_FORMAT)),
  beginIndex: getIndexOfDay(format(startOfMonth(incomingDate), DAY_NAME_FORMAT)),
  daysInMonth: getDaysInMonth(incomingDate),
  month: getMonth(incomingDate),
  year: getYear(incomingDate),
  beginDay: format(incomingDate, DAY_NAME_FORMAT)
});

/*
      Creates a 2D Array where our Prev and Next Month data is shelled into the Data Structure
      returns this DS model
    [
      [prev sun, mon, ..]
      [..., null, null]
      [..., null, null]
      [..., null, null]
      [..., nextMonth Sun, ...]
    ]
  */
const fillPrevNextMonthData = (
  prevMonth: CalendarMonthData,
  currentMonth: CalendarMonthData,
  nextMonth: CalendarMonthData
): Date[][] => {
  const endingRow =
    currentMonth.beginIndex >= 5 && currentMonth.daysInMonth >= 30
      ? 5
      : currentMonth.beginIndex === 0 && currentMonth.daysInMonth === 28
      ? 3
      : 4;
  const beginDayPrevMonth =
    currentMonth.beginIndex !== 0 ? currentMonth.beginIndex - 1 : currentMonth.beginIndex;

  let prevMonthDayIterator = prevMonth.daysInMonth - beginDayPrevMonth;
  let nextMonthDayIterator = 1;

  return range(0, MAX_NUMBER_WEEKS_SHOWN).map(index => {
    const week = new Array(DAYS.length).fill(null);

    if (index === 0) {
      forEach(week, (_, index) => {
        if (index < currentMonth.beginIndex) {
          week[index] = constructDate(prevMonth, prevMonthDayIterator);
          prevMonthDayIterator++;
        }
      });
    }

    if (index === endingRow && currentMonth.endIndex !== 6) {
      for (let i = currentMonth.endIndex + 1; i < DAYS.length; i++) {
        week[i] = constructDate(nextMonth, nextMonthDayIterator);
        nextMonthDayIterator++;
      }
    }

    return week;
  });
};

/*
  Fills our 2D currentMonth array with currentMonthData
*/
export const constructMonthData = (incomingDate: Date): Date[][] => {
  const prevMonth = calculateMonthData(addMonths(incomingDate, -1));
  const nextMonth = calculateMonthData(addMonths(incomingDate, 1));
  const currentMonth = calculateMonthData(incomingDate);
  const activeMonth = fillPrevNextMonthData(prevMonth, currentMonth, nextMonth);

  let currentMonthIterator = 1;
  for (let row = 0; row < DAYS.length; row++) {
    for (let col = row === 0 ? currentMonth.beginIndex : 0; col < DAYS.length; col++) {
      if (currentMonthIterator <= currentMonth.daysInMonth) {
        activeMonth[row][col] = constructDate(currentMonth, currentMonthIterator);
        currentMonthIterator++;
      }
    }
  }

  return activeMonth;
};
