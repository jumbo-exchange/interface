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
  }
`;

const TokenImg = styled.img`
  margin-right: .5rem;
  width: 24px;
  height: 24px;
`;

const RouteArrowLogo = styled(RouteArrow)`
  margin: 0 1rem;
`;

const LogoWallet = styled(Wallet)`
  margin-right: .313rem;
`;

const getPool = () => {

};

export default function RenderWarning() {
  const {
    balances,
    loading,
    tokens,
    pools,
    inputToken,
    setInputToken,
    outputToken,
    setOutputToken,
  } = useStore();

  const near = tokens[NEAR_TOKEN_ID] ?? null;
  const wNear = tokens[config.nearAddress] ?? null;

  const poolPathInputToken = getPoolsPath(
    inputToken?.contractId ?? '',
    wNear?.contractId,
    toArray(pools),
    tokens,
  );
  const poolPathOutputToken = getPoolsPath(
    wNear?.contractId,
    outputToken?.contractId ?? '',
    toArray(pools),
    tokens,
  );
  const havePoolPathInputToken = poolPathInputToken.length !== 0;
  const havePoolPathOutputToken = poolPathOutputToken.length !== 0;

  if (!loading && inputToken === near && outputToken === wNear) {
    return null;
  }

  if (!loading && balances[wNear.contractId] === '0'
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
    && !havePoolPathInputToken
    && !havePoolPathOutputToken) {
    return (
      <WarningBlock>
        <Warning
          title={warning.doesNotExist}
        />

      </WarningBlock>
    );
  }

  if (!loading && inputToken === near && (havePoolPathInputToken || havePoolPathOutputToken)) {
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
  return null;
}
