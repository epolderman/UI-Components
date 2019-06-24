import React, { useCallback, useMemo } from 'react';
import {
  DateMatrix,
  buildDateMatrix,
  CALENDAR_DAY_FORMAT,
  isSameDate,
  DAYS,
  MAX_NUMBER_WEEKS_SHOWN
} from './dateUtils';
import { format, isSameMonth } from 'date-fns';
import { range, map } from 'lodash';
import styled from '@emotion/styled';
import { Button, Typography } from '@material-ui/core';
import { useSpring, animated } from 'react-spring';

/*
   Calculation of calendar month data 
   Selection of calendar day
   Animating Skeleton and Calendar transitions
*/

export interface CalendarMonthProps {
  month: Date;
  selectedDate: Date;
  onSelect: (incomingDate: Date) => void;
  skeleton?: boolean;
}

export const CalendarMonth: React.FC<CalendarMonthProps> = React.memo(
  ({ month, selectedDate, skeleton, onSelect }) => {
    const fadeAnimation = useSpring({
      interpValue: skeleton ? 0 : 1
    });
    const renderWeek = useCallback(
      (week: Date[]) =>
        map(week, (date, index) => {
          const dispatchSelect = () => onSelect(date);
          if (isSameDate(date, selectedDate)) {
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
              <Button
                onClick={dispatchSelect}
                key={index}
                style={{ backgroundColor: '#34495e', color: 'white' }}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </Button>
            );
          } else {
            return (
              <Button onClick={dispatchSelect} key={index}>
                {format(date, CALENDAR_DAY_FORMAT)}
              </Button>
            );
          }
        }),
      [onSelect, selectedDate, month]
    );

    const monthJSX = useMemo(() => {
      const currentMonth: DateMatrix = buildDateMatrix(month);
      return map(currentMonth, (week, index) => (
        <FlexRow key={index}>{renderWeek(week)}</FlexRow>
      ));
    }, [month, renderWeek]);

    const monthTitleJSX = useMemo(
      () => (
        <FlexRow hasText>
          <Typography style={{ fontSize: '16px' }} color='textPrimary'>
            {format(month, 'MMM YYYY')}
          </Typography>
        </FlexRow>
      ),
      [month]
    );

    const skeletonMonthJSX = useMemo(() => {
      const month = getSkeletonMonth();
      return map(month, (week, index) => (
        <FlexRow key={index}>{renderSkeletonWeek(week)}</FlexRow>
      ));
    }, []);

    const dayNamesJSX = useMemo(
      () => (
        <FlexRow>
          {map(DAYS, (day, index) => (
            <Button
              key={index}
              style={{ color: 'black' }}
              disableFocusRipple
              disableRipple
              disableTouchRipple
            >
              {day.slice(0, 3)}
            </Button>
          ))}
        </FlexRow>
      ),
      []
    );

    return (
      <CalendarContainer>
        <CalendarHeader>
          {monthTitleJSX}
          {dayNamesJSX}
        </CalendarHeader>
        <CalendarAnimatedContent
          style={{
            opacity: fadeAnimation.interpValue.interpolate(
              opacityValue => opacityValue
            )
          }}
        >
          {monthJSX}
        </CalendarAnimatedContent>
        <CalendarAnimatedContent
          style={{
            opacity: fadeAnimation.interpValue.interpolate(
              opacityValue => 1 - opacityValue
            ),
            pointerEvents: 'none'
          }}
        >
          {skeletonMonthJSX}
        </CalendarAnimatedContent>
      </CalendarContainer>
    );
  }
);

const getSkeletonMonth = () => {
  return range(0, MAX_NUMBER_WEEKS_SHOWN).map(() => {
    return new Array(DAYS.length).fill(null);
  });
};

const renderSkeletonWeek = (week: any[]) => {
  return map(week, (_, index) => (
    <Button style={{ backgroundColor: BACKROUND_EMPTY }} key={index}>
      <Typography color='primary'>{null}</Typography>
    </Button>
  ));
};

const BACKROUND_EMPTY = 'rgb(238,238,238)';
const BRAND_PRIMARY = 'rgb(74,175,227)';

const CalendarContainer = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: stretch;
  align-content: stretch;
  box-sizing: border-box;
  position: relative;
`;

const CalendarHeader = styled.div`
  max-height: 75px; /* 2 Rows = 2 * 37.5 */
  flex-direction: column;
  flex: 1 1 0%;
  display: flex;
`;

const CalendarAnimatedContent = styled(animated.div)`
  display: flex;
  flex: 1 1 0%;
  top: 75px; /* 2 Rows = 2 * 37.5 */
  flex-direction: column;
  box-sizing: border-box;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
`;

const FlexRow = styled.div<{ hasText?: boolean }>`
  display: flex;
  flex: 1 1 0%;
  flex-direction: row;
  justify-content: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  align-items: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  box-sizing: border-box;
  padding: 2px 0;

  button {
    width: 100%;
    height: 100%;
    min-width: 0;
    padding: 0 0;
    margin: 0 2px;
    border-radius: 2.5px;
  }
`;
