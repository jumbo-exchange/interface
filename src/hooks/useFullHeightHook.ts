import React from 'react';

export default function useFullHeightHook() {
  const onResize = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  React.useEffect(() => {
    onResize();
    if (window) window.addEventListener('resize', onResize);
    return () => {
      if (window) window.removeEventListener('resize', onResize);
    };
  }, []);
}
