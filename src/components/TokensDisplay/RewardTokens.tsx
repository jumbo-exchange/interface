import React from 'react';
import FungibleTokenContract from 'services/FungibleToken';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: .563rem .5rem;
  background-color: ${({ theme }) => theme.rewardTokensBg};
  border-radius: 12px;
  & > p {
    color: ${({ theme }) => theme.globalGrey};
    font-style: normal;
    font-weight: 300;
    font-size: .75rem;
    line-height: .875rem;
    margin: 0 .75rem 0 0;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bgToken};
  border-radius: 8px;
  transition: all 1s ease-out;
  height: 1.375rem;
  min-width: 1.375rem;
  margin: 0 .3rem;
  & > img {
    border-radius: 8px;
    height: 1.25rem;
    width: 1.25rem;
    transition: all 1s ease-out;
  }
`;

export default function RewardTokens(
  { rewardTokens }:{ rewardTokens: FungibleTokenContract[] },
) {
  return (
    <Container>
      <p>Reward tokens</p>
      {rewardTokens.map((token) => (
        <LogoContainer key={token.contractId}>
          <img src={token.metadata.icon} alt={token.metadata.symbol} />
        </LogoContainer>
      ))}
    </Container>
  );
}
