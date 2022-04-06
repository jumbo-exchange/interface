import React, { useEffect, useState, useMemo } from 'react';
import {
  useModalsStore, useStore, CurrentButton, PoolType,
} from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import PoolContract from 'services/PoolContract';
import RenderButton from 'components/Button/RenderButton';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  calculateFairShare,
  checkInvalidAmount,
  formatTokenAmount,
  toNonDivisibleNumber,
} from 'utils/calculations';
import { wallet } from 'services/near';
import {
  LP_TOKEN_DECIMALS,
  ZERO_AMOUNT, SMALL_SHARE,
  INITIAL_INPUT_PLACEHOLDER,
  SLIPPAGE_TOLERANCE_DEFAULT_ADD_STABLE_LIQ,
  slippageToleranceOptionsAddStableLiq,
  STABLE_LP_TOKEN_DECIMALS,
} from 'utils/constants';
import Big from 'big.js';
import Refresh from 'components/Refresh';
import { POOL } from 'utils/routes';
import SlippageBlock from 'components/SlippageBlock';
import {
  Layout, ModalBlock, ModalIcon, ModalTitle,
} from '../styles';
import Input from './Input';
import {
  LiquidityModalContainer,
  ModalBody,
  LogoContainerAdd,
  RefreshBlock,
  YourSharesBlock,
} from './styles';

export default function AddLiquidityModal() {
  const isConnected = wallet.isSignedIn();
  const {
    tokens,
    balances,
  } = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const contract = useMemo(() => new PoolContract(), []);
  const [inputTokenValue, setInputTokenValue] = useState<string>(INITIAL_INPUT_PLACEHOLDER);
  const [outputTokenValue, setOutputTokenValue] = useState<string>(INITIAL_INPUT_PLACEHOLDER);
  const [preShare, setPreShare] = useState<string>(INITIAL_INPUT_PLACEHOLDER);
  const [slippageTolerance, setSlippageTolerance] = useState<string>(
    SLIPPAGE_TOLERANCE_DEFAULT_ADD_STABLE_LIQ,
  );

  const { addLiquidityModalOpenState, setAddLiquidityModalOpenState } = useModalsStore();
  const { pool } = addLiquidityModalOpenState;

  useEffect(() => {
    if (inputTokenValue !== INITIAL_INPUT_PLACEHOLDER
      || outputTokenValue !== INITIAL_INPUT_PLACEHOLDER) {
      setInputTokenValue(INITIAL_INPUT_PLACEHOLDER);
      setOutputTokenValue(INITIAL_INPUT_PLACEHOLDER);
      setPreShare(INITIAL_INPUT_PLACEHOLDER);
    }
  }, [pool?.id]);

  if (!pool) return null;
  const [tokenInputName, tokenOutputName] = pool.tokenAccountIds;

  const tokenInput = tokens[tokenInputName] ?? null;
  const tokenOutput = tokens[tokenOutputName] ?? null;
  if (!tokenInput || !tokenOutput) return null;

  const [inputTokenSupplies, outputTokenSupplies] = Object.values(pool.supplies);
  const handleInputChange = (value: string) => {
    if (Object.values(pool.supplies).every((s) => s === '0')) {
      setInputTokenValue(value);
    } else {
      const fairShares = calculateFairShare(
        pool.sharesTotalSupply,
        toNonDivisibleNumber(tokenInput.metadata.decimals, value),
        inputTokenSupplies,
      );
      let outputValue = '';
      if (value) {
        outputValue = formatTokenAmount(
          calculateFairShare(
            outputTokenSupplies,
            fairShares,
            pool.sharesTotalSupply,
          ),
          tokenOutput.metadata.decimals,
        );
      }
      setInputTokenValue(value);
      setOutputTokenValue(outputValue);
      setPreShare(formatTokenAmount(fairShares, pool.lpTokenDecimals));
    }
  };

  const handleOutputChange = (value: string) => {
    if (Object.values(pool.supplies).every((s) => s === '0')) {
      setOutputTokenValue(value);
    } else {
      const fairShares = calculateFairShare(
        pool.sharesTotalSupply,
        toNonDivisibleNumber(tokenOutput.metadata.decimals, value),
        outputTokenSupplies,
      );
      let inputValue = '';
      if (value) {
        inputValue = formatTokenAmount(
          calculateFairShare(
            inputTokenSupplies,
            fairShares,
            pool.sharesTotalSupply,
          ),
          tokenInput.metadata.decimals,
        );
      }
      setOutputTokenValue(value);
      setInputTokenValue(inputValue);
      setPreShare(formatTokenAmount(fairShares, pool.lpTokenDecimals));
    }
  };

  const canAddLiquidity = isConnected
    && !!inputTokenValue
    && !!outputTokenValue
    && !checkInvalidAmount(balances, tokenInput, inputTokenValue)
    && !checkInvalidAmount(balances, tokenOutput, outputTokenValue)
    && Big(inputTokenValue).gt(ZERO_AMOUNT)
    && Big(outputTokenValue).gt(ZERO_AMOUNT);

  const shareDisplay = () => {
    let result = '';
    if (preShare && new Big(ZERO_AMOUNT).lt(preShare)) {
      const yourShareBig = new Big(preShare);
      if (yourShareBig.lt(SMALL_SHARE)) {
        result = '<0.001';
      } else {
        result = `≈ ${yourShareBig.toFixed(3)}`;
      }
    } else {
      result = ZERO_AMOUNT;
    }
    return result;
  };

  return (
    <>
      {addLiquidityModalOpenState.isOpen && (
      <Layout onClick={() => {
        navigate(POOL);
        setAddLiquidityModalOpenState({ isOpen: false, pool: null });
      }}
      >
        <LiquidityModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              {t('addLiquidityModal.addLiquidity')}
            </ModalTitle>
            <ModalIcon onClick={() => {
              navigate(POOL);
              setAddLiquidityModalOpenState({ isOpen: false, pool: null });
            }}
            >
              <Close />
            </ModalIcon>
          </ModalBlock>
          <ModalBody>
            <Input
              token={tokenInput}
              value={inputTokenValue}
              setValue={handleInputChange}
              balance={balances[tokenInput.contractId ?? '']}
            />
            <LogoContainerAdd />
            <Input
              token={tokenOutput}
              value={outputTokenValue}
              setValue={handleOutputChange}
              balance={balances[tokenOutput.contractId ?? '']}
            />
            {pool.type === PoolType.STABLE_SWAP ? (
              <SlippageBlock
                onChange={setSlippageTolerance}
                slippageValue={slippageTolerance}
                slippageToleranceOptions={slippageToleranceOptionsAddStableLiq}
              />
            ) : null}
            <YourSharesBlock>
              {t('addLiquidityModal.yourShares')}: &nbsp;
              <span>{shareDisplay()}</span>
            </YourSharesBlock>
            <RefreshBlock>
              <Refresh />
            </RefreshBlock>
            <RenderButton
              typeButton={CurrentButton.AddLiquidity}
              onSubmit={() => {
                if (!tokenInput || !tokenOutput || !pool) return;
                contract.addLiquidity({
                  tokenAmounts: [
                    { token: tokenInput, amount: inputTokenValue },
                    { token: tokenOutput, amount: outputTokenValue },
                  ],
                  pool,
                  slippage: slippageTolerance,
                });
              }}
              disabled={!canAddLiquidity}
            />
          </ModalBody>
        </LiquidityModalContainer>
      </Layout>
      )}
    </>
  );
}
