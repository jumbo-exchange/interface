import React from 'react';

import { ButtonPrimary, ButtonSecondary } from 'components/Button';
import { wallet } from 'services/near';

import { getUpperCase } from 'utils';
import { useStore } from 'store';
import {
  Container,
  ActionContainer,
  Block,
  InputContainer,
  LogoContainer,
  TokenContainer,
  TokenTitle,
  ArrowDown,
  MinterName,
  MinterLogo,
  WalletInformation,
  LogoWallet,
  ExchangeContainer,
  ExchangeLogo,
  ExchangeLabel,
  TokenWrapper,
  Wallet,
} from './styles';

export default function Swap() {
  const {
    loading,
  } = useStore();

  const isConnected = wallet.isSignedIn();
  const title = isConnected
    ? 'Swap'
    : 'Connect wallet';
  const leftSide = `1 ${getUpperCase('ETH')}`;
  const rightSide = `1 ${getUpperCase('ETH')}`;

  return (
    <Container>
      <ActionContainer>
        <input />
        <ExchangeContainer>
          <ExchangeLogo />
        </ExchangeContainer>
        <input />
      </ActionContainer>
      <ExchangeLabel>
        {loading
          ? 'Loading...'
          : (
            <>
              <div>{leftSide}</div>
              <div>≈</div>
              <div>{rightSide}</div>
            </>
          ) }
      </ExchangeLabel>
      {isConnected
        ? <ButtonPrimary>{title}</ButtonPrimary>
        : (
          <ButtonSecondary>
            <Wallet />
            {title}
          </ButtonSecondary>
        )}
    </Container>
  );
}
