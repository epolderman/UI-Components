import { Button, Typography, withStyles } from '@material-ui/core';
import { format, isSameMonth, isWithinRange, isSameDay } from 'date-fns';
import { map } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import {
  buildDateMatrix,
  CALENDAR_DAY_FORMAT,
  DateMatrix,
  DAYS
} from '../dateUtils';
import {
  BRAND_PRIMARY,
  CalendarContents,
  CalendarHeader,
  CalendarRow,
  Container,
  DayNameBlocks,
  BRAND_PRIMARY_DARK,
  BRAND_PRIMARY_LIGHT
} from './monthUtils';
import { DateRangeTuple } from '../dateRange/dateRangeSelector';

/*
   Calculation of calendar month data / Selection of calendar day
*/

export interface CalendarMonthRangeProps {
  month: Date;
  dateRange: DateRangeTuple;
  isSelecting: boolean;
  hoverDate: Date;
  onHoverDateAssign: (hoverDate: Date) => void;
  onSelectRange: (incomingDate: Date) => void;
}

export const CalendarMonthRange: React.FC<CalendarMonthRangeProps> = React.memo(
  ({
    month,
    onSelectRange,
    isSelecting,
    onHoverDateAssign,
    hoverDate,
    dateRange
  }) => {
    const isDateRangeValid = dateRange[0] != null && dateRange[1] != null;

    const renderWeek = useCallback(
      (week: Date[]) =>
        map(week, (date, index) => {
          const dispatchSelect = () => onSelectRange(date);
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
          } else if (
            isSameDay(dateRange[0], date) ||
            isSameDay(dateRange[1], date)
          ) {
            return (
              <Button
                key={index}
                onMouseDown={e => e.preventDefault()}
                style={{ backgroundColor: BRAND_PRIMARY_DARK, color: 'white' }}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </Button>
            );
          } else if (
            isDateRangeValid &&
            isWithinRange(date, dateRange[0], dateRange[1])
          ) {
            return (
              <Button
                variant='contained'
                key={index}
                onClick={dispatchSelect}
                onMouseEnter={() => isSelecting && onHoverDateAssign(date)}
                style={{ backgroundColor: BRAND_PRIMARY, color: 'white' }}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </Button>
            );
          } else if (
            isSelecting &&
            hoverDate != null &&
            isWithinRange(date, dateRange[0], hoverDate)
          ) {
            return (
              <Button
                onClick={dispatchSelect}
                key={index}
                onMouseDown={e => e.preventDefault()}
                onMouseEnter={() => isSelecting && onHoverDateAssign(date)}
                style={{
                  backgroundColor: BRAND_PRIMARY_LIGHT,
                  color: 'white'
                }}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </Button>
            );
          } else {
            return (
              <Button
                onClick={dispatchSelect}
                key={index}
                onMouseDown={e => e.preventDefault()}
                onMouseEnter={() => isSelecting && onHoverDateAssign(date)}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </Button>
            );
          }
        }),
      [
        onSelectRange,
        month,
        dateRange,
        isDateRangeValid,
        hoverDate,
        isSelecting,
        onHoverDateAssign
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
