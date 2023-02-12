import { useEffect, useState } from 'react';

let timer: NodeJS.Timeout;

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
    };

    if (timer) clearTimeout(timer);
    timer = setTimeout(timerHandler, timeout);

    return () => clearTimeout(timer);
  }, [trigger]);

  return debounce;
};
