import React from 'react';
import PoolCard from 'components/PoolCard';
import styled from 'styled-components';
import { useStore } from 'store';

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
