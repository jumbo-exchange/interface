import React from 'react';
import AccountModal from './AccountModal';
import SearchModal from './SearchModal';

export default function Modals({ children }: {children: JSX.Element}) {
  return (
    <>
      <AccountModal />
      <SearchModal />
      {children}
    </>
  );
}
