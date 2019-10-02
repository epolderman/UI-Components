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
import { animated, useSpring, config } from 'react-spring';

/* 
  Date Range Selector Todo
  1. Add StartDate logic to move to different calendar month if suppplied by user(99% DONE).
  2. Handle error states (Silent + Visual) (DONE / animation?)
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
  isVisible: boolean;
  startDateTyped: string;
  endDateTyped: string;
  hoverDate: Date;
  error: RangeErrorType;
}

const initialState: DateRangeState = {
  monthOffset: MIDDLE_INDEX,
  isSelecting: false,
  isVisible: false,
  startDateTyped: '',
  endDateTyped: '',
  hoverDate: null,
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
  | { type: 'UPDATE_ERROR_STATE'; payload: RangeErrorType }
  | { type: 'UPDATE_VISIBLE_STATE'; payload: boolean };

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
    case 'UPDATE_VISIBLE_STATE':
      return { ...state, isVisible: action.payload };
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
  const startDateRef = useRef<HTMLInputElement>(null);
  const isGridAnimating = useRef(false);
  const showAnimation = useSpring({
    transform: state.isVisible ? `scale(1)` : `scale(0)`,
    opacity: state.isVisible ? 1 : 0,
    config: config.default,
    onRest: () => {
      if (!state.isVisible) {
        startDateRef.current.blur();
        // blur end date
        // transition back to the currently selected date month after close
        // if we navigated away during open state
        // const differenceInMonths = calculateMonthOffset(
        //   initialDate.current,
        //   monthOffset - MIDDLE_INDEX,
        //   value
        // );
        // if (differenceInMonths !== 0) {
        //   setMonthOffset(monthOffset => monthOffset + differenceInMonths);
        // }
      }
    }
  });
  const {
    monthOffset,
    hoverDate,
    isSelecting,
    startDateTyped,
    endDateTyped,
    error,
    isVisible
  } = state;

  useEffect(() => {
    // may need more thourough checks
    if (dateRange === prevDateRange) {
      return;
    }
    const validStartDate = dateRange[0] != null && isValid(dateRange[0]);
    const validEndDate = dateRange[1] != null && isValid(dateRange[1]);

    if (validStartDate) {
      const differenceInMonths = calculateMonthOffset(
        initialDate.current,
        monthOffset - MIDDLE_INDEX,
        dateRange[0]
      );
      const validAnimationChange =
        differenceInMonths !== 0 && differenceInMonths !== 1;
      if (validAnimationChange) {
        dispatch({
          type: 'UPDATE_MONTH_OFFSET',
          payload: monthOffset + differenceInMonths
        });
      }

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

    if (validEndDate) {
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

    if (validEndDate && validStartDate && isVisible) {
      dispatch({
        type: 'UPDATE_VISIBLE_STATE',
        payload: false
      });
    }
  }, [dateRange, prevDateRange, error, monthOffset, isVisible]);

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
      } else if (!isValidDateChange && isVisible) {
        dispatch({ type: 'UPDATE_VISIBLE_STATE', payload: false });
      } else if (endDateOverride) {
        updateDateRange(newDate, 'end');
      } else if (startDateOverride) {
        updateDateRange(newDate, 'start');
      } else {
        updateDateRange(newDate);
      }
    },
    [dateRange, updateDateRange, isSelecting, isVisible]
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

  const onFocus = useCallback(() => {
    dispatch({ type: 'UPDATE_VISIBLE_STATE', payload: true });
  }, []);

  const onBlur = useCallback(() => {
    const startDateHasText =
      startDateTyped.length > 0 && startDateTyped.trim() !== '';
    const endDateHasText =
      endDateTyped.length > 0 && endDateTyped.trim() !== '';

    if (startDateHasText) {
      onDateParse(startDateTyped, 'start');
    }
    if (endDateHasText) {
      onDateParse(endDateTyped, 'end');
    }

    if (isVisible && !startDateHasText && !endDateHasText) {
      dispatch({ type: 'UPDATE_VISIBLE_STATE', payload: false });
    }
  }, [startDateTyped, endDateTyped, onDateParse, isVisible]);

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
          onFocus={onFocus}
          onBlur={onBlur}
          ref={startDateRef}
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
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={dateRange[0] == null || !isValid(dateRange[0])}
          placeholder={'ex. 12/19/19'}
          onChange={onChangeEndDate}
          onDateParse={onDateParse}
          rangeSpecifier='end'
          error={error === 'end'}
          label={error === 'end' ? 'Invalid Date' : 'End Range'}
        />
      </Flex>
      <AnimatedCalendarWrapper style={showAnimation}>
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
            <Button
              disableRipple
              onClick={() => toMonth('prev')}
              onMouseDown={e => e.preventDefault()}
            >
              <KeyboardArrowLeft />
            </Button>
            <Button
              disableRipple
              onClick={() => toMonth('next')}
              onMouseDown={e => e.preventDefault()}
            >
              <KeyboardArrowRight />
            </Button>
          </ControlsContainer>
        </DateRangeContainer>
      </AnimatedCalendarWrapper>
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

const AnimatedCalendarWrapper = styled(animated.div)`
  display: flex;
  flex: 1 1 0%;
  position: absolute;
  top: 42px;
  right: 0;
  bottom: 0;
  justify-content: stretch;
  align-items: stretch;
  z-index: 99;
  flex-direction: column;
`;

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
