import { useEffect, useState } from 'react';

/** 반환하는 height = View Port Height - Global Navigation Bar Height*/
export default function useWindowSize(hasEventListner?: boolean) {
  const [height, setHeight] = useState(window.innerHeight);
  const [minus, setMinus] = useState(0);

  const changeMinus = (value: number) => {
    setMinus(value);
  };

  const getHeight = () => {
    const windowHeight = window.innerHeight;
    // GNB = Global Navigation Bar
    const GNBHeight =
      document.getElementById('global-header')?.clientHeight || 0;
    setHeight(windowHeight - GNBHeight - minus);
  };

  const delayedGetHeight = () => setTimeout(getHeight, 0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const debounceDelayedGetHeight = () => {
      if (timer) clearTimeout(timer);
      timer = delayedGetHeight();
    };
    debounceDelayedGetHeight();

    if (hasEventListner) {
      window.addEventListener('resize', debounceDelayedGetHeight);
      return () =>
        window.removeEventListener('resize', debounceDelayedGetHeight);
    }
  }, [minus]);

  return { height, changeMinus };
}
