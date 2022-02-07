import React from 'react';
import styled from 'styled-components';
import { useStore } from 'store';
import { FilterPoolsEnum } from 'pages/Pool';
import { toArray } from 'utils';
import Big from 'big.js';
import PoolCard from './PoolCard';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;

export default function PoolResult({ currentFilterPools }:{currentFilterPools:FilterPoolsEnum}) {
  const { pools } = useStore();
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
