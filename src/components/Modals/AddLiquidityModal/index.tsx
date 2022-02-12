import React, { useState } from 'react';
import { useModalsStore, useStore } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import { ButtonPrimary } from 'components/Button';
import PoolContract from 'services/PoolContract';
import { useNavigate } from 'react-router-dom';
import {
  calculateFairShare,
  checkInvalidAmount,
  formatTokenAmount,
  toNonDivisibleNumber,
} from 'utils/calculations';
import { wallet } from 'services/near';
import { POOL_SHARES_DECIMALS } from 'utils/constants';
import Big from 'big.js';
import Refresh from 'components/Refresh';
import { POOL } from 'utils/routes';
import {
  Layout, ModalBlock, ModalIcon, ModalTitle,
} from '../styles';
import Input from './Input';
import {
  LiquidityModalContainer,
  ModalBody,
  LogoContainerAdd,
  RefreshBlock,
  PlaceHolderGif,
  LogoButton,
  YourSharesBlock,
} from './styles';

export default function AddLiquidityModal() {
  const isConnected = wallet.isSignedIn();
  const {
    tokens,
    balances,
  } = useStore();
  const navigate = useNavigate();
  const [inputTokenValue, setInputTokenValue] = useState<string>('');
  const [outputTokenValue, setOutputTokenValue] = useState<string>('');
  const [preShare, setPreShare] = useState<string>('');

  const { addLiquidityModalOpenState, setAddLiquidityModalOpenState } = useModalsStore();
  const { pool } = addLiquidityModalOpenState;

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
      setPreShare(formatTokenAmount(fairShares, POOL_SHARES_DECIMALS));
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
      console.log('value: ', value);
      console.log('inputValue: ', inputValue);
      setOutputTokenValue(value);
      setInputTokenValue(inputValue);
      setPreShare(formatTokenAmount(fairShares, POOL_SHARES_DECIMALS));
    }
  };

  const canAddLiquidity = isConnected
    && !!inputTokenValue
    && !!outputTokenValue
    && !checkInvalidAmount(balances, tokenInput, inputTokenValue)
    && !checkInvalidAmount(balances, tokenOutput, outputTokenValue);

  const shareDisplay = () => {
    let result = '';
    if (preShare && new Big('0').lt(preShare)) {
      const yourShareBig = new Big(preShare);
      if (yourShareBig.lt('0.001')) {
        result = '<0.001';
      } else {
        result = `≈ ${yourShareBig.toFixed(3)}`;
      }
    } else {
      result = '0';
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
              Add Liquidity
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
            <YourSharesBlock>
              You will get shares: &nbsp;
              <span>{shareDisplay()}</span>
            </YourSharesBlock>
            <RefreshBlock>
              <Refresh />
            </RefreshBlock>
            <ButtonPrimary
              disabled={!canAddLiquidity}
              onClick={() => {
                const contract = new PoolContract();
                if (!tokenInput || !tokenOutput || !pool) return;
                contract.addLiquidity({
                  tokenAmounts: [
                    { token: tokenInput, amount: inputTokenValue },
                    { token: tokenOutput, amount: outputTokenValue },
                  ],
                  pool,
                });
              }}
            >
              <LogoButton />
              Add Liquidity
            </ButtonPrimary>
          </ModalBody>
        </LiquidityModalContainer>
      </Layout>
      )}
    </>
  );
}
