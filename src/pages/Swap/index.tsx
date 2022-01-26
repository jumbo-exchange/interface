import React, { useCallback, useState } from 'react';
import { ButtonPrimary, ButtonSecondary } from 'components/Button';
import { wallet } from 'services/near';
import { getUpperCase } from 'utils';
import { useStore, useModalsStore, TokenType } from 'store';
import { SLIPPAGE_TOLERANCE_DEFAULT } from 'utils/constants';
import SwapContract from 'services/SwapContract';
import Input from './SwapInput';
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

const RenderButton = ({
  disabled,
  isConnected,
  swapToken,
  setAccountModalOpen,
}:{
  disabled:boolean,
  isConnected:boolean,
  swapToken:() => void,
  setAccountModalOpen: (isOpen: boolean) => void,
}) => {
  const title = isConnected ? 'Swap' : 'Connect wallet';

  if (isConnected) {
    return (
      <ButtonPrimary
        onClick={swapToken}
        disabled={disabled}
      >{title}
      </ButtonPrimary>
    );
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

  const [slippageTolerance, setSlippageTolerance] = useState<string>(SLIPPAGE_TOLERANCE_DEFAULT);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const canSwap = !!slippageTolerance && (!!inputTokenValue && !!outputTokenValue);

  const isConnected = wallet.isSignedIn();
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
      amount: '10000000000',
      pools: [pools[3]],
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
      label: `${slippageTolerance}%`,
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
        {
          isSettingsOpen
            ? (
              <SwapSettings
                slippageTolerance={slippageTolerance}
                setSlippageTolerance={setSlippageTolerance}
              />
            ) : null
        }
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
        (inputTokenValue || outputTokenValue) && (
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
        disabled={!canSwap}
        isConnected={isConnected}
        swapToken={swapToken}
        setAccountModalOpen={setAccountModalOpen}
      />
    </Container>
  );
}
