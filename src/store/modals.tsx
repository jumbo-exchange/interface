import React, {
  createContext, useContext, useState,
  Dispatch, SetStateAction, useCallback,
} from 'react';
import { IPool } from 'store';
import Modals from 'components/Modals';
import FungibleTokenContract from 'services/contracts/FungibleToken';

enum ModalEnum {
  search,
  account,
  createPool,
  addLiquidity,
  removeLiquidity,
  stake,
  unstake,
}

interface IIsSearchModalOpen {
  isOpen: boolean,
  activeToken: FungibleTokenContract | null,
  setActiveToken: (token: FungibleTokenContract) => void
}

interface IIsOpenAndPool {
  isOpen: boolean,
  pool: IPool | null
}

type ModalsStoreContextType = {
  isAccountModalOpen: boolean;
  setAccountModalOpen: (isOpen: boolean) => void;
  addLiquidityModalOpenState: IIsOpenAndPool;
  setAddLiquidityModalOpenState: (props: IIsOpenAndPool) => void;
  isCreatePoolModalOpen: boolean;
  setCreatePoolModalOpen: (isOpen: boolean) => void;
  isSearchModalOpen: IIsSearchModalOpen;
  setSearchModalOpen: (props: IIsSearchModalOpen) => void;
  isTooltipModalOpen: boolean;
  setTooltipModalOpen: Dispatch<SetStateAction<boolean>>;
  titleTooltipModal: string;
  setTitleTooltipModal: Dispatch<SetStateAction<string>>;
  removeLiquidityModalOpenState: IIsOpenAndPool;
  setRemoveLiquidityModalOpenState: (props: IIsOpenAndPool) => void;
  modalState: ModalEnum | null;
  setModalState: (modal: ModalEnum | null) => void;

  stakeModalOpenState: IIsOpenAndPool;
  setStakeModalOpenState: (props: IIsOpenAndPool) => void;
  unStakeModalOpenState: IIsOpenAndPool;
  setUnStakeModalOpenState: (props: IIsOpenAndPool) => void;
  isWithdrawDepositModalOpen: boolean;
  setWithdrawDepositModalOpen: Dispatch<SetStateAction<boolean>>;
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
  ] = useState<IIsOpenAndPool>(initialModalsState.addLiquidityModalOpenState);
  const [
    removeLiquidityModalOpenState, setRemoveLiquidityModalOpenStateInner,
  ] = useState<IIsOpenAndPool>(initialModalsState.removeLiquidityModalOpenState);
  const [
    stakeModalOpenState, setStakeModalOpenStateInner,
  ] = useState<IIsOpenAndPool>(initialModalsState.stakeModalOpenState);
  const [
    unStakeModalOpenState, setUnStakeModalOpenStateInner,
  ] = useState<IIsOpenAndPool>(
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
      case ModalEnum.account:
        setAccountModalOpenInner(false);
        break;
      case ModalEnum.createPool:
        setCreatePoolModalOpenInner(false);
        break;
      case ModalEnum.search:
        setSearchModalOpenInner({
          isOpen: false,
          activeToken: null,
          setActiveToken: () => {},
        });
        break;
      case ModalEnum.addLiquidity:
        setAddLiquidityModalOpenStateInner({
          isOpen: false,
          pool: null,
        });
        break;
      case ModalEnum.removeLiquidity:
        setRemoveLiquidityModalOpenStateInner({
          isOpen: false,
          pool: null,
        });
        break;
      case ModalEnum.stake:
        setStakeModalOpenStateInner({
          isOpen: false,
          pool: null,
        });
        break;
      case ModalEnum.unstake:
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
    stateCallback(isOpen, ModalEnum.account);
    setAccountModalOpenInner(isOpen);
  };

  const setCreatePoolModalOpen = (isOpen: boolean) => {
    if (isOpen) closePreviousModal();
    stateCallback(isOpen, ModalEnum.createPool);
    setCreatePoolModalOpenInner(isOpen);
  };

  const setSearchModalOpen = (props: IIsSearchModalOpen) => {
    if (props.isOpen) closePreviousModal();
    stateCallback(props.isOpen, ModalEnum.search);
    setSearchModalOpenInner(props);
  };

  const setAddLiquidityModalOpenState = (props: IIsOpenAndPool) => {
    if (props.isOpen) closePreviousModal();
    stateCallback(props.isOpen, ModalEnum.addLiquidity);
    setAddLiquidityModalOpenStateInner(props);
  };

  const setRemoveLiquidityModalOpenState = (props: IIsOpenAndPool) => {
    if (props.isOpen) closePreviousModal();
    stateCallback(props.isOpen, ModalEnum.removeLiquidity);
    setRemoveLiquidityModalOpenStateInner(props);
  };
  const setStakeModalOpenState = (props: IIsOpenAndPool) => {
    if (props.isOpen) closePreviousModal();
    stateCallback(props.isOpen, ModalEnum.stake);
    setStakeModalOpenStateInner(props);
  };
  const setUnStakeModalOpenState = (props: IIsOpenAndPool) => {
    if (props.isOpen) closePreviousModal();
    stateCallback(props.isOpen, ModalEnum.unstake);
    setUnStakeModalOpenStateInner(props);
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
    }}
    >
      <Modals>
        {children}
      </Modals>
    </ModalsStoreContextHOC.Provider>
  );
};

export const useModalsStore = () => useContext(ModalsStoreContextHOC);
