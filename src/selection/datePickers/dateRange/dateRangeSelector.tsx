import React, { useState, useRef, useCallback } from 'react';
import { AnimatedGrid } from '../animatedGrid';
import { Flex } from '@rebass/grid/emotion';
import { Typography, Button, Divider } from '@material-ui/core';
import {
  MIDDLE_INDEX,
  CALENDAR_DIMENSIONS_RANGE,
  CALENDAR_DIMENSIONS,
  MAX_TIME_SPAN,
  hasDateReachedLimit,
  hasDateChanged
} from '../dateUtils';
import { usePrevious } from '../../../utils/hooks';
import { addMonths, format, isBefore, isAfter } from 'date-fns';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import styled from '@emotion/styled';
import { CalendarMonthRange } from '../calendarRenderer/calendarMonthRange';

/* 
  Date Range Selector Todo
  1. Model Interface & Interaction / What can we re-use?
*/

export interface DateRangeSelectorProps {
  onChange: (incomingDate: DateTuple) => void;
  startDate: Date;
  endDate: Date;
}

type DateTuple = [Date, Date];

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onChange
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

  const onAnimationStart = useCallback(
    () => (isGridAnimating.current = true),
    []
  );

  const onAnimationEnd = useCallback(
    () => (isGridAnimating.current = false),
    []
  );

  const updateDate = useCallback(
    (incomingDate: Date) => {
      /// selecting start date state
      // just a click

      /// selecting end date state
      /// you can still select start date if it is before our current startDate

      //

      const isBeforeStart = isBefore(incomingDate, startDate);
      const isAfterStart = isAfter(incomingDate, startDate);

      if (isSelecting && isBeforeStart) {
        setHoverDate(null);
        return onChange([incomingDate, null]);
      } else if (isSelecting && isAfterStart) {
        setSelecting(false);
        setHoverDate(null);
        return onChange([startDate, incomingDate]);
      } else {
        setSelecting(true);
        console.log('case 3 invoked');
        return onChange([incomingDate, null]);
      }
    },
    [onChange, startDate, isSelecting]
  );

  const assignHoverDate = useCallback(
    (incomingDate: Date) => {
      if (isAfter(incomingDate, startDate)) {
        setHoverDate(incomingDate);
      } else {
        setHoverDate(null);
      }
    },
    [startDate]
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
    }) => {
      const itemOffset = columnIndex - MIDDLE_INDEX;
      const itemDate = addMonths(initialDate.current, itemOffset);
      const itemNextDate = addMonths(initialDate.current, itemOffset + 1);
      return (
        <div style={{ ...style, display: 'flex' }} key={key}>
          <CalendarMonthRange
            month={itemDate}
            onSelect={updateDate}
            startDate={startDate}
            endDate={endDate}
            isSelecting={isSelecting}
            hoverDate={hoverDate}
            assignHoverDate={assignHoverDate}
          />
          <Divider orientation='vertical' style={{ margin: '0 4px' }} />
          <CalendarMonthRange
            month={itemNextDate}
            onSelect={updateDate}
            startDate={startDate}
            endDate={endDate}
            isSelecting={isSelecting}
            hoverDate={hoverDate}
            assignHoverDate={assignHoverDate}
          />
        </div>
      );
    },
    [
      initialDate,
      startDate,
      endDate,
      updateDate,
      isSelecting,
      assignHoverDate,
      hoverDate
    ]
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
        durationOfAnimation={700}
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
