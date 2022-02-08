import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import {
  initialModalsState, NEAR_TOKEN_ID, useModalsStore, useStore,
} from 'store';
import getConfig from 'services/config';
import { getCurrentToken } from './constants';

const config = getConfig();

interface ICurrentToken {
  isActive?: boolean
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 .5rem .5rem .5rem;
  position: relative;
  width: 100%;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: .75rem;
  line-height: .875rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 1.125rem;
    line-height: 1.313rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: .75rem;
    line-height: .875rem;
  `}
  transition: all 1s ease;
`;

const TokensContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const TokenBlock = styled.div<PropsWithChildren<ICurrentToken>>`
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
  margin-top: 1.5rem;
  background-color: ${({ theme, isActive }) => (isActive ? theme.globalGreyOp01 : 'none')};
  padding: 5px;
  border-radius: 12px;
  & > img {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: .5rem;
    transition: all 1s ease;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-right: 2.25rem;
    margin-top: 2.25rem;
    & > img {
      width: 2.25rem;
      height: 2.25rem;
      margin-right: .75rem;
    }
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 1.5rem;
    margin-top: 1.5rem;
    & > img {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: .5rem;
    }
  `}
  transition: all 1s ease;
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

export default function PopularToken() {
  const {
    tokens,
    inputToken,
    outputToken,
    loading,
    setCurrentToken,
  } = useStore();
  const { isSearchModalOpen, setSearchModalOpen } = useModalsStore();
  if (loading) return <h1>Loading</h1>;

  const near = tokens[NEAR_TOKEN_ID] ?? null;
  const wNear = tokens[config.nearAddress] ?? null;

  const tokensArray = [near, wNear];
  return (
    <Container>
      <Title>Popular</Title>
      <TokensContainer>
        {tokensArray.map((token) => (
          <TokenBlock
            key={token.contractId}
            isActive={getCurrentToken(inputToken, outputToken, token, isSearchModalOpen.tokenType)}
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
