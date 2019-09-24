import React, { useCallback, useState } from 'react';
import { DateRangeSelector } from './dateRangeSelector';
import { addMonths } from 'date-fns';

const endDate = addMonths(new Date(), 1);

export const DateRangeExample: React.FC = () => {
  const [currentDate, setDate] = useState(new Date());

  const onChange = useCallback(
    (incomingDate: Date) => setDate(incomingDate),
    []
  );
  return (
    <DateRangeSelector
      startDate={currentDate}
      endDate={endDate}
      onChange={onChange}
    />
  );
};
