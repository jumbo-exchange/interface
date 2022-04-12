import React, { useCallback, useState, useEffect } from 'react';
import RenderButton from 'components/Button/RenderButton';
import {
  getPoolsPath, getUpperCase, saveSwapTokens, toArray,
} from 'utils';
import {
  useStore, TokenType, CurrentButton,
} from 'store';
import {
  BAD_PRICE_IMPACT, FEE_DIVISOR, NEAR_TOKEN_ID, SLIPPAGE_TOLERANCE_DEFAULT,
} from 'utils/constants';
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
import { useTranslation } from 'react-i18next';

import Refresh from 'components/Refresh';
import { useRefresh } from 'services/refreshService';
import Tooltip from 'components/Tooltip';
import useNavigateSwapParams from 'hooks/useNavigateSwapParams';
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
  SettingsHeader,
  ExchangeLabel,
  SettingsBlock,
  SettingsLabel,
  SwapInformation,
  RouteBlock,
  TitleInfo,
  RowInfo,
  LabelInfo,
  LabelError,
  LogoContainer,
  RouteArrowLogo,
  BlockButton,
} from './styles';

const swapContract = new SwapContract();
const DEBOUNCE_VALUE = 1000;

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
    pools,
    setCurrentPools,
  } = useStore();
  const config = getConfig();
  const navigate = useNavigateSwapParams();
  const { setTrackedPools } = useRefresh();
  const { t } = useTranslation();
  const [independentField, setIndependentField] = useState(TokenType.Input);
  const [inputTokenValue, setInputTokenValue] = useState<string>('');
  const debouncedInputValue = useDebounce(inputTokenValue, DEBOUNCE_VALUE);
  const [outputTokenValue, setOutputTokenValue] = useState<string>('');
  const debouncedOutputValue = useDebounce(outputTokenValue, DEBOUNCE_VALUE);

  const [slippageTolerance, setSlippageTolerance] = useState<string>(SLIPPAGE_TOLERANCE_DEFAULT);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [averageFee, setAverageFee] = useState<string>('0');

  const minAmountOut = outputTokenValue
    ? removeTrailingZeros(percentLess(slippageTolerance, outputTokenValue, 5))
    : '';
  const priceImpact = calculatePriceImpact(
    currentPools, inputToken, outputToken, inputTokenValue, tokens,
  );
  const roundPriceImpact = removeTrailingZeros(formatBalance(priceImpact));

  const verifyToken = useCallback((
    token: FungibleTokenContract,
  ) => {
    if (token.contractId === NEAR_TOKEN_ID) {
      const wrappedTokenId = config.nearAddress;
      return tokens[wrappedTokenId];
    } return token;
  }, [config.nearAddress, tokens]);

  useEffect(() => {
    if (!inputToken || !outputToken || !debouncedInputValue) return;
    if (independentField === TokenType.Input) {
      const formattedValue = parseTokenAmount(debouncedInputValue, inputToken.metadata.decimals);
      const verifiedInputToken = verifyToken(inputToken);
      const verifiedOutputToken = verifyToken(outputToken);
      try {
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
        return;
      } catch (e) {
        setOutputTokenValue('0');
      }
    }
  }, [debouncedInputValue, inputToken, outputToken]);

  useEffect(() => {
    if (!inputToken || !outputToken || !debouncedOutputValue) return;
    if (independentField === TokenType.Output) {
      const formattedValue = parseTokenAmount(debouncedOutputValue, outputToken.metadata.decimals);
      const verifiedInputToken = verifyToken(inputToken);
      const verifiedOutputToken = verifyToken(outputToken);
      try {
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
        return;
      } catch (e) {
        setOutputTokenValue('0');
      }
    }
  }, [debouncedOutputValue, inputToken, outputToken]);

  useEffect(() => {
    const newAverageFee = Big(currentPools.reduce((acc, item) => acc + item.totalFee, 0))
      .div(FEE_DIVISOR).toFixed(4);

    if (newAverageFee !== averageFee) setAverageFee(removeTrailingZeros(newAverageFee));
    setTrackedPools(currentPools);
  }, [currentPools, averageFee, setTrackedPools]);

  const handleInputChange = useCallback(
    (value: string) => {
      if (value === '') {
        setOutputTokenValue('');
      }
      setIndependentField(TokenType.Input);
      setInputTokenValue(value);
    }, [],
  );

  const handleOutputChange = useCallback(
    (value: string) => {
      if (value === '') {
        setInputTokenValue('');
      }
      setIndependentField(TokenType.Output);
      setOutputTokenValue(value);
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

  const poolPathToken = getPoolsPath(
    inputToken?.contractId ?? '',
    outputToken?.contractId ?? '',
    toArray(pools),
    tokens,
  );
  const isMissingShares = poolPathToken.some((el) => new Big(el.sharesTotalSupply).eq(0));

  const canSwap = !!slippageTolerance
    && (!!inputTokenValue && !!outputTokenValue)
    && currentPools.length > 0
    && !isMissingShares
    && Big(inputTokenValue).gt(0)
    && Big(outputTokenValue).gt(0);

  const isWrap = inputToken && outputToken
    && (inputToken.contractId === config.nearAddress && outputToken.contractId === NEAR_TOKEN_ID);
  const isUnwrap = inputToken && outputToken
    && (outputToken.contractId === config.nearAddress && inputToken.contractId === NEAR_TOKEN_ID);
  const invalidInput = checkInvalidAmount(balances, inputToken, inputTokenValue);

  const [exchangeAmount, setExchangeAmount] = useState<string>('');

  useEffect(() => {
    if (!inputToken || !outputToken) return;
    const formattedValue = parseTokenAmount('1', inputToken.metadata.decimals);
    const verifiedInputToken = verifyToken(inputToken);
    const verifiedOutputToken = verifyToken(outputToken);
    try {
      const minOutput = SwapContract.getReturnForPools(
        currentPools,
        formattedValue,
        verifiedInputToken,
        verifiedOutputToken,
        tokens,
      );

      const lastIndex = minOutput.length - 1;
      setExchangeAmount(
        removeTrailingZeros(
          formatTokenAmount(
            minOutput[lastIndex],
            verifiedOutputToken.metadata.decimals,
            5,
          ),
        ),
      );
      setInputTokenValue('');
      setOutputTokenValue('');
    } catch (e) {
      console.warn(e);
    }
  }, [loading, inputToken, outputToken, currentPools, tokens, verifyToken]);

  const exchangeLabel = (inputToken && outputToken)
    ? `
  1 ${getUpperCase(inputToken?.metadata.symbol ?? '')} 
  ≈ ${exchangeAmount} ${getUpperCase(outputToken?.metadata.symbol ?? '')}
  `
    : 'Loading...';

  const swapTokens = () => {
    const poolArray = toArray(pools);
    if (!inputToken || !outputToken || inputToken === outputToken) return;
    navigate(outputToken.metadata.symbol, inputToken.metadata.symbol);
    saveSwapTokens(outputToken.contractId, inputToken.contractId);
    setInputToken(outputToken);
    setOutputToken(inputToken);

    const availablePools = getPoolsPath(
      outputToken.contractId, inputToken.contractId, poolArray, tokens,
    );
    setCurrentPools(availablePools);
  };

  return (
    <Container>
      <ActionContainer>
        <Input
          token={inputToken}
          tokenType={TokenType.Input}
          value={inputTokenValue}
          setValue={handleInputChange}
          balance={balances[inputToken?.contractId ?? '']}
        />
        <ChangeTokenContainer onClick={swapTokens}>
          <ChangeTokenLogo />
          <span>{t('swap.changeDirection')}</span>
        </ChangeTokenContainer>
        <Input
          token={outputToken}
          tokenType={TokenType.Output}
          value={outputTokenValue}
          setValue={handleOutputChange}
          balance={balances[outputToken?.contractId ?? '']}
        />
      </ActionContainer>
      <ExchangeBlock>
        <Refresh />
        <ExchangeLabel>
          {loading ? `${t('common.loading')}...` : <div>{exchangeLabel}</div>}
        </ExchangeLabel>
      </ExchangeBlock>
      <RenderWarning
        priceImpact={priceImpact}
      />
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
            <span>{t('swap.settings')}</span>
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
                <TitleInfo>
                  {t('swap.route')}
                  <Tooltip title={t('tooltipTitle.routes')} />
                </TitleInfo>
                <div>
                  <LogoContainer>
                    <img
                      src={inputToken?.metadata.icon}
                      alt={inputToken?.metadata.symbol}
                    />
                  </LogoContainer>
                  {inputToken?.metadata.symbol}
                  {intersectionTokenId
                    ? (
                      <>
                        <RouteArrowLogo />
                        <LogoContainer>
                          <img
                            src={intersectionToken?.metadata.icon}
                            alt={intersectionToken?.metadata.symbol}
                          />
                        </LogoContainer>
                        {intersectionToken?.metadata.symbol}
                      </>
                    )
                    : null}
                  <RouteArrowLogo />
                  <LogoContainer>
                    <img
                      src={outputToken?.metadata.icon}
                      alt={outputToken?.metadata.symbol}
                    />
                  </LogoContainer>
                  {outputToken?.metadata.symbol}
                </div>
              </RouteBlock>
              <RowInfo>
                <TitleInfo>
                  {t('swap.minimumReceived')}
                  <Tooltip title={t('tooltipTitle.minimumReceived')} />
                </TitleInfo>
                <LabelInfo>{minAmountOut} {outputToken?.metadata.symbol}</LabelInfo>
              </RowInfo>
              <RowInfo>
                <TitleInfo>
                  {t('swap.priceImpact')}
                  <Tooltip title={t('tooltipTitle.priceImpact')} />
                </TitleInfo>
                {
                  Big(priceImpact).gt(BAD_PRICE_IMPACT)
                    ? <LabelError>{roundPriceImpact}%</LabelError>
                    : <LabelInfo active>{roundPriceImpact}%</LabelInfo>
                }
              </RowInfo>
              <RowInfo>
                <TitleInfo>
                  {t('swap.liquidityProviderFee')}
                  <Tooltip title={t('tooltipTitle.liquidityProviderFee')} />
                </TitleInfo>
                <LabelInfo>{averageFee}%</LabelInfo>
              </RowInfo>
              <RowInfo>
                <TitleInfo>
                  {t('swap.slippageTolerance')}
                  <Tooltip title={t('tooltipTitle.slippageTolerance')} />
                </TitleInfo>
                <LabelInfo>{slippageTolerance}%</LabelInfo>
              </RowInfo>
            </SwapInformation>
          ) : null
      }
      <BlockButton>
        <RenderButton
          typeButton={CurrentButton.Swap}
          onSubmit={swapToken}
          disabled={(!canSwap && !isWrap && !isUnwrap) || invalidInput}
        />
      </BlockButton>

    </Container>
  );
}
