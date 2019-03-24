import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { DateMatrix, buildDateMatrix, CALENDAR_DAY_FORMAT } from './dateUtils';
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
    const renderWeek = useCallback(
      (week: Date[]) =>
        map(week, (date, index) => {
          if (date == null) {
            return <Item key={index} />;
          }
          return <Item key={index}>{format(date, CALENDAR_DAY_FORMAT)}</Item>;
        }),
      [month]
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
        {skeleton ? renderSkeletonMonth() : renderMonth()}
      </CalendarMonthWrapper>
    );
  }
);

const CalendarMonthWrapper = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  box-sizing: border-box;
`;

const Row = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: row;
  justify-content: stretch;
  align-content: stretch;
  box-sizing: border-box;
`;

const Item = styled.div`
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 50px;
  box-sizing: border-box;
  background-color: white;
  color: black;
`;
