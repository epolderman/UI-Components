import styled from '@emotion/styled';
import { Button } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import {
  addMonths,
  differenceInCalendarMonths,
  format,
  isValid,
  parse
} from 'date-fns';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { ELEVATIONS, makeShadow } from '../../common/elevation';
import { AnimatedGrid as VirtualizedGrid } from './animatedGrid';
import { CalendarMonth } from './calendarMonth';
import { usePreviousDate } from './dateHooks';
import { DateTextField } from './dateTextField';
import {
  CALENDAR_DIMENSIONS,
  DEFAULT_DATE_FORMAT,
  ENTER_KEY,
  hasDateChanged,
  hasDateReachedLimit,
  MAX_TIME_SPAN,
  MIDDLE_INDEX
} from './dateUtils';

/* 
    Parent Component that controls the Date Selector + Date Text Field
    & and the communication between the two
*/

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
    const [initialDate, setInitialDate] = useState(new Date());
    const [dateTyped, setDateTyped] = useState(
      format(value, dateFormat || DEFAULT_DATE_FORMAT)
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const prevDate = usePreviousDate(value);
    const isGridAnimating = useRef(false);
    const openCloseAnimation = useSpring({
      transform: isVisible ? `translateY(0px)` : `translateY(-100%)`,
      onRest: () => {
        // on close state change
        if (!isVisible) {
          inputRef.current.blur();
          setDateTyped(format(value, dateFormat || DEFAULT_DATE_FORMAT));
          setError(false);
        }
      }
    });

    useEffect(() => {
      // passed our protection functions, controller has been updated, new date coming in
      if (prevDate !== value) {
        const differenceInMonths = calculateMonthOffset(
          initialDate,
          monthOffset - MIDDLE_INDEX,
          value
        );
        setDateTyped(format(value, dateFormat || DEFAULT_DATE_FORMAT));
        if (differenceInMonths !== 0) {
          setMonthOffset(m => m + differenceInMonths);
        }
        if (isVisible) {
          setVisibility(false);
        }
      }
    }, [value, monthOffset, prevDate, dateFormat, isVisible, initialDate]);

    const updateDate = useCallback(
      (incomingDate: Date) => {
        // being use on a select with mouse
        const validDateChange =
          hasDateChanged(value, incomingDate) &&
          !hasDateReachedLimit(initialDate, incomingDate);

        if (validDateChange) {
          return onChange(incomingDate);
        }
      },
      [onChange, value, initialDate]
    );

    const dateParse = useCallback(() => {
      const newDate = parse(dateTyped);
      const isValidDateTyped = isValid(newDate) && dateTyped !== '';
      const validDateChange =
        hasDateChanged(value, newDate) &&
        !hasDateReachedLimit(initialDate, newDate);

      // bad date typed
      if (!isValidDateTyped && validDateChange) {
        setError(true);
        setVisibility(false);
        // no date change
      } else if (!validDateChange) {
        setVisibility(false);
      } else {
        updateDate(newDate);
      }
    }, [updateDate, dateTyped, value, initialDate]);

    const nextMonth = useCallback(() => {
      if (isGridAnimating.current) {
        return;
      }
      setMonthOffset(monthOffset + 1);
    }, [monthOffset]);

    const prevMonth = useCallback(() => {
      if (isGridAnimating.current) {
        return;
      }
      setMonthOffset(monthOffset + -1);
    }, [monthOffset]);

    const onTextFieldFocus = useCallback(
      (evt: React.FocusEvent<HTMLInputElement>) => {
        setVisibility(true);
        inputRef.current.focus();
        inputRef.current.setSelectionRange(0, dateTyped.length);
      },
      [dateTyped]
    );

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
        const itemDate = addMonths(initialDate, itemOffset);
        return (
          <div style={{ ...style, display: 'flex' }} key={key}>
            <CalendarMonth
              onSelect={updateDate}
              month={itemDate}
              selectedDate={value}
              skeleton={isScrolling}
            />
          </div>
        );
      },
      [updateDate, value]
    );

    const onAnimationEnd = useCallback(() => {
      isGridAnimating.current = false;
    }, []);

    const onAnimationStart = useCallback(() => {
      isGridAnimating.current = true;
    }, []);

    return (
      <DateSelectorContainer>
        <DateTextField
          isSmall={isSmall}
          isActiveError={isActiveError}
          onChange={onTextFieldChange}
          onFocus={onTextFieldFocus}
          onKeyDown={onKeyDown}
          inputRef={inputRef}
          value={dateTyped}
          onCalendarIconClick={onCalendarIconClick}
        />
        <DivToHideTopShowBottom
          top={31}
          isSmall={isSmall}
          isVisible={isVisible}
        >
          <OpenCloseDivWrapper style={openCloseAnimation}>
            <ElevatedWrapper>
              <VirtualizedGrid
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
                <Button onClick={prevMonth}>
                  <KeyboardArrowLeft />
                </Button>
                <Button onClick={nextMonth}>
                  <KeyboardArrowRight />
                </Button>
              </ControlsContainer>
            </ElevatedWrapper>
          </OpenCloseDivWrapper>
        </DivToHideTopShowBottom>
      </DateSelectorContainer>
    );
  }
);

const calculateMonthOffset = (
  date: Date,
  monthOffset: number,
  dateChange: Date
): number =>
  differenceInCalendarMonths(dateChange, addMonths(date, monthOffset));

const DateSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  box-sizing: border-box;
  justify-content: stretch;
  align-items: stretch;
  position: relative;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 1 0%;
  box-sizing: border-box;
  position: absolute;
  top: 0px;
  left: 2px;
  right: 2px;

  /* overrides: Dimensions Match our Flex Rows Buttons in Calendar Month */
  button {
    width: 39px;
    height: 34px;
    padding: 0 0;
    min-width: 0;
  }
`;

const ElevatedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  padding: 4px;
  position: relative;
  margin: 4px 8px 16px 8px;
  border-radius: 2.5px;
  ${makeShadow(ELEVATIONS.MENU)};
  background-color: 'rgb(255,255,255)';
`;

const OpenCloseDivWrapper = styled(animated.div)`
  display: flex;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  width: auto;
  height: auto;
  justify-content: center;
`;

const DivToHideTopShowBottom = styled.div<{
  top: number;
  isSmall: boolean;
  isVisible: boolean;
}>`
  display: flex;
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
