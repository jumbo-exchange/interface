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
      {pools.map((pool, i) => {
        const index = i + 1;
        return (
          <PoolCard
            key={index}
            pool={pool}
          />
        );
      })}
    </Wrapper>
  );
}
