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
import { formatTokenAmount, removeTrailingZeros } from 'utils/calculations';
import { LP_TOKEN_DECIMALS } from 'utils/constants';
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

const calcStakedAmount = (shares: string, pool: IPool) => {
  const { sharesTotalSupply, totalLiquidity } = pool;
  const formatTotalShares = formatTokenAmount(sharesTotalSupply, LP_TOKEN_DECIMALS);
  const formatShares = formatTokenAmount(shares, LP_TOKEN_DECIMALS);

  const numerator = Big(formatShares).times(totalLiquidity);
  const sharesInUsdt = Big(numerator).div(formatTotalShares).toFixed(2);
  return removeTrailingZeros(sharesInUsdt);
};

export default function FarmCard({ pool } : { pool: IPool }) {
  const { farms } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const farmsInPool = pool.farms?.length ? pool.farms.map((el) => farms[el]) : [];
  const { totalSeedAmount, userStaked } = farmsInPool[0];

  const totalStaked = calcStakedAmount(totalSeedAmount, pool);
  const yourStaked = calcStakedAmount(userStaked || '0', pool);

  const volume: IVolume[] = [
    {
      title: t('farm.totalStaked'),
      label: Big(totalStaked).gt(0) ? `$${totalStaked}` : '-',
      tooltip: t('tooltipTitle.totalStaked'),
    },
    {
      title: t('farm.yourStaked'),
      label: Big(yourStaked).gt(0) ? `$${yourStaked}` : '-',
      tooltip: t('tooltipTitle.yourStaked'),
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
