import React, { useCallback, useState } from 'react';
import { DateRangeSelector } from './dateRangeSelector';

export const DateRangeExample: React.FC = () => {
  const [currentDate, setDate] = useState(new Date());

  const onChange = useCallback(
    (incomingDate: Date) => setDate(incomingDate),
    []
  );
  return <DateRangeSelector startDate={currentDate} onChange={onChange} />;
};
