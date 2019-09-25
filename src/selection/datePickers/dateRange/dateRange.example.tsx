import React, { useCallback, useState } from 'react';
import { DateRangeSelector, DateRangeTuple } from './dateRangeSelector';

export const DateRangeExample: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRangeTuple>([null, null]);

  const onChange = useCallback((incomingDateRange: DateRangeTuple) => {
    setDateRange(incomingDateRange);
  }, []);
  return <DateRangeSelector onChange={onChange} dateRange={dateRange} />;
};
