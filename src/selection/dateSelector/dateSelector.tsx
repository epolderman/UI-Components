import React from 'react';
import styled from 'styled-components';

export interface DateSelectorProps {
  onChange: (incomingDate: Date) => void;
  value: Date;
}

export const DateSelector: React.FC = () => {
  return <DateWrapper>{'Date Selector'}</DateWrapper>;
};

const DateWrapper = styled.div`
  display: flex;
  flex: 1 1 0%;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
`;
