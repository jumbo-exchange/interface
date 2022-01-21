import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as CloseIcon } from 'assets/images-app/close.svg';
import { ReactComponent as SearchIcon } from 'assets/images-app/search-icon.svg';

import {
  initialModalsState, IToken, useModalsStore, useStore,
} from 'store';
import {
  Layout, Modal, ModalBlock, ModalTitle, ModalIcon,
} from '../styles';
import SearchRow from './SearchRow';
import PopularToken from './PopularToken';

const Container = styled.div`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    position: fixed;
    bottom: 0;
    width: 100%;
  `}
`;

const SearchModalContainer = styled(Modal)`
  width: 420px;
  max-height: 80vh;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 540px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: 100%;
    width: 100%;
    margin: 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  `}
  transition: all 1s ease;
`;

const SearchInputBlock = styled(ModalBlock)`
  margin-top: 0;
`;

const SearchInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.globalGreyOp04};
  box-sizing: border-box;
  border-radius: 12px;
  padding: 12px;
  
  ${({ theme }) => theme.mediaWidth.upToMedium`
    border-radius: 18px;
    padding: 16px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    border-radius: 12px;
    padding: 12px;
  `}
  :focus-within {
    border: 2px solid ${({ theme }) => theme.pink};
    padding: 11px;
    ${({ theme }) => theme.mediaWidth.upToMedium`
      padding: 15px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 11px;
  `}
  }
`;

const LogoSearchIcon = styled(SearchIcon)`
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 26px;
    height: 26px;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 18px;
    height: 18px;
  `}
  transition: all 1s ease;
`;

const SearchInput = styled.input`
  background: none;
  border: none;
  outline: none;
  font-style: normal;
  font-weight: normal;
  width: 100%;
  font-size: 1rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.globalWhite};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 1.5rem;
    line-height: 1.75rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1rem;
    line-height: 1.188rem;
  `}
  transition: all 1s ease;
  ::placeholder {
    color: ${({ theme }) => theme.globalGreyOp04};
  }
`;

const PopularTokenResult = styled(ModalBlock)`
  margin: 0 1rem 0 1rem;
`;

const SearchResults = styled(ModalBlock)`
  flex-direction: column;
  justify-content: flex-start;
  overflow-x: hidden;
  flex: 1;
  margin: 0 1rem 0 1rem;
  & > div{
    width: 100%;
  }
`;

export default function SearchModal() {
  const { loading, tokens } = useStore();
  const { isSearchModalOpen, setSearchModalOpen } = useModalsStore();

  const initialTokens = Object.values(tokens);
  const [tokensArray, setTokensArray] = useState<IToken[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');

  const onChange = ({ target }: {target: HTMLInputElement}) => {
    const newValue = target.value.trim().toLowerCase();
    setSearchValue(newValue);
    const newTokens = newValue !== ''
      ? initialTokens.filter(
        (el) => el.metadata.name.toLowerCase().includes(newValue)
        || el.metadata.symbol.toLowerCase().includes(newValue),
      )
      : initialTokens;
    setTokensArray(newTokens);
  };

  useEffect(() => {
    const newTokens = Object.values(tokens);

    if (newTokens.length !== tokensArray.length) {
      setTokensArray(newTokens);
    }
  }, [tokens, loading]);

  return (
    <>
      {isSearchModalOpen.isOpen && (
      <Layout onClick={() => setSearchModalOpen(initialModalsState.isSearchModalOpen)}>
        <Container>
          <SearchModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalBlock>
              <ModalTitle>
                Select a token
              </ModalTitle>
              <ModalIcon onClick={() => setSearchModalOpen(initialModalsState.isSearchModalOpen)}>
                <CloseIcon />
              </ModalIcon>
            </ModalBlock>
            <SearchInputBlock>
              <SearchInputContainer>
                <LogoSearchIcon />
                <SearchInput
                  value={searchValue}
                  onChange={onChange}
                  placeholder="Search name or paste address"
                />
              </SearchInputContainer>
            </SearchInputBlock>
            <PopularTokenResult>
              <PopularToken tokensArray={tokensArray} />
            </PopularTokenResult>
            <SearchResults>
              <SearchRow tokensArray={tokensArray} />
            </SearchResults>
          </SearchModalContainer>
        </Container>
      </Layout>
      )}
    </>
  );
}
