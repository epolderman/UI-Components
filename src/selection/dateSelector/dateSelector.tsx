import React, { useCallback, useState, useRef, useEffect } from 'react';
import { CalendarMonth } from './calendarMonth';
import { AnimatedGrid as VirtualizedGrid } from './animatedGrid';
import { addMonths, differenceInCalendarMonths, format } from 'date-fns';
import {
  MIDDLE_INDEX,
  MAX_TIME_SPAN,
  CALENDAR_DIMENSIONS,
  ENTER_KEY
} from './dateUtils';
import styled from '@emotion/styled';
import { Button } from '@material-ui/core';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons';
import { DateTextField } from './dateTextField';
import { useSpring, animated } from 'react-spring';

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

export interface DateSelectorState {
  monthOffset: number;
}

const DEFAULT_DATE_FORMAT = 'dddd, MMMM D, YYYY';

export const DateSelector: React.FC<DateSelectorProps> = React.memo(
  ({ value, onChange, dateFormat, isSmall }) => {
    const [monthOffset, setMonthOffset] = useState(MIDDLE_INDEX);
    const [isVisible, setVisibility] = useState(false);
    const [dateTyped, setDateTyped] = useState(
      format(value, dateFormat || DEFAULT_DATE_FORMAT)
    );

    const initialDate = useRef<Date>(new Date());
    const prevDate = usePreviousDate(value);
    const isGridAnimating = useRef(false);
    const textFieldComponentRef = useRef<any>(null);

    const openCloseAnimation = useSpring({
      transform: isVisible ? `translateY(0px)` : `translateY(-100%)`
    });

    useEffect(() => {
      // new date coming in
      if (prevDate !== value) {
        const difference = calculateMonthOffset(
          initialDate.current,
          monthOffset - MIDDLE_INDEX,
          value
        );
        if (difference !== 0) {
          setMonthOffset(m => m + difference);
        }
      }
    }, [value, monthOffset, prevDate]);

    const onSelect = useCallback(
      (incomingDate: Date) => onChange(incomingDate),
      [onChange]
    );

    // empty array dependency / only callbacked, useffect, useMemo = 1 intital render call
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

    // protection against users slamming the next, prev button
    // use ref to prevent a render on grid state changes while animating
    const startAnimation = useCallback(() => {
      isGridAnimating.current = true;
    }, []);

    const endAnimation = useCallback(() => {
      isGridAnimating.current = false;
    }, []);

    const cellRenderer = ({
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
            onSelect={onSelect}
            month={itemDate}
            selectedDate={value}
            skeleton={isScrolling}
          />
        </div>
      );
    };

    const monthJSX = () => {
      return (
        <AnimatingDivWrapper style={openCloseAnimation}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              padding: '4px',
              flex: '0 0 auto'
            }}
          >
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
              durationOfAnimation={600}
            />
            <ControlsContainer>
              <Button onClick={prevMonth}>
                <KeyboardArrowLeft />
              </Button>
              <Button onClick={nextMonth}>
                <KeyboardArrowRight />
              </Button>
            </ControlsContainer>
          </div>
        </AnimatingDivWrapper>
      );
    };

    const onFocus = useCallback(() => {
      setVisibility(true);
    }, []);

    const onTextFieldChange = useCallback(
      (evt: React.ChangeEvent<HTMLInputElement>) =>
        setDateTyped(evt.target.value),
      []
    );

    const onKeyDown = useCallback(
      (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.keyCode === ENTER_KEY && isVisible) {
          setVisibility(false);
          // this.close(() => this.dateParse('Default', true), false);
        }
      },
      [isVisible]
    );

    const onBlur = useCallback(() => {
      // setVisibility(false);
    }, []);

    // // height of our dateTextField
    // const getInputHeight = useCallback((): number => {
    //   if (htmlInputRef == null) {
    //     return null;
    //   }
    //   console.log('clientHeight', htmlInputRef.clientHeight);
    //   return htmlInputRef.clientHeight;
    // }, [htmlInputRef]);

    console.log('isVisible', isVisible);

    return (
      <DateSelectorContainer>
        <DateTextField
          isSmall={isSmall}
          // innerInputRef={setInputInnerRef}
          // ref={textFieldComponentRef}
          onFocus={onFocus}
          onChange={onTextFieldChange}
          value={dateTyped}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
        <DivToHideTopShowBottom
          top={31}
          isSmall={isSmall}
          isVisible={isVisible}
        >
          {monthJSX()}
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
  border-width: 1px;
  border-color: black;
  border-style: solid;
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

const AnimatingDivWrapper = styled(animated.div)`
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

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
const usePreviousDate = (value: Date) => {
  const ref = useRef<Date>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
