import React from 'react';
import Big from 'big.js';
import styled from 'styled-components';
import { wallet } from 'services/near';
import {
  initialModalsState, IToken, useModalsStore, useStore,
} from 'store';
import { formatAmount } from 'utils';

const SearchRowContainer = styled.div`
  min-height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 1rem;
  & > img {
    width: 3rem;
    height: 3rem;
    transition: all 1s ease;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-bottom: 2.25rem;
    & > img {
      width: 4.5rem;
      height: 4.5rem;
    }
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-bottom: 1rem;
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
  margin-bottom: .25rem;
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

const getCurrentBalance = (
  balances: {[key: string]: string;},
  token: IToken,
) => {
  const currentBalance = formatAmount(balances[token.contractId], token.metadata.decimals);
  if (currentBalance !== '0') {
    return new Big(currentBalance).toFixed(3);
  }
  return 0;
};

const getCurrentPrice = (
  balances: {[key: string]: string;},
  token: IToken,
) => {
  const currentBalance = formatAmount(balances[token.contractId], token.metadata.decimals);
  if (currentBalance !== '0') {
    return '~$3141';
  }
  return '-';
};

export default function SearchRow({ tokensArray }:{tokensArray: IToken[]}) {
  const isConnected = wallet.isSignedIn();
  const {
    loading,
    balances,
    setCurrentToken,
  } = useStore();
  const { isSearchModalOpen, setSearchModalOpen } = useModalsStore();

  if (loading) return null;

  return (
    <>
      {tokensArray.map((token) => (
        <SearchRowContainer
          key={token.contractId}
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
      ))}
    </>
  );
}
