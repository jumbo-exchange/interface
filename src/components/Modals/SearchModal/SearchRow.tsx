import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { wallet } from 'services/near';
import {
  initialModalsState, useModalsStore, useStore,
} from 'store';

import FungibleTokenContract from 'services/FungibleToken';
import { getCurrentBalance, getCurrentPrice, isCurrentToken } from './constants';

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
    cursor: ${({ isActive }) => (isActive ? 'default' : 'pointer')};
    background-color: ${({ theme }) => theme.globalGreyOp01};
    transition: all .2s ease;
  }
`;

const SearchRowContainer = styled.div`
  margin: .5rem;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
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
  font-style: normal;
  font-weight: 300;
  font-size: 1rem;
  line-height: 1.188;
  margin-top: 2rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: .75rem;
    margin-top: 1.5rem;
  `}
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bgToken};
  border-radius: 16px;
  transition: all 1s ease-out;
  height: 3.125rem;
  min-width: 3.125rem;
  & > img {
    border-radius: 16px;
    width: 3rem;
    height: 3rem;
    transition: all 1s ease;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    border-radius: 20px;
    min-width: 4.625rem;
    height: 4.625rem;
    & > img {
      border-radius: 20px;
      width: 4.5rem;
      height: 4.5rem;
    }
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    border-radius: 16px;
    height: 3.125rem;
    min-width: 3.125rem;
    & > img {
      border-radius: 16px;
      height: 3rem;
      width: 3rem;
      transition: all 1s ease-out;
    }
  `}
`;

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
        isCurrentToken(inputToken, outputToken, token, isSearchModalOpen.tokenType);
        return (
          <Container
            key={token.contractId}
            isActive={isCurrentToken(inputToken, outputToken, token, isSearchModalOpen.tokenType)}
          >
            <SearchRowContainer
              onClick={() => {
                if (isCurrentToken(inputToken, outputToken, token, isSearchModalOpen.tokenType)) {
                  return;
                }
                setCurrentToken(token.contractId, isSearchModalOpen.tokenType);
                setSearchModalOpen(initialModalsState.isSearchModalOpen);
              }}
            >
              <LogoContainer>
                <img src={token.metadata.icon} alt={token.metadata.symbol} />
              </LogoContainer>
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
