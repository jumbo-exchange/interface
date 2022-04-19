import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { IPool, useStore } from 'store';
import { FilterPoolsEnum } from 'pages/Pool';
import styled from 'styled-components';
import Big from 'big.js';
import PoolCardPlaceholder from 'components/Placeholder/PoolCardPlaceholder';
import { useTranslation } from 'react-i18next';
import { FarmStatusEnum } from 'components/FarmStatus';
import { SHOW_MIN_TOTAL_LIQUIDITY } from 'utils/constants';
import PoolCard from './Card/PoolCard';
import FarmCard from './Card/FarmCard';
import YourLiquidityCard from './Card/YourLiquidityCard';

const numberPlaceholderCard = Array.from(Array(5).keys());
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

const NoResult = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.globalWhite};
  margin: 2rem 0;
`;

const EndedFarm = styled.div<{isShowingEndedOnly: boolean}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin: ${({ isShowingEndedOnly }) => (isShowingEndedOnly ? '0' : '3rem 0')};
  & > p {
    font-style: normal;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.125rem;
    color: ${({ theme }) => theme.globalGrey};
    margin: 0 0 1.5rem;
  }
`;

export default function PoolResult(
  {
    poolsArray,
    currentFilterPools,
    setCurrentFilterPools,
    isShowingEndedOnly,
    isHiddenLowTL,
  }:{
    poolsArray: IPool[],
    currentFilterPools: FilterPoolsEnum,
    setCurrentFilterPools: Dispatch<SetStateAction<FilterPoolsEnum>>,
    isShowingEndedOnly:boolean,
    isHiddenLowTL: boolean,
  },
) {
  const { farms, loading } = useStore();
  const { t } = useTranslation();
  const poolsArraySorted = useMemo(() => poolsArray.sort(
    (a, b) => Big(b.totalLiquidity)
      .minus(a.totalLiquidity).toNumber(),
  ),
  [poolsArray]);

  const filteredPools = useMemo(() => poolsArraySorted
    .filter((pool) => (
      Big(pool.totalLiquidity).gte(SHOW_MIN_TOTAL_LIQUIDITY)
    )),
  [poolsArraySorted]);

  const poolsForRender = isHiddenLowTL ? filteredPools : poolsArraySorted;

  if (loading) {
    return (
      <Wrapper>
        {numberPlaceholderCard.map((el) => (
          <PoolCardPlaceholder
            key={el}
            isFarming={currentFilterPools === FilterPoolsEnum.Farming}
          />
        ))}
      </Wrapper>
    );
  }

  if (currentFilterPools === FilterPoolsEnum.YourLiquidity) {
    const filteredPoolsLiquidity = poolsArraySorted.filter((pool) => {
      const poolFarms = pool.farms?.map((id) => farms[id]);
      const canUnStake = poolFarms?.some((farm) => Big(farm.userStaked || '0').gt('0'));
      const canWithdraw = Big(pool.shares || '0').gt('0');
      return (canUnStake || canWithdraw) && pool;
    });

    return (
      <Wrapper>
        {filteredPoolsLiquidity.map((pool) => (
          <YourLiquidityCard
            key={pool.id}
            pool={pool}
          />
        ))}
        {filteredPoolsLiquidity.length === 0
          && (
            <NoResult>
              {t('noResult.yourLiquidity')}
            </NoResult>
          )}
      </Wrapper>
    );
  }

  if (currentFilterPools === FilterPoolsEnum.Farming) {
    const filteredFarms = poolsArraySorted.reduce(
      (acc: {active:IPool[], ended: IPool[]}, pool:IPool) => {
        const poolFarms = pool?.farms?.map((id) => farms[id]);
        if (!poolFarms) return acc;
        const isAnyActive = poolFarms.some(
          (farm) => farm.status === FarmStatusEnum.Active,
        );
        const isAnyPending = poolFarms.some(
          (farm) => farm.status === FarmStatusEnum.Pending,
        );
        if (isAnyActive || isAnyPending) {
          return {
            ...acc,
            active: isAnyActive ? [pool, ...acc.active] : [...acc.active, pool],
          };
        }

        return { ...acc, ended: [...acc.ended, pool] };
      }, { active: [], ended: [] },
    );

    return (
      <>
        {!isShowingEndedOnly && (
        <Wrapper>
          {filteredFarms.active.map((pool) => (
            <FarmCard
              key={pool.id}
              pool={pool}
            />
          ))}
          {poolsArraySorted.length === 0
          && (
          <NoResult>
            {t('noResult.noResultFound')}
          </NoResult>
          )}
        </Wrapper>
        )}
        {filteredFarms.ended.length
          ? (
            <EndedFarm isShowingEndedOnly={isShowingEndedOnly}>
              <p>Ended</p>
              {filteredFarms.ended.map((pool) => (
                <FarmCard
                  key={pool.id}
                  pool={pool}
                />
              ))}
            </EndedFarm>
          ) : null}
      </>
    );
  }

  return (
    <Wrapper>
      {poolsForRender.map((pool) => (
        <PoolCard
          key={pool.id}
          pool={pool}
          setCurrentFilterPools={setCurrentFilterPools}
        />
      ))}
      {poolsForRender.length === 0
        && (
        <NoResult>
          {t('noResult.noResultFound')}
        </NoResult>
        )}
    </Wrapper>
  );
}
