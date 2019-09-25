import styled from '@emotion/styled';
import { Button, Divider } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { Flex } from '@rebass/grid/emotion';
import { addMonths, isAfter, isBefore } from 'date-fns';
import React, { useCallback, useRef, useState } from 'react';
import { AnimatedGrid } from '../animatedGrid';
import { CalendarMonthRange } from '../calendarRenderer/calendarMonthRange';
import {
  CALENDAR_DIMENSIONS,
  CALENDAR_DIMENSIONS_RANGE,
  MAX_TIME_SPAN,
  MIDDLE_INDEX
} from '../dateUtils';

/* 
  Date Range Selector Todo
  1. Add StartDate logic to move to different calendar month if suppplied by user.
  2. CalendarMonthRange needs styles update to match mockups.
  3. Wire in text field date ranges to this component.
  4. Wire up isSmall prop to respond to smaller dimension threshold.
*/

export interface DateRangeSelectorProps {
  onChange: (incomingDate: DateRangeTuple) => void;
  dateRange: DateRangeTuple;
}

export type DateRangeTuple = [Date, Date];

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onChange,
  dateRange
}) => {
  const [monthOffset, setMonthOffset] = useState(MIDDLE_INDEX);
  const [isSelecting, setSelecting] = useState(false);
  // const prevDate = usePrevious<Date>(value);
  const initialDate = useRef<Date>(new Date());
  const isGridAnimating = useRef(false);
  const [hoverDate, setHoverDate] = useState<Date>(null);

  const toMonth = useCallback(
    (increment: 'next' | 'prev') => {
      if (isGridAnimating.current) {
        return;
      }
      const monthAddition = increment === 'next' ? 1 : -1;
      setMonthOffset(monthOffset + monthAddition);
    },
    [monthOffset]
  );

  const updateDateRange = useCallback(
    (incomingDate: Date) => {
      const isBeforeStart = isBefore(incomingDate, dateRange[0]);
      const isAfterStart = isAfter(incomingDate, dateRange[0]);

      if (isSelecting && isBeforeStart) {
        setHoverDate(null);
        onChange([incomingDate, null]);
      } else if (isSelecting && isAfterStart) {
        setSelecting(false);
        setHoverDate(null);
        onChange([dateRange[0], incomingDate]);
      } else {
        setSelecting(true);
        onChange([incomingDate, null]);
      }
    },
    [onChange, dateRange, isSelecting]
  );

  const onSelectHoverRange = useCallback(
    (incomingDate: Date) => {
      if (isAfter(incomingDate, dateRange[0])) {
        setHoverDate(incomingDate);
      } else {
        setHoverDate(null);
      }
    },
    [dateRange]
  );

  const cellRenderer = useCallback(
    ({
      key,
      style,
      columnIndex
    }: {
      key: string;
      style: React.CSSProperties;
      columnIndex: number;
    }) => (
      <div style={{ ...style, display: 'flex' }} key={key}>
        <CalendarMonthRange
          month={addMonths(initialDate.current, columnIndex - MIDDLE_INDEX)}
          onSelectRange={updateDateRange}
          isSelecting={isSelecting}
          hoverDate={hoverDate}
          onSelectHoverRange={onSelectHoverRange}
          dateRange={dateRange}
        />
        <Divider orientation='vertical' style={{ margin: '0 4px' }} />
        <CalendarMonthRange
          month={addMonths(initialDate.current, columnIndex - MIDDLE_INDEX + 1)}
          onSelectRange={updateDateRange}
          isSelecting={isSelecting}
          hoverDate={hoverDate}
          onSelectHoverRange={onSelectHoverRange}
          dateRange={dateRange}
        />
      </div>
    ),
    [
      initialDate,
      dateRange,
      updateDateRange,
      isSelecting,
      onSelectHoverRange,
      hoverDate
    ]
  );

  const onAnimationStart = useCallback(
    () => (isGridAnimating.current = true),
    []
  );

  const onAnimationEnd = useCallback(
    () => (isGridAnimating.current = false),
    []
  );

  return (
    <DateRangeContainer>
      <AnimatedGrid
        column={monthOffset}
        cellRenderer={cellRenderer}
        height={CALENDAR_DIMENSIONS}
        width={CALENDAR_DIMENSIONS_RANGE}
        rowHeight={CALENDAR_DIMENSIONS}
        rowCount={1}
        columnCount={MAX_TIME_SPAN}
        columnWidth={CALENDAR_DIMENSIONS_RANGE}
        style={{ overflow: 'hidden', outline: 'none' }}
        durationOfAnimation={800}
        onAnimationStart={onAnimationStart}
        onAnimationEnd={onAnimationEnd}
      />
      <ControlsContainer>
        <Button disableRipple onClick={() => toMonth('prev')}>
          <KeyboardArrowLeft />
        </Button>
        <Button disableRipple onClick={() => toMonth('next')}>
          <KeyboardArrowRight />
        </Button>
      </ControlsContainer>
    </DateRangeContainer>
  );
};

const background = {
  content: {
    primary: 'rgb(255,255,255)',
    secondary: 'rgb(248,248,248)'
  },
  empty: 'rgb(238,238,238)',
  error: '#323232',
  barren: 'rgb(220,220,220)'
};

const DateRangeContainer = styled(Flex)`
  flex-direction: column;
  flex: 1 1 0%;
  max-width: 600px;
  justify-content: stretch;
  align-items: stretch;
  position: relative;
  background-color: ${background.content.primary};
`;

const ControlsContainer = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  flex: 1 1 0%;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;

  button {
    width: 39px;
    height: 34px;
    padding: 0 0;
    min-width: 0;
    &:hover {
      background-color: transparent;
    }
  }
`;
