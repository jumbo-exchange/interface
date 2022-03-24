import React from 'react';
import AccountModal from './AccountModal';
import AddLiquidityModal from './AddLiquidityModal';
import CreatePoolModal from './CreatePoolModal';
import SearchModal from './SearchModal';
import TooltipModal from './TooltipModal';
import RemoveLiquidityModal from './RemoveLiquidityModal';
import StakeModal from './StakeModal';
import UnStakeModal from './UnStakeModal';

export default function Modals({ children }: {children: JSX.Element}) {
  return (
    <>
      <AccountModal />
      <AddLiquidityModal />
      <CreatePoolModal />
      <RemoveLiquidityModal />
      <SearchModal />
      <TooltipModal />
      <StakeModal />
      <UnStakeModal />
      {children}
    </>
  );
}
