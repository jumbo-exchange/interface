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
import { calcYourLiquidity, displayPriceWithSpace } from 'utils/calculations';
import { FilterPoolsEnum } from 'pages/Pool';
import { displayAPY } from 'utils';
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

interface IVolume {
  title: string;
  label: string;
  color?: boolean;
  tooltip: string;
  show: boolean;
}

export default function PoolCard(
  {
    pool,
    currentFilterPools,
    setCurrentFilterPools,
  } : {
    pool: IPool,
    currentFilterPools: FilterPoolsEnum,
    setCurrentFilterPools: Dispatch<SetStateAction<FilterPoolsEnum>>,
  },
) {
  const { farms, tokens, prices } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const yourLiquidityAmount = calcYourLiquidity(tokens, prices, pool);

  const volume: IVolume[] = [
    {
      title: t('pool.totalLiquidity'),
      label: Big(pool.totalLiquidity).lte(0)
        ? '-'
        : `$${displayPriceWithSpace(Big(pool.totalLiquidity).toFixed(0))}`,
      tooltip: t('tooltipTitle.totalLiquidity'),
      show: true,
    },
    {
      title: t('pool.dayVolume'),
      label: Big(pool.dayVolume).lte(0)
        ? '-'
        : `$${displayPriceWithSpace(Big(pool.dayVolume).toFixed(0))}`,
      tooltip: t('tooltipTitle.dayVolume'),
      show: currentFilterPools === FilterPoolsEnum.AllPools,
    },
    {
      title: t('pool.yourLiquidity'),
      label: `$${displayPriceWithSpace(yourLiquidityAmount || '0')}`,
      tooltip: t('tooltipTitle.yourLiquidity'),
      show: currentFilterPools === FilterPoolsEnum.YourLiquidity,
    },
    {
      title: t('pool.APY'),
      label: displayAPY(pool.apy),
      color: true,
      tooltip: t('tooltipTitle.APY'),
      show: true,
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
              onClick={() => {
                document.querySelector('body')?.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
                setCurrentFilterPools(FilterPoolsEnum.Farming);
              }}
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
          {volume.map((el) => {
            if (!el.show) return null;
            return (
              <Column key={el.title}>
                <TitleVolume>
                  <span>{el.title}</span>
                  <Tooltip title={el.tooltip} />
                </TitleVolume>
                <LabelVolume isColor={el.color}>{el.label}</LabelVolume>
              </Column>
            );
          })}
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
