import styled from '@emotion/styled';
import { Button, Typography } from '@material-ui/core';
import { format, isSameMonth } from 'date-fns';
import { map, range } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import {
  buildDateMatrix,
  CALENDAR_DAY_FORMAT,
  DateMatrix,
  DAYS,
  isSameDate,
  MAX_NUMBER_WEEKS_SHOWN
} from './dateUtils';
import { Flex } from '@rebass/grid/emotion';

/*
   Calculation of calendar month data / Selection of calendar day
*/

export interface CalendarMonthProps {
  month: Date;
  selectedDate: Date;
  onSelect: (incomingDate: Date) => void;
  skeleton?: boolean;
}

export const CalendarMonth: React.FC<CalendarMonthProps> = React.memo(
  ({ month, selectedDate, skeleton, onSelect }) => {
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
                onMouseDown={e => e.preventDefault()}
                key={index}
                style={{ backgroundColor: BACKGROUND_EMPTY }}
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
              >
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
          {map(DAYS, (day, index) => (
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
              style={{ fontSize: '16px', marginTop: '-10px' }}
              color='textPrimary'
            >
              {format(month, 'MMM YYYY')}
            </Typography>
          </CalendarRow>
          {dayNamesJSX}
        </CalendarHeader>
        <CalendarContents>
          {skeleton ? skeletonMonthJSX : monthJSX}
        </CalendarContents>
      </Container>
    );
  }
);

const getSkeletonMonth = () => {
  return range(0, MAX_NUMBER_WEEKS_SHOWN).map(() =>
    new Array(DAYS.length).fill(null)
  );
};

const renderSkeletonWeek = (week: any[]) => {
  return map(week, (_, index) => (
    <Button style={{ backgroundColor: BACKGROUND_EMPTY }} key={index}>
      <Typography color='primary'>{null}</Typography>
    </Button>
  ));
};

const BACKGROUND_EMPTY = 'rgb(238,238,238)';
const BRAND_PRIMARY = 'rgb(74,175,227)';

const Container = styled(Flex)`
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: stretch;
  align-content: stretch;
  position: relative;
`;

/* Contains Month Name Row + Day Names Row */
const CalendarHeader = styled(Flex)`
  max-height: 75px; /* 2 Rows = 2 * 37.5 */
  flex-direction: column;
  flex: 1 1 0%;
`;

const CalendarContents = styled(Flex)`
  flex: 1 1 0%;
  top: 75px; /* 2 Rows = 2 * 37.5 */
  flex-direction: column;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
`;

const CalendarRow = styled(Flex)<{ hasText?: boolean }>`
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
    margin: 0 2px;
    border-radius: 2.5px;
  }
`;

const DayNameBlocks = styled(Flex)`
  justify-content: center;
  align-items: center;
  flex: 1 1 0%;
  min-width: 0;
  padding: 0 0;
  margin: 0 2px;
  border-radius: 2.5px;
`;
