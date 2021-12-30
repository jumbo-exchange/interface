import React, { useCallback, useState } from 'react';
import SpecialContainer from 'components/SpecialContainer';
import { ButtonPrimary, ButtonSecondary } from 'components/Button';
import { wallet } from 'services/near';
import { getUpperCase } from 'utils';
import { useStore, useModalsStore, TokenType } from 'store';
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

const RenderSettings = ({ isSettingsOpen }: {isSettingsOpen:boolean}) => {
  if (isSettingsOpen) {
    return <Settings />;
  }
  return null;
};

export default function Swap() {
  const {
    inputToken,
    setInputToken,
    outputToken,
    setOutputToken,
    balances,
    loading,
  } = useStore();

  const { setAccountModalOpen, setSearchModalOpen } = useModalsStore();

  const [inputTokenValue, setInputTokenValue] = useState<string>('');
  const [outputTokenValue, setOutputTokenValue] = useState<string>('');

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const isConnected = wallet.isSignedIn();
  const title = isConnected
    ? 'Swap'
    : 'Connect wallet';
  const exchangeLabel = `1 ${getUpperCase(inputToken?.metadata.symbol ?? '')} ≈ 4923.333 ${getUpperCase(outputToken?.metadata.symbol ?? '')}`;

  const openModal = useCallback(
    (tokenType: TokenType) => {
      setSearchModalOpen({ isOpen: true, tokenType });
      setIsSettingsOpen(false);
    },
    [],
  );

  const changeToken = () => {
    const oldOutputToken = outputToken;
    setOutputToken(inputToken);
    setInputToken(oldOutputToken);
  };

  const swapToken = () => {
    console.log('swap');
  };

  return (
    <SpecialContainer>
      <ActionContainer>
        <Input
          openModal={openModal}
          token={inputToken}
          tokenType={TokenType.Input}
          value={inputTokenValue}
          setValue={setInputTokenValue}
          balance={balances[inputToken?.contractId ?? '']}
        />
        <ChangeTokenContainer onClick={changeToken}>
          <ChangeTokenLogo />
          <span>Change Direction</span>
        </ChangeTokenContainer>
        <Input
          openModal={openModal}
          token={outputToken}
          tokenType={TokenType.Output}
          value={outputTokenValue}
          setValue={setOutputTokenValue}
          balance={balances[outputToken?.contractId ?? '']}
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
        <RenderSettings isSettingsOpen={isSettingsOpen} />
      </SettingsBlock>
      {isConnected
        ? <ButtonPrimary onClick={swapToken}>{title}</ButtonPrimary>
        : (
          <ButtonSecondary onClick={() => {
            setAccountModalOpen(true);
            setIsSettingsOpen(false);
          }}
          >
            <Wallet />
            {title}
          </ButtonSecondary>
        )}
    </SpecialContainer>
  );
}
