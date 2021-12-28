import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ReactComponent as CloseIcon } from 'assets/images-app/close.svg';
import { ReactComponent as SearchIcon } from 'assets/images-app/search-icon.svg';

import {
  initialModalsState, IToken, useModalsStore, useStore,
} from 'store';
import {
  Layout, Modal, ModalBlock, ModalTitle, ModalClose,
} from '../styles';
import SearchRow from './SearchRow';
import PopularToken from './PopularToken';

const SearchModalContainer = styled(Modal)`
  max-width: 420px;
  max-height: 80vh;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    max-width: 100%;
    width: 100%;
    margin: 0;
    max-height: 90vh;
    height: 90vh;
    align-self: flex-end;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  `}
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
  :focus-within {
    border: 1px solid ${({ theme }) => theme.pink};
  }
`;

const LogoSearchIcon = styled(SearchIcon)`
  margin-right: 12px;
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
  ::placeholder {
    color: ${({ theme }) => theme.globalGreyOp04};
  }
`;

const SearchResults = styled(ModalBlock)`
  flex-direction: column;
  justify-content: flex-start;
  overflow: scroll;
  flex: 5;
  margin-bottom: 0;
  margin-top: 0;
  &>div{
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
        <SearchModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalBlock>
            <ModalTitle>
              Select a token
            </ModalTitle>
            <ModalClose onClick={() => setSearchModalOpen(initialModalsState.isSearchModalOpen)}>
              <CloseIcon />
            </ModalClose>
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
          <SearchResults>
            <PopularToken tokensArray={tokensArray} />
            <SearchRow tokensArray={tokensArray} />
          </SearchResults>
        </SearchModalContainer>
      </Layout>
      )}
    </>
  );
}
