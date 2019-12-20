import { Button, Typography, withStyles } from '@material-ui/core';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { map } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import {
  buildDateMatrix,
  CALENDAR_DAY_FORMAT,
  DateMatrix,
  DAYS,
  isSameDate
} from '../dateUtils';
import styled from '@emotion/styled';
import { Flex } from '@rebass/grid/emotion';
import { background, text, brand } from '../../../common/colors';

/*
   Calculation of calendar month data / Selection of calendar day
*/

export interface CalendarMonthProps {
  month: Date;
  currentDay: Date;
  selectedDate: Date;
  onSelect: (incomingDate: Date) => void;
  isLoading?: boolean;
}

export const CalendarMonth: React.FC<CalendarMonthProps> = React.memo(
  ({ month, selectedDate, isLoading, onSelect, currentDay }) => {
    const renderWeek = useCallback(
      (week: Date[]) =>
        map(week, (date, index) => {
          const dispatchSelect = () => onSelect(date);
          if (isSameMonth(month, date) && isSameDate(date, selectedDate)) {
            return (
              <CalenderSelectorButton
                key={index}
                style={{
                  backgroundColor: brand.primary.blue,
                  color: text.white.primary
                }}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </CalenderSelectorButton>
            );
          } else if (isSameMonth(month, date) && isSameDay(currentDay, date)) {
            return (
              <CalenderSelectorButton
                onClick={dispatchSelect}
                onMouseDown={e => e.preventDefault()}
                key={index}
                style={{
                  border: `1px solid ${text.black.primary}`
                }}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </CalenderSelectorButton>
            );
          } else if (!isSameMonth(month, date)) {
            return (
              <CalenderNotSameDay
                onClick={dispatchSelect}
                onMouseDown={e => e.preventDefault()}
                key={index}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </CalenderNotSameDay>
            );
          } else {
            return (
              <CalenderSelectorButton
                onClick={dispatchSelect}
                key={index}
                onMouseDown={e => e.preventDefault()}
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </CalenderSelectorButton>
            );
          }
        }),
      [onSelect, selectedDate, month, currentDay]
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
              <Typography variant='subtitle2' color='textSecondary'>
                {day.slice(0, 1)}
              </Typography>
            </DayNameBlocks>
          ))}
        </CalendarRow>
      ),
      []
    );

    return (
      <MonthContainer>
        <CalendarHeader>
          <CalendarRow hasText>
            <Typography variant='body1' color='textSecondary'>
              {format(month, 'MMMM YYYY')}
            </Typography>
          </CalendarRow>
          {dayNamesJSX}
        </CalendarHeader>
        <CalendarContents>{monthJSX}</CalendarContents>
      </MonthContainer>
    );
  }
);

const MonthContainer = styled(Flex)`
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: stretch;
  align-content: stretch;
  position: relative;
  max-height: 288px; /* 36 x 8 = 288 */
  margin: 8px 0 4px 0;
`;

/* Contains Month Name Row + Day Names Row */
const CalendarHeader = styled(Flex)`
  max-height: 72px; /* 2 Rows = 2 * 36 */
  flex-direction: column;
  flex: 1 1 0%;
`;

const CalendarContents = styled(Flex)`
  flex: 1 1 0%;
  top: 72px; /* 2 Rows = 2 * 36 */
  flex-direction: column;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
`;

const CalendarRow = styled(Flex)<{ hasText?: boolean }>`
  flex: 1 1 0%;
  flex-direction: row;
  justify-content: ${({ hasText }) => (hasText ? 'center' : 'space-evenly')};
  align-items: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  padding: 2px 4px;
  max-height: 36px;
  /* Edge */
  justify-content: ${({ hasText }) => (hasText ? 'center' : 'space-around')};

  button {
    display: flex;
    flex: 1 1 0%;
    min-width: 0;
    padding: 0 0;
    justify-content: center;
    align-items: center;
  }
`;

const DayNameBlocks = styled(Flex)`
  justify-content: center;
  align-items: center;
  flex: 1 1 0%;
  min-width: 0;
  padding: 0 0;
  height: 32px;
  max-width: 32px;
  border-radius: 50%;
`;

const CalenderSelectorButton = withStyles({
  root: {
    height: '32px',
    maxWidth: '32px',
    transition: 'none',
    borderRadius: '50%'
  }
})(Button);

const CalenderNotSameDay = withStyles({
  root: {
    height: '32px',
    maxWidth: '32px',
    borderRadius: '50%',
    opacity: 0.2,
    color: text.black.secondary,
    backgroundColor: 'transparent',
    '&:hover': {
      opacity: 1,
      backgroundColor: background.empty
    }
  }
})(Button);
