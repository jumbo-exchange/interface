import React from 'react';
import { IPool, useStore } from 'store';
import styled from 'styled-components';

const BlockTitle = styled.div`
  display: flex;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 1rem;
  `}
`;

const LogoPool = styled.div`
  position: relative;
  margin-right: 1.75rem;
  & > div:last-child {
    position: absolute;
    left: 19px;
    top: -5px;
    filter: drop-shadow(0px 4px 8px #202632);
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    & > img {
      width: 32px;
      height: 32px;
    }
  `}
`;

const TitlePool = styled.div`
  display: flex;
  width: 100%;
  & > p {
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.188rem;
    color: ${({ theme }) => theme.globalWhite};
    margin: 0;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.bgToken};
  border-radius: 8px;
  transition: all 1s ease-out;
  height: 2rem;
  min-width: 2rem;
  & > img {
    border-radius: 8px;
    height: 1.875rem;
    width: 1.875rem;
    transition: all 1s ease-out;
  }
`;

export default function TokenPairDisplay({ pool }:{ pool: IPool }) {
  const { tokens } = useStore();
  const [tokenInputName, tokenOutputName] = pool.tokenAccountIds;

  const tokenInput = tokens[tokenInputName] ?? null;
  const tokenOutput = tokens[tokenOutputName] ?? null;
  if (!tokenInput || !tokenOutput) return null;

  return (
    <BlockTitle>
      <LogoPool>
        <LogoContainer>
          <img src={tokenInput.metadata.icon} alt={tokenInput.metadata.symbol} />
        </LogoContainer>
        <LogoContainer>
          <img src={tokenOutput.metadata.icon} alt={tokenOutput.metadata.symbol} />
        </LogoContainer>
      </LogoPool>
      <TitlePool>
        <p>{tokenInput.metadata.symbol}</p>
        <p>/</p>
        <p>{tokenOutput.metadata.symbol}</p>
      </TitlePool>
    </BlockTitle>
  );
}
