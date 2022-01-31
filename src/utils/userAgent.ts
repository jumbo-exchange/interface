const userAgent = navigator.userAgent || navigator.vendor;

const isMobileCheck = () => {
  const windows = /windows phone/i.test(userAgent);
  const android = /android/i.test(userAgent);
  const iOs = /iPhone/.test(userAgent);

  return windows || android || iOs;
};

const isTabletCheck = () => {
  const tablet = /Tablet|iPad/i.test(userAgent);
  return tablet;
};

export const isMobile = isMobileCheck();
export const isTablet = isTabletCheck();
