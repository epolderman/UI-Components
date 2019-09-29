import { Button, Typography, withStyles } from '@material-ui/core';
import {
  format,
  isSameMonth,
  isWithinRange,
  isSameDay,
  addDays,
  isAfter
} from 'date-fns';
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
   @todo redo all styles
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

    const renderCalendarWeek = useCallback(
      (week: Date[]) => {
        return map(week, (date, index) => {
          const dispatchSelect = () => onSelectRange(date);
          const markerStyles = buildCalendarDayStyle(
            dateRange,
            hoverDate,
            date,
            week,
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
            (hoverDate != null || isDateRangeValid)
          ) {
            return (
              <Flex
                flex='1 1 0%'
                alignItems='stretch'
                justifyContent='stretch'
                style={{
                  position: 'relative'
                }}
                key={index}
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
                  <Flex flex='1 1 0%' bg='white' />
                  <Flex flex='1 1 0%' bg={BRAND_PRIMARY_LIGHT} />
                </Flex>
                <Button
                  style={{
                    zIndex: 3,
                    position: 'absolute',
                    borderRadius: '50%',
                    width: '100%',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: BRAND_PRIMARY,
                    color: 'white'
                  }}
                  onClick={dispatchSelect}
                  onMouseDown={e => e.preventDefault()}
                  onMouseEnter={() => isSelecting && onSelectHoverRange(date)}
                >
                  {format(date, CALENDAR_DAY_FORMAT)}
                </Button>
              </Flex>
            );
          } else if (isSameDay(dateRange[0], date)) {
            return (
              <CalenderNoHoverButton
                style={{
                  borderRadius: '50%',
                  backgroundColor: BRAND_PRIMARY,
                  color: 'white'
                }}
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
            (hoverDate != null || isDateRangeValid)
          ) {
            return (
              <Flex
                flex='1 1 0%'
                alignItems='stretch'
                justifyContent='stretch'
                style={{
                  position: 'relative'
                }}
                key={index}
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
                  <Flex flex='1 1 0%' bg={BRAND_PRIMARY_LIGHT} />
                  <Flex flex='1 1 0%' bg='white' />
                </Flex>
                <Button
                  style={{
                    zIndex: 3,
                    position: 'absolute',
                    borderRadius: '50%',
                    width: '100%',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: BRAND_PRIMARY,
                    color: 'white'
                  }}
                  onClick={dispatchSelect}
                  onMouseDown={e => e.preventDefault()}
                  onMouseEnter={() => isSelecting && onSelectHoverRange(date)}
                >
                  {format(date, CALENDAR_DAY_FORMAT)}
                </Button>
              </Flex>
            );
          } else if (isSameDay(dateRange[1], date)) {
            return (
              <CalenderNoHoverButton
                style={{
                  borderRadius: '50%',
                  backgroundColor: BRAND_PRIMARY,
                  color: 'white'
                }}
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

const buildCalendarDayStyle = (
  dateRange: DateRangeTuple,
  hoverDate: Date,
  currentDate: Date,
  week: Date[],
  index: number
): React.CSSProperties => {
  const isDateRangeValid = dateRange[0] != null && dateRange[1] != null;
  let style: React.CSSProperties = {};

  // while hovering states -->

  if (hoverDate != null) {
    const isWithinRanges = isWithinRange(currentDate, dateRange[0], hoverDate);

    if (isSameDay(currentDate, hoverDate)) {
      style = {
        backgroundColor: BRAND_PRIMARY_LIGHT,
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        color: 'white'
      };
      return style;
    }

    if (isWithinRanges && index == 6) {
      style = {
        backgroundColor: BRAND_PRIMARY_LIGHT,
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        color: 'white'
      };
      return style;
    }

    // while hover, begin index, left side circle
    if (isWithinRanges && index == 0) {
      style = {
        backgroundColor: BRAND_PRIMARY_LIGHT,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
        color: 'white'
      };
      return style;
    }

    // while hovering, middle indices
    if (isWithinRanges) {
      style = {
        backgroundColor: BRAND_PRIMARY_LIGHT,
        borderRadius: 0,
        color: 'white'
      };
      return style;
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
    if (isWithinRanges && index === 6) {
      style = {
        backgroundColor: BRAND_PRIMARY_LIGHT,
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        color: 'white'
      };
      return style;
    }

    // begin index start range
    if (isWithinRanges && index === 0) {
      style = {
        backgroundColor: BRAND_PRIMARY_LIGHT,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
        color: 'white'
      };
      return style;
    }

    // middle indexes within range
    if (isWithinRanges) {
      style = {
        backgroundColor: BRAND_PRIMARY_LIGHT,
        borderRadius: 0,
        color: 'white'
      };
      return style;
    }
  }

  return style;
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
    borderRadius: 0,
    '&:hover': {
      backgroundColor: 'transparent'
    }
  }
})(Button);

// @todo find a better way to handle adding / removing styles depending on props
interface CalendarButtonProps {
  color?: 'selected' | 'range' | 'rangeRight' | 'rangeLeft';
}

type OmittedTypes = Omit<ButtonProps, keyof CalendarButtonProps>;

const CalenderButton = matStyled(
  ({ color, ...buttonProps }: CalendarButtonProps & OmittedTypes) => (
    <Button {...buttonProps} />
  )
)({
  background: ({ color }) =>
    color === 'range'
      ? `${BRAND_PRIMARY_LIGHT}`
      : color === 'selected'
      ? `${BRAND_PRIMARY}`
      : 'white',
  borderTopRightRadius: ({ color }) =>
    color === 'rangeRight' ? '50% !important' : null,
  borderBottomRightRadius: ({ color }) =>
    color === 'rangeRight' ? '50% !important' : null,
  borderTopLeftRadius: ({ color }) =>
    color === 'rangeLeft' ? '50% !important' : null,
  borderBottomLeftRadius: ({ color }) =>
    color === 'rangeLeft' ? '50% !important' : null,
  borderRadius: ({ color }) =>
    color === 'range' ? '0px' : color === 'selected' ? '50% !important' : null,
  color: 'white',
  height: 44,
  width: 44,
  '&:hover': {
    background: ({ color }) =>
      color === 'range' ? `${BRAND_PRIMARY_LIGHT}` : `${BRAND_PRIMARY}`
  }
});
