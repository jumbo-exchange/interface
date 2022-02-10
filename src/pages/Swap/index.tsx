import React, { useCallback, useState, useEffect } from 'react';
import { ButtonPrimary, ButtonSecondary } from 'components/Button';
import { wallet } from 'services/near';
import { getUpperCase } from 'utils';
import {
  useStore, useModalsStore, TokenType, NEAR_TOKEN_ID,
} from 'store';
import { FEE_DIVISOR, SLIPPAGE_TOLERANCE_DEFAULT } from 'utils/constants';
import SwapContract from 'services/SwapContract';
import useDebounce from 'hooks/useDebounce';
import {
  formatTokenAmount, parseTokenAmount, removeTrailingZeros,
  percentLess, checkInvalidAmount, formatBalance,
} from 'utils/calculations';
import FungibleTokenContract from 'services/FungibleToken';
import getConfig from 'services/config';
import Big from 'big.js';

import { calculatePriceImpact } from 'services/swap';
import { useUpdatePoolsService } from 'services/updatePoolService';
import Input from './SwapInput';
import SwapSettings from './SwapSettings';
import RenderWarning from './SwapWarning';
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
  LabelError,
  LogoInfo,
  TokenImg,
  RouteArrowLogo,
  BlockButton,
  IconSwap,
} from './styles';

const swapContract = new SwapContract();
const DEBOUNCE_VALUE = 1000;

const RenderButton = ({
  isConnected,
  swapToken,
  setAccountModalOpen,
  disabled = false,
}:{
  isConnected:boolean,
  swapToken:() => void,
  setAccountModalOpen: (isOpen: boolean) => void,
  disabled?: boolean
}) => {
  const title = isConnected ? 'Swap' : 'Connect Wallet';
  if (isConnected) {
    return (
      <ButtonPrimary
        onClick={swapToken}
        disabled={disabled}
      >{title} <IconSwap />
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
    currentPools,
    tokens,
    updatePools,
  } = useStore();
  const config = getConfig();

  const { setAccountModalOpen, setSearchModalOpen } = useModalsStore();
  const [independentField, setIndependentField] = useState(TokenType.Input);
  const [inputTokenValue, setInputTokenValue] = useState<string>('');
  const debouncedInputValue = useDebounce(inputTokenValue, DEBOUNCE_VALUE);
  const [outputTokenValue, setOutputTokenValue] = useState<string>('');
  const debouncedOutputValue = useDebounce(outputTokenValue, DEBOUNCE_VALUE);

  const [slippageTolerance, setSlippageTolerance] = useState<string>(SLIPPAGE_TOLERANCE_DEFAULT);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [averageFee, setAverageFee] = useState<string>('0');

  const isConnected = wallet.isSignedIn();

  const minAmountOut = outputTokenValue
    ? percentLess(slippageTolerance, outputTokenValue, 0)
    : '';
  const priceImpact = calculatePriceImpact(
    currentPools, inputToken, outputToken, inputTokenValue, tokens,
  );
  const openModal = useCallback(
    (tokenType: TokenType) => {
      setSearchModalOpen({ isOpen: true, tokenType });
      setIsSettingsOpen(false);
    },
    [],
  );

  useUpdatePoolsService(wallet, currentPools, updatePools);

  const changeToken = () => {
    const oldOutputToken = outputToken;
    setOutputToken(inputToken);
    setInputToken(oldOutputToken);
  };

  const verifyToken = (
    token: FungibleTokenContract,
  ) => {
    if (token.contractId === NEAR_TOKEN_ID) {
      const wrappedTokenId = config.nearAddress;
      return tokens[wrappedTokenId];
    } return token;
  };

  useEffect(() => {
    if (!inputToken || !outputToken || !debouncedInputValue) return;
    if (independentField === TokenType.Input) {
      const formattedValue = parseTokenAmount(debouncedInputValue, inputToken.metadata.decimals);
      const verifiedInputToken = verifyToken(inputToken);
      const verifiedOutputToken = verifyToken(outputToken);
      const minOutput = SwapContract.getReturnForPools(
        currentPools,
        formattedValue,
        verifiedInputToken,
        verifiedOutputToken,
        tokens,
      );
      const lastIndex = minOutput.length - 1;
      setOutputTokenValue(
        removeTrailingZeros(
          formatTokenAmount(
            minOutput[lastIndex],
            verifiedOutputToken.metadata.decimals,
          ),
        ),
      );
    }
  }, [debouncedInputValue, inputToken, outputToken]);

  useEffect(() => {
    if (!inputToken || !outputToken || !debouncedOutputValue) return;
    if (independentField === TokenType.Output) {
      const formattedValue = parseTokenAmount(debouncedOutputValue, outputToken.metadata.decimals);
      const verifiedInputToken = verifyToken(inputToken);
      const verifiedOutputToken = verifyToken(outputToken);
      const minOutput = SwapContract.getReturnForPools(
        currentPools,
        formattedValue,
        verifiedOutputToken,
        verifiedInputToken,
        tokens,
      );
      const lastIndex = minOutput.length - 1;
      setInputTokenValue(
        removeTrailingZeros(
          formatTokenAmount(
            minOutput[lastIndex],
            verifiedInputToken.metadata.decimals,
          ),
        ),
      );
    }
  }, [debouncedOutputValue, inputToken, outputToken]);

  useEffect(() => {
    const newAverageFee = Big(currentPools.reduce((acc, item) => acc + item.totalFee, 0))
      .div(FEE_DIVISOR).toFixed(4);

    if (newAverageFee !== averageFee) setAverageFee(removeTrailingZeros(newAverageFee));
  }, [currentPools]);

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
      tokens,
      slippageAmount: slippageTolerance,
    });
  };

  const intersectionTokenId = currentPools.length === 2
    ? currentPools[0].tokenAccountIds.find((el) => el !== inputToken?.contractId) : null;

  const intersectionToken = tokens[intersectionTokenId ?? ''] ?? null;

  const canSwap = !!slippageTolerance
    && (!!inputTokenValue && !!outputTokenValue)
    && currentPools.length > 0;
  const isWrap = inputToken && outputToken
    && (inputToken.contractId === config.nearAddress && outputToken.contractId === NEAR_TOKEN_ID);
  const isUnwrap = inputToken && outputToken
    && (outputToken.contractId === config.nearAddress && inputToken.contractId === NEAR_TOKEN_ID);
  const invalidInput = checkInvalidAmount(balances, inputToken, inputTokenValue);

  const [exchangeAmount, setExchangeAmount] = useState<string>('');

  useEffect(() => {
    if (!inputToken || !outputToken) return;
    const formattedValue = parseTokenAmount('1', outputToken.metadata.decimals);
    const verifiedInputToken = verifyToken(inputToken);
    const verifiedOutputToken = verifyToken(outputToken);
    const minOutput = SwapContract.getReturnForPools(
      currentPools,
      formattedValue,
      verifiedOutputToken,
      verifiedInputToken,
      tokens,
    );
    const lastIndex = minOutput.length - 1;
    setExchangeAmount(
      formatTokenAmount(
        minOutput[lastIndex],
        verifiedInputToken.metadata.decimals,
        5,
      ),
    );
  }, [inputToken, outputToken]);

  const exchangeLabel = `
  1 ${getUpperCase(inputToken?.metadata.symbol ?? '')} 
  ≈ ${removeTrailingZeros(exchangeAmount)} ${getUpperCase(outputToken?.metadata.symbol ?? '')}
  `;

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
      <RenderWarning />
      <SettingsBlock>
        <SwapSettings
          slippageTolerance={slippageTolerance}
          setSlippageTolerance={setSlippageTolerance}
          isSettingsOpen={isSettingsOpen}
        />
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
        currentPools.length
        && outputTokenValue && Big(outputTokenValue ?? 0).gt(0)
        && inputTokenValue && Big(inputTokenValue ?? 0).gt(0)
          ? (
            <SwapInformation>
              <RouteBlock>
                <TitleInfo>Route <LogoInfo /></TitleInfo>
                <div>
                  <TokenImg
                    src={inputToken?.metadata.icon}
                    alt={inputToken?.metadata.symbol}
                  />
                  {inputToken?.metadata.symbol}
                  {intersectionTokenId
                    ? (
                      <>
                        <RouteArrowLogo />
                        <TokenImg
                          src={intersectionToken?.metadata.icon}
                          alt={intersectionToken?.metadata.symbol}
                        />
                        {intersectionToken?.metadata.symbol}
                      </>
                    ) // TODO: check correct display
                    : null}
                  <RouteArrowLogo />
                  <TokenImg
                    src={outputToken?.metadata.icon}
                    alt={outputToken?.metadata.symbol}
                  />
                  {outputToken?.metadata.symbol}
                </div>
              </RouteBlock>
              <RowInfo>
                <TitleInfo>Minimum Received<LogoInfo /></TitleInfo>
                <LabelInfo>{minAmountOut} {outputToken?.metadata.symbol}</LabelInfo>
              </RowInfo>
              <RowInfo>
                <TitleInfo>Price Impact<LogoInfo /></TitleInfo>
                {
                  Number(formatBalance(priceImpact)) > 2
                    ? <LabelError>{formatBalance(priceImpact)}%</LabelError>
                    : <LabelInfo isColor>{formatBalance(priceImpact)}%</LabelInfo>
                }
              </RowInfo>
              <RowInfo>
                <TitleInfo>Liquidity Provider Fee<LogoInfo /></TitleInfo>
                <LabelInfo>{averageFee}%</LabelInfo>
              </RowInfo>
              <RowInfo>
                <TitleInfo>Slippage Tolerance<LogoInfo /></TitleInfo>
                <LabelInfo>{slippageTolerance}%</LabelInfo>
              </RowInfo>
            </SwapInformation>
          ) : null
      }
      <BlockButton>
        <RenderButton
          isConnected={isConnected}
          swapToken={swapToken}
          setAccountModalOpen={setAccountModalOpen}
          disabled={(!canSwap && !isWrap && !isUnwrap) || invalidInput}
        />
      </BlockButton>

    </Container>
  );
}
