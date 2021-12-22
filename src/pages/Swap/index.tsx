import React, { useState } from 'react';
import CurrencyInputPanel from 'components/CurrencyInputPanel';
import tokenLogo from 'assets/images-app/ETH.svg';
import SpecialContainer from 'components/SpecialContainer';
import { ButtonPrimary, ButtonSecondary } from 'components/Button';
import { wallet } from 'services/near';
import { getUpperCase } from 'utils';
import { useStore } from 'store';
import {
  ActionContainer,
  Block,
  InputContainer,
  LogoContainer,
  TokenContainer,
  ArrowDown,
  InputLabel,
  WalletInformation,
  ButtonHalfWallet,
  ButtonMaxWallet,
  LogoWallet,
  ChangeTokenContainer,
  ChangeTokenLogo,
  ExchangeBlock,
  RefreshBlock,
  ExchangeLabel,
  SettingsBlock,
  SettingsLabel,
  Wallet,
} from './styles';

const Input = (
  {
    value,
    setValue,
  }:
  {
    value: string,
    setValue: any,
  },
) => {
  const setHalfAmount = () => {
    console.log('setHalfAmount');
  };

  const setMaxAmount = () => {
    console.log('setMaxAmount');
  };

  return (
    <Block>
      <InputLabel>
        <WalletInformation>
          <LogoWallet />
          1234
        </WalletInformation>
        <ButtonHalfWallet onClick={setHalfAmount}>
          <span>HALF</span>
        </ButtonHalfWallet>
        <ButtonMaxWallet onClick={setMaxAmount}>
          <span>MAX</span>
        </ButtonMaxWallet>
      </InputLabel>
      <InputContainer>
        <LogoContainer>
          <img src={tokenLogo} alt="token" />
        </LogoContainer>
        <CurrencyInputPanel
          value={value}
          setValue={setValue}
        />
        <TokenContainer>
          {getUpperCase('ETH')}
          <ArrowDown />
        </TokenContainer>
      </InputContainer>
    </Block>
  );
};

export default function Swap() {
  const { loading, setAccountModalOpen } = useStore();

  const [value, setValue] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const isConnected = wallet.isSignedIn();
  const title = isConnected
    ? 'Swap'
    : 'Connect wallet';
  const exchangeLabel = `1 ${getUpperCase('ETH')} ≈ 4923.333 ${getUpperCase('NEAR')}`;

  const changeToken = () => {
    console.log('changeToken');
  };
  const swapToken = () => {
    console.log('swap');
  };

  return (
    <SpecialContainer>
      <ActionContainer>
        <Input
          value={value}
          setValue={setValue}
        />
        <ChangeTokenContainer onClick={changeToken}>
          <ChangeTokenLogo />
          <span>Change Direction</span>
        </ChangeTokenContainer>
        <Input
          value={value}
          setValue={setValue}
        />
      </ActionContainer>
      <ExchangeBlock>
        <RefreshBlock>
          gif load Refresh
        </RefreshBlock>
        <ExchangeLabel>
          {loading ? 'Loading...' : <div>{exchangeLabel}</div>}
        </ExchangeLabel>
      </ExchangeBlock>
      <SettingsBlock>
        <SettingsLabel
          isActive={isSettingsOpen}
          onClick={() => (setIsSettingsOpen(!isSettingsOpen))}
        >
          <span>Settings</span> <ArrowDown />
        </SettingsLabel>
      </SettingsBlock>
      {isConnected
        ? <ButtonPrimary onClick={swapToken}>{title}</ButtonPrimary>
        : (
          <ButtonSecondary onClick={() => setAccountModalOpen(true)}>
            <Wallet />
            {title}
          </ButtonSecondary>
        )}
    </SpecialContainer>
  );
}
