import React, {
  createContext, useContext, useState,
  Dispatch, SetStateAction,
} from 'react';
import { IPool } from 'store';
import Modals from 'components/Modals';
import FungibleTokenContract from 'services/FungibleToken';

type ModalsStoreContextType = {
  isAccountModalOpen: boolean;
  setAccountModalOpen: Dispatch<SetStateAction<boolean>>;
  addLiquidityModalOpenState: {isOpen: boolean, pool: IPool | null};
  setAddLiquidityModalOpenState: Dispatch<SetStateAction<{isOpen: boolean, pool: IPool | null}>>;
  isCreatePoolModalOpen: boolean;
  setCreatePoolModalOpen: Dispatch<SetStateAction<boolean>>;
  isSearchModalOpen: {
    isOpen: boolean,
    activeToken: FungibleTokenContract | null,
    setActiveToken: (token: FungibleTokenContract) => void
  };
  setSearchModalOpen: Dispatch<SetStateAction<{
    isOpen: boolean,
    activeToken: FungibleTokenContract | null,
    setActiveToken: (token: FungibleTokenContract) => void
  }>>;
  isTooltipModalOpen: boolean;
  setTooltipModalOpen: Dispatch<SetStateAction<boolean>>;
  titleTooltipModal: string;
  setTitleTooltipModal: Dispatch<SetStateAction<string>>;
  removeLiquidityModalOpenState: {isOpen: boolean, pool: IPool | null};
  setRemoveLiquidityModalOpenState: Dispatch<SetStateAction<{isOpen: boolean, pool: IPool | null}>>;

  stakeModalOpenState: {isOpen: boolean, pool: IPool | null};
  setStakeModalOpenState: Dispatch<SetStateAction<{isOpen: boolean, pool: IPool | null}>>;
  unStakeModalOpenState: {isOpen: boolean, pool: IPool | null};
  setUnStakeModalOpenState: Dispatch<SetStateAction<{isOpen: boolean, pool: IPool | null}>>;
}

export const initialModalsState: ModalsStoreContextType = {
  isAccountModalOpen: false,
  setAccountModalOpen: () => {},
  addLiquidityModalOpenState: { isOpen: false, pool: null },
  setAddLiquidityModalOpenState: () => {},
  isCreatePoolModalOpen: false,
  setCreatePoolModalOpen: () => {},
  isSearchModalOpen: {
    isOpen: false,
    activeToken: null,
    setActiveToken: () => {},
  },
  setSearchModalOpen: () => {},
  isTooltipModalOpen: false,
  setTooltipModalOpen: () => {},
  titleTooltipModal: '',
  setTitleTooltipModal: () => {},
  removeLiquidityModalOpenState: { isOpen: false, pool: null },
  setRemoveLiquidityModalOpenState: () => {},

  stakeModalOpenState: { isOpen: false, pool: null },
  setStakeModalOpenState: () => {},
  unStakeModalOpenState: { isOpen: false, pool: null },
  setUnStakeModalOpenState: () => {},
};

const ModalsStoreContextHOC = createContext<ModalsStoreContextType>(initialModalsState);

export const ModalsContextProvider = (
  { children }:{ children: JSX.Element },
) => {
  const [isAccountModalOpen, setAccountModalOpen] = useState<boolean>(
    initialModalsState.isAccountModalOpen,
  );
  const [addLiquidityModalOpenState, setAddLiquidityModalOpenState] = useState<{
    isOpen: boolean,
    pool: IPool | null
  }>(
    initialModalsState.addLiquidityModalOpenState,
  );
  const [isCreatePoolModalOpen, setCreatePoolModalOpen] = useState<boolean>(
    initialModalsState.isCreatePoolModalOpen,
  );
  const [isSearchModalOpen, setSearchModalOpen] = useState<{
    isOpen: boolean,
    activeToken: FungibleTokenContract | null,
    setActiveToken:(token: FungibleTokenContract) => void
      }>(
      initialModalsState.isSearchModalOpen);
  const [isTooltipModalOpen, setTooltipModalOpen] = useState<boolean>(
    initialModalsState.isTooltipModalOpen,
  );
  const [titleTooltipModal, setTitleTooltipModal] = useState<string>('');

  const [removeLiquidityModalOpenState, setRemoveLiquidityModalOpenState] = useState<{
    isOpen: boolean,
    pool: IPool | null
  }>(
    initialModalsState.removeLiquidityModalOpenState,
  );

  const [stakeModalOpenState, setStakeModalOpenState] = useState<{
    isOpen: boolean,
    pool: IPool | null
  }>(
    initialModalsState.stakeModalOpenState,
  );
  const [unStakeModalOpenState, setUnStakeModalOpenState] = useState<{
    isOpen: boolean,
    pool: IPool | null
  }>(
    initialModalsState.unStakeModalOpenState,
  );

  return (
    <ModalsStoreContextHOC.Provider value={{
      isAccountModalOpen,
      setAccountModalOpen,
      addLiquidityModalOpenState,
      setAddLiquidityModalOpenState,
      isCreatePoolModalOpen,
      setCreatePoolModalOpen,
      isSearchModalOpen,
      setSearchModalOpen,
      isTooltipModalOpen,
      setTooltipModalOpen,
      titleTooltipModal,
      setTitleTooltipModal,
      removeLiquidityModalOpenState,
      setRemoveLiquidityModalOpenState,

      stakeModalOpenState,
      setStakeModalOpenState,
      unStakeModalOpenState,
      setUnStakeModalOpenState,
    }}
    >
      <Modals>
        {children}
      </Modals>
    </ModalsStoreContextHOC.Provider>
  );
};

export const useModalsStore = () => useContext(ModalsStoreContextHOC);
