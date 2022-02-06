import React, { useState } from 'react';
import tokenLogo from 'assets/images-app/placeholder-token.svg';
import PoolContract from 'services/PoolContract';
import { useModalsStore, useStore } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import { ButtonPrimary } from 'components/Button';
import { useNavigate } from 'react-router-dom';
import { getUpperCase } from 'utils';
import {
  calculateFairShare,
  toNonDivisibleNumber,
  formatBalance,
  formatTokenAmount,
  removeTrailingZeros,
  percentLess,
  parseTokenAmount,
} from 'utils/calculations';
import Big from 'big.js';
import Input from './Input';
import {
  Layout, ModalBlock, ModalIcon,
} from '../styles';
import {
  LiquidityModalContainer,
  ModalTitle,
  ModalBody,
  TitleAction,
  WithdrawTokenBlock,
  TokenLogo,
  TokenBlock,
  TokenValueBlock,
} from './styles';

export const POOL_SHARES_DECIMALS = 24;

export default function RemoveLiquidityModal() {
  const {
    tokens,
  } = useStore();

  const navigate = useNavigate();
  const { removeLiquidityModalOpenState, setRemoveLiquidityModalOpenState } = useModalsStore();
  const { pool } = removeLiquidityModalOpenState;

  const [withdrawValue, setWithdrawValue] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  if (!pool) return null;
  const [tokenInputName, tokenOutputName] = pool.tokenAccountIds;

  const tokenInput = tokens[tokenInputName] ?? null;
  const tokenOutput = tokens[tokenOutputName] ?? null;
  if (!tokenInput || !tokenOutput) return null;
  const checkTotalSupply = pool?.sharesTotalSupply === '0' ? '1' : pool?.sharesTotalSupply;

  const minAmounts = Object.entries(pool.supplies).reduce<{
    [tokenId: string]: string;
  }>((acc, [tokenId, totalSupply]) => {
    acc[tokenId] = percentLess(10, calculateFairShare(
      totalSupply,
      withdrawValue ? toNonDivisibleNumber(POOL_SHARES_DECIMALS, withdrawValue) : '0',
      checkTotalSupply,
    ), 0);
    return acc;
  }, {});
  const [inputToken, outputToken] = Object.entries(minAmounts).map((el) => el);
  const tokensData = [
    {
      token: tokenInput,
      value: formatTokenAmount(inputToken[1], tokenInput.metadata.decimals, 5),
    },
    {
      token: tokenOutput,
      value: formatTokenAmount(outputToken[1], tokenOutput.metadata.decimals, 5),
    },
  ];

  const onChange = () => {
    const withdrawValueBN = new Big(withdrawValue);
    const shareBN = new Big(formatTokenAmount(pool?.shares ?? '', POOL_SHARES_DECIMALS));
    if (Number(withdrawValue) === 0) {
      setError(true);
    }
    if (withdrawValueBN.gt(shareBN)) {
      setError(true);
    }
    if (!error) {
      const contract = new PoolContract();
      if (!tokenInput || !tokenOutput || !removeLiquidityModalOpenState.pool) return;
      contract.removeLiquidity({
        pool,
        shares: parseTokenAmount(withdrawValue, POOL_SHARES_DECIMALS),
        minAmounts,
      });
    }
  };
  const formattedPoolShares = formatTokenAmount(pool?.shares ?? '0', POOL_SHARES_DECIMALS);

  const buttonDisabled = withdrawValue
    ? (new Big(withdrawValue).lte(0) || new Big(withdrawValue).gt(formattedPoolShares)) : true;
  return (
    <>
      {removeLiquidityModalOpenState.isOpen && (
      <Layout onClick={() => {
        navigate('/app/pool');
        setRemoveLiquidityModalOpenState({ isOpen: false, pool: null });
      }}
      >
        <LiquidityModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              Withdraw
            </ModalTitle>
            <ModalIcon onClick={() => {
              navigate('/app/pool');
              setRemoveLiquidityModalOpenState({ isOpen: false, pool: null });
            }}
            >
              <Close />
            </ModalIcon>
          </ModalBlock>
          <ModalBody>
            <Input
              shares={formattedPoolShares}
              withdrawValue={withdrawValue}
              setWithdrawValue={setWithdrawValue}
            />
            <TitleAction>
              Withdrawal Amount
            </TitleAction>
            <WithdrawTokenBlock>
              {tokensData.map(({ token, value }) => (
                <TokenBlock key={token.contractId}>
                  <TokenLogo>
                    <img
                      src={token?.metadata.icon ?? tokenLogo}
                      alt={token?.metadata.symbol}
                    />
                  </TokenLogo>
                  <TokenValueBlock>
                    <p>{removeTrailingZeros(formatBalance(value)) }</p>
                    &nbsp;
                    <p>{getUpperCase(token?.metadata.symbol ?? '')}</p>
                  </TokenValueBlock>
                </TokenBlock>
              ))}
            </WithdrawTokenBlock>
            <ButtonPrimary
              onClick={onChange}
              disabled={buttonDisabled}
            >
              Withdraw
            </ButtonPrimary>
          </ModalBody>
        </LiquidityModalContainer>
      </Layout>
      )}
    </>
  );
}
