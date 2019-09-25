import React, { useCallback, useState } from 'react';
import { DateRangeSelector } from './dateRangeSelector';
import { addMonths } from 'date-fns';

const endDate = addMonths(new Date(), 1);

type DateTuple = [Date, Date];

export const DateRangeExample: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateTuple>([new Date(), endDate]);

  const onChange = useCallback((incomingDateRange: DateTuple) => {
    setDateRange(incomingDateRange);
  }, []);
  return (
    <DateRangeSelector
      startDate={dateRange[0]}
      endDate={dateRange[1]}
      onChange={onChange}
    />
  );
};
