import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedCallback<T>(
  callback: (args: T) => void,
  wait = 300
) {
  const deps = [callback, wait];
  const timeId = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeId.current) clearTimeout(timeId.current);
    return () => clearTimeout(timeId.current);
  }, deps);

  return useCallback(function (args: T) {
    if (timeId.current) clearTimeout(timeId.current);
    timeId.current = setTimeout(() => callback(args), wait);
  }, deps);
}
