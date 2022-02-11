import React from 'react';
import { useStore } from 'store';
import { FilterPoolsEnum } from 'pages/Pool';
import { toArray } from 'utils';
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

export default function PoolResult({ currentFilterPools }:{currentFilterPools:FilterPoolsEnum}) {
  const { pools, loading } = useStore();
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
    const filteredPools = toArray(pools)
      .filter((pool) => pool.shares && Big(pool.shares).gt(0));
    return (
      <Wrapper>
        {filteredPools.map((pool) => (
          <PoolCard
            key={pool.id}
            pool={pool}
          />
        ))}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {toArray(pools).map((pool) => (
        <PoolCard
          key={pool.id}
          pool={pool}
        />
      ))}
    </Wrapper>
  );
}
