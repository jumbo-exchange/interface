import React, { useMemo } from 'react';
import { IPool } from 'store';
import { FilterPoolsEnum } from 'pages/Pool';
import styled from 'styled-components';
import Big from 'big.js';
import PoolCardPlaceholder from 'components/Placeholder/PoolCardPlaceholder';
import { useTranslation } from 'react-i18next';
import { SHOW_MIN_TOTAL_LIQUIDITY } from 'utils/constants';
import PoolCard from './PoolCard';

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
    isHiddenLowTL,
  }:{
    poolsArray: IPool[],
    currentFilterPools:FilterPoolsEnum,
    loading: boolean,
    isHiddenLowTL: boolean,
  },
) {
  const { t } = useTranslation();
  const poolsArraySorted = poolsArray.sort(
    (a, b) => Big(b.totalLiquidity)
      .minus(a.totalLiquidity).toNumber(),
  );

  const allPools = useMemo(() => poolsArraySorted
    .filter((pool) => (isHiddenLowTL
      ? Big(pool.totalLiquidity).gte(SHOW_MIN_TOTAL_LIQUIDITY)
      : pool))
    .map((pool) => (
      <PoolCard
        key={pool.id}
        pool={pool}
      />
    )), [isHiddenLowTL, poolsArraySorted]);

  if (loading) {
    return (
      <Wrapper>
        {numberPlaceholderCard.map((el) => (
          <PoolCardPlaceholder
            key={el}
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

  return (
    <Wrapper>
      {allPools}
      {poolsArraySorted.length === 0
        && (
        <NoResult>
          {t('noResult.noResultFound')}
        </NoResult>
        )}
    </Wrapper>
  );
}
