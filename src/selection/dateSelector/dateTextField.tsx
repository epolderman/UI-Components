import styled from '@emotion/styled';
import { anime } from 'animejs';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ENTER_KEY, isValidDateObjectFromString } from './dateUtils';
import { CalendarToday, DateRange } from '@material-ui/icons';
import { useSpring } from 'react-spring';

/* Todo: Rewrite to function + hooks after wire up complete */
// write this now
interface InputProps {
  onFocus: () => void;
  onBlur: () => void;
  innerInputRef?: (ref: HTMLInputElement) => void;
  onKeyDown: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  isSmall?: boolean;
}

export const DateTextField: React.FC<InputProps> = React.forwardRef(
  (
    { onChange, onFocus, onBlur, onKeyDown, value, innerInputRef, isSmall },
    ref
  ) => {
    const [isFocused, setFocus] = useState(false);
    const [isActiveError, setError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const prevValue = usePreviousValue(value);

    const errorAnimation = useSpring({
      transform: isActiveError ? `translateX(2px)` : `translateX(0px)`
    });

    useEffect(() => {
      if (value !== prevValue) {
        const oldDateIsValid = isValidDateObjectFromString(prevValue);
        const newDateIsValid = isValidDateObjectFromString(value);
        if (newDateIsValid && !oldDateIsValid) {
          // this.setState({ activeError: false });
          setError(false);
        }
      }
    }, [value, prevValue]);

    const _onChange = useCallback(
      (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (isValidDateObjectFromString(evt.target.value)) {
          setError(false);
        } else {
          setError(true);
        }
        return onChange(evt);
      },
      [onChange]
    );

    const _onKeyDown = useCallback(
      (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.keyCode === ENTER_KEY && isActiveError) {
          // this.shakeAnimation();
          // animate
        }
        return onKeyDown(evt);
      },
      [onKeyDown, isActiveError]
    );

    const _onBlur = useCallback(() => {
      // date selector parent will handle reverting back to last valid date
      if (isActiveError) {
        // animate
        // this.shakeAnimation();
      }
      setFocus(false);
      return onBlur();
    }, [isActiveError, onBlur]);

    const _onFocus = useCallback(() => {
      setFocus(true);
      return onFocus();
    }, [onFocus]);

    const onCalendarIconClick = useCallback(() => {
      if (isFocused) {
        return onBlur();
      }
      onFocus();
    }, [onFocus, isFocused, onBlur]);

    return (
      <TextFieldWrapper ref={containerRef} isSmall={isSmall}>
        <CalendarToday
          style={{
            paddingLeft: isSmall ? 4 : 0,
            transform: errorAnimation.transform
          }}
          color={isActiveError ? 'error' : 'inherit'}
          onClick={onCalendarIconClick}
        />
        <Input
          type='text'
          ref={innerInputRef}
          value={value}
          onFocus={_onFocus}
          onBlur={_onBlur}
          onKeyDown={_onKeyDown}
          onChange={_onChange}
          isSmall={isSmall}
        />
      </TextFieldWrapper>
    );
  }
);

// todo generically get this going
// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
const usePreviousValue = (value: string) => {
  const ref = useRef<string>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const Input = styled.input<{
  isSmall: boolean;
  fontConfig?: { weight: number; size: number };
}>`
  display: flex;
  flex: 1 1 0%;
  justify-content: center;
  align-items: center;
  padding: ${props => (props.isSmall ? '4px' : '8px')};
  background-color: inherit;
  color: inherit;
  border-radius: 4px;
  border-width: 0px;
  text-align: center;
  font-family: 'Open Sans', sans-serif, monospace;
  text-overflow: ellipsis;
  /* input elements have min width auto by default so it refuses to shrink */
  min-width: 0;
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
  background-color: inherit;
  border-radius: 4px;
`;
