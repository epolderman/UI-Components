import React, { useCallback } from 'react';
import styled from 'styled-components';
import { CalendarMonth } from './calendarMonth';
import { AnimatedGrid } from './animatedGrid';

/*
  Styled Components: 
  https://mxstbr.blog/2016/11/styled-components-magic-explained/
  https://medium.com/styled-components/how-styled-components-works-618a69970421


  /TODO: look into 2
  styled-components renders an element with 3 class names:
  1. this.props.className — optional passed by parent component.
  2. componentId — uniq identifier of a component but not component instance. This class has no any CSS 
     rules but it is used in nesting selectors when need to refer to other component.
  3. generatedClassName — uniq per every component instance which has actual CSS rules.
*/

export interface DateSelectorProps {
  onChange: (incomingDate: Date) => void;
  value: Date;
}

export const DateSelector: React.FC<DateSelectorProps> = ({ value, onChange }) => {
  const onSelect = useCallback(
    (incomingDate: Date) => {
      console.log(incomingDate);
      onChange(incomingDate);
    },
    [onChange]
  );

  return (
    <DateWrapper>
      <CalendarMonth onSelect={onSelect} month={value} selectedDate={value} />
      <AnimatedGrid column={1} />
    </DateWrapper>
  );
};

const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0%;
  box-sizing: border-box;
  justify-content: stretch;
  align-items: stretch;
  background-color: black;
`;
