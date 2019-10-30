import React, { useCallback, useState } from 'react';
import { DateRangeSelector, DateRangeTuple } from './dateRangeSelector';
import { Flex } from '@rebass/grid/emotion';
import { Button } from '@material-ui/core';
import { DEFAULT_DATE_FORMAT } from '../dateUtils';

export const DateRangeExample: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRangeTuple>([null, null]);
  const [isVirtualizationDisabled, setVirtualizationDiabled] = useState(true);
  const [isCalendarIconRemoved, setCalendarIconRemoved] = useState(false);
  const [dateFormat, setDateFormat] = useState('');

  const onChange = useCallback(
    (incomingDateRange: DateRangeTuple) => setDateRange(incomingDateRange),
    []
  );

  return (
    <Flex flex='1 1 0%' justifyContent='center' alignItems='center'>
      <Button
        style={{ margin: '16px' }}
        variant='text'
        onClick={() => setDateRange([null, null])}
      >
        Erase Date Ranges
      </Button>
      <Button
        style={{ margin: '16px' }}
        variant='text'
        onClick={() => setCalendarIconRemoved(s => !s)}
      >
        {isCalendarIconRemoved ? 'Show Calendar Icon' : 'Hide Calendar Icon'}
      </Button>
      <Button
        style={{ margin: '16px' }}
        variant='text'
        onClick={() =>
          setDateFormat(s => (s === '' ? DEFAULT_DATE_FORMAT : ''))
        }
      >
        {dateFormat === '' ? 'Default Date Format' : 'Use Range Default'}
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
      <Flex style={{ maxWidth: '300px' }}>
        <DateRangeSelector
          onChange={onChange}
          dateRange={dateRange}
          disableVirtualization={isVirtualizationDisabled}
          hideCalendarIcon={isCalendarIconRemoved}
          dateFormat={dateFormat}
        />
      </Flex>
    </Flex>
  );
};
