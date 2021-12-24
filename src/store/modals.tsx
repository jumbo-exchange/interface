import React, {
  createContext, useContext, useState,
  Dispatch, SetStateAction,
} from 'react';
import { TokenType } from 'store';
import Modals from 'components/Modals';

type ModalsStoreContextType = {
  isAccountModalOpen: boolean;
  setAccountModalOpen: Dispatch<SetStateAction<boolean>>;
  isSearchModalOpen: {isOpen: boolean, tokenType: TokenType};
  setSearchModalOpen: Dispatch<SetStateAction<{isOpen: boolean, tokenType: TokenType}>>;
}

const initialState: ModalsStoreContextType = {
  isAccountModalOpen: false,
  setAccountModalOpen: () => {},
  isSearchModalOpen: { isOpen: false, tokenType: TokenType.Output },
  setSearchModalOpen: () => {},
};

const ModalsStoreContextHOC = createContext<ModalsStoreContextType>(initialState);

export const ModalsContextProvider = (
  { children }:{ children: JSX.Element },
) => {
  const [isAccountModalOpen, setAccountModalOpen] = useState<boolean>(
    initialState.isAccountModalOpen,
  );
  const [isSearchModalOpen, setSearchModalOpen] = useState<{isOpen: boolean, tokenType: TokenType}>(
    initialState.isSearchModalOpen,
  );

  return (
    <ModalsStoreContextHOC.Provider value={{
      isAccountModalOpen,
      setAccountModalOpen,
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
