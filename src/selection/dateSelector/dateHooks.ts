import { useEffect, useRef } from 'react';

export const usePreviousDate = (value: Date) => {
  const ref = useRef<Date>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
