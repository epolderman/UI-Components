import {
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  format,
  getMonth,
  getYear
} from 'date-fns';
import { findIndex } from 'lodash';

/* Utility Functions/Types for Date Components */

export const DAYS: string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export type CalendarMonthData = {
  endIndex: number;
  beginIndex: number;
  daysInMonth: number;
  month: number;
  year: number;
  beginDay: string;
};

export const getIndexOfDay = (day: string): number =>
  findIndex(DAYS, name => day === name);

const DAY_NAME_FORMAT: string = 'dddd';

export const calculateMonthData = (incomingDate: Date): CalendarMonthData => {
  const startDate = startOfMonth(incomingDate);
  const endDate = endOfMonth(incomingDate);
  return {
    endIndex: getIndexOfDay(format(endDate, DAY_NAME_FORMAT)),
    beginIndex: getIndexOfDay(format(startDate, DAY_NAME_FORMAT)),
    daysInMonth: getDaysInMonth(incomingDate),
    month: getMonth(incomingDate),
    year: getYear(incomingDate),
    beginDay: format(incomingDate, DAY_NAME_FORMAT)
  };
};
