import React, { useState } from 'react';
import tokenLogo from 'assets/images-app/placeholder-token.svg';
import PoolContract from 'services/PoolContract';
import Big from 'big.js';
import Toggle from 'components/Toggle';
import Tooltip from 'components/Tooltip';
import RenderButton from 'components/Button/RenderButton';

import {
  COEFFICIENT_SLIPPAGE,
  MAX_SLIPPAGE_TOLERANCE,
  MIN_SLIPPAGE_TOLERANCE,
  slippageToleranceOptions,
  SLIPPAGE_TOLERANCE_DEFAULT,
  tooltipTitle,
  POOL_SHARES_DECIMALS,
} from 'utils/constants';
import { useModalsStore, useStore, CurrentButton } from 'store';
import { ReactComponent as Close } from 'assets/images-app/close.svg';
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
import { wallet } from 'services/near';
import { POOL } from 'utils/routes';
import Input from './Input';
import {
  Layout, ModalBlock, ModalIcon, ModalTitle,
} from '../styles';
import {
  LiquidityModalContainer,
  ModalBody,
  TitleAction,
  WithdrawTokenBlock,
  TokenLogo,
  TokenBlock,
  TokenValueBlock,
  SlippageBlock,
  Warning,
} from './styles';

export default function RemoveLiquidityModal() {
  const isConnected = wallet.isSignedIn();
  const {
    tokens,
  } = useStore();

  const navigate = useNavigate();
  const { removeLiquidityModalOpenState, setRemoveLiquidityModalOpenState } = useModalsStore();
  const { pool } = removeLiquidityModalOpenState;

  const [withdrawValue, setWithdrawValue] = useState<string>('');
  const [warning, setWarning] = useState<boolean>(false);
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
      withdrawValue ? toNonDivisibleNumber(POOL_SHARES_DECIMALS, withdrawValue) : '0',
      checkTotalSupply,
    ), 0);
    return acc;
  }, {});
  const [inputToken, outputToken] = Object.values(minAmounts).map((el) => el);

  const tokensData = [
    {
      token: tokenInput,
      value: formatTokenAmount(inputToken, tokenInput.metadata.decimals, 5),
    },
    {
      token: tokenOutput,
      value: formatTokenAmount(outputToken, tokenOutput.metadata.decimals, 5),
    },
  ];

  const onSubmit = () => {
    const withdrawValueBN = new Big(withdrawValue);
    const shareBN = new Big(formatTokenAmount(pool?.shares ?? '', POOL_SHARES_DECIMALS));
    if (Number(withdrawValue) === 0) return;
    if (withdrawValueBN.gt(shareBN)) return;

    const contract = new PoolContract();
    if (!tokenInput || !tokenOutput || !removeLiquidityModalOpenState.pool) return;
    contract.removeLiquidity({
      pool,
      shares: parseTokenAmount(withdrawValue, POOL_SHARES_DECIMALS),
      minAmounts,
    });
  };

  const formattedPoolShares = formatTokenAmount(pool?.shares ?? '0', POOL_SHARES_DECIMALS);

  const buttonDisabled = isConnected
    && withdrawValue
    ? (new Big(withdrawValue).lte(0)
    || new Big(withdrawValue).gt(formattedPoolShares))
    : true;

  const onChangeSlippage = (value:string) => {
    if (!value || Number(value) <= 0) {
      setSlippageTolerance(MIN_SLIPPAGE_TOLERANCE.toString());
      setWarning(true);
      return;
    }
    if (Number(value) < MIN_SLIPPAGE_TOLERANCE) {
      setSlippageTolerance(value);
      setWarning(true);
      return;
    }
    if (Number(value) >= (MAX_SLIPPAGE_TOLERANCE)) {
      setSlippageTolerance(MAX_SLIPPAGE_TOLERANCE.toString());
      return;
    }

    setSlippageTolerance(value);
    setWarning(false);
  };
  return (
    <>
      {removeLiquidityModalOpenState.isOpen && (
      <Layout onClick={() => {
        navigate(POOL);
        setRemoveLiquidityModalOpenState({ isOpen: false, pool: null });
      }}
      >
        <LiquidityModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              Withdraw
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
            <Input
              shares={formattedPoolShares}
              withdrawValue={withdrawValue}
              setWithdrawValue={setWithdrawValue}
            />
            <SlippageBlock>
              <TitleAction>
                Slippage Tolerance
                <Tooltip title={tooltipTitle.slippageTolerance} />
              </TitleAction>
              <Toggle
                value={slippageTolerance}
                coefficient={COEFFICIENT_SLIPPAGE}
                options={slippageToleranceOptions}
                onChange={onChangeSlippage}
              />
              {warning && (
                <Warning>
                  Your transaction may be frontrun
                </Warning>
              )}
            </SlippageBlock>
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
