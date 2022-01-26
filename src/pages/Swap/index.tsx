import React, { useCallback, useState, useEffect } from 'react';
import { ButtonPrimary, ButtonSecondary } from 'components/Button';
import { wallet } from 'services/near';
import { getUpperCase } from 'utils';
import { useStore, useModalsStore, TokenType } from 'store';
import SwapContract from 'services/SwapContract';
import useDebounce from 'hooks/useDebounce';
import { formatTokenAmount, parseTokenAmount } from 'services/FungibleToken';
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

const swapContract = new SwapContract();
const DEBOUNCE_VALUE = 1000;
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
  disabled = false,
}:{
  isConnected:boolean,
  swapToken:() => void,
  title: string,
  setAccountModalOpen: (isOpen: boolean) => void,
  disabled?: boolean
}) => {
  if (isConnected) {
    return <ButtonPrimary disabled={disabled} onClick={swapToken}>{title}</ButtonPrimary>;
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
    currentPools,
    tokens,
  } = useStore();

  const { setAccountModalOpen, setSearchModalOpen } = useModalsStore();
  const [independentField, setIndependentField] = useState(TokenType.Input);
  const [inputTokenValue, setInputTokenValue] = useState<string>('');
  const debouncedInputValue = useDebounce(inputTokenValue, DEBOUNCE_VALUE);
  const [outputTokenValue, setOutputTokenValue] = useState<string>('');
  const debouncedOutputValue = useDebounce(outputTokenValue, DEBOUNCE_VALUE);

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

  useEffect(() => {
    if (!inputToken || !outputToken || !debouncedInputValue) return;
    if (independentField === TokenType.Input) {
      const formattedValue = parseTokenAmount(debouncedInputValue, inputToken.metadata.decimals);
      swapContract.getReturnForPools(
        currentPools,
        formattedValue,
        inputToken,
        outputToken,
      ).then((minOutput) => {
        const lastIndex = minOutput.length - 1;
        setOutputTokenValue(
          formatTokenAmount(
            minOutput[lastIndex],
            outputToken.metadata.decimals,
            5,
          ),
        );
      });
    }
  }, [debouncedInputValue]);

  useEffect(() => {
    if (!inputToken || !outputToken || !debouncedOutputValue) return;
    if (independentField === TokenType.Output) {
      const formattedValue = parseTokenAmount(debouncedOutputValue, outputToken.metadata.decimals);
      swapContract.getReturnForPools(
        currentPools,
        formattedValue,
        outputToken,
        inputToken,
      ).then((minOutput) => {
        const lastIndex = minOutput.length - 1;
        setInputTokenValue(
          formatTokenAmount(
            minOutput[lastIndex],
            inputToken.metadata.decimals, 5,
          ),
        );
      });
    }
  }, [debouncedOutputValue]);

  const handleAmountChange = async (tokenType: TokenType, value: string) => {
    if (tokenType === TokenType.Input) {
      setInputTokenValue(value);
    } else {
      setOutputTokenValue(value);
    }
  };

  const handleInputChange = useCallback(
    (value: string) => {
      setIndependentField(TokenType.Input);
      handleAmountChange(TokenType.Input, value);
    }, [],
  );

  const handleOutputChange = useCallback(
    (value: string) => {
      setIndependentField(TokenType.Output);
      handleAmountChange(TokenType.Output, value);
    }, [],
  );

  const swapToken = async () => {
    if (!inputToken || !outputToken) return;
    const formattedValue = parseTokenAmount(inputTokenValue, inputToken.metadata.decimals);

    await swapContract.swap({
      inputToken,
      outputToken,
      amount: formattedValue,
      pools: currentPools,
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
  const intersectionToken = currentPools.length === 2
    ? currentPools[0].tokenAccountIds.find((el) => el !== inputToken?.contractId) : null;
  const isSwapAvailable = currentPools.length > 0;
  return (
    <Container>
      <ActionContainer>
        <Input
          openModal={openModal}
          token={inputToken}
          tokenType={TokenType.Input}
          value={inputTokenValue}
          setValue={handleInputChange}
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
          setValue={handleOutputChange}
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
        currentPools.length ? (
          <SwapInformation>
            <RouteBlock>
              <TitleInfo>Route <LogoInfo /></TitleInfo>
              <div>
                {inputToken?.metadata.symbol}
                {' '}
                {intersectionToken ? `> ${intersectionToken}` : null }
                {'> '}
                {outputToken?.metadata.symbol}
              </div>
            </RouteBlock>
            {swapInformation.map((el) => (
              <RowInfo key={el.title}>
                <TitleInfo>{el.title} <LogoInfo /></TitleInfo>
                <LabelInfo isColor={el.color}>{el.label}</LabelInfo>
              </RowInfo>
            ))}
          </SwapInformation>
        ) : null
      }
      <RenderButton
        isConnected={isConnected}
        swapToken={swapToken}
        title={title}
        setAccountModalOpen={setAccountModalOpen}
        disabled={!isSwapAvailable}
      />
    </Container>
  );
}
