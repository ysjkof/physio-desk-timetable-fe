import { useEffect, useState } from 'react';

let timer: NodeJS.Timeout;
let apiCallNumber = 0;

interface UseDebounceProps {
  callback: () => void;
  timeout?: number;
}

export const useDebounce = ({ callback, timeout = 300 }: UseDebounceProps) => {
  const [trigger, setTrigger] = useState([1]);

  const debounce = () => {
    setTrigger((prev) => [...prev]);
  };

  useEffect(() => {
    if (!trigger) return;

    const timerHandler = () => {
      callback();
      apiCallNumber += 1;
      console.log('Api call count :', apiCallNumber);
    };

    if (timer) clearTimeout(timer);
    timer = setTimeout(timerHandler, timeout);

    return () => clearTimeout(timer);
  }, [trigger]);

  return debounce;
};
