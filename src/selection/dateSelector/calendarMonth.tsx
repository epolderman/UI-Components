import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {
  DateMatrix,
  buildDateMatrix,
  CALENDAR_DAY_FORMAT,
  isSameDate,
  DAYS
} from './dateUtils';
import { map } from 'lodash';
import { format } from 'date-fns';

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
          <Item key={index}>{day.slice(0, 3)}</Item>
        ))}
      </Row>
    );
    const renderWeek = useCallback(
      (week: Date[]) =>
        map(week, (date, index) => {
          const dispatchSelect = () => onSelect(date);
          if (date == null) {
            return <Item key={index} />;
          } else if (isSameDate(date, selectedDate)) {
            return (
              <Item style={{ color: 'red' }} key={index}>
                {format(date, CALENDAR_DAY_FORMAT)}
              </Item>
            );
          } else {
            return (
              <Item onClick={dispatchSelect} key={index}>
                {format(date, CALENDAR_DAY_FORMAT)}
              </Item>
            );
          }
        }),
      [month, onSelect]
    );

    const renderMonth = useCallback(() => {
      /* TODO: Needs to be tested for the 'memoize last' semantics */
      const currentMonth: DateMatrix = useMemo(() => buildDateMatrix(month), [month]);
      return map(currentMonth, (week, index) => {
        return <Row key={index}>{renderWeek(week)}</Row>;
      });
    }, [month]);

    const renderSkeletonMonth = () => <div />;

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

const Item = styled.div`
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0%;
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
