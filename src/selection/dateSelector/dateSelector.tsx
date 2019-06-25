import React, { useCallback, useState, useRef, useEffect } from 'react';
import { CalendarMonth } from './calendarMonth';
import { AnimatedGrid as VirtualizedGrid } from './animatedGrid';
import {
  addMonths,
  differenceInCalendarMonths,
  format,
  parse,
  isValid
} from 'date-fns';
import {
  MIDDLE_INDEX,
  MAX_TIME_SPAN,
  CALENDAR_DIMENSIONS,
  ENTER_KEY,
  hasDateChanged,
  hasDateReachedLimit
} from './dateUtils';
import styled from '@emotion/styled';
import { Button } from '@material-ui/core';
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons';
import { DateTextField } from './dateTextField';
import { useSpring, animated } from 'react-spring';
import { makeShadow, ELEVATIONS } from '../../common/elevation';

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
const MONTH_DAY_YEAR_FORMAT = 'M/D/YY';

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
    const openCloseAnimation = useSpring({
      transform: isVisible ? `translateY(0px)` : `translateY(-100%)`
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

    useEffect(() => {
      if (isVisible) {
        setDateTyped(format(dateTyped, MONTH_DAY_YEAR_FORMAT));
      } else {
        setDateTyped(format(dateTyped, dateFormat || DEFAULT_DATE_FORMAT));
      }
    }, [isVisible, dateFormat, dateTyped]);

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

    const startAnimation = useCallback(() => {
      isGridAnimating.current = true;
    }, []);

    const endAnimation = useCallback(() => {
      isGridAnimating.current = false;
    }, []);

    const onFocus = useCallback(() => {
      setVisibility(true);
    }, []);

    const onTextFieldChange = useCallback(
      (evt: React.ChangeEvent<HTMLInputElement>) =>
        setDateTyped(evt.target.value),
      []
    );

    // protection function
    const updateDate = useCallback(
      (incomingDate: Date) => {
        const validDateChange =
          hasDateChanged(value, incomingDate) &&
          !hasDateReachedLimit(initialDate.current, incomingDate);

        if (validDateChange) {
          console.log('valid date change');
          return onChange(incomingDate);
        } else {
          console.log('not valid date change');
          if (isVisible) {
            setVisibility(false);
          }
        }
      },
      [onChange, value, isVisible]
    );

    const dateParse = useCallback(() => {
      const newDate = parse(dateTyped);
      const isValidDate = isValid(newDate) && dateTyped !== '';

      if (!isValidDate) {
        setDateTyped(format(value, dateFormat || DEFAULT_DATE_FORMAT));
        setVisibility(false);
      }

      return updateDate(newDate);
    }, [dateFormat, value, updateDate, dateTyped]);

    const onKeyDown = useCallback(
      (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.keyCode === ENTER_KEY && isVisible) {
          dateParse();
        }
      },
      [isVisible, dateParse]
    );

    const onBlur = useCallback(() => {
      if (isVisible) {
        // allow updateDate to run before this check
        setTimeout(() => {
          if (isVisible && !isGridAnimating.current) {
            dateParse();
          }
        }, 300);
      }
    }, [isVisible, dateParse]);

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
            onSelect={updateDate}
            month={itemDate}
            selectedDate={value}
            skeleton={isScrolling}
          />
        </div>
      );
    };

    const animatedGrid = () => {
      return (
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
      );
    };

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
          {animatedGrid()}
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

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
const usePreviousDate = (value: Date) => {
  const ref = useRef<Date>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
