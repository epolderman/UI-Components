import styled from '@emotion/styled';
import { Button } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { addMonths, format, isValid, parse } from 'date-fns';
import React, { useCallback, useEffect, useRef, useReducer } from 'react';
import { animated, useSpring, config } from 'react-spring';
import { ELEVATIONS, makeShadow } from '../../../common/elevation';
import { AnimatedGrid } from '../AnimatedGrid';
import { CalendarMonth } from '../calenderRenderer/CalenderMonth';
import { usePrevious } from '../../../utils/hooks';
import { DateTextField } from './DateTextField';
import {
  CALENDAR_DIMENSIONS,
  MONTH_DAY_YEAR_FORMAT,
  ENTER_KEY,
  hasDateChanged,
  hasDateReachedLimit,
  MAX_TIME_SPAN,
  MIDDLE_INDEX,
  calculateMonthOffset,
  formatDate
} from '../dateUtils';
import { Flex } from '@rebass/grid/emotion';
import { text } from '../../../common/colors';

/* 
    Parent Component that controls the Date Selector + Date Text Field
    & and the communication between the two

    Todos: 
    1. Add disabled dates props to interface, write logic.
*/

interface DateSelectorState {
  monthOffset: number;
  dateTyped: string;
  isVisible: boolean;
  isActiveError: boolean;
}

type DateSelectorActions =
  | { type: 'UPDATE_MONTH_OFFSET'; payload: number }
  | { type: 'UPDATE_DATE_TYPED_STATE'; payload: string }
  | { type: 'UPDATE_VISIBLE_STATE'; payload: boolean }
  | { type: 'UPDATE_ERROR_STATE'; payload: boolean }
  | {
      type: 'UPDATE_FOCUS_STATE';
      payload: { isVisible: boolean; dateTyped: string };
    }
  | {
      type: 'CLEAR_ERROR_STATE';
      payload: { isActiveError: boolean; dateTyped: string };
    }
  | {
      type: 'CLEAR_VISIBLE_STATE';
      payload: { isVisible: boolean; dateTyped: string };
    };

function reducer(
  state: DateSelectorState,
  action: DateSelectorActions
): DateSelectorState {
  switch (action.type) {
    case 'UPDATE_MONTH_OFFSET':
      return { ...state, monthOffset: action.payload };
    case 'UPDATE_DATE_TYPED_STATE':
      return { ...state, dateTyped: action.payload };
    case 'UPDATE_ERROR_STATE':
      return { ...state, isActiveError: action.payload };
    case 'UPDATE_VISIBLE_STATE':
      return { ...state, isVisible: action.payload };
    case 'UPDATE_FOCUS_STATE':
      return {
        ...state,
        isVisible: action.payload.isVisible,
        dateTyped: action.payload.dateTyped
      };
    case 'CLEAR_ERROR_STATE':
      return {
        ...state,
        isActiveError: action.payload.isActiveError,
        dateTyped: action.payload.dateTyped
      };
    case 'CLEAR_VISIBLE_STATE':
      return {
        ...state,
        isVisible: action.payload.isVisible,
        dateTyped: action.payload.dateTyped
      };
    default:
      throw new Error();
  }
}

const TEXT_FIELD_HEIGHT = 34;

export interface DateSelectorProps {
  onChange: (incomingDate: Date) => void;
  value: Date;
  isSmall?: boolean;
  dateFormat?: string;
}

export const DateSelector: React.FC<DateSelectorProps> = React.memo(
  ({ value, onChange, dateFormat, isSmall }) => {
    const [state, dispatch] = useReducer(reducer, {
      monthOffset: MIDDLE_INDEX,
      isVisible: false,
      isActiveError: false,
      dateTyped: formatDate(value, isSmall, dateFormat)
    });
    const { monthOffset, isVisible, isActiveError, dateTyped } = state;
    const inputRef = useRef<HTMLInputElement>(null);
    const prevDate = usePrevious<Date>(value);
    const initialDate = useRef<Date>(new Date());
    const isGridAnimating = useRef(false);
    const noCloseFlag = useRef(false);
    const isCalendarHidden = useRef(false);
    // @todo: Refactor when spring hits v9 to take to add scale + into account isSmall + different animation.
    const openCloseAnimation = useSpring({
      transform: isVisible ? `translateY(0)` : `translateY(-150%)`,
      onRest: () => {
        // close animationEnd state change
        if (!isVisible) {
          isCalendarHidden.current = true;
          inputRef.current.blur();
          if (isActiveError) {
            dispatch({
              type: 'CLEAR_ERROR_STATE',
              payload: {
                isActiveError: false,
                dateTyped: formatDate(value, isSmall, dateFormat)
              }
            });
          }
          // transition back to the currently selected date month after close
          // if we navigated away during open state
          const differenceInMonths = calculateMonthOffset(
            initialDate.current,
            monthOffset - MIDDLE_INDEX,
            value
          );
          if (differenceInMonths !== 0) {
            dispatch({
              type: 'UPDATE_MONTH_OFFSET',
              payload: monthOffset + differenceInMonths
            });
          }
        }
      }
    });

    // update date logic
    useEffect(() => {
      if (prevDate !== value) {
        const differenceInMonths = calculateMonthOffset(
          initialDate.current,
          monthOffset - MIDDLE_INDEX,
          value
        );
        // need to animate
        if (differenceInMonths !== 0) {
          noCloseFlag.current = false;
          dispatch({
            type: 'UPDATE_MONTH_OFFSET',
            payload: monthOffset + differenceInMonths
          });
        } else {
          // no animation
          dispatch({
            type: 'CLEAR_VISIBLE_STATE',
            payload: {
              isVisible: false,
              dateTyped: formatDate(value, isSmall, dateFormat)
            }
          });
        }
      }
    }, [
      value,
      monthOffset,
      prevDate,
      isVisible,
      initialDate,
      dateFormat,
      isSmall
    ]);

    // shrinking size logic
    useEffect(() => {
      dispatch({
        type: 'UPDATE_DATE_TYPED_STATE',
        payload: formatDate(value, isSmall, dateFormat)
      });
    }, [isSmall, dateFormat, value]);

    const updateDate = useCallback(
      (incomingDate: Date) => {
        const validDateChange =
          hasDateChanged(value, incomingDate) &&
          !hasDateReachedLimit(initialDate.current, incomingDate);

        if (validDateChange) {
          onChange(incomingDate);
        } else {
          dispatch({
            type: 'CLEAR_VISIBLE_STATE',
            payload: {
              isVisible: false,
              dateTyped: formatDate(value, isSmall, dateFormat)
            }
          });
        }
      },
      [onChange, value, initialDate, isSmall, dateFormat]
    );

    const dateParse = useCallback(() => {
      const newDate = parse(dateTyped);
      const isValidDateTyped = isValid(newDate) && dateTyped !== '';

      if (!isValidDateTyped && hasDateChanged(value, newDate)) {
        dispatch({ type: 'UPDATE_ERROR_STATE', payload: true });
        dispatch({
          type: 'CLEAR_VISIBLE_STATE',
          payload: {
            isVisible: false,
            dateTyped: formatDate(value, isSmall, dateFormat)
          }
        });
      } else {
        updateDate(newDate);
      }
    }, [updateDate, dateTyped, value, isSmall, dateFormat]);

    const toMonth = useCallback(
      (increment: 'next' | 'prev') => {
        if (isGridAnimating.current) {
          return;
        }
        noCloseFlag.current = true;
        const monthAddition = increment === 'next' ? 1 : -1;
        dispatch({
          type: 'UPDATE_MONTH_OFFSET',
          payload: monthOffset + monthAddition
        });
      },
      [monthOffset]
    );

    const onTextFieldFocus = useCallback(() => {
      inputRef.current.focus();
      isCalendarHidden.current = false;
      dispatch({
        type: 'UPDATE_FOCUS_STATE',
        payload: {
          dateTyped: format(value, MONTH_DAY_YEAR_FORMAT),
          isVisible: true
        }
      });
    }, [value]);

    const onTextFieldBlur = useCallback(() => dateParse(), [dateParse]);

    const onTextFieldChange = useCallback(
      (evt: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({
          type: 'UPDATE_DATE_TYPED_STATE',
          payload: evt.target.value
        });
      },
      []
    );

    const onKeyDown = useCallback(
      (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.keyCode === ENTER_KEY && isVisible) {
          dateParse();
        }
      },
      [isVisible, dateParse]
    );

    const onCalendarIconClick = useCallback(() => {
      isCalendarHidden.current = false;
      if (isVisible) {
        inputRef.current.blur();
        dispatch({
          type: 'CLEAR_VISIBLE_STATE',
          payload: {
            isVisible: false,
            dateTyped: formatDate(value, isSmall, dateFormat)
          }
        });
      } else {
        inputRef.current.focus();
      }
    }, [isVisible, isSmall, dateFormat, value]);

    const onAnimationEnd = useCallback(() => {
      isGridAnimating.current = false;
      if (!noCloseFlag.current) {
        dispatch({
          type: 'CLEAR_VISIBLE_STATE',
          payload: {
            isVisible: false,
            dateTyped: formatDate(value, isSmall, dateFormat)
          }
        });
      }
    }, [noCloseFlag, isSmall, dateFormat, value]);

    const onAnimationStart = useCallback(
      () => (isGridAnimating.current = true),
      []
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
        const shouldRenderCalendar = isCalendarHidden.current === false;
        const itemOffset = columnIndex - MIDDLE_INDEX;
        const itemDate = addMonths(initialDate.current, itemOffset);
        return (
          <div style={{ ...style, display: 'flex' }} key={key}>
            {shouldRenderCalendar ? (
              <CalendarMonth
                onSelect={updateDate}
                month={itemDate}
                selectedDate={value}
                currentDay={initialDate.current}
              />
            ) : null}
          </div>
        );
      },
      [updateDate, value, initialDate]
    );

    return (
      <DateSelectorContainer>
        <DateTextField
          ref={inputRef}
          isSmall={isSmall}
          isActiveError={isActiveError}
          onChange={onTextFieldChange}
          onFocus={onTextFieldFocus}
          onBlur={onTextFieldBlur}
          onKeyDown={onKeyDown}
          value={dateTyped}
          onCalendarIconClick={onCalendarIconClick}
        />
        <CalendarWrapper
          top={TEXT_FIELD_HEIGHT}
          isSmall={isSmall}
          isVisible={isVisible}
        >
          <AnimatedDivOpenClose style={openCloseAnimation}>
            <ElevatedWrapper>
              <AnimatedGrid
                column={monthOffset}
                cellRenderer={cellRenderer}
                height={CALENDAR_DIMENSIONS}
                width={CALENDAR_DIMENSIONS}
                rowHeight={CALENDAR_DIMENSIONS}
                rowCount={1}
                columnCount={MAX_TIME_SPAN}
                columnWidth={CALENDAR_DIMENSIONS}
                onAnimationStart={onAnimationStart}
                onAnimationEnd={onAnimationEnd}
                durationOfAnimation={500}
              />
              <ControlsContainer>
                <Button
                  disableRipple
                  onClick={() => toMonth('prev')}
                  /* Event Chain OnMouseDown -> onFocus/onBlur -> OnMouseUp -> Click */
                  /* Cancel the focus event with e.preventDefualt on mouse down on the button */
                  onMouseDown={e => e.preventDefault()}
                  style={{ color: text.black.secondary }}
                >
                  <KeyboardArrowLeft />
                </Button>
                <Button
                  disableRipple
                  onClick={() => toMonth('next')}
                  onMouseDown={e => e.preventDefault()}
                  style={{ color: text.black.secondary }}
                >
                  <KeyboardArrowRight />
                </Button>
              </ControlsContainer>
            </ElevatedWrapper>
          </AnimatedDivOpenClose>
        </CalendarWrapper>
      </DateSelectorContainer>
    );
  }
);

const DateSelectorContainer = styled(Flex)`
  flex-direction: column;
  flex: 1 1 0%;
  justify-content: stretch;
  align-items: stretch;
  position: relative;
`;

const ControlsContainer = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  flex: 1 1 0%;
  position: absolute;
  top: 12px;
  left: 10px;
  right: 10px;

  /* overrides: sync with title animation */
  button {
    width: 36px;
    height: 36px;
    padding: 0 0;
    min-width: 0;
    &:hover {
      background-color: transparent;
    }
  }
`;

const ElevatedWrapper = styled(Flex)`
  flex-direction: column;
  flex: 0 0 auto;
  padding: 4px;
  position: relative;
  margin: 4px 8px 16px 8px;
  border-radius: 2.5px;
  ${makeShadow(ELEVATIONS.MENU)};
  background-color: rgb(255, 255, 255);
`;

const AnimatedDivOpenClose = styled(animated.div)`
  display: flex;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  width: auto;
  height: auto;
  justify-content: center;
`;

/* Hides Top / Shows Bottom */
const CalendarWrapper = styled(Flex)<{
  top: number;
  isSmall: boolean;
  isVisible: boolean;
}>`
  width: 350px;
  height: 350px;
  margin-left: ${props => (props.isSmall ? '-125px' : '-25px')};
  margin-right: ${props => (props.isSmall ? '-125px' : '-25px')};
  position: absolute;
  overflow: auto;
  top: ${props => (props.top ? `${props.top}px` : '33px')};
  left: 0px;
  right: 0px;
  z-index: 99;
  overflow: hidden;
  pointer-events: ${props => (props.isVisible ? 'auto' : 'none')};
  -ms-overflow-style: none;
`;
