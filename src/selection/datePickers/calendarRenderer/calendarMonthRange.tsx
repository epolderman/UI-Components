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
   @todo redo all styles
*/

export interface CalendarMonthRangeProps {
  month: Date;
  dateRange: DateRangeTuple;
  isSelecting: boolean;
  hoverDate: Date;
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

    const renderCalendarWeek = useCallback(
      (week: Date[]) => {
        return map(week, (date, index) => {
          const dispatchSelect = () => onSelectRange(date);
          const markerStyles = buildCalendarDayStyle(
            dateRange,
            hoverDate,
            date,
            index
          );

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
            (hoverDate != null || isDateRangeValid)
          ) {
            return (
              <RangeStartComponent rangeSpecifier='start' key={index}>
                <Button
                  style={{
                    ...Full_Radius,
                    zIndex: 3,
                    position: 'absolute',
                    width: '100%',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                  }}
                  onClick={dispatchSelect}
                  onMouseDown={e => e.preventDefault()}
                  onMouseEnter={() => isSelecting && onSelectHoverRange(date)}
                >
                  {format(date, CALENDAR_DAY_FORMAT)}
                </Button>
              </RangeStartComponent>
            );
          } else if (isSameDay(dateRange[0], date)) {
            return (
              <CalenderNoHoverButton
                style={Full_Radius}
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
            (hoverDate != null || isDateRangeValid)
          ) {
            return (
              <RangeStartComponent rangeSpecifier='end' key={index}>
                <Button
                  style={{
                    ...Full_Radius,
                    zIndex: 3,
                    position: 'absolute',
                    width: '100%',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                  }}
                  onClick={dispatchSelect}
                  onMouseDown={e => e.preventDefault()}
                  onMouseEnter={() => isSelecting && onSelectHoverRange(date)}
                >
                  {format(date, CALENDAR_DAY_FORMAT)}
                </Button>
              </RangeStartComponent>
            );
          } else if (isSameDay(dateRange[1], date)) {
            return (
              <CalenderNoHoverButton
                style={Full_Radius}
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
                style={markerStyles}
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
        isDateRangeValid,
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

const Right_Radius: React.CSSProperties = {
  backgroundColor: BRAND_PRIMARY_LIGHT,
  borderTopRightRadius: '50%',
  borderBottomRightRadius: '50%',
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  color: 'white'
};

const Left_Radius: React.CSSProperties = {
  backgroundColor: BRAND_PRIMARY_LIGHT,
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
  borderTopLeftRadius: '50%',
  borderBottomLeftRadius: '50%',
  color: 'white'
};

const Square: React.CSSProperties = {
  backgroundColor: BRAND_PRIMARY_LIGHT,
  borderRadius: 0,
  color: 'white'
};

const Full_Radius: React.CSSProperties = {
  backgroundColor: BRAND_PRIMARY,
  borderRadius: '50%',
  color: 'white'
};

const buildCalendarDayStyle = (
  dateRange: DateRangeTuple,
  hoverDate: Date,
  currentDate: Date,
  index: number
): React.CSSProperties => {
  const isStartDate = isSameDay(currentDate, dateRange[0]);
  const isDateRangeValid = dateRange[0] != null && dateRange[1] != null;

  // while hovering states -->
  if (hoverDate != null && !isStartDate) {
    const isWithinRanges = isWithinRange(currentDate, dateRange[0], hoverDate);

    if (
      (isSameDay(currentDate, hoverDate) &&
        index !== 0 &&
        !isFirstDayOfMonth(currentDate)) ||
      (isWithinRanges && (index === 6 || isLastDayOfMonth(currentDate)))
    ) {
      return Right_Radius;
    }

    // while hover, begin index, left side circle
    if (isWithinRanges && (index === 0 || isFirstDayOfMonth(currentDate))) {
      return Left_Radius;
    }

    // while hovering, middle indices
    if (isWithinRanges) {
      return Square;
    }
  }

  // end and start ranges are already set states ->
  if (isDateRangeValid) {
    const isWithinRanges = isWithinRange(
      currentDate,
      dateRange[0],
      dateRange[1]
    );
    // end index within range
    if (isWithinRanges && (index === 6 || isLastDayOfMonth(currentDate))) {
      return Right_Radius;
    }

    // begin index start range
    if (isWithinRanges && (index === 0 || isFirstDayOfMonth(currentDate))) {
      return Left_Radius;
    }

    // middle indexes within range
    if (isWithinRanges) {
      return Square;
    }
  }
  return {};
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

const RangeStartComponent: React.FC<{
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

// @todo find a better way to handle adding / removing styles depending on props
// interface CalendarButtonProps {
//   color?: 'selected' | 'range' | 'rangeRight' | 'rangeLeft';
// }

// type OmittedTypes = Omit<ButtonProps, keyof CalendarButtonProps>;

// const CalenderButton = matStyled(
//   ({ color, ...buttonProps }: CalendarButtonProps & OmittedTypes) => (
//     <Button {...buttonProps} />
//   )
// )({
//   background: ({ color }) =>
//     color === 'range'
//       ? `${BRAND_PRIMARY_LIGHT}`
//       : color === 'selected'
//       ? `${BRAND_PRIMARY}`
//       : 'white',
//   borderTopRightRadius: ({ color }) =>
//     color === 'rangeRight' ? '50% !important' : null,
//   borderBottomRightRadius: ({ color }) =>
//     color === 'rangeRight' ? '50% !important' : null,
//   borderTopLeftRadius: ({ color }) =>
//     color === 'rangeLeft' ? '50% !important' : null,
//   borderBottomLeftRadius: ({ color }) =>
//     color === 'rangeLeft' ? '50% !important' : null,
//   borderRadius: ({ color }) =>
//     color === 'range' ? '0px' : color === 'selected' ? '50% !important' : null,
//   color: 'white',
//   height: 44,
//   width: 44,
//   '&:hover': {
//     background: ({ color }) =>
//       color === 'range' ? `${BRAND_PRIMARY_LIGHT}` : `${BRAND_PRIMARY}`
//   }
// });
