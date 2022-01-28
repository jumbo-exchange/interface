import React, {
  createContext, useContext, useState,
  Dispatch, SetStateAction,
} from 'react';
import { TokenType } from 'store';
import Modals from 'components/Modals';

type ModalsStoreContextType = {
  isAccountModalOpen: boolean;
  setAccountModalOpen: Dispatch<SetStateAction<boolean>>;
  isAddLiquidityModalOpen: boolean;
  setAddLiquidityModalOpen: Dispatch<SetStateAction<boolean>>;
  isCreatePollModalOpen: boolean;
  setCreatePollModalOpen: Dispatch<SetStateAction<boolean>>;
  isSearchModalOpen: {isOpen: boolean, tokenType: TokenType};
  setSearchModalOpen: Dispatch<SetStateAction<{isOpen: boolean, tokenType: TokenType}>>;
  isTooltipModalOpen: boolean;
  setTooltipModalOpen: Dispatch<SetStateAction<boolean>>;
  titleTooltipModal: string;
  setTitleTooltipModal: Dispatch<SetStateAction<string>>;
}

export const initialModalsState: ModalsStoreContextType = {
  isAccountModalOpen: false,
  setAccountModalOpen: () => {},
  isAddLiquidityModalOpen: false,
  setAddLiquidityModalOpen: () => {},
  isCreatePollModalOpen: false,
  setCreatePollModalOpen: () => {},
  isSearchModalOpen: { isOpen: false, tokenType: TokenType.Output },
  setSearchModalOpen: () => {},
  isTooltipModalOpen: false,
  setTooltipModalOpen: () => {},
  titleTooltipModal: '',
  setTitleTooltipModal: () => {},
};

const ModalsStoreContextHOC = createContext<ModalsStoreContextType>(initialModalsState);

export const ModalsContextProvider = (
  { children }:{ children: JSX.Element },
) => {
  const [isAccountModalOpen, setAccountModalOpen] = useState<boolean>(
    initialModalsState.isAccountModalOpen,
  );
  const [isAddLiquidityModalOpen, setAddLiquidityModalOpen] = useState<boolean>(
    initialModalsState.isAddLiquidityModalOpen,
  );
  const [isCreatePollModalOpen, setCreatePollModalOpen] = useState<boolean>(
    initialModalsState.isCreatePollModalOpen,
  );
  const [isSearchModalOpen, setSearchModalOpen] = useState<{isOpen: boolean, tokenType: TokenType}>(
    initialModalsState.isSearchModalOpen,
  );
  const [isTooltipModalOpen, setTooltipModalOpen] = useState<boolean>(
    initialModalsState.isTooltipModalOpen,
  );
  const [titleTooltipModal, setTitleTooltipModal] = useState<string>('');

  return (
    <ModalsStoreContextHOC.Provider value={{
      isAccountModalOpen,
      setAccountModalOpen,
      isAddLiquidityModalOpen,
      setAddLiquidityModalOpen,
      isCreatePollModalOpen,
      setCreatePollModalOpen,
      isSearchModalOpen,
      setSearchModalOpen,
      isTooltipModalOpen,
      setTooltipModalOpen,
      titleTooltipModal,
      setTitleTooltipModal,
    }}
    >
      <Modals>
        {children}
      </Modals>
    </ModalsStoreContextHOC.Provider>
  );
};

export const useModalsStore = () => useContext(ModalsStoreContextHOC);
