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
// import styled from '@emotion/styled';
import { ButtonProps } from '@material-ui/core/Button';
import { styled } from '@material-ui/styles';

/*
   Calculation of calendar month data + date range rendering 
*/

export interface CalendarMonthRangeProps {
  month: Date; // current month being shown
  dateRange: DateRangeTuple; // data set for our range
  isSelecting: boolean; // are we selecting a new range?
  hoverDate: Date; // latest hovered date
  onSelectHoverRange: (hoverDate: Date) => void;
  onSelectRange: (incomingDate: Date) => void;
}

export const CalendarMonthRange: React.FC<CalendarMonthRangeProps> = React.memo(
  ({
    month,
    onSelectRange,
    isSelecting,
    onSelectHoverRange,
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
              <CalenderButton
                color='selected'
                key={index}
                onMouseDown={e => e.preventDefault()}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </CalenderButton>
            );
            // render blue range selection blocks
          } else if (
            (hoverDate != null &&
              isWithinRange(date, dateRange[0], hoverDate)) ||
            (isDateRangeValid &&
              isWithinRange(date, dateRange[0], dateRange[1]))
          ) {
            return (
              <CalenderButton
                color='range'
                onClick={dispatchSelect}
                key={index}
                onMouseDown={e => e.preventDefault()}
                onMouseEnter={() => isSelecting && onSelectHoverRange(date)}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </CalenderButton>
            );
            // render default blocks non selected
          } else {
            return (
              <RoundButton
                onClick={dispatchSelect}
                key={index}
                onMouseDown={e => e.preventDefault()}
                onMouseEnter={() => isSelecting && onSelectHoverRange(date)}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </RoundButton>
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
        onSelectHoverRange
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
    borderRadius: '50% !important',
    // width: '40px',
    // height: '40px',
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  }
})(Button);

const RoundButton = withStyles({
  root: {
    borderRadius: '50% !important'
    // width: '40px',
    // height: '40px'
    // backgroundColor: `${BRAND_PRIMARY_LIGHT}`,
    // color: 'white'
  }
})(Button);

// @todo: is this the proper way to pass props to mat ui components
// too complex, woulld like to be more simple
interface CalendarButtonProps {
  color: 'selected' | 'range';
}

const CalenderButton = styled(
  ({
    color,
    ...other
  }: CalendarButtonProps & Omit<ButtonProps, keyof CalendarButtonProps>) => (
    <Button {...other} />
  )
)({
  background: (props: CalendarButtonProps) =>
    props.color === 'range' ? `${BRAND_PRIMARY_LIGHT}` : `${BRAND_PRIMARY}`,
  borderRadius: '50% !important',
  color: 'white',
  height: 40,
  width: 40
});
