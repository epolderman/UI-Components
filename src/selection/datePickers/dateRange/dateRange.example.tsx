import React, { useCallback, useState } from 'react';
import { DateRangeSelector, DateRangeTuple } from './dateRangeSelector';
import { Flex } from '@rebass/grid/emotion';
import { Button } from '@material-ui/core';

export const DateRangeExample: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRangeTuple>([null, null]);
  const [isVirtualizationDisabled, setVirtualizationDiabled] = useState(true);

  const onChange = useCallback(
    (incomingDateRange: DateRangeTuple) => setDateRange(incomingDateRange),
    []
  );

  return (
    <Flex
      flexDirection='column'
      flex='1 1 0%'
      justifyContent='center'
      alignItems='center'
    >
      <DateRangeSelector
        onChange={onChange}
        dateRange={dateRange}
        disableVirtualization={isVirtualizationDisabled}
      />
      <Button
        style={{ margin: '16px' }}
        variant='contained'
        onClick={() => setDateRange([null, null])}
      >
        Erase Date Ranges
      </Button>
      <Button
        style={{ margin: '16px' }}
        variant='contained'
        color='primary'
        onClick={() => setVirtualizationDiabled(disabled => !disabled)}
      >
        {isVirtualizationDisabled
          ? 'Turn on Virtualization'
          : 'Turn off Virtualization'}
      </Button>
    </Flex>
  );
};
