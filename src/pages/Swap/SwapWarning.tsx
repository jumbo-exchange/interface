import React from 'react';
import getConfig from 'services/config';
import Warning from 'components/Warning';
import styled from 'styled-components';
import { warning } from 'utils/constants';
import { NEAR_TOKEN_ID, useStore } from 'store';
import { ReactComponent as RouteArrow } from 'assets/images-app/route-arrow.svg';
import { ReactComponent as Wallet } from 'assets/images-app/wallet.svg';
import { ButtonSecondary } from 'components/Button';
import { getPoolsPath, toArray } from 'utils';
import { useNavigate } from 'react-router-dom';
import Big from 'big.js';
import { toAddLiquidityPage } from 'utils/routes';

const config = getConfig();

const WarningBlock = styled.div`
  margin-bottom: 1.625rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-bottom: 1.25rem;
  `}
`;

const RouteBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & > div {
    display: flex;
    align-items: center;
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.188rem;
  }
  & > button {
    padding: .625rem;
    font-weight: 500;
    font-size: .75rem;
    line-height: 1.063rem;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    & > div {
      font-size: .75rem;
      line-height: .875rem;
    }
  `}
`;

const TokenImg = styled.img`
  margin-right: .5rem;
  width: 24px;
  height: 24px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: .25rem;
    width: 16px;
    height: 16px;
  `}
`;

const RouteArrowLogo = styled(RouteArrow)`
  margin: 0 1rem;
`;

const LogoWallet = styled(Wallet)`
  margin-right: .313rem;
`;

export default function RenderWarning() {
  const {
    loading,
    tokens,
    pools,
    inputToken,
    setInputToken,
    outputToken,
    setOutputToken,
    getTokenBalance,
    getToken,
  } = useStore();
  const navigate = useNavigate();

  const near = getToken(NEAR_TOKEN_ID);
  const wNear = getToken(config.nearAddress);

  const poolPathInputToken = getPoolsPath(
    inputToken?.contractId ?? '',
    wNear?.contractId ?? '',
    toArray(pools),
    tokens,
  );
  const poolPathOutputToken = getPoolsPath(
    wNear?.contractId ?? '',
    outputToken?.contractId ?? '',
    toArray(pools),
    tokens,
  );
  const poolPathToken = getPoolsPath(
    inputToken?.contractId ?? '',
    outputToken?.contractId ?? '',
    toArray(pools),
    tokens,
  );
  const havePoolPathInputToken = poolPathInputToken.length > 0;
  const havePoolPathOutputToken = poolPathOutputToken.length > 0;
  const havePoolPathToken = poolPathToken.length > 0;

  const isMissingShares = poolPathToken.every((el) => new Big(el.sharesTotalSupply).eq(0));
  const poolWithoutLiquidity = poolPathToken.shift();

  const firstTokenBalance = getTokenBalance(inputToken?.contractId);
  const secondTokenBalance = getTokenBalance(outputToken?.contractId);

  const isBalancesEmpty = Big(firstTokenBalance).lte('0') || Big(secondTokenBalance).lte('0');

  if (!loading
    && (
      (inputToken === near && outputToken === wNear)
      || (inputToken === wNear && outputToken === near)
    )
  ) {
    return null;
  }

  if (!loading && getTokenBalance(wNear?.contractId) === '0'
  && (inputToken === wNear || outputToken === wNear)
  ) {
    return (
      <WarningBlock>
        <Warning
          title={warning.zeroBalance}
          description={warning.zeroBalanceDesc}
        >
          <RouteBlock>
            <div>
              <TokenImg
                src={near?.metadata.icon}
                alt={near?.metadata.symbol}
              />
              {near?.metadata.symbol}
              <RouteArrowLogo />
              <TokenImg
                src={wNear?.metadata.icon}
                alt={wNear?.metadata.symbol}
              />
              {wNear?.metadata.symbol}
            </div>
            <ButtonSecondary
              onClick={() => {
                setInputToken(near);
                setOutputToken(wNear);
              }}
            >
              <LogoWallet />
              Go to Pair
            </ButtonSecondary>
          </RouteBlock>
        </Warning>

      </WarningBlock>
    );
  }

  if (!loading
    && (inputToken === near || outputToken === near)
    && (havePoolPathInputToken || havePoolPathOutputToken)) {
    return (
      <WarningBlock>
        <Warning
          title={warning.noSuchPairExists}
          description={warning.noSuchPairExistsDesc}
        >
          <RouteBlock>
            <div>
              <TokenImg
                src={near?.metadata.icon}
                alt={near?.metadata.symbol}
              />
              {near?.metadata.symbol}
              <RouteArrowLogo />
              <TokenImg
                src={wNear?.metadata.icon}
                alt={wNear?.metadata.symbol}
              />
              {wNear?.metadata.symbol}
            </div>
            <ButtonSecondary
              onClick={() => {
                setInputToken(near);
                setOutputToken(wNear);
              }}
            >
              <LogoWallet />
              Go to Pair
            </ButtonSecondary>
          </RouteBlock>
        </Warning>
      </WarningBlock>
    );
  }

  if (!loading && !havePoolPathToken) {
    return (
      <WarningBlock>
        <Warning
          title={warning.doesNotExist}
        />

      </WarningBlock>
    );
  }

  if (!loading && isMissingShares) {
    return (
      <WarningBlock>
        <Warning
          title={warning.zeroPoolLiquidity}
          description={warning.zeroPoolLiquidityDesc}
        >
          <RouteBlock>
            <div>
              <TokenImg
                src={inputToken?.metadata.icon}
                alt={inputToken?.metadata.symbol}
              />
              {inputToken?.metadata.symbol}
              <RouteArrowLogo />
              <TokenImg
                src={outputToken?.metadata.icon}
                alt={outputToken?.metadata.symbol}
              />
              {outputToken?.metadata.symbol}
            </div>
            {!isBalancesEmpty ? (
              <ButtonSecondary
                onClick={() => {
                  navigate(toAddLiquidityPage(poolWithoutLiquidity?.id));
                }}
              >
                <LogoWallet />
                Add liquidity
              </ButtonSecondary>
            ) : null }
          </RouteBlock>
        </Warning>
      </WarningBlock>
    );
  }

  return null;
}
