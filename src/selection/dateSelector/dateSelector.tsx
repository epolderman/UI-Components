import React, { useCallback, useState, useRef, useEffect } from 'react';
import { CalendarMonth } from './calendarMonth';
import { AnimatedGrid } from './animatedGrid';
import { addMonths, differenceInCalendarMonths } from 'date-fns';
import { MIDDLE_INDEX, MAX_TIME_SPAN, CALENDAR_DIMENSIONS } from './dateUtils';
import styled from '@emotion/styled';
import { Button } from '@material-ui/core';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons';

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

    // empty array dependency / only callbacked, useffect, useMemo = 1 intital render call

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
            skeleton={isScrolling}
          />
        </div>
      );
    };

    return (
      <DateContainer>
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
        <ControlRow>
          <ControlItem onClick={prevMonth} color='primary'>
            <KeyboardArrowLeft />
          </ControlItem>
          <ControlItem onClick={nextMonth} color='primary'>
            <KeyboardArrowRight />
          </ControlItem>
        </ControlRow>
      </DateContainer>
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
const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  box-sizing: border-box;
  justify-content: stretch;
  align-items: stretch;
  position: relative;
`;

const ControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 1 0%;
  box-sizing: border-box;
  position: absolute;
  top: 12px;
  left: 0;
  right: 0;
`;

const ControlItem = styled(Button)`
  display: flex;
  flex: 0 0 auto;
`;

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
const usePreviousDate = (value: Date) => {
  const ref = useRef<Date>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
