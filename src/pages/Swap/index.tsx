import React, { useState } from 'react';
import SpecialContainer from 'components/SpecialContainer';
import { ButtonPrimary, ButtonSecondary } from 'components/Button';
import { wallet } from 'services/near';
import { getUpperCase } from 'utils';
import { useStore } from 'store';
import Input from './Input';
import Settings from './Settings';
import {
  ActionContainer,
  ArrowDown,
  ChangeTokenContainer,
  ChangeTokenLogo,
  ExchangeBlock,
  RefreshBlock,
  PlaceHolderGif,
  SettingsHeader,
  ExchangeLabel,
  SettingsBlock,
  SettingsLabel,
  Wallet,
} from './styles';

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
          <PlaceHolderGif />
          Refresh
        </RefreshBlock>
        <ExchangeLabel>
          {loading ? 'Loading...' : <div>{exchangeLabel}</div>}
        </ExchangeLabel>
      </ExchangeBlock>
      <SettingsBlock>
        <SettingsHeader>
          <SettingsLabel
            isActive={isSettingsOpen}
            onClick={() => (setIsSettingsOpen(!isSettingsOpen))}
          >
            <span>Settings</span>
            <ArrowDown />
          </SettingsLabel>
        </SettingsHeader>
        <Settings isActive={isSettingsOpen} />
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
