import React, { useState } from 'react';
import tokenLogo from 'assets/images-app/placeholder-token.svg';
import PoolContract from 'services/PoolContract';
import Big from 'big.js';

import RenderButton from 'components/Button/RenderButton';

import {
  slippageToleranceOptions,
  SLIPPAGE_TOLERANCE_DEFAULT,
} from 'utils/constants';
import { useModalsStore, useStore, CurrentButton } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
import { useNavigate } from 'react-router-dom';
import { getUpperCase } from 'utils';
import { useTranslation } from 'react-i18next';
import {
  calculateFairShare,
  toNonDivisibleNumber,
  formatBalance,
  formatTokenAmount,
  removeTrailingZeros,
  percentLess,
  parseTokenAmount,
} from 'utils/calculations';
import { wallet } from 'services/near';
import { POOL } from 'utils/routes';
import SlippageBlock from 'components/SlippageBlock';
import InputSharesContainer from 'components/CurrencyInputPanel/InputSharesContainer';
import {
  Layout, ModalBlock, ModalIcon, ModalTitle,
} from '../styles';
import {
  LiquidityModalContainer,
  ModalBody,
  TitleAction,
  WithdrawTokenBlock,
  LogoContainer,
  TokenBlock,
  TokenValueBlock,
} from './styles';

export default function RemoveLiquidityModal() {
  const isConnected = wallet.isSignedIn();
  const {
    tokens,
  } = useStore();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { removeLiquidityModalOpenState, setRemoveLiquidityModalOpenState } = useModalsStore();
  const { pool, isOpen } = removeLiquidityModalOpenState;

  const [withdrawValue, setWithdrawValue] = useState<string>('');
  const [slippageTolerance, setSlippageTolerance] = useState<string>(SLIPPAGE_TOLERANCE_DEFAULT);

  if (!pool) return null;
  const [tokenInputName, tokenOutputName] = pool.tokenAccountIds;

  const tokenInput = tokens[tokenInputName] ?? null;
  const tokenOutput = tokens[tokenOutputName] ?? null;
  if (!tokenInput || !tokenOutput) return null;
  const checkTotalSupply = pool?.sharesTotalSupply === '0' ? '1' : pool?.sharesTotalSupply;

  const minAmounts = Object.entries(pool.supplies).reduce<{
    [tokenId: string]: string;
  }>((acc, [tokenId, totalSupply]) => {
    acc[tokenId] = percentLess(slippageTolerance, calculateFairShare(
      totalSupply,
      withdrawValue ? toNonDivisibleNumber(pool.lpTokenDecimals, withdrawValue) : '0',
      checkTotalSupply,
    ), 0);
    return acc;
  }, {});
  const [inputToken, outputToken] = Object.values(minAmounts).map((el) => el);

  const tokensData = [
    {
      token: tokenInput,
      value: formatTokenAmount(inputToken, tokenInput.metadata.decimals),
    },
    {
      token: tokenOutput,
      value: formatTokenAmount(outputToken, tokenOutput.metadata.decimals),
    },
  ];

  const onSubmit = () => {
    const shareBN = new Big(formatTokenAmount(pool?.shares ?? '', pool.lpTokenDecimals));
    if (
      Big(withdrawValue).eq(0)
      || Big(withdrawValue).gt(shareBN)
      || !pool
    ) return;

    const contract = new PoolContract();
    if (!tokenInput || !tokenOutput || !pool) return;
    contract.removeLiquidity({
      pool,
      shares: parseTokenAmount(withdrawValue, pool.lpTokenDecimals),
      minAmounts,
    });
  };

  const formattedPoolShares = formatTokenAmount(pool?.shares ?? '0', pool.lpTokenDecimals);

  const buttonDisabled = isConnected
    && withdrawValue
    ? (new Big(withdrawValue).lte(0)
    || new Big(withdrawValue).gt(formattedPoolShares))
    : true;

  return (
    <>
      {isOpen && (
      <Layout onClick={() => {
        navigate(POOL);
        setRemoveLiquidityModalOpenState({ isOpen: false, pool: null });
      }}
      >
        <LiquidityModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              {t('removeLiquidityModal.withdraw')}
            </ModalTitle>
            <ModalIcon onClick={() => {
              navigate(POOL);
              setRemoveLiquidityModalOpenState({ isOpen: false, pool: null });
            }}
            >
              <Close />
            </ModalIcon>
          </ModalBlock>
          <ModalBody>
            <InputSharesContainer
              shares={formattedPoolShares}
              value={withdrawValue}
              setValue={setWithdrawValue}
            />
            <SlippageBlock
              onChange={setSlippageTolerance}
              slippageValue={slippageTolerance}
              slippageToleranceOptions={slippageToleranceOptions}
            />
            <TitleAction>
              {t('removeLiquidityModal.withdrawalAmount')}
            </TitleAction>
            <WithdrawTokenBlock>
              {tokensData.map(({ token, value }) => (
                <TokenBlock key={token.contractId}>
                  <LogoContainer>
                    <img
                      src={token?.metadata.icon ?? tokenLogo}
                      alt={token?.metadata.symbol}
                    />
                  </LogoContainer>
                  <TokenValueBlock>
                    <p>{removeTrailingZeros(formatBalance(value)) }</p>
                    &nbsp;
                    <p>{getUpperCase(token?.metadata.symbol ?? '')}</p>
                  </TokenValueBlock>
                </TokenBlock>
              ))}
            </WithdrawTokenBlock>
            <RenderButton
              typeButton={CurrentButton.Withdraw}
              onSubmit={onSubmit}
              disabled={buttonDisabled}
            />
          </ModalBody>
        </LiquidityModalContainer>
      </Layout>
      )}
    </>
  );
}
