import React from 'react';
import styled from 'styled-components';
import { FarmStatusEnum } from 'components/FarmStatus';
import { useTranslation } from 'react-i18next';
import { useStore } from 'store';
import { onlyUniqueValues } from 'utils';

const Container = styled.div<{isFarming?: boolean, type?: FarmStatusEnum}>`
  display: flex;
  align-items: center;
  padding: .563rem .5rem;
  background-color: ${({ theme, isFarming }) => (isFarming ? theme.rewardTokensBg : theme.statusFarmInPoolBg)};
  border-radius: 12px;
  & > p {
    color: ${({ theme, type }) => {
    if (type === FarmStatusEnum.Active) return theme.statusActive;
    if (type === FarmStatusEnum.Pending) return theme.statusPending;
    return theme.globalGrey;
  }};
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
  {
    rewardTokens,
    isFarming,
    type,
    title,
  }:{
    rewardTokens: string[],
    isFarming?: boolean,
    type?: FarmStatusEnum,
    title?: string,
  },
) {
  const { tokens } = useStore();
  const { t } = useTranslation();
  const uniqueRewardTokens = onlyUniqueValues(rewardTokens);
  return (
    <Container isFarming={isFarming} type={type}>
      <p>{title || t('farm.rewardTokens')}</p>
      {uniqueRewardTokens.map((tokenId) => {
        const token = tokens[tokenId] || null;
        if (!token) return null;
        return (
          <LogoContainer key={token.contractId}>
            <img src={token.metadata.icon} alt={token.metadata.symbol} />
          </LogoContainer>
        );
      })}
    </Container>
  );
}
