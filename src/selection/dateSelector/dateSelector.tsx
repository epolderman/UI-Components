import React, { useCallback } from 'react';
import styled from 'styled-components';
import { CalendarMonth } from './calendarMonth';
import { AnimatedGrid } from './animatedGrid';
/* Main Component */

export interface DateSelectorProps {
  onChange: (incomingDate: Date) => void;
  value: Date;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ value, onChange }) => {
  const onSelect = useCallback((incomingDate: Date) => {
    console.log(incomingDate);
    onChange(incomingDate);
  }, []);

  return (
    <DateWrapper>
      <CalendarMonth onSelect={onSelect} month={value} selectedDate={value} />
      <AnimatedGrid column={1} />
    </DateWrapper>
  );
};

const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  box-sizing: border-box;
  justify-content: stretch;
  align-items: stretch;
  background-color: black;
`;
