import { useRef } from 'react';

export const usePrevRef = <T>(value: T) => {
  const currentRef = useRef<T | undefined>(undefined);
  const prevRef = useRef<T | undefined>(undefined);

  // Update previous reference
  prevRef.current = currentRef.current;
  currentRef.current = value;

  return prevRef;
};
