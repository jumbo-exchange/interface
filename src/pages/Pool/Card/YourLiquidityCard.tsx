import React from 'react';
import Tooltip from 'components/Tooltip';
import Big from 'big.js';
import { IPool, useStore } from 'store';
import { useNavigate } from 'react-router-dom';
import { toAddLiquidityPage, toRemoveLiquidityPage } from 'utils/routes';
import { useTranslation } from 'react-i18next';
import TokenPairDisplay from 'components/TokensDisplay/TokenPairDisplay';
import { PoolOrFarmButtons } from 'components/Button/RenderButton';
import { FarmStatusLocalesInYourPool, getAvailableTimestamp } from 'components/FarmStatus';
import { calcYourLiquidity, displayAmount, displayPriceWithSpace } from 'utils/calculations';
import RewardTokens from 'components/TokensDisplay/RewardTokens';
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

export default function YourLiquidityCard({ pool } : {pool: IPool}) {
  const { farms, tokens, prices } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const yourLiquidityAmount = calcYourLiquidity(tokens, prices, pool);

  const volume: IVolume[] = [
    {
      title: t('pool.totalLiquidity'),
      label: Big(pool.totalLiquidity).eq(0)
        ? '-'
        : `$${displayAmount(pool.totalLiquidity)}`,
      tooltip: t('tooltipTitle.totalLiquidity'),
    },
    {
      title: t('pool.yourLiquidity'),
      label: yourLiquidityAmount && !Big(pool.totalLiquidity).eq(0)
        ? `$${displayAmount(pool.totalLiquidity)}`
        : '-',
      tooltip: t('tooltipTitle.yourLiquidity'),
    },
    {
      title: t('pool.APY'),
      label: Big(pool.apy).eq(0)
        ? '-'
        : `${displayAmount(pool.apy)}%`,
      color: true,
      tooltip: t('tooltipTitle.APY'),
    },
  ];

  const canWithdraw = Big(pool.shares || '0').gt('0');

  const farmsInPool = !pool.farms?.length ? [] : pool.farms.map((el) => farms[el]);
  const canUnStake = farmsInPool.some((el) => Big(el.userStaked || '0').gt('0'));
  const { status } = getAvailableTimestamp(farmsInPool);
  const titleStatusFarm = `${t('farm.farming')} ${FarmStatusLocalesInYourPool[status].toLowerCase()}`;
  return (
    <Wrapper>
      <UpperRow>
        <TokenPairDisplay pool={pool} />
        <LabelPool>
          <>
            {canUnStake && (
              <RewardTokens
                rewardTokens={farmsInPool.map((el) => el.rewardTokenId)}
                type={status}
                title={titleStatusFarm}
              />
            )}
          </>
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
            toPageAdd={() => navigate(toAddLiquidityPage(pool.id))}
            titleAdd={t('action.addLiquidity')}
            toPageRemove={() => navigate(toRemoveLiquidityPage(pool.id))}
            titleRemove={t('action.removeLiquidity')}
            showRemoveButton={canWithdraw}
            showAddButton
          />
        </BlockButton>
      </LowerRow>
    </Wrapper>
  );
}
