import React, { useCallback, useState, useRef, useEffect } from 'react';
import { CalendarMonth } from './calendarMonth';
import { AnimatedGrid } from './animatedGrid';
import { addMonths, differenceInCalendarMonths } from 'date-fns';
import { MIDDLE_INDEX, MAX_TIME_SPAN, CALENDAR_DIMENSIONS } from './dateUtils';
import styled from '@emotion/styled';
import { Button } from '@material-ui/core';

export interface DateSelectorProps {
  onChange: (incomingDate: Date) => void;
  value: Date;
}

export interface DateSelectorState {
  monthOffset: number;
}

export const DateSelector: React.FC<DateSelectorProps> = React.memo(
  ({ value, onChange }) => {
    const [monthOffset, setMonthOffset] = useState(MIDDLE_INDEX);
    const initialDate = useRef<Date>(new Date());
    const prevDate = usePreviousDate(value);

    useEffect(() => {
      // new date coming in
      if (prevDate !== value) {
        const difference = calculateMonthOffset(
          initialDate.current,
          monthOffset - MIDDLE_INDEX,
          value
        );
        if (difference !== 0) {
          setMonthOffset(m => m + difference);
        }
      }
    }, [value, monthOffset, prevDate]);

    const onSelect = useCallback(
      (incomingDate: Date) => onChange(incomingDate),
      [onChange]
    );

    const nextMonth = useCallback(() => setMonthOffset(monthOffset + 1), [
      monthOffset
    ]);

    const prevMonth = useCallback(() => setMonthOffset(monthOffset + -1), [
      monthOffset
    ]);

    const cellRenderer = ({
      key,
      style,
      columnIndex,
      isScrolling
    }: {
      key: string;
      style: React.CSSProperties;
      columnIndex: number;
      isScrolling: boolean;
    }) => {
      const itemOffset = columnIndex - MIDDLE_INDEX;
      const itemDate = addMonths(initialDate.current, itemOffset);
      return (
        <div style={{ ...style, display: 'flex' }} key={key}>
          <CalendarMonth
            onSelect={onSelect}
            month={itemDate}
            selectedDate={value}
            // skeleton={isScrolling}
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

    const renderControls = () => {
      return (
        <ControlRow>
          <ControlItem
            onClick={prevMonth}
            variant='contained'
            color='secondary'
          >
            Prev
          </ControlItem>
          <ControlItem
            onClick={nextMonth}
            variant='contained'
            color='secondary'
          >
            Next
          </ControlItem>
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

const calculateMonthOffset = (
  date: Date,
  monthOffset: number,
  dateChange: Date
): number =>
  differenceInCalendarMonths(dateChange, addMonths(date, monthOffset));

/* Top Left Container*/
const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  box-sizing: border-box;
  justify-content: stretch;
  align-items: stretch;
`;

const ControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  flex: 1 1 0%;
  box-sizing: border-box;
`;

const ControlItem = styled(Button)`
  display: flex;
  flex: 1 1 0%;
`;

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
const usePreviousDate = (value: Date) => {
  const ref = useRef<Date>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
