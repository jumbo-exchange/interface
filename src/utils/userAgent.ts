import { UAParser } from 'ua-parser-js';

const parser = new UAParser(window.navigator.userAgent);
const { type } = parser.getDevice();

export const isTablet = type === 'tablet';

const isMobileCheck = () => {
  const userAgent = navigator.userAgent || navigator.vendor;

  const windows = /windows phone/i.test(userAgent);
  const android = /android/i.test(userAgent);
  const iOs = /iPad|iPhone|iPod/.test(userAgent);

  return windows || android || iOs;
};

export const isMobile = isMobileCheck();
