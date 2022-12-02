import { useEffect, useState } from 'react';

interface UseMediaQueryProps {
  minWidth: string;
}

/**
 * minWidth는 px단위
 * 640px : 너비가 640px이상이면 태블릿
 * 768px : 너비가 768px이상이면 데스크톱
 */
export const useMediaQuery = ({ minWidth }: UseMediaQueryProps) => {
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
  }, [minWidth]);

  return [isMatch, loading];
};
