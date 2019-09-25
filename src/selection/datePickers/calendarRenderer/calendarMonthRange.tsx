import { Button, Typography, withStyles } from '@material-ui/core';
import {
  format,
  isSameMonth,
  isWithinRange,
  isSameDay,
  lastDayOfMonth,
  isBefore,
  isAfter
} from 'date-fns';
import { map } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import {
  buildDateMatrix,
  CALENDAR_DAY_FORMAT,
  DateMatrix,
  DAYS,
  isSameDate
} from '../dateUtils';
import {
  BRAND_PRIMARY,
  CalendarContents,
  CalendarHeader,
  CalendarRow,
  Container,
  DayNameBlocks,
  BRAND_PRIMARY_DARK
} from './monthUtils';

/*
   Calculation of calendar month data / Selection of calendar day
*/

export interface CalendarMonthRangeProps {
  month: Date;
  onSelect: (incomingDate: Date) => void;
  startDate?: Date;
  endDate?: Date;
  isSelecting?: boolean;
  hoverDate?: Date;
  assignHoverDate?: (hoverDate: Date) => void;
}

export const CalendarMonthRange: React.FC<CalendarMonthRangeProps> = React.memo(
  ({
    month,
    onSelect,
    startDate,
    endDate,
    isSelecting,
    assignHoverDate,
    hoverDate
  }) => {
    const isDateRangeValid = startDate != null && endDate != null;

    const renderWeek = useCallback(
      (week: Date[]) =>
        map(week, (date, index) => {
          const dispatchSelect = () => onSelect(date);
          // render nothing
          if (!isSameMonth(month, date)) {
            return (
              <TransparentButton
                onMouseDown={e => e.preventDefault()}
                key={index}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </TransparentButton>
            );
            // render dark blue selected blocks
          } else if (isSameDay(startDate, date) || isSameDay(endDate, date)) {
            return (
              <Button
                // onClick={dispatchSelect}
                key={index}
                onMouseDown={e => e.preventDefault()}
                style={{ backgroundColor: BRAND_PRIMARY_DARK, color: 'white' }}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </Button>
            );
            // render light blue range blocks w/ opcity
          } else if (
            isSelecting &&
            hoverDate != null &&
            isWithinRange(date, startDate, hoverDate)
          ) {
            return (
              <Button
                onClick={dispatchSelect}
                key={index}
                onMouseDown={e => e.preventDefault()}
                onMouseEnter={() => isSelecting && assignHoverDate(date)}
                style={{
                  backgroundColor: BRAND_PRIMARY,
                  opacity: 0.5,
                  color: 'white'
                }}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </Button>
            );
            // render range blocks without opacity
          } else if (
            isDateRangeValid &&
            !isSelecting &&
            isWithinRange(date, startDate, endDate)
          ) {
            return (
              <Button
                variant='contained'
                key={index}
                onClick={dispatchSelect}
                onMouseEnter={() => isSelecting && assignHoverDate(date)}
                style={{ backgroundColor: BRAND_PRIMARY, color: 'white' }}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </Button>
            );
            // default render, no selected day
          } else {
            return (
              <Button
                onClick={dispatchSelect}
                key={index}
                onMouseDown={e => e.preventDefault()}
                onMouseEnter={() => isSelecting && assignHoverDate(date)}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </Button>
            );
          }
        }),
      [
        onSelect,
        month,
        startDate,
        endDate,
        isDateRangeValid,
        hoverDate,
        isSelecting,
        assignHoverDate
      ]
    );

    const monthJSX = useMemo(() => {
      const currentMonth: DateMatrix = buildDateMatrix(month);
      return map(currentMonth, (week, index) => (
        <CalendarRow key={index}>{renderWeek(week)}</CalendarRow>
      ));
    }, [month, renderWeek]);

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
