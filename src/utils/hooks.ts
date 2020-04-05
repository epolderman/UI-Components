import { useEffect, useRef, useCallback, useState, useMemo } from "react";

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export const usePopoverState = () => {
  const [element, setAnchoredElement] = useState<null | HTMLElement>(null);
  const onOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>) => setAnchoredElement(e.currentTarget),
    []
  );
  const onClose = useCallback(() => setAnchoredElement(null), []);
  const isOpen = element != null;
  return useMemo(() => ({ element, onOpen, onClose, isOpen }), [
    element,
    onOpen,
    onClose,
    isOpen,
  ]);
};
