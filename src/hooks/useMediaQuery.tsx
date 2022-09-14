import { useEffect, useState } from 'react';

export default function useMediaQuery() {
  const [isMobile, setIsMobile] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width:640px)');
    if (mediaQuery.matches) setIsMobile(false);

    const senseScreen = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    };

    mediaQuery.addEventListener('change', senseScreen);
    setLoading(false);
    return () => mediaQuery.removeEventListener('change', senseScreen);
  }, []);

  return { isMobile, loading };
}
