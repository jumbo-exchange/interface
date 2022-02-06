import React from 'react';
import AccountModal from './AccountModal';
import AddLiquidityModal from './AddLiquidityModal';
import CreatePoolModal from './CreatePoolModal';
import SearchModal from './SearchModal';
import TooltipModal from './TooltipModal';
import RemoveLiquidityModal from './RemoveLiquidityModal';

export default function Modals({ children }: {children: JSX.Element}) {
  return (
    <>
      <AccountModal />
      <AddLiquidityModal />
      <CreatePoolModal />
      <SearchModal />
      <TooltipModal />
      <RemoveLiquidityModal />
      {children}
    </>
  );
}
