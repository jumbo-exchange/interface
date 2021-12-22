import React from 'react';
import AccountModal from './AccountModal';

export default function Modals({ children }: {children: JSX.Element}) {
  return (
    <>
      <AccountModal />
      {children}
    </>
  );
}
