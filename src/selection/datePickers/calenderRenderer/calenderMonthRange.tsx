import styled from '@emotion/styled';
import { Button, Typography, withStyles } from '@material-ui/core';
import { Flex } from '@rebass/grid/emotion';
import {
  format,
  isSameDay,
  isSameMonth,
  isWithinRange,
  isLastDayOfMonth,
  isFirstDayOfMonth
} from 'date-fns';
import { map } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { DateRangeTuple } from '../dateRange/dateRangeSelector';
import {
  buildDateMatrix,
  CALENDAR_DAY_FORMAT,
  DateMatrix,
  DAYS
} from '../dateUtils';
import {
  BRAND_PRIMARY,
  BRAND_PRIMARY_LIGHT,
  DayNameBlocks
} from './monthUtils';

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
              <RangeStart rangeSpecifier='start' key={index}>
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
              </RangeStart>
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
              <RangeStart rangeSpecifier='end' key={index}>
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
              </RangeStart>
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
                marginTop: '-2px'
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

/* Day marker styles / See mockups */
const RIGHT_RADIUS_STYLE: React.CSSProperties = {
  backgroundColor: BRAND_PRIMARY_LIGHT,
  borderTopRightRadius: '50%',
  borderBottomRightRadius: '50%',
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0
};

const LEFT_RADIUS_STYLE: React.CSSProperties = {
  backgroundColor: BRAND_PRIMARY_LIGHT,
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderTopLeftRadius: '50%',
  borderBottomLeftRadius: '50%'
};

const SQUARE_STYLE: React.CSSProperties = {
  backgroundColor: BRAND_PRIMARY_LIGHT,
  borderRadius: 0
};

const FULL_RADIUS_STYLE: React.CSSProperties = {
  backgroundColor: BRAND_PRIMARY,
  borderRadius: '50%',
  color: 'white'
};

const RANGE_BUTTON_STYLE: React.CSSProperties = {
  zIndex: 3,
  position: 'absolute',
  width: '100%',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
};

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

  // we have a set date range states -->
  if (isValidDateRange) {
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

const CalendarRowRange = styled(Flex)<{ hasText?: boolean }>`
  flex: 1 1 0%;
  flex-direction: row;
  justify-content: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  align-items: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  padding: 2px 0;

  button {
    display: flex;
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
  margin: 0 8px;
`;

/* Contains Month Name Row + Day Names Row */
const CalendarHeader = styled(Flex)`
  max-height: 96px; /* 2 Rows = 2 * 44 */
  flex-direction: column;
  flex: 1 1 0%;
`;

const CalendarContents = styled(Flex)`
  flex: 1 1 0%;
  top: 96px; /* 2 Rows = 2 * 44 */
  flex-direction: column;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
`;

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

/* 
  Container that has two divs behind children[button], depending on direction[range specifier], 
  will render the color on the left or right side visualizing range start
*/
const RangeStart: React.FC<{
  children?: React.ReactNode;
  rangeSpecifier: 'start' | 'end';
}> = ({ children, rangeSpecifier }) => {
  return (
    <Flex
      flex='1 1 0%'
      alignItems='stretch'
      justifyContent='stretch'
      style={{
        position: 'relative'
      }}
    >
      <Flex
        flex='1 1 0%'
        style={{
          position: 'absolute',
          zIndex: 2,
          height: '44px',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0
        }}
      >
        {rangeSpecifier === 'start' ? (
          <>
            <Flex flex='1 1 0%' bg='white' />
            <Flex flex='1 1 0%' bg={BRAND_PRIMARY_LIGHT} />
          </>
        ) : (
          <>
            <Flex flex='1 1 0%' bg={BRAND_PRIMARY_LIGHT} />
            <Flex flex='1 1 0%' bg='white' />
          </>
        )}
      </Flex>
      {children}
    </Flex>
  );
};
