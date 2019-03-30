import React, { useCallback, useState, useRef } from 'react';
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

    const onSelect = useCallback((incomingDate: Date) => onChange(incomingDate), [
      onChange
    ]);

    const cellRenderer = (props: GridCellProps) => {
      const { style, columnIndex, key, isVisible } = props;
      const itemIndex = MIDDLE_INDEX - columnIndex;
      const itemDate = addMonths(initialDate.current, itemIndex);
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
          style={{ overflow: 'hidden' }}
        />
      );
    };

    return (
      <DateWrapper>
        <GridWrapper>{renderGrid()}</GridWrapper>
      </DateWrapper>
    );
  }
);

const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  box-sizing: border-box;
  justify-content: stretch;
  align-items: center;
  background-color: black;
`;

const GridWrapper = styled.div`
  display: flex;
  flex: 1 1 500px;
  box-sizing: border-box;
`;
