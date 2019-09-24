import React, { useState, useCallback, useEffect } from 'react';
import { DateSelector } from './dateSelector';
import styled from '@emotion/styled-base';
import { Flex, Box } from '@rebass/grid/emotion';
import { Button } from '@material-ui/core';

/* 
  Date Selector Test File 
  1. Shrinking to Small Vs Large Size
  2. Un-mounting while animating
*/

const DIMENSION_THRESHOLD = 700;

export const DateExample: React.FC = () => {
  const [currentDate, setDate] = useState(new Date());
  const [isRemoved, setIsRemoved] = useState(false);
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
    <Flex flex='1 1 0%' justifyContent='space-evenly' alignItems='center'>
      <Button
        variant='contained'
        onClick={() => setIsRemoved(removed => !removed)}
      >
        {isRemoved ? 'Mount' : 'Unmount'}
      </Button>
      {isRemoved ? null : (
        <DateWrapper isSmall={isPastDimensionThreshold}>
          <DateSelector
            value={currentDate}
            onChange={onChange}
            isSmall={isPastDimensionThreshold}
          />
        </DateWrapper>
      )}
    </Flex>
  );
};

const DateWrapper = styled(Box)<{ isSmall: boolean }>`
  width: ${({ isSmall }) => (isSmall ? `100px` : `300px`)};
  justify-content: stretch;
  align-items: stretch;
  padding: 0 2px;
`;
