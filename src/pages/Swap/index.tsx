import React, { useCallback, useState } from 'react';
import { ButtonPrimary, ButtonSecondary } from 'components/Button';
import { wallet } from 'services/near';
import { getUpperCase } from 'utils';
import { useStore, useModalsStore, TokenType } from 'store';
import SwapContract from 'services/SwapContract';
import Input from './Input';
import SwapSettings from './SwapSettings';
import {
  Container,
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
  SwapInformation,
  RouteBlock,
  TitleInfo,
  RowInfo,
  LabelInfo,
  LogoInfo,
} from './styles';

const RenderSettings = ({ isSettingsOpen }: {isSettingsOpen:boolean}) => {
  if (isSettingsOpen) {
    return <SwapSettings />;
  }
  return null;
};

const RenderButton = ({
  isConnected,
  swapToken,
  title,
  setAccountModalOpen,
}:{
  isConnected:boolean,
  swapToken:() => void,
  title: string,
  setAccountModalOpen: (isOpen: boolean) => void,
}) => {
  if (isConnected) {
    return <ButtonPrimary onClick={swapToken}>{title}</ButtonPrimary>;
  }
  return (
    <ButtonSecondary onClick={() => setAccountModalOpen(true)}>
      <Wallet />
      {title}
    </ButtonSecondary>
  );
};

export default function Swap() {
  const {
    inputToken,
    setInputToken,
    outputToken,
    setOutputToken,
    balances,
    loading,
    pools,
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

  const swapToken = async () => {
    if (!inputToken || !outputToken) return;
    const swapContract = new SwapContract();
    await swapContract.swap({
      accountId: 'solniechniy.testnet',
      inputToken: inputToken.contract,
      outputToken: outputToken.contract,
      amount: '100000000000000000000',
      pools: [pools[4], pools[3]],
    });
  };

  const swapInformation = [
    {
      title: 'Minimum Recieved',
      label: '0.005053 USDT',
      color: false,
    },
    {
      title: 'Price Impact',
      label: '0.02%',
      color: true,
    },
    {
      title: 'Liquidity Provider Fee',
      label: '0.000000007477 ETH',
      color: false,
    },
    {
      title: 'Slippage Tolerance',
      label: '0.50%',
      color: false,
    },
  ];

  return (
    <Container>
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
          disabled
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
        <RenderSettings isSettingsOpen={isSettingsOpen} />
        <SettingsHeader>
          <SettingsLabel
            isActive={isSettingsOpen}
            onClick={() => (setIsSettingsOpen(!isSettingsOpen))}
          >
            <span>Settings</span>
            <ArrowDown />
          </SettingsLabel>
        </SettingsHeader>
      </SettingsBlock>
      {
        inputTokenValue && (
        <SwapInformation>
          <RouteBlock>
            <TitleInfo>Route <LogoInfo /> </TitleInfo>
            <div> ETH {'>'} USDT {'>'} NEAR </div>
          </RouteBlock>
          {swapInformation.map((el) => (
            <RowInfo key={el.title}>
              <TitleInfo>{el.title} <LogoInfo /></TitleInfo>
              <LabelInfo isColor={el.color}>{el.label}</LabelInfo>
            </RowInfo>
          ))}
        </SwapInformation>
        )
      }
      <RenderButton
        isConnected={isConnected}
        swapToken={swapToken}
        title={title}
        setAccountModalOpen={setAccountModalOpen}
      />
    </Container>
  );
}
