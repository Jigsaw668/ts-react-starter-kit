import { useState, useEffect } from 'react';

interface WindowWidth {
  windowWidth: number;
}

export default function useWindowWidthResize(): WindowWidth {
  const [windowWidth, setWindowWidth] = useState<WindowWidth>({
    windowWidth: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth({
      windowWidth: window.innerWidth,
    });

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
}
