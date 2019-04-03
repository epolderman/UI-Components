import React, { useCallback, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { CalendarMonth } from './calendarMonth';
import { AnimatedGrid } from './animatedGrid';
import { GridCellProps } from 'react-virtualized';
import { addMonths } from 'date-fns';

export interface DateSelectorProps {
  onChange: (incomingDate: Date) => void;
  value: Date;
}

export interface DateSelectorState {
  monthOffset: number;
}

const CALENDAR_DIMENSIONS: number = 500;
const MAX_TIME_SPAN: number = 1000;
const MIDDLE_INDEX: number = 500;

export const DateSelector: React.FC<DateSelectorProps> = React.memo(
  ({ value, onChange }) => {
    const [monthOffset, setMonthOffset] = useState(MIDDLE_INDEX);
    const initialDate = useRef(new Date());

    useEffect(() => {
      setMonthOffset(monthOffset);
    }, [monthOffset]);

    const onSelect = useCallback((incomingDate: Date) => onChange(incomingDate), [
      onChange
    ]);
    const nextMonth = useCallback(() => onChange(addMonths(initialDate.current, 1)), [
      onChange
    ]);
    const prevMonth = useCallback(() => onChange(addMonths(initialDate.current, -1)), [
      onChange
    ]);

    const cellRenderer = (props: GridCellProps) => {
      const { style, columnIndex, key, isVisible } = props;
      const itemIndex = MIDDLE_INDEX - columnIndex;
      const itemDate = addMonths(initialDate.current, itemIndex);
      console.log('itemDate', itemDate, itemIndex, initialDate.current);
      return (
        <div style={{ ...style }} key={key}>
          <CalendarMonth
            onSelect={onSelect}
            month={itemDate}
            selectedDate={value}
            skeleton={isVisible}
          />
        </div>
      );
    };

    const renderGrid = () => {
      return (
        <AnimatedGrid
          column={monthOffset}
          cellRenderer={cellRenderer}
          height={CALENDAR_DIMENSIONS}
          width={CALENDAR_DIMENSIONS}
          rowHeight={CALENDAR_DIMENSIONS}
          rowCount={1}
          columnCount={MAX_TIME_SPAN}
          columnWidth={CALENDAR_DIMENSIONS}
          style={{ overflow: 'hidden', backgroundColor: 'red' }}
        />
      );
    };

    const renderControls = () => {
      return (
        <ControlRow>
          <ControlItem onClick={prevMonth}>Prev</ControlItem>
          <ControlItem onClick={nextMonth}>Next</ControlItem>
        </ControlRow>
      );
    };

    return (
      <DateWrapper>
        {renderControls()}
        {renderGrid()}
      </DateWrapper>
    );
  }
);

/* Top Left Container*/
const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  box-sizing: border-box;
  justify-content: stretch;
  align-items: stretch;
  background-color: teal;
`;

const ControlRow = styled.div`
  display: flex;
  background-color: blue;
  justify-content: space-between;
  align-items: center;
  flex: 1 1 0%;
  box-sizing: border-box;
`;

const ControlItem = styled.div`
  display: flex;
  flex: 1 1 0%;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background-color: white;
  color: black;
  border: 1px solid black;
`;
