import React from 'react';
import Tooltip from 'components/Tooltip';
import Big from 'big.js';
import { IPool, useStore } from 'store';
import { useNavigate } from 'react-router-dom';
import { toStakePage, toUnStakeAndClaimPage } from 'utils/routes';
import { useTranslation } from 'react-i18next';
import TokenPairDisplay from 'components/TokensDisplay/TokenPairDisplay';
import RewardTokens from 'components/TokensDisplay/RewardTokens';
import { PoolOrFarmButtons } from 'components/Button/RenderButton';
import {
  Wrapper,
  UpperRow,
  LabelPool,
  LowerRow,
  BlockVolume,
  Column,
  TitleVolume,
  LabelVolume,
  BlockButton,
} from './styles';

interface IVolume {
  title: string;
  label: string;
  color?: boolean;
  tooltip: string;
}

export default function FarmCard({ pool } : { pool: IPool }) {
  const {
    tokens,
    farms,
  } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [inputToken, outputToken] = pool.tokenAccountIds;
  const tokenInput = tokens[inputToken] ?? null;
  const tokenOutput = tokens[outputToken] ?? null;
  if (!tokenInput || !tokenOutput) return null;

  const farmsInPool = pool.farms?.length ? pool.farms.map((el) => farms[el]) : [];

  const volume: IVolume[] = [
    {
      title: t('farm.totalStaked'),
      label: '-',
      tooltip: t('tooltipTitle.totalLiquidity'),
    },
    {
      title: t('farm.yourStaked'),
      label: '-',
      tooltip: t('tooltipTitle.dayVolume'),
    },
    {
      title: t('farm.APY'),
      label: '-',
      color: true,
      tooltip: t('tooltipTitle.APY'),
    },
  ];

  const canUnStake = farmsInPool.some((el) => Big(el.userStaked || '0').gt('0'));

  return (
    <Wrapper isFarming>
      <UpperRow>
        <TokenPairDisplay pool={pool} />
        <LabelPool>
          <RewardTokens rewardTokens={farmsInPool.map((el) => el.rewardTokenId)} />
        </LabelPool>
      </UpperRow>
      <LowerRow>
        <BlockVolume>
          {volume.map((el) => (
            <Column key={el.title}>
              <TitleVolume>
                <span>{el.title}</span>
                <Tooltip title={el.tooltip} />
              </TitleVolume>
              <LabelVolume isColor={el.color}>{el.label}</LabelVolume>
            </Column>
          ))}
        </BlockVolume>
        <BlockButton>
          <PoolOrFarmButtons
            toPageAdd={toStakePage(pool.id)}
            titleAdd={t('action.stake')}
            toPageRemove={toUnStakeAndClaimPage(pool.id)}
            titleRemove={t('action.unStakeAndClaim')}
            showButton={canUnStake}
            navigate={navigate}
          />
        </BlockButton>
      </LowerRow>
    </Wrapper>
  );
}
