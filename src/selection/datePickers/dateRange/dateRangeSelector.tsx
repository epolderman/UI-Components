import styled from '@emotion/styled';
import { Button, Divider, TextField, Typography } from '@material-ui/core';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CalendarToday
} from '@material-ui/icons';
import { Flex } from '@rebass/grid/emotion';
import { addMonths, isAfter, isBefore, isSameDay, format } from 'date-fns';
import React, { useCallback, useRef, useReducer, useEffect } from 'react';
import { AnimatedGrid } from '../AnimatedGrid';
import {
  CALENDAR_DIMENSIONS_RANGE_HEIGHT,
  CALENDAR_DIMENSIONS_RANGE_WIDTH,
  MAX_TIME_SPAN,
  MIDDLE_INDEX,
  MONTH_DAY_YEAR_FORMAT
} from '../dateUtils';
import { DateRangeTextFields } from './DateRangeTextFields';
import { makeShadow, ELEVATIONS } from '../../../common/elevation';
import { CalendarMonthRange } from '../calenderRenderer/CalenderMonthRange';
import { usePrevious } from '../../../utils/hooks';

/* 
  Date Range Selector Todo
  1. Add StartDate logic to move to different calendar month if suppplied by user(WIP).
  2. Wire in text field date ranges to this component. (WIP)
  3. Layout of text field with calendar below. Handle no space on right. (WIP)
  3. CalendarMonthRange needs styles update to match mockups. (99% DONE)
  4. Add pallette colors and remove static colors. 
*/

interface DateRangeState {
  monthOffset: number;
  isSelecting: boolean;
  hoverDate: Date;
  startDateTyped: string;
  endDateTyped: string;
}

const initialState: DateRangeState = {
  monthOffset: MIDDLE_INDEX,
  isSelecting: false,
  hoverDate: null,
  startDateTyped: '',
  endDateTyped: ''
};

type DateRangeActions =
  | { type: 'UPDATE_MONTH_OFFSET'; payload: number }
  | { type: 'UPDATE_HOVER_DATE'; payload: Date }
  | { type: 'UPDATE_SELECTION_STATE'; payload: boolean }
  | { type: 'CLEAR_SELECTION_STATE' }
  | { type: 'CLEAR_HOVER_DATE' }
  | { type: 'UPDATE_START_DATE_STATE'; payload: string }
  | { type: 'UPDATE_END_DATE_STATE'; payload: string };

function reducer(
  state: DateRangeState,
  action: DateRangeActions
): DateRangeState {
  switch (action.type) {
    case 'UPDATE_MONTH_OFFSET':
      return { ...state, monthOffset: action.payload };
    case 'UPDATE_SELECTION_STATE':
      return { ...state, isSelecting: action.payload };
    case 'UPDATE_START_DATE_STATE':
      return { ...state, startDateTyped: action.payload };
    case 'UPDATE_END_DATE_STATE':
      return { ...state, endDateTyped: action.payload };
    case 'CLEAR_SELECTION_STATE':
      return { ...state, isSelecting: false, hoverDate: null };
    case 'UPDATE_HOVER_DATE':
      return { ...state, hoverDate: action.payload };
    case 'CLEAR_HOVER_DATE':
      return { ...state, hoverDate: null };
  }
}

export interface DateRangeSelectorProps {
  onChange: (incomingDate: DateRangeTuple) => void;
  dateRange: DateRangeTuple;
}

export type DateRangeTuple = [Date, Date];

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onChange,
  dateRange
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const prevDateRange = usePrevious<DateRangeTuple>(dateRange);
  const initialDate = useRef<Date>(new Date());
  const isGridAnimating = useRef(false);
  const {
    monthOffset,
    hoverDate,
    isSelecting,
    startDateTyped,
    endDateTyped
  } = state;

  // @todo bind this to the calendar and vic versa
  useEffect(() => {
    if (dateRange !== prevDateRange) {
      // check if date[0], date[1] is same as prev date
      dispatch({
        type: 'UPDATE_START_DATE_STATE',
        payload: format(dateRange[0], MONTH_DAY_YEAR_FORMAT)
      });
    }
  }, [dateRange]);

  const toMonth = useCallback(
    (increment: 'next' | 'prev') => {
      if (isGridAnimating.current) {
        return;
      }
      const monthAddition = increment === 'next' ? 1 : -1;
      dispatch({
        type: 'UPDATE_MONTH_OFFSET',
        payload: monthOffset + monthAddition
      });
    },
    [monthOffset]
  );

  const updateDateRange = useCallback(
    (incomingDate: Date) => {
      const isBeforeStart = isBefore(incomingDate, dateRange[0]);
      const isAfterStart = isAfter(incomingDate, dateRange[0]);
      const isSameStart = isSameDay(incomingDate, dateRange[0]);

      if (isSelecting && (isBeforeStart || isSameStart)) {
        dispatch({ type: 'CLEAR_HOVER_DATE' });
        onChange([incomingDate, null]);
      } else if (isSelecting && isAfterStart) {
        dispatch({ type: 'CLEAR_SELECTION_STATE' });
        onChange([dateRange[0], incomingDate]);
      } else {
        dispatch({ type: 'UPDATE_SELECTION_STATE', payload: true });
        onChange([incomingDate, null]);
      }
    },
    [onChange, dateRange, isSelecting]
  );

  const onSelectHoverRange = useCallback(
    (incomingDate: Date) => {
      // update hover date as long as not on dateRange, never clear
      if (isAfter(incomingDate, dateRange[0])) {
        dispatch({ type: 'UPDATE_HOVER_DATE', payload: incomingDate });
      } else {
        dispatch({ type: 'CLEAR_HOVER_DATE' });
      }
    },
    [dateRange]
  );

  const cellRenderer = useCallback(
    ({
      key,
      style,
      columnIndex,
      isScrolling
    }: {
      key: string;
      style: React.CSSProperties;
      columnIndex: number;
      isScrolling: boolean;
    }) => (
      <div
        style={{
          ...style,
          display: 'flex'
        }}
        key={key}
      >
        <CalendarMonthRange
          month={addMonths(initialDate.current, columnIndex - MIDDLE_INDEX)}
          onSelectRange={updateDateRange}
          isSelecting={isSelecting}
          hoverDate={hoverDate}
          onSelectHoverRange={onSelectHoverRange}
          dateRange={dateRange}
          isLoading={isScrolling}
        />
        <Divider orientation='vertical' />
        <CalendarMonthRange
          month={addMonths(initialDate.current, columnIndex - MIDDLE_INDEX + 1)}
          onSelectRange={updateDateRange}
          isSelecting={isSelecting}
          hoverDate={hoverDate}
          onSelectHoverRange={onSelectHoverRange}
          dateRange={dateRange}
          isLoading={isScrolling}
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

  const onChangeStartDate = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) =>
      dispatch({ type: 'UPDATE_START_DATE_STATE', payload: evt.target.value }),
    []
  );

  const onChangeEndDate = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) =>
      dispatch({ type: 'UPDATE_END_DATE_STATE', payload: evt.target.value }),
    []
  );

  return (
    <Flex
      justifyContent='center'
      alignItems='center'
      flex='1 1 0%'
      style={{ position: 'relative', maxWidth: '625px' }}
    >
      <Flex alignItems='center' justifyContent='center' flex='1 1 0%'>
        <CalendarToday style={{ marginRight: '8px' }} />
        <TextField
          value={startDateTyped}
          placeholder={'ex. 12/19/99'}
          onChange={onChangeStartDate}
          margin='dense'
          autoComplete='on'
          variant='outlined'
          style={{
            margin: 0
          }}
          InputProps={{
            endAdornment: null,
            startAdornment: null,
            style: { width: '150px' }
          }}
        />
        <Typography variant='subtitle1' style={{ margin: '0 8px' }}>
          to
        </Typography>
        <TextField
          value={endDateTyped}
          placeholder={'ex. 12/19/99'}
          onChange={onChangeEndDate}
          margin='dense'
          autoComplete='on'
          variant='outlined'
          style={{
            margin: 0
          }}
          InputProps={{
            endAdornment: null,
            startAdornment: null,
            style: { width: '150px' }
          }}
        />
      </Flex>
      <Flex
        justifyContent='stretch'
        alignItems='stretch'
        flexDirection='column'
        flex='1 1 0%'
        style={{
          position: 'absolute',
          top: '41px',
          bottom: 0,
          left: 0
        }}
      >
        <DateRangeContainer>
          <AnimatedGrid
            column={monthOffset}
            cellRenderer={cellRenderer}
            height={CALENDAR_DIMENSIONS_RANGE_HEIGHT}
            width={CALENDAR_DIMENSIONS_RANGE_WIDTH}
            rowHeight={CALENDAR_DIMENSIONS_RANGE_HEIGHT}
            rowCount={1}
            columnCount={MAX_TIME_SPAN}
            columnWidth={CALENDAR_DIMENSIONS_RANGE_WIDTH}
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
      </Flex>
    </Flex>
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
  max-width: ${CALENDAR_DIMENSIONS_RANGE_WIDTH}px;
  justify-content: stretch;
  align-items: stretch;
  position: relative;
  padding: 8px 0;
  background-color: ${background.content.primary};
  ${makeShadow(ELEVATIONS.MENU)};
`;

const ControlsContainer = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  flex: 1 1 0%;
  position: absolute;
  top: 8px;
  left: 4px;
  right: 4px;
  height: 44px;

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
