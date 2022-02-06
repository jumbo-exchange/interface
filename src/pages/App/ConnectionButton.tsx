import React from 'react';
import { wallet } from 'services/near';
import styled from 'styled-components';
import { isMobile } from 'utils/userAgent';

import { useModalsStore } from 'store';
import { ButtonPrimary, ButtonThird } from 'components/Button';
import { ReactComponent as LogoWallet } from 'assets/images-app/wallet.svg';
import { ReactComponent as LogoNear } from 'assets/images-app/near.svg';
import { ReactComponent as ArrowDown } from 'assets/images-app/icon-arrow-down.svg';

const Wallet = styled(LogoWallet)`
  margin-right: 0.625rem;
`;

const Near = styled(LogoNear)`
  margin-right: 0.5rem;
`;
const MobileNear = styled(LogoNear)`
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
`;

const Arrow = styled(ArrowDown)`
  margin-left: .453rem;
`;

const MobileArrow = styled(ArrowDown)`
  width: .594rem;
  height: .344rem;
  margin-left: .453rem;
`;

const PinkButtonThird = styled(ButtonThird)`
  background-color: ${({ theme }) => theme.pink};
  border-color: ${({ theme }) => theme.pink};
`;

export default function ConnectionButton() {
  const isConnected = wallet.isSignedIn();
  const { setAccountModalOpen } = useModalsStore();

  const title = 'Connect Wallet';

  if (isConnected) {
    return (
      <ButtonThird onClick={() => setAccountModalOpen(true)}>
        {isMobile ? <><MobileNear /><MobileArrow /></> : <><Near /><Arrow /></>}

      </ButtonThird>
    );
  }
  return (
    <>
      {isMobile
        ? (
          <PinkButtonThird onClick={() => setAccountModalOpen(true)}>
            <Wallet />
            <MobileArrow />
          </PinkButtonThird>
        )
        : (
          <ButtonPrimary onClick={() => setAccountModalOpen(true)}>
            <Wallet />
            {title}
          </ButtonPrimary>
        ) }
    </>
  );
}
