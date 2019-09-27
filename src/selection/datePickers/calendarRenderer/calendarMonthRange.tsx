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
  DayNameBlocks,
  BRAND_PRIMARY_DARK,
  BRAND_PRIMARY_LIGHT
} from './monthUtils';
import { DateRangeTuple } from '../dateRange/dateRangeSelector';
import styled from '@emotion/styled';
import { ButtonProps } from '@material-ui/core/Button';
import { styled as matStyled } from '@material-ui/styles';
import { Flex } from '@rebass/grid/emotion';

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
        <CalendarRowRange key={index}>{renderWeek(week)}</CalendarRowRange>
      ));
    }, [month, renderWeek]);

    const dayNamesJSX = useMemo(
      () => (
        <CalendarRowRange>
          {map(DAYS, day => (
            <DayNameBlocks key={day}>
              <Typography style={{ fontSize: '14px' }} color='textSecondary'>
                {day.slice(0, 1)}
              </Typography>
            </DayNameBlocks>
          ))}
        </CalendarRowRange>
      ),
      []
    );

    return (
      <MonthContainer>
        <CalendarHeader>
          <CalendarRowRange hasText>
            <Typography
              style={{
                fontSize: '16px',
                marginTop: '-2px'
              }}
              color='textPrimary'
            >
              {format(month, 'MMM YYYY')}
            </Typography>
          </CalendarRowRange>
          {dayNamesJSX}
        </CalendarHeader>
        <CalendarContents>{monthJSX}</CalendarContents>
      </MonthContainer>
    );
  }
);

const CalendarRowRange = styled(Flex)<{ hasText?: boolean }>`
  flex: 1 1 0%;
  flex-direction: row;
  justify-content: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  align-items: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  padding: 2px 0;

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 1 0%;
    min-width: 0;
    padding: 0 0;
  }
`;

const MonthContainer = styled(Flex)`
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: stretch;
  align-content: stretch;
  position: relative;
  margin: 0 4px;
`;

// @todo: Find a better solution than this.
const TransparentButton = withStyles({
  root: {
    backgroundColor: 'transparent',
    color: 'transparent',
    borderRadius: '50% !important',
    width: '44px',
    height: '44px',
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  }
})(Button);

const RoundButton = withStyles({
  root: {
    borderRadius: '50% !important',
    width: '44px',
    height: '44px',
    '&:hover': {
      backgroundColor: 'transparent'
    }
    // backgroundColor: `${BRAND_PRIMARY_LIGHT}`,
    // color: 'white'
  }
})(Button);

// isWithinRange + index = 1 <-> 5 + index - 1 && index + 1 is within range = square
// isWithinRange + index = 0 => rounded radius on left
// isWithinRange + index = 6 => rounded radius on right
// selected => rounded radius full, different color, background range color?

interface CalendarButtonProps {
  color: 'selected' | 'range' | 'rightRight' | 'rangeLeft';
}

type OmittedTypes = Omit<ButtonProps, keyof CalendarButtonProps>;

const CalenderButton = matStyled(
  ({ color, ...buttonProps }: CalendarButtonProps & OmittedTypes) => (
    <Button {...buttonProps} />
  )
)({
  background: ({ color }) =>
    color === 'range' ? `${BRAND_PRIMARY_LIGHT}` : `${BRAND_PRIMARY}`,
  borderRadius: '50% !important',
  color: 'white',
  height: 44,
  width: 44,
  '&:hover': {
    background: ({ color }) =>
      color === 'range' ? `${BRAND_PRIMARY_LIGHT}` : `${BRAND_PRIMARY}`
  }
});
