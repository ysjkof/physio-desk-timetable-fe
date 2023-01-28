import { useEffect, useState } from 'react';

/** 반환하는 height = View Port Height - Global Navigation Bar Height */
export const useWindowSize = (hasEventListener?: boolean) => {
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);
  const [minusToHeight, setMinusToHeight] = useState(0);
  const [minusToWidth, setMinusToWidth] = useState(0);

  const changeHeight = (number: number) => {
    setMinusToHeight(number);
  };

  const changeWidth = (number: number) => {
    setMinusToWidth(number);
  };

  const getHeightAndWidth = () => {
    getHeight();
    getWidth();
  };

  const getHeight = () => {
    // GNB = Global Navigation Bar
    const GNBHeight =
      document.getElementById('global-header')?.clientHeight || 0;
    setHeight(window.innerHeight - GNBHeight - minusToHeight);
  };

  const getWidth = () => {
    setWidth(window.innerWidth - minusToWidth);
  };

  const delayedGetHeight = () => setTimeout(getHeightAndWidth, 0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    const debounceDelayedGetHeight = () => {
      if (timer) clearTimeout(timer);
      timer = delayedGetHeight();
    };
    debounceDelayedGetHeight();

    if (hasEventListener) {
      window.addEventListener('resize', debounceDelayedGetHeight);
      return () =>
        window.removeEventListener('resize', debounceDelayedGetHeight);
    }
  }, [hasEventListener, minusToHeight, minusToWidth]);

  return { height, width, changeHeight, changeWidth };
};
