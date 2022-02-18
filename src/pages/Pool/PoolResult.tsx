import React from 'react';
import { IPool, useStore } from 'store';
import { FilterPoolsEnum } from 'pages/Pool';
import { noResult } from 'utils/constants';
import styled from 'styled-components';
import Big from 'big.js';
import PoolCardPlaceholder from 'components/Placeholder/PoolCardPlaceholder';
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
  }:{
    poolsArray: IPool[],
    currentFilterPools:FilterPoolsEnum},
) {
  const { loading } = useStore();
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
    const filteredPools = poolsArray.filter((pool) => pool.shares && Big(pool.shares).gt(0));
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
              {noResult.yourLiquidity}
            </NoResult>
          )}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {poolsArray.map((pool) => (
        <PoolCard
          key={pool.id}
          pool={pool}
        />
      ))}
      {poolsArray.length === 0
        && (
        <NoResult>
          {noResult.noResultFound}
        </NoResult>
        )}
    </Wrapper>
  );
}
