import React from 'react';
import styled from 'styled-components';
import { useStore } from 'store';
import PoolCard from './PoolCard';

const Wrapper = styled.div`
  width: 100%;
`;

export default function PoolResult() {
  const { pools } = useStore();
  return (
    <Wrapper>
      {pools.map((pool, index) => (
        <PoolCard
          key={`pool-index-${index + 1}`}
          pool={pool}
        />
      ))}
    </Wrapper>
  );
}
