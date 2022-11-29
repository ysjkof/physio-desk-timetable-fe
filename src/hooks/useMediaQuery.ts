import { useEffect, useState } from 'react';

interface useMediaQueryProps {
  minWidth: string;
}

/**
 * minWidth는 px단위
 * 640px : 너비가 640px이상이면 태블릿
 * 768px : 너비가 768px이상이면 데스크톱
 */
export function useMediaQuery({ minWidth }: useMediaQueryProps) {
  const [isMatch, setIsMatch] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width:${minWidth}px)`);
    if (mediaQuery.matches) setIsMatch(true);

    const senseScreen = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMatch(true);
      } else {
        setIsMatch(false);
      }
    };

    mediaQuery.addEventListener('change', senseScreen);
    setLoading(false);
    return () => mediaQuery.removeEventListener('change', senseScreen);
  }, []);

  return [isMatch, loading];
}
