import React from 'react';
import AccountModal from './AccountModal';
import LiquidityModal from './LiquidityModal';
import AddPoolModal from './AddPoolModal';
import SearchModal from './SearchModal';

export default function Modals({ children }: {children: JSX.Element}) {
  return (
    <>
      <AccountModal />
      <LiquidityModal />
      <AddPoolModal />
      <SearchModal />
      {children}
    </>
  );
}
