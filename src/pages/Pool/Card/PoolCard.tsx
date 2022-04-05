import React, { Dispatch, SetStateAction } from 'react';
import Tooltip from 'components/Tooltip';
import Big from 'big.js';
import { IPool, useStore } from 'store';
import { useNavigate } from 'react-router-dom';
import { toAddLiquidityPage, toRemoveLiquidityPage } from 'utils/routes';
import { useTranslation } from 'react-i18next';
import TokenPairDisplay from 'components/TokensDisplay/TokenPairDisplay';
import { PoolOrFarmButtons } from 'components/Button/RenderButton';
import { ReactComponent as Arrow } from 'assets/images-app/route-arrow.svg';
import { FarmStatusEnum, FarmStatusLocalesInPool, getAvailableTimestamp } from 'components/FarmStatus';
import {
  Wrapper,
  UpperRow,
  LabelPool,
  FarmBlock,
  LogoArrowContainer,
  LowerRow,
  BlockVolume,
  Column,
  TitleVolume,
  LabelVolume,
  BlockButton,
} from './styles';
import { FilterPoolsEnum } from '..';

interface IVolume {
  title: string;
  label: string;
  color?: boolean;
  tooltip: string;
}

export default function PoolCard(
  {
    pool,
    setCurrentFilterPools,
  } : {
    pool: IPool,
    setCurrentFilterPools: Dispatch<SetStateAction<FilterPoolsEnum>>,
  },
) {
  const { farms } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const volume: IVolume[] = [
    {
      title: t('pool.totalLiquidity'),
      label: pool.totalLiquidity && Big(pool.totalLiquidity).gt(0) ? `$${pool.totalLiquidity}` : '-',
      tooltip: t('tooltipTitle.totalLiquidity'),
    },
    {
      title: t('pool.dayVolume'),
      label: pool.dayVolume && Big(pool.dayVolume).gt(0) ? `$${pool.dayVolume}` : '-',
      tooltip: t('tooltipTitle.dayVolume'),
    },
    {
      title: t('pool.APY'),
      label: '-',
      color: true,
      tooltip: t('tooltipTitle.APY'),
    },
  ];

  const canWithdraw = Big(pool.shares || '0').gt('0');

  const farmsInPool = !pool.farms?.length ? [] : pool.farms.map((el) => farms[el]);
  const { status } = getAvailableTimestamp(farmsInPool);
  return (
    <Wrapper>
      <UpperRow>
        <TokenPairDisplay pool={pool} />
        <LabelPool>
          <>
            {pool.farms && status !== FarmStatusEnum.Ended && (
            <FarmBlock
              type={status}
              onClick={() => setCurrentFilterPools(FilterPoolsEnum.Farming)}
            >
              Farming {FarmStatusLocalesInPool[status].toLowerCase()}
              <LogoArrowContainer type={status}>
                <Arrow />
              </LogoArrowContainer>
            </FarmBlock>
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
