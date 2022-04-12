import React, { useMemo } from 'react';
import styled from 'styled-components';
import {
  initialModalsState, useModalsStore, useStore,
} from 'store';
import getConfig from 'services/config';
import { NEAR_TOKEN_ID } from 'utils/constants';
import { useTranslation } from 'react-i18next';
import { getToken } from 'store/helpers';

const config = getConfig();

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

const TokenBlock = styled.div`
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
  margin-top: 1.5rem;
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
  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.globalGreyOp01};
  }
`;

const TokenTitle = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.188rem;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bgToken};
  border-radius: 8px;
  transition: all 1s ease-out;
  height: 1.625rem;
  min-width: 1.625rem;
  margin-right: .5rem;
  & > img {
    border-radius: 8px;
    width: 1.5rem;
    height: 1.5rem;
    transition: all 1s ease;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    border-radius: 12px;
    min-width: 2.375rem;
    height: 2.375rem;
    margin-right: .75rem;
    & > img {
      border-radius: 6px;
      width: 2.25rem;
      height: 2.25rem;
    }
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    border-radius: 8px;
    height: 1.125rem;
    min-width: 1.125rem;
    & > img {
      border-radius: 8px;
      height: 1rem;
      width: 1rem;
      transition: all 1s ease-out;
    }
  `}
`;

export default function PopularToken() {
  const { tokens } = useStore();
  const { isSearchModalOpen, setSearchModalOpen } = useModalsStore();
  const { t } = useTranslation();

  const { activeToken, setActiveToken } = isSearchModalOpen;

  const near = useMemo(() => getToken(NEAR_TOKEN_ID, tokens), [tokens]);
  const wNear = useMemo(() => getToken(config.nearAddress, tokens), [tokens]);
  const jumbo = useMemo(() => getToken(config.jumboAddress, tokens), [tokens]);

  if (!near || !wNear || !jumbo) return null;
  const popularTokensArray = [near, wNear, jumbo];

  return (
    <Container>
      <Title>{t('searchModal.popular')}</Title>
      <TokensContainer>
        {popularTokensArray.map((token) => (
          <TokenBlock
            key={token.contractId}
            onClick={() => {
              if (token !== activeToken) {
                setActiveToken(token);
                setSearchModalOpen(initialModalsState.isSearchModalOpen);
              }
            }}
          >
            <LogoContainer>
              <img src={token.metadata.icon} alt={token.metadata.symbol} />
            </LogoContainer>
            <TokenTitle>{token.metadata.symbol}</TokenTitle>
          </TokenBlock>
        ))}
      </TokensContainer>
    </Container>
  );
}
