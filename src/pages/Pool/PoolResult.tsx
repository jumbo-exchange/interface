import React, { Dispatch, SetStateAction } from 'react';
import { IPool, useStore } from 'store';
import { FilterPoolsEnum } from 'pages/Pool';
import styled from 'styled-components';
import Big from 'big.js';
import PoolCardPlaceholder from 'components/Placeholder/PoolCardPlaceholder';
import { useTranslation } from 'react-i18next';
import { FarmStatusEnum } from 'components/FarmStatus';
import PoolCard from './Card/PoolCard';
import FarmCard from './Card/FarmCard';

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
  }:{
    poolsArray: IPool[],
    currentFilterPools: FilterPoolsEnum,
    setCurrentFilterPools: Dispatch<SetStateAction<FilterPoolsEnum>>,
    isShowingEndedOnly:boolean,
  },
) {
  const { farms, loading } = useStore();
  const { t } = useTranslation();
  const poolsArraySorted = poolsArray.sort(
    (a, b) => Big(b.totalLiquidity)
      .minus(a.totalLiquidity).toNumber(),
  );

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
    const filteredPools = poolsArraySorted.filter((pool) => pool.shares && Big(pool.shares).gt(0));
    return (
      <Wrapper>
        {filteredPools.map((pool) => (
          <PoolCard
            key={pool.id}
            pool={pool}
            currentFilterPools={currentFilterPools}
            setCurrentFilterPools={setCurrentFilterPools}
          />
        ))}
        {filteredPools.length === 0
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
        const poolFarmIds = pool.farms;
        if (!poolFarmIds) return acc;
        const poolFarms = poolFarmIds.map((id) => farms[id]);
        if (!poolFarms) return acc;
        const isAnyActive = poolFarms.some(
          (farm) => farm.status === FarmStatusEnum.Active || farm.status === FarmStatusEnum.Pending,
        );

        if (isAnyActive) return { ...acc, active: [...acc.active, pool] };
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
        && (
          <EndedFarm isShowingEndedOnly={isShowingEndedOnly}>
            <p>Ended</p>
            {filteredFarms.ended.map((pool) => (
              <FarmCard
                key={pool.id}
                pool={pool}
              />
            ))}
          </EndedFarm>
        )}
      </>
    );
  }

  return (
    <Wrapper>
      {poolsArraySorted.map((pool) => (
        <PoolCard
          key={pool.id}
          pool={pool}
          currentFilterPools={currentFilterPools}
          setCurrentFilterPools={setCurrentFilterPools}
        />
      ))}
      {poolsArraySorted.length === 0
        && (
        <NoResult>
          {t('noResult.noResultFound')}
        </NoResult>
        )}
    </Wrapper>
  );
}
