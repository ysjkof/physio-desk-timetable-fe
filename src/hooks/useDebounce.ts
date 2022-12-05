import { useEffect } from 'react';

let timer: NodeJS.Timeout;
let apiCallNumber = 0;

interface UseDebounceProps {
  watchValue: unknown;
  callback: () => void;
  timeout?: number;
}

export const useDebounce = ({
  watchValue,
  callback,
  timeout = 300,
}: UseDebounceProps) => {
  useEffect(() => {
    if (!watchValue) return;
    const timerHandler = () => {
      callback();
      apiCallNumber += 1;
      console.log('Api call count :', apiCallNumber);
    };

    if (timer) clearTimeout(timer);
    timer = setTimeout(timerHandler, timeout);

    return () => clearTimeout(timer);
  }, [watchValue]);
};
