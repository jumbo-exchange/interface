import React, { useState } from 'react';
import tokenLogo from 'assets/images-app/placeholder-token.svg';
import PoolContract from 'services/PoolContract';
import { useModalsStore, useStore } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import { ButtonPrimary } from 'components/Button';
import { useNavigate } from 'react-router-dom';
import { formatAmount, getUpperCase } from 'utils';
import { calculateFairShare, toNonDivisibleNumber, formatBalance } from 'utils/calculations';
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
  const CheckTotalSupply = pool?.sharesTotalSupply === '0' ? '1' : pool?.sharesTotalSupply;

  const minAmount = Object.entries(pool.supplies).reduce<{
    [tokenId: string]: string;
  }>((acc, [tokenId, totalSupply]) => {
    acc[tokenId] = calculateFairShare(
      totalSupply,
      withdrawValue ? toNonDivisibleNumber(24, withdrawValue) : '0',
      CheckTotalSupply,
    );
    return acc;
  }, {});

  const [inputToken, outputToken] = Object.entries(minAmount).map((el) => el);
  const tokensData = [
    {
      token: tokenInput,
      value: formatAmount(inputToken[1], tokenInput.metadata.decimals),
    },
    {
      token: tokenOutput,
      value: formatAmount(outputToken[1], tokenOutput.metadata.decimals),
    },
  ];

  const onChange = () => {
    const withdrawValueBN = new Big(withdrawValue);
    const shareBN = new Big(formatAmount(pool?.shares ?? '', 24));
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
        shares: withdrawValue,
        minAmount,
      });
    }
  };

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
              shares={formatAmount(pool?.shares ?? '', 24)}
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
                    <p>{formatBalance(value)}</p>
                    &nbsp;
                    <p>{getUpperCase(token?.metadata.symbol ?? '')}</p>
                  </TokenValueBlock>
                </TokenBlock>
              ))}
            </WithdrawTokenBlock>
            <ButtonPrimary
              onClick={onChange}
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
