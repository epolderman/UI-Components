import styled from '@emotion/styled';
import { Button } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { addMonths, format, isValid, parse } from 'date-fns';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { animated, useSpring, config } from 'react-spring';
import { ELEVATIONS, makeShadow } from '../../common/elevation';
import { AnimatedGrid } from './animatedGrid';
import { CalendarMonth } from './calendarMonth';
import { usePrevious } from '../../utils/hooks';
import { DateTextField } from './dateTextField';
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
} from './dateUtils';
import { Flex } from '@rebass/grid/emotion';

/* 
    Parent Component that controls the Date Selector + Date Text Field
    & and the communication between the two
*/

const TEXT_FIELD_HEIGHT = 31;

export interface DateSelectorProps {
  onChange: (incomingDate: Date) => void;
  value: Date;
  isSmall?: boolean;
  dateFormat?: string;
}

export const DateSelector: React.FC<DateSelectorProps> = React.memo(
  ({ value, onChange, dateFormat, isSmall }) => {
    const [monthOffset, setMonthOffset] = useState(MIDDLE_INDEX);
    const [isVisible, setVisibility] = useState(false);
    const [isActiveError, setError] = useState(false);
    const [dateTyped, setDateTyped] = useState(
      formatDate(value, isSmall, dateFormat)
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const prevDate = usePrevious<Date>(value);
    const initialDate = useRef<Date>(new Date());
    const isGridAnimating = useRef(false);
    const noCloseFlag = useRef(false);
    // @todo: Refactor when spring hits v9 to take
    // into account isSmall + different animation.
    const openCloseAnimation = useSpring({
      transform: isVisible
        ? `translateY(0) scale(1)`
        : `translateY(-100%) scale(0)`,
      config: config.default,
      onRest: () => {
        // close animationEnd state change
        if (!isVisible) {
          inputRef.current.blur();
          setDateTyped(formatDate(value, isSmall, dateFormat));
          setError(false);
          // transition back to the currently selected date month after close
          // if we navigated away during open state
          const differenceInMonths = calculateMonthOffset(
            initialDate.current,
            monthOffset - MIDDLE_INDEX,
            value
          );
          if (differenceInMonths !== 0) {
            setMonthOffset(monthOffset => monthOffset + differenceInMonths);
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
          setMonthOffset(monthOffset => monthOffset + differenceInMonths);
        } else {
          // no animation
          setVisibility(false);
        }
      }
    }, [value, monthOffset, prevDate, isVisible, initialDate]);

    // shrinking size logic
    useEffect(() => setDateTyped(formatDate(value, isSmall, dateFormat)), [
      isSmall,
      dateFormat,
      value
    ]);

    const updateDate = useCallback(
      (incomingDate: Date) => {
        const validDateChange =
          hasDateChanged(value, incomingDate) &&
          !hasDateReachedLimit(initialDate.current, incomingDate);

        if (validDateChange) {
          onChange(incomingDate);
        } else {
          setVisibility(false);
        }
      },
      [onChange, value, initialDate]
    );

    const dateParse = useCallback(() => {
      const newDate = parse(dateTyped);
      const isValidDateTyped = isValid(newDate) && dateTyped !== '';

      if (!isValidDateTyped && hasDateChanged(value, newDate)) {
        setError(true);
        setVisibility(false);
      } else {
        updateDate(newDate);
      }
    }, [updateDate, dateTyped, value]);

    const toMonth = useCallback(
      (increment: 'next' | 'prev') => {
        if (isGridAnimating.current) {
          return;
        }
        noCloseFlag.current = true;
        const monthAddition = increment === 'next' ? 1 : -1;
        setMonthOffset(monthOffset + monthAddition);
      },
      [monthOffset]
    );

    const onTextFieldFocus = useCallback(
      (evt: React.FocusEvent<HTMLInputElement>) => {
        setDateTyped(format(value, MONTH_DAY_YEAR_FORMAT));
        inputRef.current.focus();
        setVisibility(true);
      },
      [value]
    );

    const onTextFieldBlur = useCallback(() => dateParse(), [dateParse]);

    const onTextFieldChange = useCallback(
      (evt: React.ChangeEvent<HTMLInputElement>) =>
        setDateTyped(evt.target.value),
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
      if (isVisible) {
        inputRef.current.blur();
        setVisibility(false);
      } else {
        inputRef.current.focus();
      }
    }, [isVisible]);

    const onAnimationEnd = useCallback(() => {
      isGridAnimating.current = false;
      if (!noCloseFlag.current) {
        setVisibility(false);
      }
    }, [noCloseFlag]);

    const onAnimationStart = useCallback(
      () => (isGridAnimating.current = true),
      []
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
      }) => {
        const itemOffset = columnIndex - MIDDLE_INDEX;
        const itemDate = addMonths(initialDate.current, itemOffset);
        return (
          <div style={{ ...style, display: 'flex' }} key={key}>
            <CalendarMonth
              onSelect={updateDate}
              month={itemDate}
              selectedDate={value}
              isLoading={isScrolling}
            />
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
                style={{ overflow: 'hidden' }}
                onAnimationStart={onAnimationStart}
                onAnimationEnd={onAnimationEnd}
              />
              <ControlsContainer>
                <Button
                  disableRipple
                  onClick={() => toMonth('prev')}
                  /* Event Chain OnMouseDown -> onFocus/onBlur -> OnMouseUp -> Click */
                  /* Cancel the focus event with e.preventDefualt on mouse down on the button */
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
  top: 0px;
  left: 0px;
  right: 0px;

  /* overrides: sync with title animation */
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

const ElevatedWrapper = styled(Flex)`
  flex-direction: column;
  flex: 0 0 auto;
  padding: 4px;
  position: relative;
  margin: 4px 8px 16px 8px;
  border-radius: 2.5px;
  ${makeShadow(ELEVATIONS.MENU)};
  background-color: 'rgb(255,255,255)';
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
