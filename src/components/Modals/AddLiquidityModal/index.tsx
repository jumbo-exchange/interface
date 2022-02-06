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
  removeTrailingZeros,
  toNonDivisibleNumber,
} from 'utils/calculations';

import {
  Layout, ModalBlock, ModalIcon,
} from '../styles';
import Input from './Input';
import {
  LiquidityModalContainer,
  ModalTitle,
  ModalBody,
  LogoContainerAdd,
  RefreshBlock,
  PlaceHolderGif,
  LogoButton,
} from './styles';

export default function AddLiquidityModal() {
  const {
    tokens,
    balances,
  } = useStore();
  const navigate = useNavigate();
  const [inputTokenValue, setInputTokenValue] = useState<string>('');
  const [outputTokenValue, setOutputTokenValue] = useState<string>('');

  const { addLiquidityModalOpenState, setAddLiquidityModalOpenState } = useModalsStore();
  const { pool } = addLiquidityModalOpenState;

  if (!pool) return null;
  const [tokenInputName, tokenOutputName] = pool.tokenAccountIds;

  const tokenInput = tokens[tokenInputName] ?? null;
  const tokenOutput = tokens[tokenOutputName] ?? null;
  if (!tokenInput || !tokenOutput) return null;

  const [inputTokenSupplies, outputTokenSupplies] = Object.entries(pool.supplies).map(
    (el) => el[1],
  );

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
        outputValue = removeTrailingZeros(
          formatTokenAmount(
            calculateFairShare(
              outputTokenSupplies,
              fairShares,
              pool.sharesTotalSupply,
            ),
            tokenOutput.metadata.decimals,
          ),
        );
      }
      setInputTokenValue(value);
      setOutputTokenValue(outputValue);
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
        inputValue = removeTrailingZeros(
          formatTokenAmount(
            calculateFairShare(
              inputTokenSupplies,
              fairShares,
              pool.sharesTotalSupply,
            ),
            tokenInput.metadata.decimals,
          ),
        );
      }
      setOutputTokenValue(value);
      setInputTokenValue(inputValue);
    }
  };

  const canAddLiquidity = !!inputTokenValue
  && !!outputTokenValue
  && !checkInvalidAmount(balances, tokenInput, inputTokenValue)
  && !checkInvalidAmount(balances, tokenOutput, outputTokenValue);

  return (
    <>
      {addLiquidityModalOpenState.isOpen && (
      <Layout onClick={() => {
        navigate('/app/pool');
        setAddLiquidityModalOpenState({ isOpen: false, pool: null });
      }}
      >
        <LiquidityModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              Add Liquidity
            </ModalTitle>
            <ModalIcon onClick={() => {
              navigate('/app/pool');
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
            <RefreshBlock>
              <PlaceHolderGif />
              Refresh
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
