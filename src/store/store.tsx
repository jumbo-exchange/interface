import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { wallet as nearWallet } from 'services/near';
import SpecialWallet from 'services/wallet';

import {
  StoreContextType, TokenType,
} from 'store';

const initialState: StoreContextType = {
  wallet: null,
  setWallet: () => {},
  loading: false,
  setLoading: () => {},
};

const StoreContextHOC = createContext<StoreContextType>(initialState);

export const StoreContextProvider = (
  { children }:{ children: JSX.Element },
) => {
  const [wallet, setWallet] = useState<SpecialWallet| null>(initialState.wallet);
  const [loading, setLoading] = useState<boolean>(initialState.loading);

  const initialLoading = async () => {
    try {
      setLoading(true);
      const isSignedIn = nearWallet.isSignedIn();

      if (isSignedIn) {
        setWallet(nearWallet);
      }
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
      wallet,
      setWallet,
      loading,
      setLoading,
    }}
    >
      {children}
    </StoreContextHOC.Provider>
  );
};

export const useStore = () => useContext(StoreContextHOC);
