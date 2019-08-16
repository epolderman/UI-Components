import React, { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { DateSelector } from './selection';
import { theme } from '../src/theme/theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import styled from '@emotion/styled-base';
import { Flex, Box } from '@rebass/grid/emotion';

const DIMENSION_THRESHOLD = 700;

const DateWrapper = styled(Box)<{ isSmall: boolean }>`
  width: ${({ isSmall }) => (isSmall ? `100px` : `300px`)};
  justify-content: stretch;
  align-items: stretch;
  padding: 0 2px;
`;

const DateExample: React.FC = () => {
  const [currentDate, setDate] = useState(new Date());
  const onChange = useCallback(
    (incomingDate: Date) => setDate(incomingDate),
    []
  );
  const [isPastDimensionThreshold, setPastDimensionThreshold] = useState(
    window.innerWidth <= DIMENSION_THRESHOLD
  );

  const checkWindowSize = useCallback(
    () => setPastDimensionThreshold(window.innerWidth <= DIMENSION_THRESHOLD),
    []
  );

  useEffect(() => {
    window.addEventListener('resize', checkWindowSize, false);
    return () => window.removeEventListener('resize', checkWindowSize, false);
  }, [checkWindowSize]);

  return (
    <Flex flex='1 1 0%' justifyContent='center' alignItems='center' bg='red'>
      <DateWrapper isSmall={isPastDimensionThreshold}>
        <DateSelector
          value={currentDate}
          onChange={onChange}
          isSmall={isPastDimensionThreshold}
        />
      </DateWrapper>
    </Flex>
  );
};

const App: React.FC = () => (
  <MuiThemeProvider theme={theme}>
    <Flex>
      <DateExample />
    </Flex>
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));

// @ts-ignore
module.hot.accept();
