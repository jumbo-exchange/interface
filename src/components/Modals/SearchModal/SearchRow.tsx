import React, { PropsWithChildren } from 'react';
import Big from 'big.js';
import styled from 'styled-components';
import { wallet } from 'services/near';
import {
  initialModalsState, TokenType, useModalsStore, useStore,
} from 'store';
import { formatTokenAmount } from 'utils/calculations';

import FungibleTokenContract from 'services/FungibleToken';

interface ICurrentToken {
  isActive?: boolean
}

const Container = styled.div<PropsWithChildren<ICurrentToken>>`
  min-height: 60px;
  width: 100%;
  display: flex;
  align-items: center;
  margin: .25rem 0;
  background-color: ${({ theme, isActive }) => (isActive ? theme.globalGreyOp01 : 'none')};
  border-radius: 18px;
  & > img {
    width: 3rem;
    height: 3rem;
    transition: all 1s ease;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-bottom: .375rem 0;
    min-height: 90px;
    border-radius: 27px;
    & > img {
      width: 4.5rem;
      height: 4.5rem;
    }
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-height: 60px;
    margin: .25rem 0;
    border-radius: 18px;
    & > img {
      width: 3rem;
      height: 3rem;
    }
  `}
  transition: all 1s ease;
  :hover {
    cursor: pointer;
  }
`;

const SearchRowContainer = styled.div`
  margin: .5rem;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  & > img {
    width: 3rem;
    height: 3rem;
    transition: all 1s ease;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    & > img {
      width: 4.5rem;
      height: 4.5rem;
    }
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    & > img {
      width: 3rem;
      height: 3rem;
    }
  `}
  transition: all 1s ease;
`;

const SearchDescriptionBlock = styled.div`
  display: flex; 
  flex-direction: column;
  flex-grow: 2;
  margin-left: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-left: 1.5rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-left: 1rem;
  `}
  transition: all 1s ease;
`;

const SearchTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.188rem;
  margin-bottom: .5rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 1.5rem;
    line-height: 1.75rem;
    margin-bottom: .406rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1rem;
    line-height: 1.188rem;
    margin-bottom: .25rem;
  `}
  transition: all 1s ease;
`;

const SearchSubtitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  margin-block-start: 0;
  margin-block-end: 0;
  color: ${({ theme }) => theme.globalGrey};
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

const NoResultContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const getCurrentBalance = (
  balances: {[key: string]: string;},
  token: FungibleTokenContract,
) => {
  const currentBalance = formatTokenAmount(balances[token.contractId], token.metadata.decimals);
  if (currentBalance !== '0') {
    return new Big(currentBalance).toFixed(3);
  }
  return 0;
};

const getCurrentPrice = (
  balances: {[key: string]: string;},
  token: FungibleTokenContract,
) => {
  const currentBalance = formatTokenAmount(balances[token.contractId], token.metadata.decimals);
  if (currentBalance !== '0') {
    return 'Price Unavailable';
  }
  return '-';
};

const getCurrentToken = (
  inputToken: FungibleTokenContract | null,
  outputToken: FungibleTokenContract | null,
  token: FungibleTokenContract | null,
  tokenType: TokenType,
) => {
  if (inputToken === token && tokenType === TokenType.Input) {
    return true;
  } if (outputToken === token && tokenType === TokenType.Output) {
    return true;
  }
  return false;
};

export default function SearchRow({ tokensArray }:{tokensArray: FungibleTokenContract[]}) {
  const isConnected = wallet.isSignedIn();
  const {
    loading,
    balances,
    inputToken,
    outputToken,
    setCurrentToken,
  } = useStore();
  const { isSearchModalOpen, setSearchModalOpen } = useModalsStore();

  if (loading) return null;

  return (
    <>
      {tokensArray.length ? tokensArray.map((token) => {
        getCurrentToken(inputToken, outputToken, token, isSearchModalOpen.tokenType);
        return (
          <Container
            key={token.contractId}
            isActive={getCurrentToken(inputToken, outputToken, token, isSearchModalOpen.tokenType)}
          >
            <SearchRowContainer
              onClick={() => {
                setCurrentToken(token.contractId, isSearchModalOpen.tokenType);
                setSearchModalOpen(initialModalsState.isSearchModalOpen);
              }}
            >
              <img src={token.metadata.icon} alt={token.metadata.symbol} />
              <SearchDescriptionBlock>
                <SearchTitle>
                  <div>{token.metadata.symbol}</div>
                  {isConnected && <div>{getCurrentBalance(balances, token)}</div>}
                </SearchTitle>
                <SearchSubtitle>
                  <div>{token.metadata.name}</div>
                  {isConnected && <div>{getCurrentPrice(balances, token)}</div>}
                </SearchSubtitle>
              </SearchDescriptionBlock>
            </SearchRowContainer>
          </Container>
        );
      }) : (
        <NoResultContainer>
          <p>No results found</p>
        </NoResultContainer>
      )}
    </>
  );
}
