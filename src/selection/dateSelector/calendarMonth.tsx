import React, { useCallback, useMemo } from 'react';
import {
  DateMatrix,
  buildDateMatrix,
  CALENDAR_DAY_FORMAT,
  isSameDate,
  DAYS,
  MAX_NUMBER_WEEKS_SHOWN
} from './dateUtils';
import { format } from 'date-fns';
import { range, map } from 'lodash';
import styled from '@emotion/styled';
import { Button, Typography, withStyles } from '@material-ui/core';

/* Calculation of calendar month data */

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
              <CalendarItemButton key={index} style={{ color: 'white' }}>
                {format(date, CALENDAR_DAY_FORMAT)}
              </CalendarItemButton>
            );
          } else {
            return (
              <CalendarItemButton
                onClick={dispatchSelect}
                key={index}
                variant='text'
                color='primary'
              >
                {format(date, CALENDAR_DAY_FORMAT)}
              </CalendarItemButton>
            );
          }
        }),
      [onSelect, selectedDate]
    );

    const monthJSX = useMemo(() => {
      const currentMonth: DateMatrix = buildDateMatrix(month);
      return map(currentMonth, (week, index) => {
        return <Row key={index}>{renderWeek(week)}</Row>;
      });
    }, [month, renderWeek]);

    return (
      <CalendarMonthWrapper>
        <Row hasText>
          <Typography style={{ fontSize: '20px' }} color={'secondary'}>
            {format(month, 'MMM YYYY')}
          </Typography>
        </Row>
        {renderDayNames()}
        {skeleton ? renderSkeletonMonth() : monthJSX}
      </CalendarMonthWrapper>
    );
  }
);

const renderDayNames = () => (
  <Row>
    {map(DAYS, (day, index) => (
      <DayItemButton key={index} color='secondary' variant='text'>
        {day.slice(0, 3)}
      </DayItemButton>
    ))}
  </Row>
);

const renderSkeletonMonth = () => {
  const month = getSkeletonMonth();
  return map(month, (week, index) => {
    return <Row key={index}>{renderSkeletonWeek(week)}</Row>;
  });
};

const getSkeletonMonth = () => {
  return range(0, MAX_NUMBER_WEEKS_SHOWN).map(() => {
    return new Array(DAYS.length).fill(null);
  });
};

const renderSkeletonWeek = (week: any[]) => {
  return map(week, (_, index) => {
    return (
      <CalendarItemButton key={index} variant='contained' color='secondary' />
    );
  });
};

const CalendarMonthWrapper = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: stretch;
  align-content: stretch;
  box-sizing: border-box;
`;

const Row = styled.div<{ hasText?: boolean }>`
  display: flex;
  flex: 1 1 0%;
  flex-direction: row;
  justify-content: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  align-items: ${({ hasText }) => (hasText ? 'center' : 'stretch')};
  box-sizing: border-box;
`;

const CalendarItemButton = withStyles({
  root: {
    display: 'flex',
    flex: '1 1 0%',
    background: '#2C3539'
  },
  label: {
    fontSize: '20px'
  }
})(Button);

const DayItemButton = withStyles({
  root: {
    display: 'flex',
    flex: '1 1 0%'
  },
  label: {
    fontSize: '20px'
  }
})(Button);
