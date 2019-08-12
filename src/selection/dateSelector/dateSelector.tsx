import styled from '@emotion/styled';
import { Button } from '@material-ui/core';
import {
  DateRange,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@material-ui/icons';
import {
  addMonths,
  differenceInCalendarMonths,
  format,
  isValid,
  parse
} from 'date-fns';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { animated, config, useSpring } from 'react-spring';
import { ELEVATIONS, makeShadow } from '../../common/elevation';
import { AnimatedGrid as VirtualizedGrid } from './animatedGrid';
import { CalendarMonth } from './calendarMonth';
import { usePreviousDate } from './dateHooks';
import {
  CALENDAR_DIMENSIONS,
  ENTER_KEY,
  hasDateChanged,
  hasDateReachedLimit,
  MAX_TIME_SPAN,
  MIDDLE_INDEX,
  DEFAULT_DATE_FORMAT
} from './dateUtils';

/* 
    Parent Component that controls the Date Selector + Date Text Field
    & and the communication between the two
*/

export interface DateSelectorProps {
  onChange: (incomingDate: Date) => VoidFunction;
  value: Date;
  isSmall?: boolean;
  dateFormat?: string;
}

export interface DateSelectorState {
  monthOffset: number;
}

export const DateSelector: React.FC<DateSelectorProps> = React.memo(
  ({ value, onChange, dateFormat, isSmall }) => {
    const [monthOffset, setMonthOffset] = useState(MIDDLE_INDEX);
    const [isVisible, setVisibility] = useState(false);
    const [dateTyped, setDateTyped] = useState(
      format(value, dateFormat || DEFAULT_DATE_FORMAT)
    );
    const inputRef = useRef<HTMLInputElement>(null);
    const initialDate = useRef<Date>(new Date());
    const prevDate = usePreviousDate(value);
    // animating grid, open close
    const isGridAnimating = useRef(false);
    const openCloseAnimation = useSpring({
      transform: isVisible ? `translateY(0px)` : `translateY(-100%)`,
      onRest: () => {
        // state on animation completes
        if (!isVisible) {
          inputRef.current.blur();
          setDateTyped(format(value, dateFormat || DEFAULT_DATE_FORMAT));
        }
      }
    });

    // todo: interpolating on error, but resetting back shouldnt interpolate.
    const [isActiveError, setError] = useState(false);
    const errorAnimation = useSpring({
      x: isActiveError ? 1 : 0,
      config: config.wobbly,
      // state on animation completes
      onRest: () => {
        if (isActiveError && !isVisible) {
          setError(false);
        }
      }
    });

    useEffect(() => {
      // passed our protection functions, controller has been updated, new date coming in
      if (prevDate !== value) {
        const differenceInMonths = calculateMonthOffset(
          initialDate.current,
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
    }, [value, monthOffset, prevDate, dateFormat, isVisible]);

    const nextMonth = useCallback(
      (evt: React.SyntheticEvent<HTMLButtonElement, Event>) => {
        if (isGridAnimating.current) {
          return;
        }
        setMonthOffset(monthOffset + 1);
      },
      [monthOffset]
    );

    const prevMonth = useCallback(
      (evt: React.SyntheticEvent<HTMLButtonElement, Event>) => {
        if (isGridAnimating.current) {
          return;
        }
        setMonthOffset(monthOffset + -1);
      },
      [monthOffset]
    );

    const startAnimation = useCallback(() => {
      isGridAnimating.current = true;
    }, []);

    const endAnimation = useCallback(() => {
      isGridAnimating.current = false;
    }, []);

    const onFocus = useCallback(
      (evt: React.FocusEvent<HTMLInputElement>) => {
        setVisibility(true);
        inputRef.current.focus();
        inputRef.current.setSelectionRange(0, dateTyped.length);
      },
      [dateTyped]
    );

    // resp: setting dateTyped, allow user to make error
    const onTextFieldChange = useCallback(
      (evt: React.ChangeEvent<HTMLInputElement>) =>
        setDateTyped(evt.target.value),
      []
    );

    // resp: pass the ok to the controller to update date, or invalid date swallow error
    const updateDate = useCallback(
      (incomingDate: Date) => {
        const validDateChange =
          hasDateChanged(value, incomingDate) &&
          !hasDateReachedLimit(initialDate.current, incomingDate);

        if (validDateChange) {
          return onChange(incomingDate);
        }
      },
      [onChange, value]
    );

    // resp: parse dateTyped, swollow invalid date, or pass on to valid update date
    const dateParse = useCallback(() => {
      const newDate = parse(dateTyped);
      const isValidDate = isValid(newDate) && dateTyped !== '';
      const validDateChange =
        hasDateChanged(value, newDate) &&
        !hasDateReachedLimit(initialDate.current, newDate);
      // edge case
      if (!isValidDate && validDateChange) {
        setError(true);
        return setVisibility(false);
      }
      return updateDate(newDate);
    }, [updateDate, dateTyped, value, initialDate]);

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
        const itemDate = addMonths(initialDate.current, itemOffset);
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

    return (
      <DateSelectorContainer>
        <AnimatedTextFieldWrapper
          isSmall={isSmall}
          style={{
            transform: errorAnimation.x
              .interpolate({
                range: [0, 0.5, 0.75, 1],
                output: [0, 2, -2, 0]
              })
              .interpolate(x => `translate3d(${x}px, 0, 0)`)
          }}
        >
          <DateRange
            style={{
              paddingLeft: isSmall ? 4 : 0,
              cursor: 'pointer',
              color: isActiveError ? BRAND_RED : BRAND_PRIMARY
            }}
            onClick={onCalendarIconClick}
          />
          <Input
            type='text'
            ref={inputRef}
            value={dateTyped}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onChange={onTextFieldChange}
            isSmall={isSmall}
          />
        </AnimatedTextFieldWrapper>
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
                onAnimationStart={startAnimation}
                onAnimationEnd={endAnimation}
                durationOfAnimation={500}
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

/* Bottom Margin needs additional margins because we need space to show shadow */
/* Change in elevation, -> needs change in margin values for casting shadows */
/* Provides cushion to see shadows. wrapper around CalendarMonth, and in a child of dateselectordiv */
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

/* Text Field Sctuff */

const BACKGROUND_EMPTY = 'rgb(238,238,238)';
const BRAND_PRIMARY = 'rgb(74,175,227)';
const BRAND_RED = 'rgb(231,54,49)';

const Input = styled.input<{
  isSmall: boolean;
}>`
  display: flex;
  flex: 1 1 0%;
  justify-content: center;
  align-items: center;
  padding: ${props => (props.isSmall ? '4px' : '8px')};
  border-radius: 4px;
  border-width: 0px;
  border-style: none;
  text-align: center;
  font-family: 'Open Sans', sans-serif, monospace;
  text-overflow: ellipsis;
  /* input elements have min width auto by default so it refuses to shrink */
  min-width: 0;
  font-size: 14px;
  background-color: ${BACKGROUND_EMPTY};
`;

const TextFieldWrapper = styled.div<{ isSmall: boolean }>`
  display: flex;
  flex: 1 1 0%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding-left: ${props => (props.isSmall ? '0px' : '8px')};
  padding-right: ${props => (props.isSmall ? '0px' : '8px')};
  z-index: 99;
  border-radius: 4px;
  background-color: ${BACKGROUND_EMPTY};

  input {
    outline: none;
  }
`;

const AnimatedTextFieldWrapper = animated(TextFieldWrapper);
