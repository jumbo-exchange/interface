import React, { useMemo } from 'react';
import getConfig from 'services/config';
import Warning from 'components/Warning';
import styled from 'styled-components';
import Big from 'big.js';
import { NEAR_TOKEN_ID, SHOW_WARNING_PRICE_IMPACT } from 'utils/constants';
import { useStore } from 'store';
import { ReactComponent as RouteArrow } from 'assets/images-app/route-arrow.svg';
import { ReactComponent as Wallet } from 'assets/images-app/wallet.svg';
import { ButtonSecondary } from 'components/Button';
import { getPoolsPath, toArray } from 'utils';
import { useNavigate } from 'react-router-dom';
import { wallet } from 'services/near';
import { toAddLiquidityPage } from 'utils/routes';
import { useTranslation } from 'react-i18next';
import { getToken } from 'store/helpers';
import useNavigateSwapParams from 'hooks/useNavigateSwapParams';
import { SWAP_ENUM } from 'services/interfaces';

const config = getConfig();

const WarningBlock = styled.div`
  margin-bottom: 1.625rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-bottom: 1.25rem;
  `}
`;

const RouteBlock = styled.div<{intersectionTokenId?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: ${({ intersectionTokenId }) => (intersectionTokenId ? 'column' : 'row')};
  & > div {
    display: flex;
    align-items: center;
    align-self: ${({ intersectionTokenId }) => (intersectionTokenId ? 'flex-start' : 'center')};
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.188rem;
  }
  & > button {
    margin-top: ${({ intersectionTokenId }) => (intersectionTokenId ? '1rem' : '0')};
    align-self: flex-end;
    padding: .625rem;
    font-weight: 500;
    font-size: .75rem;
    line-height: 1.063rem;
  }
  ${({ theme, intersectionTokenId }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: ${intersectionTokenId ? 'column' : 'row'};
    & > div {
      font-size: .75rem;
      line-height: .875rem;
    }
    & > button {
      margin-top: ${intersectionTokenId ? '1rem' : '0'};
    }
  `}
`;

const LogoContainer = styled.div`
  margin-right: .5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bgToken};
  border-radius: 8px;
  transition: all 1s ease-out;
  height: 1.625rem;
  min-width: 1.625rem;
  & > img {
    border-radius: 8px;
    height: 1.5rem;
    width: 1.5rem;
    transition: all 1s ease-out;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: .25rem;
    border-radius: 6px;
    height: 1.125rem;
    min-width: 1.125rem;
    & > img {
      border-radius: 6px;
      height: 1rem;
      width: 1rem;
      transition: all 1s ease-out;
    }
  `}
`;

const RouteArrowLogo = styled(RouteArrow)`
  margin: 0 1rem;
`;

const LogoWallet = styled(Wallet)`
  margin-right: .313rem;
`;

export default function RenderWarning({ priceImpact }: {priceImpact: string}) {
  const {
    loading,
    tokens,
    pools,
    inputToken,
    setInputToken,
    outputToken,
    setOutputToken,
    getTokenBalance,
    currentPools,
    setCurrentPools,
  } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isConnected = wallet.isSignedIn();
  const navigateSwapTokens = useNavigateSwapParams();

  const near = useMemo(() => getToken(NEAR_TOKEN_ID, tokens), [tokens]);
  const wNear = useMemo(() => getToken(config.nearAddress, tokens), [tokens]);

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

  const poolWithoutLiquidity = poolPathToken.find((pool) => Big(pool.sharesTotalSupply).eq(0));

  const intersectionTokenId = currentPools.length === SWAP_ENUM.INDIRECT_SWAP
    ? currentPools[0].tokenAccountIds.find((el) => el !== inputToken?.contractId) : null;

  const intersectionToken = tokens[intersectionTokenId ?? ''] ?? null;
  const isBalancesEmpty = poolWithoutLiquidity?.tokenAccountIds.some((tokenId) => Big(getTokenBalance(tokenId)).eq('0'));

  if (Big(priceImpact).gt(SHOW_WARNING_PRICE_IMPACT)) {
    return (
      <WarningBlock>
        <Warning
          title={t('warningMessage.badPriceImpact')}
          description={t('warningMessage.badPriceImpactDesc')}
        />
      </WarningBlock>
    );
  }

  if (!loading
    && (
      (inputToken === near && outputToken === wNear)
      || (inputToken === wNear && outputToken === near)
    )
  ) {
    return null;
  }

  if (!loading && isConnected
    && getTokenBalance(wNear?.contractId) === '0'
    && (inputToken === wNear)
  ) {
    return (
      <WarningBlock>
        <Warning
          title={t('warningMessage.zeroBalance')}
          description={t('warningMessage.zeroBalanceDesc')}
        >
          <RouteBlock>
            <div>
              <LogoContainer>
                <img
                  src={near?.metadata.icon}
                  alt={near?.metadata.symbol}
                />
              </LogoContainer>

              {near?.metadata.symbol}
              <RouteArrowLogo />
              <LogoContainer>
                <img
                  src={wNear?.metadata.icon}
                  alt={wNear?.metadata.symbol}
                />
              </LogoContainer>
              {wNear?.metadata.symbol}
            </div>
            <ButtonSecondary
              onClick={() => {
                setInputToken(near);
                setOutputToken(wNear);
                if (near && wNear) {
                  navigateSwapTokens(near.metadata.symbol, wNear.metadata.symbol);
                  setCurrentPools([]);
                }
              }}
            >
              <LogoWallet />
              {t('swap.goToPair')}
            </ButtonSecondary>
          </RouteBlock>
        </Warning>

      </WarningBlock>
    );
  }

  if (!loading
    && (inputToken === near || outputToken === near)
    && (havePoolPathInputToken || havePoolPathOutputToken)) {
    const nearIsInput = (havePoolPathInputToken || havePoolPathOutputToken) && inputToken === near;

    const onClick = () => {
      if (nearIsInput) {
        setInputToken(wNear);
        setOutputToken(outputToken);
        if (wNear && outputToken) {
          navigateSwapTokens(wNear.metadata.symbol, outputToken.metadata.symbol);
        }
        setCurrentPools(poolPathOutputToken);
      } else {
        setInputToken(inputToken);
        setOutputToken(wNear);
        if (wNear && inputToken) {
          navigateSwapTokens(inputToken?.metadata.symbol, wNear?.metadata.symbol);
        }
        setCurrentPools(poolPathInputToken);
      }
    };

    return (
      <WarningBlock>
        <Warning
          title={t('warningMessage.noSuchPairExists')}
          description={t('warningMessage.noSuchPairExistsDesc')}
        >
          <RouteBlock>
            <div>
              {nearIsInput
                ? (
                  <>
                    <LogoContainer>
                      <img
                        src={wNear?.metadata.icon}
                        alt={wNear?.metadata.symbol}
                      />
                    </LogoContainer>
                    {wNear?.metadata.symbol}
                    <RouteArrowLogo />
                    <LogoContainer>
                      <img
                        src={outputToken?.metadata.icon}
                        alt={outputToken?.metadata.symbol}
                      />
                    </LogoContainer>
                    {outputToken?.metadata.symbol}
                  </>
                )
                : (
                  <>
                    <LogoContainer>
                      <img
                        src={inputToken?.metadata.icon}
                        alt={inputToken?.metadata.symbol}
                      />
                    </LogoContainer>
                    {inputToken?.metadata.symbol}
                    <RouteArrowLogo />
                    <LogoContainer>
                      <img
                        src={wNear?.metadata.icon}
                        alt={wNear?.metadata.symbol}
                      />
                    </LogoContainer>
                    {wNear?.metadata.symbol}
                  </>
                )}
            </div>
            <ButtonSecondary
              onClick={onClick}
            >
              <LogoWallet />
              {t('swap.goToPair')}
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
          title={t('warningMessage.doesNotExist')}
        />

      </WarningBlock>
    );
  }

  if (!loading && poolWithoutLiquidity) {
    return (
      <WarningBlock>
        <Warning
          title={t('warningMessage.zeroPoolLiquidity')}
          description={t('warningMessage.zeroPoolLiquidityDesc')}
        >
          <RouteBlock intersectionTokenId={!!intersectionTokenId}>
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
            {!isBalancesEmpty ? (
              <ButtonSecondary
                onClick={() => {
                  navigate(toAddLiquidityPage(poolWithoutLiquidity?.id));
                }}
              >
                <LogoWallet />
                {t('action.addLiquidity')}
              </ButtonSecondary>
            ) : null }
          </RouteBlock>
        </Warning>
      </WarningBlock>
    );
  }

  return null;
}
