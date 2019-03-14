import React from 'react';
import styled from 'styled-components';

export interface CalendarMonthProps {
  month: Date;
  selectedDate: Date;
  onSelect: (incomingDate: Date) => void;
}

export const CalendarMonth: React.FC<CalendarMonthProps> = React.memo(() => {
  return <CalendarMonthWrapper />;
});

const CalendarMonthWrapper = styled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: column;
  justify-content: center;
  align-content: center;
`;
