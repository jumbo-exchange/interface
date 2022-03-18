import React, { useEffect, useState } from 'react';
import { FilterButton } from 'components/Button';
import { isMobile } from 'utils/userAgent';
import { IPool, useModalsStore, useStore } from 'store';
import { useLocation, useParams } from 'react-router-dom';
import { toAddLiquidityPage, toRemoveLiquidityPage } from 'utils/routes';
import { toArray } from 'utils';
import { useTranslation } from 'react-i18next';

import getConfig from 'services/config';
import Big from 'big.js';
import {
  Container,
  FilterBlock,
  InformationBlock,
  WrapperInfoBlock,
  InfoBLock,
  TitleInfo,
  LabelInfo,
  LogoSoon,
} from './styles';
import PoolSettings from './PoolSettings';
import PoolResult from './PoolResult';
import Slider from './Slider';

export enum FilterPoolsEnum {
  'All Pools',
  'Your Liquidity',
  'Farming',
  'Smart Pools',
}

interface IFilters {
  title: string
  isActive: FilterPoolsEnum,
  disabled?: boolean,
  logoSoon?: boolean,
}

const filters: IFilters[] = [
  {
    title: 'All Pools',
    isActive: FilterPoolsEnum['All Pools'],
  },
  {
    title: 'Your Liquidity',
    isActive: FilterPoolsEnum['Your Liquidity'],
  },
  {
    title: 'Farming',
    isActive: FilterPoolsEnum.Farming,
    disabled: true,
  },
  {
    title: 'Smart Pools',
    isActive: FilterPoolsEnum['Smart Pools'],
    disabled: true,
    logoSoon: !isMobile,
  },
];

export interface IMainInfo {
  title: string,
  label: string,
}

export default function Pool() {
  const { t } = useTranslation();

  const {
    pools, loading, prices,
  } = useStore();
  const { setAddLiquidityModalOpenState, setRemoveLiquidityModalOpenState } = useModalsStore();
  const { id } = useParams<'id'>();
  const config = getConfig();
  const location = useLocation();
  const [totalValueLocked, setTotalValueLocked] = useState('0');
  const [poolsArray, setPoolsArray] = useState<IPool[]>([]);

  useEffect(() => {
    if (id && pools[Number(id)]) {
      const pool = pools[Number(id)];
      if (location.pathname === toRemoveLiquidityPage(pool.id)) {
        setRemoveLiquidityModalOpenState({ isOpen: true, pool });
      } else if (location.pathname === toAddLiquidityPage(pool.id)) {
        setAddLiquidityModalOpenState({ isOpen: true, pool });
      }
    }
  }, [id, pools]);

  useEffect(() => {
    const newPools = toArray(pools);
    if (newPools.length !== poolsArray.length) {
      setPoolsArray(newPools);
    }
    const newTotalValueLocked = newPools.reduce(
      (acc, item:IPool) => acc.add(item.totalLiquidity), Big(0),
    );
    setTotalValueLocked(newTotalValueLocked.toFixed(2));
  }, [pools, loading]);

  const [currentFilterPools, setCurrentFilterPools] = useState(FilterPoolsEnum['All Pools']);

  const mainInfo: IMainInfo[] = [
    {
      title: t('pool.totalValueLocked'),
      label: Big(totalValueLocked ?? 0).lte(0) ? '-' : `$${totalValueLocked}`,
    },
    {
      title: t('pool.totalDayLocked'),
      label: '-',
    },
    {
      title: t('pool.jumboPrice'),
      label: `$${prices[config.jumboAddress].price ?? 0}` || '-',
    },
    {
      title: t('pool.weeklyEmissions'),
      label: '-',
    },
  ];

  return (
    <Container>

      <FilterBlock>
        {filters.map((el) => (
          <FilterButton
            key={el.title}
            isActive={currentFilterPools === el.isActive}
            onClick={() => setCurrentFilterPools(el.isActive)}
            disabled={el.disabled}
          >
            {el.title}
            {el.logoSoon && <LogoSoon />}
          </FilterButton>
        ))}
      </FilterBlock>
      {isMobile
        ? <Slider mainInfo={mainInfo} />
        : (
          <InformationBlock>
            <WrapperInfoBlock>
              {mainInfo.map((el) => (
                <InfoBLock
                  key={el.title}
                >
                  <TitleInfo>
                    {el.title}
                  </TitleInfo>
                  <LabelInfo>
                    {el.label}
                  </LabelInfo>
                </InfoBLock>
              ))}
            </WrapperInfoBlock>
          </InformationBlock>
        )}

      <PoolSettings
        setPoolsArray={setPoolsArray}
        currentFilterPools={currentFilterPools}
      />
      <PoolResult
        poolsArray={poolsArray}
        currentFilterPools={currentFilterPools}
        loading={loading}
      />
    </Container>
  );
}
