import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
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

/* Calculation of calendar month data */

export interface CalendarMonthProps {
  month: Date;
  selectedDate: Date;
  onSelect: (incomingDate: Date) => void;
  skeleton?: boolean;
}

export const CalendarMonth: React.FC<CalendarMonthProps> = React.memo(
  ({ month, selectedDate, skeleton, onSelect }) => {
    const renderDayNames = () => (
      <Row>
        {map(DAYS, (day, index) => (
          <DayItem key={index}>{day.slice(0, 3)}</DayItem>
        ))}
      </Row>
    );
    const renderWeek = useCallback(
      (week: Date[]) =>
        map(week, (date, index) => {
          const dispatchSelect = () => onSelect(date);
          if (date == null) {
            return <CalendarItem key={index} />;
          } else if (isSameDate(date, selectedDate)) {
            return (
              <CalendarItem style={{ color: 'red' }} key={index}>
                {format(date, CALENDAR_DAY_FORMAT)}
              </CalendarItem>
            );
          } else {
            return (
              <CalendarItem onClick={dispatchSelect} key={index}>
                {format(date, CALENDAR_DAY_FORMAT)}
              </CalendarItem>
            );
          }
        }),
      [onSelect, selectedDate]
    );

    const renderMonth = useCallback(() => {
      const currentMonth: DateMatrix = buildDateMatrix(month);
      return map(currentMonth, (week, index) => {
        return <Row key={index}>{renderWeek(week)}</Row>;
      });
    }, [month, renderWeek]);

    const getSkeletonMonth = useCallback(() => {
      return range(0, MAX_NUMBER_WEEKS_SHOWN).map(() => {
        return new Array(DAYS.length).fill(null);
      });
    }, []);

    const renderSkeletonWeek = useCallback((week: any[]) => {
      return map(week, (week, index) => {
        return (
          <CalendarItem key={index}>{renderSkeletonWeek(week)}</CalendarItem>
        );
      });
    }, []);

    const renderSkeletonMonth = useCallback(() => {
      const month = getSkeletonMonth();
      return map(month, (week, index) => {
        return <Row key={index}>{renderSkeletonWeek(week)}</Row>;
      });
    }, [getSkeletonMonth, renderSkeletonWeek]);

    return (
      <CalendarMonthWrapper>
        {renderDayNames()}
        {skeleton ? renderSkeletonMonth() : renderMonth()}
      </CalendarMonthWrapper>
    );
  }
);

const CalendarMonthWrapper = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: stretch;
  align-content: stretch;
  box-sizing: border-box;
`;

const Row = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  box-sizing: border-box;
`;

const CalendarItem = styled.div`
  display: flex;
  flex: 1 1 0%;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background-color: white;
  color: black;
  border: 1px solid black;
  cursor: pointer;

  &:hover {
    background-color: black;
    color: white;
  }
`;

const DayItem = styled.div`
  display: flex;
  flex: 1 1 0%;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background-color: white;
  color: black;
  border: 1px solid black;
`;
