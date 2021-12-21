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
  isAccountModalOpen: false,
  setAccountModalOpen: () => {},
  isLiquidityModalOpen: false,
  setLiquidityModalOpen: () => {},
  isSearchModalOpen: { isOpen: false, tokenType: TokenType.Output },
  setSearchModalOpen: () => {},
};

const StoreContextHOC = createContext<StoreContextType>(initialState);

export const StoreContextProvider = (
  { children }:{ children: JSX.Element },
) => {
  const [wallet, setWallet] = useState<SpecialWallet| null>(initialState.wallet);
  const [loading, setLoading] = useState<boolean>(initialState.loading);

  const [isAccountModalOpen, setAccountModalOpen] = useState<boolean>(
    initialState.isAccountModalOpen,
  );
  const [isLiquidityModalOpen, setLiquidityModalOpen] = useState<boolean>(
    initialState.isLiquidityModalOpen,
  );
  const [isSearchModalOpen, setSearchModalOpen] = useState<{isOpen: boolean, tokenType: TokenType}>(
    initialState.isSearchModalOpen,
  );

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
      isAccountModalOpen,
      setAccountModalOpen,
      isLiquidityModalOpen,
      setLiquidityModalOpen,
      isSearchModalOpen,
      setSearchModalOpen,
    }}
    >
      {children}
    </StoreContextHOC.Provider>
  );
};

export const useStore = () => useContext(StoreContextHOC);
