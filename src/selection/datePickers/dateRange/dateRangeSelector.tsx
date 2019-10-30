import React, {
  useCallback,
  useRef,
  useReducer,
  useEffect,
  useMemo
} from 'react';
import styled from '@emotion/styled';
import { Button, Divider, Box, Fade } from '@material-ui/core';
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
import { AnimatedGrid } from '../AnimatedGrid';
import {
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
import { background } from '../../../common/colors';
import {
  CALENDAR_DIMENSIONS_RANGE_WIDTH,
  CALENDAR_CONTENTS_HEIGHT
} from '../calenderRenderer/rangeUtils';

/* 
  Date Range main component:
  Currently optimized for no virtualization for speed of date selection from a UX point of view. 
  If virtualization is a must, ping Erik, due to us unmounting the calendar on fade out transition.
*/

interface DateRangeState {
  monthOffset: number;
  isSelecting: boolean;
  isVisible: boolean;
  startDateTyped: string;
  endDateTyped: string;
  hoverDate: Date;
}

const initialState: DateRangeState = {
  monthOffset: MIDDLE_INDEX,
  isSelecting: false,
  isVisible: false,
  startDateTyped: '',
  endDateTyped: '',
  hoverDate: null
};

type DateRangeActions =
  | { type: 'UPDATE_MONTH_OFFSET'; payload: number }
  | { type: 'UPDATE_HOVER_DATE'; payload: Date }
  | { type: 'UPDATE_SELECTION_STATE'; payload: boolean }
  | { type: 'UPDATE_START_DATE_STATE'; payload: string }
  | { type: 'UPDATE_END_DATE_STATE'; payload: string }
  | { type: 'UPDATE_VISIBLE_STATE'; payload: boolean }
  | { type: 'CLEAR_SELECTION_STATE' };

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
    case 'UPDATE_HOVER_DATE':
      return { ...state, hoverDate: action.payload };
    case 'UPDATE_VISIBLE_STATE':
      return { ...state, isVisible: action.payload };
    case 'CLEAR_SELECTION_STATE':
      return { ...state, isSelecting: false, hoverDate: null };
  }
}

export interface DateRangeSelectorProps {
  onChange: (incomingDate: DateRangeTuple) => void;
  dateRange: DateRangeTuple;
  disableVirtualization?: boolean;
  hideCalendarIcon?: boolean;
  dateFormat?: string;
}

export type DateRangeTuple = [Date, Date];

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onChange,
  dateRange,
  disableVirtualization,
  hideCalendarIcon,
  dateFormat
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    monthOffset,
    hoverDate,
    isSelecting,
    startDateTyped,
    endDateTyped,
    isVisible
  } = state;
  const prevDateRange = usePrevious<DateRangeTuple>(dateRange);
  const initialDate = useRef<Date>(new Date());
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const isGridAnimating = useRef(false);
  const _dateFormat = useMemo(() => {
    if (dateFormat != null && dateFormat.length > 0) {
      return dateFormat;
    }
    return MONTH_DAY_YEAR_FORMAT;
  }, [dateFormat]);

  // valid date changes
  useEffect(() => {
    if (dateRange === prevDateRange) {
      return;
    }
    const validStartDate = dateRange[0] != null && isValid(dateRange[0]);
    const validEndDate = dateRange[1] != null && isValid(dateRange[1]);
    const isRangeCleared = dateRange[0] == null && dateRange[1] == null;
    const isRangeChanged = validEndDate && validStartDate;

    if (validStartDate) {
      const differenceInMonths = calculateMonthOffset(
        initialDate.current,
        monthOffset - MIDDLE_INDEX,
        dateRange[0]
      );
      const validCalendarChange =
        differenceInMonths !== 0 && differenceInMonths !== 1;
      // animate / next / prev month range render
      if (validCalendarChange) {
        dispatch({
          type: 'UPDATE_MONTH_OFFSET',
          payload: monthOffset + differenceInMonths
        });
      }
      // update field
      dispatch({
        type: 'UPDATE_START_DATE_STATE',
        payload: format(dateRange[0], _dateFormat)
      });
    }

    if (validEndDate) {
      dispatch({
        type: 'UPDATE_END_DATE_STATE',
        payload: format(dateRange[1], _dateFormat)
      });
    }

    // start range was cleared
    if (dateRange[0] == null) {
      dispatch({
        type: 'UPDATE_START_DATE_STATE',
        payload: ''
      });
    }

    // end range was cleared
    if (dateRange[1] == null) {
      dispatch({
        type: 'UPDATE_END_DATE_STATE',
        payload: ''
      });
    }

    if (isVisible && (isRangeCleared || isRangeChanged)) {
      dispatch({
        type: 'UPDATE_VISIBLE_STATE',
        payload: false
      });
    }
  }, [dateRange, prevDateRange, monthOffset, isVisible, _dateFormat]);

  // on close state resets [monthOffset]
  useEffect(() => {
    if (isVisible) {
      return;
    }
    startDateRef.current.blur();
    endDateRef.current.blur();
    // on close, transition back to our start date is not visible
    if (dateRange[0] != null && isValid(dateRange[0])) {
      const differenceInMonths = calculateMonthOffset(
        initialDate.current,
        monthOffset - MIDDLE_INDEX,
        dateRange[0]
      );
      if (differenceInMonths !== 0 && differenceInMonths !== 1) {
        dispatch({
          type: 'UPDATE_MONTH_OFFSET',
          payload: monthOffset + differenceInMonths
        });
      }
    } else {
      // transition back to current date if not
      // visible on close with no start date selected & we navigated away
      if (monthOffset !== MIDDLE_INDEX) {
        dispatch({
          type: 'UPDATE_MONTH_OFFSET',
          payload: MIDDLE_INDEX
        });
      }
    }
  }, [isVisible, dateRange, monthOffset]);

  // focus end date field
  useEffect(() => {
    if (isSelecting && dateRange[1] == null) {
      endDateRef.current.focus();
    }
  }, [isSelecting, dateRange]);

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
      if (overrideSelectionState === 'end' && isBeforeStart) {
        return;
      }

      if (overrideSelectionState === 'start' && isBeforeEnd) {
        onChange([incomingDate, dateRange[1]]);
      } else if (overrideSelectionState === 'end') {
        onChange([dateRange[0], incomingDate]);
      } else if (isSelecting && isBeforeStart) {
        dispatch({ type: 'UPDATE_HOVER_DATE', payload: null });
        onChange([incomingDate, null]);
      } else if (isSelecting && (isAfterStart || isSameStart)) {
        dispatch({ type: 'CLEAR_SELECTION_STATE' });
        onChange([dateRange[0], incomingDate]);
      } else {
        dispatch({ type: 'UPDATE_SELECTION_STATE', payload: true });
        onChange([incomingDate, null]);
      }
    },
    [onChange, dateRange, isSelecting]
  );

  const onHandleSilentError = useCallback(
    (rangeSpecifier: 'start' | 'end') => {
      if (rangeSpecifier === 'start') {
        const dateFormat =
          dateRange[0] != null ? format(dateRange[0], _dateFormat) : '';
        dispatch({
          type: 'UPDATE_START_DATE_STATE',
          payload: dateFormat
        });
      } else {
        const dateFormat =
          dateRange[1] != null ? format(dateRange[1], _dateFormat) : '';
        dispatch({
          type: 'UPDATE_END_DATE_STATE',
          payload: dateFormat
        });
      }
    },
    [dateRange, _dateFormat]
  );

  const onDateParse = useCallback(
    (dateTyped: string, rangeSpecifier: 'start' | 'end') => {
      const newDate = parse(dateTyped);
      const isValidDateTyped = isValid(newDate);
      const emptyDate = dateTyped === '';
      const isValidDateChange = hasDateChanged(
        rangeSpecifier === 'start' ? dateRange[0] : dateRange[1],
        newDate
      );
      // overrides: don't go through hover date selecting, just slam
      const endDateOverride =
        rangeSpecifier === 'end' &&
        dateRange[0] != null &&
        isValid(dateRange[0]) &&
        !isSelecting &&
        isValidDateChange;
      const startDateOverride =
        rangeSpecifier === 'start' &&
        dateRange[1] != null &&
        isValid(dateRange[1]) &&
        !isSelecting &&
        isValidDateChange;
      const singleSelectionStartDateBlur =
        !isValidDateChange &&
        rangeSpecifier === 'start' &&
        dateRange[1] == null;

      if (emptyDate) {
        onChange([null, null]);
      } else if (!isValidDateTyped && isValidDateChange) {
        onHandleSilentError(rangeSpecifier);
      } else if (endDateOverride) {
        updateDateRange(newDate, 'end');
      } else if (startDateOverride) {
        updateDateRange(newDate, 'start');
      } else if (singleSelectionStartDateBlur) {
        dispatch({ type: 'UPDATE_VISIBLE_STATE', payload: false });
        dispatch({ type: 'CLEAR_SELECTION_STATE' });
        onChange([dateRange[0], dateRange[0]]);
      } else if (!isValidDateChange) {
        dispatch({ type: 'UPDATE_VISIBLE_STATE', payload: false });
      } else {
        updateDateRange(newDate);
      }
    },
    [dateRange, updateDateRange, isSelecting, onChange, onHandleSilentError]
  );

  const onSelectHoverRange = useCallback(
    (incomingDate: Date) => {
      const payload = isAfter(incomingDate, dateRange[0]) ? incomingDate : null;
      dispatch({ type: 'UPDATE_HOVER_DATE', payload });
    },
    [dateRange]
  );

  const toMonth = useCallback(
    (increment: 'next' | 'prev') => {
      if (!disableVirtualization && isGridAnimating.current) {
        return;
      }
      const monthAddition = increment === 'next' ? 1 : -1;
      dispatch({
        type: 'UPDATE_MONTH_OFFSET',
        payload: monthOffset + monthAddition
      });
    },
    [monthOffset, disableVirtualization]
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
      <Flex
        alignItems='stretch'
        justifyContent='stretch'
        style={style}
        key={key}
      >
        <CalendarMonthRange
          month={addMonths(initialDate.current, columnIndex - MIDDLE_INDEX)}
          onSelectRange={updateDateRange}
          isSelecting={isSelecting}
          hoverDate={hoverDate}
          onSelectHoverRange={onSelectHoverRange}
          dateRange={dateRange}
          currentDate={initialDate.current}
        />
        <Divider orientation='vertical' />
        <CalendarMonthRange
          month={addMonths(initialDate.current, columnIndex - MIDDLE_INDEX + 1)}
          onSelectRange={updateDateRange}
          isSelecting={isSelecting}
          hoverDate={hoverDate}
          onSelectHoverRange={onSelectHoverRange}
          dateRange={dateRange}
          currentDate={initialDate.current}
        />
      </Flex>
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

  const CalendarRangeJSXNoVirtualization = useMemo(() => {
    if (!disableVirtualization) {
      return null;
    }
    return (
      <Flex
        style={{
          width: `${CALENDAR_DIMENSIONS_RANGE_WIDTH}px`,
          height: `${CALENDAR_CONTENTS_HEIGHT}px`
        }}
      >
        {isVisible ? (
          <>
            <CalendarMonthRange
              month={addMonths(initialDate.current, monthOffset - MIDDLE_INDEX)}
              onSelectRange={updateDateRange}
              isSelecting={isSelecting}
              hoverDate={hoverDate}
              onSelectHoverRange={onSelectHoverRange}
              dateRange={dateRange}
              currentDate={initialDate.current}
            />
            <Divider orientation='vertical' />
            <CalendarMonthRange
              month={addMonths(
                initialDate.current,
                monthOffset - MIDDLE_INDEX + 1
              )}
              onSelectRange={updateDateRange}
              isSelecting={isSelecting}
              hoverDate={hoverDate}
              onSelectHoverRange={onSelectHoverRange}
              dateRange={dateRange}
              currentDate={initialDate.current}
            />
          </>
        ) : null}
      </Flex>
    );
  }, [
    initialDate,
    dateRange,
    updateDateRange,
    isSelecting,
    onSelectHoverRange,
    hoverDate,
    monthOffset,
    disableVirtualization,
    isVisible
  ]);

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
    if (isVisible) {
      return;
    }
    dispatch({ type: 'UPDATE_VISIBLE_STATE', payload: true });
  }, [isVisible]);

  const onBlurStart = useCallback(() => {
    const startDateHasText =
      startDateTyped.length > 0 && startDateTyped.trim() !== '';

    if (isVisible && !startDateHasText && !isSelecting) {
      dispatch({ type: 'UPDATE_VISIBLE_STATE', payload: false });
      onChange([null, null]);
      return;
    }

    // Edge Case: To accomdate for select start date, onBlur -> OnParse.
    // But if we select the endDate Range, dont allow parsing of date.
    setTimeout(() => {
      const activeElement = document.activeElement === endDateRef.current;
      if (activeElement) {
        return;
      }
      onDateParse(startDateTyped, 'start');
    }, 0);
  }, [startDateTyped, onDateParse, isVisible, onChange, isSelecting]);

  const onBlurEnd = useCallback(() => {
    const endDateHasText =
      endDateTyped.length > 0 && endDateTyped.trim() !== '';

    if (isVisible && !endDateHasText) {
      // special onBlur flag when we have a valid start date
      dispatch({ type: 'UPDATE_VISIBLE_STATE', payload: false });
      dispatch({ type: 'CLEAR_SELECTION_STATE' });
      onChange([dateRange[0], dateRange[0]]);
      return;
    }
    onDateParse(endDateTyped, 'end');
  }, [endDateTyped, onDateParse, isVisible, onChange, dateRange]);

  return (
    <RangeWrapper justifyContent='center' alignItems='center' flex='1 1 0%'>
      <Flex alignItems='center' justifyContent='center' flex='1 1 0%'>
        {!hideCalendarIcon && (
          <CalendarToday
            style={{
              marginRight: '8px',
              color: textSecondaryColor
            }}
          />
        )}
        <DateRangeField
          value={startDateTyped}
          onFocus={onFocus}
          onBlur={onBlurStart}
          ref={startDateRef}
          onChange={onChangeStartDate}
          onDateParse={onDateParse}
          rangeSpecifier='start'
          fieldLabel='Start Date'
          placeholder='Select a date'
        />
        <Box marginRight='8px' />
        <DateRangeField
          value={endDateTyped}
          onBlur={onBlurEnd}
          onFocus={onFocus}
          ref={endDateRef}
          disabled={dateRange[0] == null || !isValid(dateRange[0])}
          onChange={onChangeEndDate}
          onDateParse={onDateParse}
          fieldLabel='End Date'
          rangeSpecifier='end'
        />
      </Flex>
      <Fade
        in={isVisible}
        unmountOnExit
        style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
        timeout={
          disableVirtualization
            ? { enter: 100, exit: 100 }
            : { enter: 500, exit: 50 }
        }
      >
        <CalendarWrapperDiv>
          <DateRangeContainer>
            {disableVirtualization ? (
              CalendarRangeJSXNoVirtualization
            ) : (
              <AnimatedGrid
                column={monthOffset}
                cellRenderer={cellRenderer}
                height={CALENDAR_CONTENTS_HEIGHT}
                width={CALENDAR_DIMENSIONS_RANGE_WIDTH}
                rowHeight={CALENDAR_CONTENTS_HEIGHT}
                rowCount={1}
                columnCount={MAX_TIME_SPAN}
                columnWidth={CALENDAR_DIMENSIONS_RANGE_WIDTH}
                durationOfAnimation={300}
                onAnimationStart={onAnimationStart}
                onAnimationEnd={onAnimationEnd}
              />
            )}
            <ControlsContainer>
              <Button
                disableRipple
                onClick={() => toMonth('prev')}
                onMouseDown={e => e.preventDefault()}
                style={{ color: textSecondaryColor }}
              >
                <KeyboardArrowLeft />
              </Button>
              <Button
                disableRipple
                onClick={() => toMonth('next')}
                onMouseDown={e => e.preventDefault()}
                style={{ color: textSecondaryColor }}
              >
                <KeyboardArrowRight />
              </Button>
            </ControlsContainer>
          </DateRangeContainer>
        </CalendarWrapperDiv>
      </Fade>
    </RangeWrapper>
  );
};

const textSecondaryColor = 'rgba(0, 0, 0, 0.54)';

const RangeWrapper = styled(Flex)`
  position: relative;
  max-width: ${CALENDAR_DIMENSIONS_RANGE_WIDTH}px;
`;

const CalendarWrapperDiv = styled.div`
  position: absolute;
  top: 44px;
  right: 0;
  bottom: 0;
  z-index: 99;
  flex-direction: column;
  -ms-overflow-style: none;
  /* For Safari */
  height: 100%;
`;

const DateRangeContainer = styled(Flex)`
  flex-direction: column;
  flex: 1 1 0%;
  max-width: ${CALENDAR_DIMENSIONS_RANGE_WIDTH}px;
  justify-content: stretch;
  align-items: stretch;
  position: relative;
  /* https://material.io/components/pickers/#specs */
  padding: 8px 0 8px 0;
  background-color: ${background.content.primary};
  ${makeShadow(ELEVATIONS.MENU)};
`;

const ControlsContainer = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  flex: 1 1 0%;
  position: absolute;
  top: 8px;
  left: 18px;
  right: 18px;
  height: 36px;

  button {
    width: 24px;
    height: 24px;
    padding: 0 0;
    min-width: 0;
    &:hover {
      background-color: transparent;
    }
  }
`;
