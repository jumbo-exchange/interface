import React from 'react';
import styled from 'styled-components';
import {
  initialModalsState, IToken, useModalsStore, useStore,
} from 'store';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: .5rem;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: .75rem;
  line-height: .875rem;
  margin-bottom: 1rem;
`;

const TokensContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const TokenBlock = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
  margin-bottom: 1.5rem;
  & > img {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: .5rem;
  }
  :hover {
    cursor: pointer;
  }
`;

const TokenTitle = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.188rem;
`;

export default function PopularToken({ tokensArray } : {tokensArray: IToken[]}) {
  const {
    loading,
    setCurrentToken,
  } = useStore();
  const { isSearchModalOpen, setSearchModalOpen } = useModalsStore();
  if (loading) return <h1>Loading</h1>;

  return (
    <Container>
      <Title>Popular</Title>
      <TokensContainer>
        {tokensArray.map((token) => (
          <TokenBlock
            key={token.metadata.symbol}
            onClick={() => {
              setCurrentToken(token.contractId, isSearchModalOpen.tokenType);
              setSearchModalOpen(initialModalsState.isSearchModalOpen);
            }}
          >
            <img src={token.metadata.icon} alt={token.metadata.symbol} />
            <TokenTitle>{token.metadata.symbol}</TokenTitle>
          </TokenBlock>
        ))}
      </TokensContainer>
    </Container>
  );
}
