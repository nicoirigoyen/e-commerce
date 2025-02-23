
import { useEffect } from 'react';
import { animateScroll as scroll } from 'react-scroll';

export const useScrollToTop = () => {
  useEffect(() => {
    scroll.scrollToTop({
      duration: 500,
      delay: 0,
      smooth: true,
    });
  }, []);
};
