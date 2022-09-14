import { useEffect, useState } from 'react';

/** 반환하는 height = View Port Height - GlobalNavigationBar Height*/
export default function useWindowSize(hasEventListner?: boolean) {
  const [height, setHeight] = useState(window.innerHeight);
  const [minus, setMinus] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    function handleTableHeight() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const windowHeight = window.innerHeight;
        const globalNavigationBarHeight =
          document.getElementById('global-header')?.clientHeight || 0;
        setHeight(windowHeight - globalNavigationBarHeight - minus);
      }, 200);
    }
    handleTableHeight();

    if (hasEventListner) {
      window.addEventListener('resize', handleTableHeight);
      return () => window.removeEventListener('resize', handleTableHeight);
    }
  }, [minus]);

  return { height, setMinus };
}
