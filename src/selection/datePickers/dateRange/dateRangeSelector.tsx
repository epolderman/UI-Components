import React, { useState, useRef, useCallback } from 'react';
import { AnimatedGrid } from '../animatedGrid';
import { Flex } from '@rebass/grid/emotion';
import { Typography, Button, Divider } from '@material-ui/core';
import {
  MIDDLE_INDEX,
  CALENDAR_DIMENSIONS_RANGE,
  CALENDAR_DIMENSIONS,
  MAX_TIME_SPAN
} from '../dateUtils';
import { usePrevious } from '../../../utils/hooks';
import { addMonths, format } from 'date-fns';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import styled from '@emotion/styled';
import { CalendarMonthRange } from '../calendarRenderer/calendarMonthRange';

/* 
  Date Range Selector Todo
  1. Model Interface & Interaction / What can we re-use?
*/

export interface DateRangeSelectorProps {
  onChange: (incomingDate: Date) => void;
  startDate: Date;
  endDate: Date;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  onChange
}) => {
  const [monthOffset, setMonthOffset] = useState(MIDDLE_INDEX);
  // const prevDate = usePrevious<Date>(value);
  const initialDate = useRef<Date>(new Date());
  const isGridAnimating = useRef(false);

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
            selectedDate={startDate}
            onSelect={onChange}
          />
          <Divider orientation='vertical' />
          <CalendarMonthRange
            month={itemNextDate}
            selectedDate={endDate}
            onSelect={onChange}
          />
        </div>
      );
    },
    [initialDate, startDate, endDate, onChange]
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
        // onAnimationStart={onAnimationStart}
        // onAnimationEnd={onAnimationEnd}
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
