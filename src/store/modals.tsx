import React, {
  createContext, useContext, useState,
  Dispatch, SetStateAction,
} from 'react';
import { TokenType } from 'store';
import Modals from 'components/Modals';

type ModalsStoreContextType = {
  isAccountModalOpen: boolean;
  setAccountModalOpen: Dispatch<SetStateAction<boolean>>;
  isLiquidityModalOpen: boolean;
  setLiquidityModalOpen: Dispatch<SetStateAction<boolean>>;
  isCreatePollModalOpen: boolean;
  setCreatePollModalOpen: Dispatch<SetStateAction<boolean>>;
  isSearchModalOpen: {isOpen: boolean, tokenType: TokenType};
  setSearchModalOpen: Dispatch<SetStateAction<{isOpen: boolean, tokenType: TokenType}>>;
}

export const initialModalsState: ModalsStoreContextType = {
  isAccountModalOpen: false,
  setAccountModalOpen: () => {},
  isLiquidityModalOpen: false,
  setLiquidityModalOpen: () => {},
  isCreatePollModalOpen: false,
  setCreatePollModalOpen: () => {},
  isSearchModalOpen: { isOpen: false, tokenType: TokenType.Output },
  setSearchModalOpen: () => {},
};

const ModalsStoreContextHOC = createContext<ModalsStoreContextType>(initialModalsState);

export const ModalsContextProvider = (
  { children }:{ children: JSX.Element },
) => {
  const [isAccountModalOpen, setAccountModalOpen] = useState<boolean>(
    initialModalsState.isAccountModalOpen,
  );
  const [isLiquidityModalOpen, setLiquidityModalOpen] = useState<boolean>(
    initialModalsState.isLiquidityModalOpen,
  );
  const [isCreatePollModalOpen, setCreatePollModalOpen] = useState<boolean>(
    initialModalsState.isCreatePollModalOpen,
  );
  const [isSearchModalOpen, setSearchModalOpen] = useState<{isOpen: boolean, tokenType: TokenType}>(
    initialModalsState.isSearchModalOpen,
  );

  return (
    <ModalsStoreContextHOC.Provider value={{
      isAccountModalOpen,
      setAccountModalOpen,
      isLiquidityModalOpen,
      setLiquidityModalOpen,
      isCreatePollModalOpen,
      setCreatePollModalOpen,
      isSearchModalOpen,
      setSearchModalOpen,
    }}
    >
      <Modals>
        {children}
      </Modals>
    </ModalsStoreContextHOC.Provider>
  );
};

export const useModalsStore = () => useContext(ModalsStoreContextHOC);
