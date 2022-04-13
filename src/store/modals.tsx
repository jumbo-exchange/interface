import React, {
  createContext, useContext, useState,
  Dispatch, SetStateAction, useCallback,
} from 'react';
import { IPool } from 'store';
import Modals from 'components/Modals';
import FungibleTokenContract from 'services/contracts/FungibleToken';
import {
  toAddLiquidityPage, toRemoveLiquidityPage, toStakePage, toUnStakeAndClaimPage,
} from 'utils/routes';

enum ModalEnum {
  Search,
  Account,
  CreatePool,
  AddLiquidity,
  RemoveLiquidity,
  Stake,
  Unstake,
}

interface IIsSearchModalOpen {
  isOpen: boolean,
  activeToken: FungibleTokenContract | null,
  setActiveToken: (token: FungibleTokenContract) => void
}

interface IBasicModalState {
  isOpen: boolean,
  pool: IPool | null
}

type ModalsStoreContextType = {
  isAccountModalOpen: boolean;
  setAccountModalOpen: (isOpen: boolean) => void;
  addLiquidityModalOpenState: IBasicModalState;
  setAddLiquidityModalOpenState: (props: IBasicModalState) => void;
  isCreatePoolModalOpen: boolean;
  setCreatePoolModalOpen: (isOpen: boolean) => void;
  isSearchModalOpen: IIsSearchModalOpen;
  setSearchModalOpen: (props: IIsSearchModalOpen) => void;
  isTooltipModalOpen: boolean;
  setTooltipModalOpen: Dispatch<SetStateAction<boolean>>;
  titleTooltipModal: string;
  setTitleTooltipModal: Dispatch<SetStateAction<string>>;
  removeLiquidityModalOpenState: IBasicModalState;
  setRemoveLiquidityModalOpenState: (props: IBasicModalState) => void;
  modalState: ModalEnum | null;
  setModalState: (modal: ModalEnum | null) => void;

  stakeModalOpenState: IBasicModalState;
  setStakeModalOpenState: (props: IBasicModalState) => void;
  unStakeModalOpenState: IBasicModalState;
  setUnStakeModalOpenState: (props: IBasicModalState) => void;
  isWithdrawDepositModalOpen: boolean;
  setWithdrawDepositModalOpen: Dispatch<SetStateAction<boolean>>;
  openModalByUrl: (pool: IPool, locationPathname: string) => void;
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
  modalState: null,
  setModalState: () => {},

  stakeModalOpenState: { isOpen: false, pool: null },
  setStakeModalOpenState: () => {},
  unStakeModalOpenState: { isOpen: false, pool: null },
  setUnStakeModalOpenState: () => {},
  isWithdrawDepositModalOpen: false,
  setWithdrawDepositModalOpen: () => {},
  openModalByUrl: () => {},
};

const ModalsStoreContextHOC = createContext<ModalsStoreContextType>(initialModalsState);

export const ModalsContextProvider = (
  { children }:{ children: JSX.Element },
) => {
  const [isAccountModalOpen, setAccountModalOpenInner] = useState<boolean>(
    initialModalsState.isAccountModalOpen,
  );
  const [isCreatePoolModalOpen, setCreatePoolModalOpenInner] = useState<boolean>(
    initialModalsState.isCreatePoolModalOpen,
  );
  const [isSearchModalOpen, setSearchModalOpenInner] = useState<IIsSearchModalOpen>(
    initialModalsState.isSearchModalOpen,
  );
  const [isTooltipModalOpen, setTooltipModalOpen] = useState<boolean>(
    initialModalsState.isTooltipModalOpen,
  );
  const [titleTooltipModal, setTitleTooltipModal] = useState<string>('');
  const [modalState, setModalState] = useState<ModalEnum | null>(null);
  const [
    addLiquidityModalOpenState, setAddLiquidityModalOpenStateInner,
  ] = useState<IBasicModalState>(initialModalsState.addLiquidityModalOpenState);
  const [
    removeLiquidityModalOpenState, setRemoveLiquidityModalOpenStateInner,
  ] = useState<IBasicModalState>(initialModalsState.removeLiquidityModalOpenState);
  const [
    stakeModalOpenState, setStakeModalOpenStateInner,
  ] = useState<IBasicModalState>(initialModalsState.stakeModalOpenState);
  const [
    unStakeModalOpenState, setUnStakeModalOpenStateInner,
  ] = useState<IBasicModalState>(
    initialModalsState.unStakeModalOpenState,
  );
  const [isWithdrawDepositModalOpen, setWithdrawDepositModalOpen] = useState<boolean>(
    initialModalsState.isWithdrawDepositModalOpen,
  );

  const stateCallback = useCallback((isOpen: boolean, modal: ModalEnum) => {
    setModalState(isOpen ? modal : null);
  }, []);

  const closePreviousModal = () => {
    switch (modalState) {
      case ModalEnum.Account:
        setAccountModalOpenInner(false);
        break;
      case ModalEnum.CreatePool:
        setCreatePoolModalOpenInner(false);
        break;
      case ModalEnum.Search:
        setSearchModalOpenInner({
          isOpen: false,
          activeToken: null,
          setActiveToken: () => {},
        });
        break;
      case ModalEnum.AddLiquidity:
        setAddLiquidityModalOpenStateInner({
          isOpen: false,
          pool: null,
        });
        break;
      case ModalEnum.RemoveLiquidity:
        setRemoveLiquidityModalOpenStateInner({
          isOpen: false,
          pool: null,
        });
        break;
      case ModalEnum.Stake:
        setStakeModalOpenStateInner({
          isOpen: false,
          pool: null,
        });
        break;
      case ModalEnum.Unstake:
        setUnStakeModalOpenStateInner({
          isOpen: false,
          pool: null,
        });
        break;
      default: {
        break;
      }
    }
  };

  const setAccountModalOpen = (isOpen: boolean) => {
    if (isOpen) closePreviousModal();
    stateCallback(isOpen, ModalEnum.Account);
    setAccountModalOpenInner(isOpen);
  };

  const setCreatePoolModalOpen = (isOpen: boolean) => {
    if (isOpen) closePreviousModal();
    stateCallback(isOpen, ModalEnum.CreatePool);
    setCreatePoolModalOpenInner(isOpen);
  };

  const setSearchModalOpen = (props: IIsSearchModalOpen) => {
    if (props.isOpen) closePreviousModal();
    stateCallback(props.isOpen, ModalEnum.Search);
    setSearchModalOpenInner(props);
  };

  const setAddLiquidityModalOpenState = (props: IBasicModalState) => {
    if (props.isOpen) closePreviousModal();
    stateCallback(props.isOpen, ModalEnum.AddLiquidity);
    setAddLiquidityModalOpenStateInner(props);
  };

  const setRemoveLiquidityModalOpenState = (props: IBasicModalState) => {
    if (props.isOpen) closePreviousModal();
    stateCallback(props.isOpen, ModalEnum.RemoveLiquidity);
    setRemoveLiquidityModalOpenStateInner(props);
  };
  const setStakeModalOpenState = (props: IBasicModalState) => {
    if (props.isOpen) closePreviousModal();
    stateCallback(props.isOpen, ModalEnum.Stake);
    setStakeModalOpenStateInner(props);
  };
  const setUnStakeModalOpenState = (props: IBasicModalState) => {
    if (props.isOpen) closePreviousModal();
    stateCallback(props.isOpen, ModalEnum.Unstake);
    setUnStakeModalOpenStateInner(props);
  };

  const openModalByUrl = (pool: IPool, locationPathname: string) => {
    if (locationPathname === toRemoveLiquidityPage(pool.id)) {
      setRemoveLiquidityModalOpenState({ isOpen: true, pool });
    } else if (locationPathname === toAddLiquidityPage(pool.id)) {
      setAddLiquidityModalOpenState({ isOpen: true, pool });
    } else if (locationPathname === toStakePage(pool.id)) {
      setStakeModalOpenState({ isOpen: true, pool });
    } else if (locationPathname === toUnStakeAndClaimPage(pool.id)) {
      setUnStakeModalOpenState({ isOpen: true, pool });
    }
  };

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
      modalState,
      setModalState,

      stakeModalOpenState,
      setStakeModalOpenState,
      unStakeModalOpenState,
      setUnStakeModalOpenState,
      isWithdrawDepositModalOpen,
      setWithdrawDepositModalOpen,
      openModalByUrl,
    }}
    >
      <Modals>
        {children}
      </Modals>
    </ModalsStoreContextHOC.Provider>
  );
};

export const useModalsStore = () => useContext(ModalsStoreContextHOC);
