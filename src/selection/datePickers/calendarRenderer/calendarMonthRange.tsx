import { Button, Typography, withStyles } from '@material-ui/core';
import { format, isSameMonth, isWithinRange } from 'date-fns';
import { map } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import {
  buildDateMatrix,
  CALENDAR_DAY_FORMAT,
  DateMatrix,
  DAYS,
  isSameDate
} from '../dateUtils';
import {
  BACKGROUND_EMPTY,
  BRAND_PRIMARY,
  CalendarContents,
  CalendarHeader,
  CalendarRow,
  Container,
  DayNameBlocks,
  getSkeletonMonth,
  renderSkeletonWeek
} from './monthUtils';
import styled from '@emotion/styled';
/*
   Calculation of calendar month data / Selection of calendar day
*/

export interface CalendarMonthRangeProps {
  month: Date;
  selectedDate: Date;
  onSelect: (incomingDate: Date) => void;
  startDate?: Date;
  endDate?: Date;
}

export const CalendarMonthRange: React.FC<CalendarMonthRangeProps> = React.memo(
  ({ month, selectedDate, onSelect, startDate, endDate }) => {
    const renderWeek = useCallback(
      (week: Date[]) =>
        map(week, (date, index) => {
          const dispatchSelect = () => onSelect(date);
          if (isWithinRange(date, startDate, endDate)) {
            return (
              <Button
                variant='contained'
                key={index}
                style={{ backgroundColor: BRAND_PRIMARY, color: 'white' }}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </Button>
            );
          } else if (!isSameMonth(month, date)) {
            return (
              <TransparentButton
                onMouseDown={e => e.preventDefault()}
                key={index}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </TransparentButton>
            );
          } else {
            return (
              <Button
                onClick={dispatchSelect}
                key={index}
                onMouseDown={e => e.preventDefault()}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </Button>
            );
          }
        }),
      [onSelect, month, startDate, endDate]
    );

    const monthJSX = useMemo(() => {
      const currentMonth: DateMatrix = buildDateMatrix(month);
      return map(currentMonth, (week, index) => (
        <CalendarRow key={index}>{renderWeek(week)}</CalendarRow>
      ));
    }, [month, renderWeek]);

    const skeletonMonthJSX = useMemo(() => {
      const month = getSkeletonMonth();
      return map(month, (week, index) => (
        <CalendarRow key={index}>{renderSkeletonWeek(week)}</CalendarRow>
      ));
    }, []);

    const dayNamesJSX = useMemo(
      () => (
        <CalendarRow>
          {map(DAYS, day => (
            <DayNameBlocks key={day}>
              <Typography style={{ fontSize: '14px' }} color='textPrimary'>
                {day.slice(0, 3)}
              </Typography>
            </DayNameBlocks>
          ))}
        </CalendarRow>
      ),
      []
    );

    return (
      <Container>
        <CalendarHeader>
          <CalendarRow hasText>
            <Typography
              style={{
                fontSize: '16px',
                marginTop: '-4px'
              }}
              color='textPrimary'
            >
              {format(month, 'MMM YYYY')}
            </Typography>
          </CalendarRow>
          {dayNamesJSX}
        </CalendarHeader>
        <CalendarContents>{monthJSX}</CalendarContents>
      </Container>
    );
  }
);

// @todo: Find a better solution than this.
const TransparentButton = withStyles({
  root: {
    backgroundColor: 'transparent',
    color: 'transparent',
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  }
})(Button);
