import React from 'react';
import { IPool } from 'store';
import { FilterPoolsEnum } from 'pages/Pool';
import { noResult } from 'utils/constants';
import styled from 'styled-components';
import Big from 'big.js';
import PoolCardPlaceholder from 'components/Placeholder/PoolCardPlaceholder';
import getConfig from 'services/config';
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

const config = getConfig();

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
  const poolsArraySorted = poolsArray.sort(
    (a, b) => {
      if (a.tokenAccountIds.includes(config.nearAddress)
      && b.tokenAccountIds.includes(config.nearAddress)) {
        return Big(b.supplies[config.nearAddress])
          .minus(a.supplies[config.nearAddress]).toNumber();
      }
      if (a.tokenAccountIds.includes(config.nearAddress)) {
        return 1;
      }
      if (a.tokenAccountIds.includes(config.nearAddress)) {
        return -1;
      }
      return 0;
    },
  );

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
              {noResult.yourLiquidity}
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
          {noResult.noResultFound}
        </NoResult>
        )}
    </Wrapper>
  );
}
