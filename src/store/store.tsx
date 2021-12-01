import React, {
  createContext, useContext, useEffect, useState,
} from 'react';

import {
  StoreContextType,
} from 'store';

const initialState: StoreContextType = {
  loading: false,
  setLoading: () => {},
};

const StoreContextHOC = createContext<StoreContextType>(initialState);

export const StoreContextProvider = (
  { children }:{ children: JSX.Element },
) => {
  const [loading, setLoading] = useState<boolean>(initialState.loading);

  const initialLoading = async () => {
    try {
      setLoading(true);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialLoading();
  }, []);

  return (
    <StoreContextHOC.Provider value={{
      loading,
      setLoading,
    }}
    >
      {children}
    </StoreContextHOC.Provider>
  );
};

export const useStore = () => useContext(StoreContextHOC);
