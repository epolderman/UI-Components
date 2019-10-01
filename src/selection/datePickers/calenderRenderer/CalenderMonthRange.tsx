import { Button, Typography, withStyles } from '@material-ui/core';
import { Flex } from '@rebass/grid/emotion';
import {
  format,
  isSameDay,
  isSameMonth,
  isWithinRange,
  isLastDayOfMonth,
  isFirstDayOfMonth,
  isBefore
} from 'date-fns';
import { map } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { DateRangeTuple } from '../dateRange/DateRangeSelector';
import {
  buildDateMatrix,
  CALENDAR_DAY_FORMAT,
  DateMatrix,
  DAYS
} from '../dateUtils';
import {
  CalendarRowRange,
  MonthContainer,
  CalendarContents,
  FULL_RADIUS_STYLE,
  RANGE_BUTTON_STYLE,
  RIGHT_RADIUS_STYLE,
  SQUARE_STYLE,
  LEFT_RADIUS_STYLE,
  DayNameBlocks,
  CalendarHeader,
  BRAND_PRIMARY_LIGHT
} from './rangeUtils';
import { RangeStartEnd } from './RangeStartEnd';

/*
   Calculation of calendar month data + date range rendering 
*/

export interface CalendarMonthRangeProps {
  month: Date;
  dateRange: DateRangeTuple;
  isSelecting: boolean;
  hoverDate: Date;
  onSelectHoverRange: (hoverDate: Date) => void;
  onSelectRange: (incomingDate: Date) => void;
  isLoading?: boolean;
}

export const CalendarMonthRange: React.FC<CalendarMonthRangeProps> = React.memo(
  ({
    month,
    onSelectRange,
    isSelecting,
    onSelectHoverRange,
    hoverDate,
    dateRange,
    isLoading
  }) => {
    const isValidDateRange = dateRange[0] != null && dateRange[1] != null;

    const renderCalendarWeek = useCallback(
      (week: Date[]) => {
        return map(week, (date, index) => {
          const dispatchSelect = () => onSelectRange(date);
          const isSelectionInProgress = hoverDate != null || isValidDateRange;

          if (!isSameMonth(month, date)) {
            return (
              <Flex
                key={index}
                flex='1 1 0%'
                justifyContent='stretch'
                alignItems='stretch'
              />
            );
          } else if (
            isSameDay(dateRange[0], date) &&
            !isLastDayOfMonth(date) &&
            index !== 6 &&
            isSelectionInProgress
          ) {
            return (
              <RangeStartEnd rangeSpecifier='start' key={index}>
                <Button
                  style={{
                    ...FULL_RADIUS_STYLE,
                    ...RANGE_BUTTON_STYLE
                  }}
                  onClick={dispatchSelect}
                  onMouseDown={e => e.preventDefault()}
                  onMouseEnter={() => isSelecting && onSelectHoverRange(date)}
                >
                  {format(date, CALENDAR_DAY_FORMAT)}
                </Button>
              </RangeStartEnd>
            );
          } else if (isSameDay(dateRange[0], date)) {
            return (
              <CalenderNoHoverButton
                style={FULL_RADIUS_STYLE}
                key={index}
                onClick={dispatchSelect}
                onMouseDown={e => e.preventDefault()}
                onMouseEnter={() => isSelecting && onSelectHoverRange(date)}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </CalenderNoHoverButton>
            );
          } else if (
            isSameDay(dateRange[1], date) &&
            !isFirstDayOfMonth(date) &&
            index !== 0 &&
            isSelectionInProgress
          ) {
            return (
              <RangeStartEnd rangeSpecifier='end' key={index}>
                <Button
                  style={{
                    ...FULL_RADIUS_STYLE,
                    ...RANGE_BUTTON_STYLE
                  }}
                  onClick={dispatchSelect}
                  onMouseDown={e => e.preventDefault()}
                  onMouseEnter={() => isSelecting && onSelectHoverRange(date)}
                >
                  {format(date, CALENDAR_DAY_FORMAT)}
                </Button>
              </RangeStartEnd>
            );
          } else if (isSameDay(dateRange[1], date)) {
            return (
              <CalenderNoHoverButton
                style={FULL_RADIUS_STYLE}
                key={index}
                onClick={dispatchSelect}
                onMouseDown={e => e.preventDefault()}
                onMouseEnter={() => isSelecting && onSelectHoverRange(date)}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </CalenderNoHoverButton>
            );
          } else {
            return (
              <CalenderNoHoverButton
                key={index}
                style={styleBuilder(dateRange, hoverDate, date, index, week)}
                onClick={dispatchSelect}
                onMouseDown={e => e.preventDefault()}
                onMouseEnter={() => isSelecting && onSelectHoverRange(date)}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </CalenderNoHoverButton>
            );
          }
        });
      },
      [
        onSelectRange,
        month,
        dateRange,
        isValidDateRange,
        hoverDate,
        isSelecting,
        onSelectHoverRange
      ]
    );

    const monthJSX = useMemo(() => {
      const currentMonth: DateMatrix = buildDateMatrix(month);
      return map(currentMonth, (week, index) => (
        <CalendarRowRange key={index}>
          {renderCalendarWeek(week)}
        </CalendarRowRange>
      ));
    }, [month, renderCalendarWeek]);

    const skeletonMonthJSX = useMemo(() => {
      const currentMonth: DateMatrix = buildDateMatrix(month);
      return map(currentMonth, (week, index) => (
        <CalendarRowRange key={index}>
          {renderSkeletonWeek(week, month)}
        </CalendarRowRange>
      ));
    }, [month]);

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
                marginTop: '-4px'
              }}
              color='textPrimary'
            >
              {format(month, 'MMM YYYY')}
            </Typography>
          </CalendarRowRange>
          {dayNamesJSX}
        </CalendarHeader>
        <CalendarContents>
          {isLoading ? skeletonMonthJSX : monthJSX}
        </CalendarContents>
      </MonthContainer>
    );
  }
);

const renderSkeletonWeek = (week: Date[], month: Date) => {
  return map(week, (date, index) => {
    if (!isSameMonth(month, date)) {
      return (
        <Flex
          key={index}
          flex='1 1 0%'
          justifyContent='stretch'
          alignItems='stretch'
        />
      );
    } else {
      return (
        <CalenderNoHoverButton key={index} disabled>
          {format(date, CALENDAR_DAY_FORMAT)}
        </CalenderNoHoverButton>
      );
    }
  });
};

// @todo: add final check for date within rage but 1st arrives on Sunday [Check feb 2020]
const styleBuilder = (
  dateRange: DateRangeTuple,
  hoverDate: Date,
  currentDate: Date,
  index: number,
  week: Date[]
): React.CSSProperties | null => {
  const isStartDate = isSameDay(currentDate, dateRange[0]);
  const isValidDateRange = dateRange[0] != null && dateRange[1] != null;
  const isValidHoverDateRange = hoverDate != null && !isStartDate;
  if (!isValidHoverDateRange && !isValidDateRange) {
    return null;
  }

  // hovering states -->
  if (isValidHoverDateRange) {
    const isWithinHoverRange = isWithinRange(
      currentDate,
      dateRange[0],
      hoverDate
    );

    const isValidHoverRightDate =
      isSameDay(currentDate, hoverDate) &&
      index !== 0 &&
      !isFirstDayOfMonth(currentDate);

    const nextIndexIsOutOfRange =
      week[index + 1] != null &&
      !isWithinRange(week[index + 1], dateRange[0], hoverDate);

    if (
      isValidHoverRightDate ||
      (isWithinHoverRange && (index === 6 || isLastDayOfMonth(currentDate)))
    ) {
      return RIGHT_RADIUS_STYLE;
    }

    if (
      isWithinHoverRange &&
      nextIndexIsOutOfRange &&
      (index === 0 || isFirstDayOfMonth(currentDate))
    ) {
      return {
        ...FULL_RADIUS_STYLE,
        backgroundColor: BRAND_PRIMARY_LIGHT,
        color: 'black'
      };
    }

    if (isWithinHoverRange && (index === 0 || isFirstDayOfMonth(currentDate))) {
      return LEFT_RADIUS_STYLE;
    }

    if (isWithinHoverRange) {
      return SQUARE_STYLE;
    }
  }

  // we have a set date range states --> @todo: may not need isBefore
  if (isValidDateRange && isBefore(dateRange[0], dateRange[1])) {
    const isWithinDateRanges = isWithinRange(
      currentDate,
      dateRange[0],
      dateRange[1]
    );

    if (isWithinDateRanges && (index === 6 || isLastDayOfMonth(currentDate))) {
      return RIGHT_RADIUS_STYLE;
    }

    if (isWithinDateRanges && (index === 0 || isFirstDayOfMonth(currentDate))) {
      return LEFT_RADIUS_STYLE;
    }

    if (isWithinDateRanges) {
      return SQUARE_STYLE;
    }
  }
};

const CalenderNoHoverButton = withStyles({
  root: {
    width: '44px',
    height: '44px',
    transition: 'none',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  }
})(Button);
