import React, { useEffect, useState } from 'react';
import Tooltip from 'components/Tooltip';
import Big from 'big.js';
import { IPool, useStore } from 'store';
import { useNavigate } from 'react-router-dom';
import { toStakePage, toUnStakeAndClaimPage } from 'utils/routes';
import { useTranslation } from 'react-i18next';
import TokenPairDisplay from 'components/TokensDisplay/TokenPairDisplay';
import RewardTokens from 'components/TokensDisplay/RewardTokens';
import { PoolOrFarmButtons } from 'components/Button/RenderButton';
import moment from 'moment';
import { FarmStatusLocales, getAvailableTimestamp } from 'components/FarmStatus';
import { getTotalApr } from 'utils';
import { displayPriceWithSpace } from 'utils/calculations';
import {
  FarmWrapper,
  FarmContainer,
  UpperRow,
  LabelPool,
  LowerRow,
  BlockVolume,
  Column,
  TitleVolume,
  TitlePool,
  LabelVolume,
  BlockButton,
  FarmsStatus,
  FarmTime,
} from './styles';

interface IVolume {
  title: string;
  label: string;
  color?: boolean;
  tooltip: string;
}

export default function FarmCard({ pool } : { pool: IPool }) {
  const { farms } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [timeToStartFarm, setTimeToStart] = useState<number>(0);

  const farmsInPool = !pool.farms?.length ? [] : pool.farms.map((el) => farms[el]);
  const { totalStaked, yourStaked } = farmsInPool[0];
  const totalAPY = getTotalApr(farmsInPool);

  const volume: IVolume[] = [
    {
      title: t('farm.totalStaked'),
      label: totalStaked && Big(totalStaked).gt(0)
        ? `$${displayPriceWithSpace(totalStaked)}`
        : '-',
      tooltip: t('tooltipTitle.totalStaked'),
    },
    {
      title: t('farm.yourStaked'),
      label: yourStaked && Big(yourStaked).gt(0)
        ? `$${displayPriceWithSpace(yourStaked)}`
        : '-',
      tooltip: t('tooltipTitle.yourStaked'),
    },
    {
      title: t('farm.APY'),
      label: Big(totalAPY).gt(0) ? `${totalAPY}%` : '-',
      color: true,
      tooltip: t('tooltipTitle.APY'),
    },
  ];

  const currentDate = moment().valueOf();
  const {
    farmStart, farmEnd, timeToStart, status,
  } = getAvailableTimestamp(farmsInPool);

  const isFarmingEnd = currentDate > farmEnd;
  const isFarmingActive = currentDate > farmStart && currentDate < farmEnd;

  const activeTime = `
  ${moment(farmStart).format('YYYY-MM-DD HH:mm:ss')}
  \xa0 \u2014 \xa0
  ${moment(farmEnd).format('YYYY-MM-DD HH:mm:ss')}
  `;
  const pendingTime = `${moment(timeToStartFarm).format('DD [days] \xa0 HH : mm : ss')}`;
  const canUnStake = farmsInPool.some((el) => Big(el.userStaked || '0').gt('0'));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeToStart(timeToStart);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeToStart]);

  return (
    <FarmWrapper isShowingTime={isFarmingEnd}>
      <FarmContainer>
        <UpperRow>
          <TitlePool>
            <TokenPairDisplay pool={pool} />
            <FarmsStatus type={status}>{FarmStatusLocales[status]}</FarmsStatus>
          </TitlePool>
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
              toPageAdd={() => navigate(toStakePage(pool.id))}
              titleAdd={t('action.stake')}
              toPageRemove={() => navigate(toUnStakeAndClaimPage(pool.id))}
              titleRemove={t('action.unStakeAndClaim')}
              showRemoveButton={canUnStake}
              showAddButton={!isFarmingEnd}
            />
          </BlockButton>
        </LowerRow>
      </FarmContainer>
      {!isFarmingEnd && (
      <FarmTime>
        <p>{isFarmingActive ? activeTime : pendingTime}</p>
      </FarmTime>
      )}
    </FarmWrapper>
  );
}
