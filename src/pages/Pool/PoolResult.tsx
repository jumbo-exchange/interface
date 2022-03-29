import React from 'react';
import { IFarm, IPool } from 'store';
import { FilterPoolsEnum } from 'pages/Pool';
import styled from 'styled-components';
import Big from 'big.js';
import PoolCardPlaceholder from 'components/Placeholder/PoolCardPlaceholder';
import { useTranslation } from 'react-i18next';
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

export default function PoolResult(
  {
    poolsArray,
    currentFilterPools,
    loading,
  }:{
    poolsArray: IPool[],
    currentFilterPools:FilterPoolsEnum,
    loading:boolean,
  },
) {
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

  if (currentFilterPools === FilterPoolsEnum['Your Liquidity']) {
    const filteredPools = poolsArraySorted.filter((pool) => pool.shares && Big(pool.shares).gt(0));
    return (
      <Wrapper>
        {filteredPools.map((pool) => (
          <PoolCard
            key={pool.id}
            pool={pool}
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
    const farmingPool = poolsArraySorted.filter((pool) => pool.farms);
    return (
      <Wrapper>
        {farmingPool.map((pool) => (
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
    );
  }

  return (
    <Wrapper>
      {poolsArraySorted.map((pool) => (
        <PoolCard
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
  );
}
