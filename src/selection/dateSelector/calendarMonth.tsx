import React from 'react';
import styled from 'styled-components';
import {} from 'date-fns';

/* Calculation of calendar month data */

export interface CalendarMonthProps {
  month: Date;
  selectedDate: Date;
  onSelect: (incomingDate: Date) => void;
  skeleton?: boolean;
}

export const CalendarMonth: React.FC<CalendarMonthProps> = React.memo(
  ({ month, selectedDate, skeleton, onSelect }) => {
    const renderWeek = () => <div />;
    const renderMonth = () => {
      return <div />;
    };

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
