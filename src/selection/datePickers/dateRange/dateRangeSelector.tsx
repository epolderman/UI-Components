import styled from '@emotion/styled';
import { Button, Divider, Typography } from '@material-ui/core';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CalendarToday
} from '@material-ui/icons';
import { Flex } from '@rebass/grid/emotion';
import {
  addMonths,
  isAfter,
  isBefore,
  isSameDay,
  format,
  parse,
  isValid
} from 'date-fns';
import React, { useCallback, useRef, useReducer, useEffect } from 'react';
import { AnimatedGrid } from '../AnimatedGrid';
import {
  CALENDAR_DIMENSIONS_RANGE_HEIGHT,
  CALENDAR_DIMENSIONS_RANGE_WIDTH,
  MAX_TIME_SPAN,
  MIDDLE_INDEX,
  MONTH_DAY_YEAR_FORMAT,
  calculateMonthOffset,
  hasDateChanged,
  hasDateReachedLimit
} from '../dateUtils';
import { makeShadow, ELEVATIONS } from '../../../common/elevation';
import { CalendarMonthRange } from '../calenderRenderer/CalenderMonthRange';
import { usePrevious } from '../../../utils/hooks';
import { DateRangeField } from './DateRangeField';

/* 
  Date Range Selector Todo
  1. Add StartDate logic to move to different calendar month if suppplied by user(99% DONE).
  2. Handle error states (Silent + Visual) (DONE)
  3. Wire in text field date ranges to this component. (DONE)
  4. Layout of text field with calendar below. Handle no space on right. (50%)
  5. CalendarMonthRange needs styles update to match mockups. (99% DONE / 1 Bug)
  6  Add onBlur to text fields to parse date. 
  7. Add pallette colors and remove static colors. 
*/

type RangeErrorType = 'start' | 'end' | null;

interface DateRangeState {
  monthOffset: number;
  isSelecting: boolean;
  hoverDate: Date;
  startDateTyped: string;
  endDateTyped: string;
  error: RangeErrorType;
}

const initialState: DateRangeState = {
  monthOffset: MIDDLE_INDEX,
  isSelecting: false,
  hoverDate: null,
  startDateTyped: '',
  endDateTyped: '',
  error: null
};

type DateRangeActions =
  | { type: 'UPDATE_MONTH_OFFSET'; payload: number }
  | { type: 'UPDATE_HOVER_DATE'; payload: Date }
  | { type: 'UPDATE_SELECTION_STATE'; payload: boolean }
  | { type: 'CLEAR_SELECTION_STATE' }
  | { type: 'CLEAR_HOVER_DATE' }
  | { type: 'UPDATE_START_DATE_STATE'; payload: string }
  | { type: 'UPDATE_END_DATE_STATE'; payload: string }
  | { type: 'UPDATE_ERROR_STATE'; payload: RangeErrorType };

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
    case 'UPDATE_ERROR_STATE':
      return { ...state, error: action.payload };
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
    endDateTyped,
    error
  } = state;

  useEffect(() => {
    // may need more thourough checks
    if (dateRange === prevDateRange) {
      return;
    }
    // // animations ->>>
    const differenceInMonths = calculateMonthOffset(
      initialDate.current,
      monthOffset - MIDDLE_INDEX,
      dateRange[0]
    );
    const validAnimationChange =
      differenceInMonths !== 0 &&
      differenceInMonths !== 1 &&
      dateRange[0] != null;
    if (validAnimationChange) {
      dispatch({
        type: 'UPDATE_MONTH_OFFSET',
        payload: monthOffset + differenceInMonths
      });
    }
    // date typed ->>>
    if (dateRange[0] != null) {
      if (error === 'start') {
        dispatch({
          type: 'UPDATE_ERROR_STATE',
          payload: null
        });
      }
      dispatch({
        type: 'UPDATE_START_DATE_STATE',
        payload: format(dateRange[0], MONTH_DAY_YEAR_FORMAT)
      });
    }
    if (dateRange[1] != null) {
      if (error === 'end') {
        dispatch({
          type: 'UPDATE_ERROR_STATE',
          payload: null
        });
      }
      dispatch({
        type: 'UPDATE_END_DATE_STATE',
        payload: format(dateRange[1], MONTH_DAY_YEAR_FORMAT)
      });
    }
  }, [dateRange, prevDateRange, error, monthOffset]);

  const updateDateRange = useCallback(
    (incomingDate: Date, overrideSelectionState?: 'start' | 'end') => {
      // silent protection: limitation of virtualized table: incoming date is > 41 years in future, past
      if (hasDateReachedLimit(initialDate.current, incomingDate)) {
        return;
      }
      const isBeforeStart = isBefore(incomingDate, dateRange[0]);
      const isAfterStart = isAfter(incomingDate, dateRange[0]);
      const isSameStart = isSameDay(incomingDate, dateRange[0]);
      const isBeforeEnd = isBefore(incomingDate, dateRange[1]);
      // silent protection: end date cannot start before start date when typing in date
      if (overrideSelectionState === 'end' && (isBeforeStart || isSameStart)) {
        return;
      }

      if (overrideSelectionState === 'start' && isBeforeEnd) {
        onChange([incomingDate, dateRange[1]]);
      } else if (overrideSelectionState === 'end') {
        onChange([dateRange[0], incomingDate]);
      } else if (isSelecting && (isBeforeStart || isSameStart)) {
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

  const onDateParse = useCallback(
    (dateTyped: string, rangeSpecifier: 'start' | 'end') => {
      const newDate = parse(dateTyped);
      const isValidDateTyped = isValid(newDate) && dateTyped !== '';
      const isValidDateChange = hasDateChanged(
        rangeSpecifier === 'start' ? dateRange[0] : dateRange[1],
        newDate
      );
      // overrides: don't go through hover date selecting, just slam
      const endDateOverride =
        rangeSpecifier === 'end' &&
        dateRange[0] != null &&
        isValid(dateRange[0]) &&
        !isSelecting;
      const startDateOverride =
        rangeSpecifier === 'start' &&
        dateRange[1] != null &&
        isValid(dateRange[1]) &&
        !isSelecting;

      if (!isValidDateTyped && isValidDateChange) {
        dispatch({ type: 'UPDATE_ERROR_STATE', payload: rangeSpecifier });
      } else if (endDateOverride) {
        updateDateRange(newDate, 'end');
      } else if (startDateOverride) {
        updateDateRange(newDate, 'start');
      } else {
        updateDateRange(newDate);
      }
    },
    [dateRange, updateDateRange, isSelecting]
  );

  const onSelectHoverRange = useCallback(
    (incomingDate: Date) => {
      if (isAfter(incomingDate, dateRange[0])) {
        dispatch({ type: 'UPDATE_HOVER_DATE', payload: incomingDate });
      } else {
        dispatch({ type: 'CLEAR_HOVER_DATE' });
      }
    },
    [dateRange]
  );

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
        <DateRangeField
          value={startDateTyped}
          placeholder={'ex. 11/19/19'}
          onChange={onChangeStartDate}
          onDateParse={onDateParse}
          rangeSpecifier='start'
          error={error === 'start'}
          label={error === 'start' ? 'Invalid Date' : 'Start Range'}
        />
        <Typography variant='subtitle1' style={{ margin: '0 8px' }}>
          to
        </Typography>
        <DateRangeField
          value={endDateTyped}
          placeholder={'ex. 12/19/19'}
          onChange={onChangeEndDate}
          onDateParse={onDateParse}
          rangeSpecifier='end'
          error={error === 'end'}
          label={error === 'end' ? 'Invalid Date' : 'End Range'}
        />
      </Flex>
      <Flex
        justifyContent='stretch'
        alignItems='stretch'
        flexDirection='column'
        flex='1 1 0%'
        style={{
          position: 'absolute',
          top: '42px' /* text field height + 2px */,
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
