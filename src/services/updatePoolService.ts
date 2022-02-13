import { useEffect } from 'react';

const DEFAULT_UPDATE_TIMEOUT = 5000;
export const useUpdateService = (
  callback: () => {},
  updateTimeout?: number,
) => useEffect(() => {
  const interval = setInterval(async () => {
    await callback();
  }, updateTimeout || DEFAULT_UPDATE_TIMEOUT);

  return () => clearInterval(interval);
});

export default useUpdateService;
