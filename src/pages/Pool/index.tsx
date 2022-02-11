import React, { useEffect, useState } from 'react';
import { FilterButton } from 'components/Button';
import { isMobile } from 'utils/userAgent';
import { useModalsStore, useStore } from 'store';
import { useLocation, useParams } from 'react-router-dom';
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
  const { pools } = useStore();
  const { setAddLiquidityModalOpenState, setRemoveLiquidityModalOpenState } = useModalsStore();
  const { id } = useParams<'id'>();

  const location = useLocation();

  useEffect(() => {
    if (id && pools[Number(id)]) {
      const pool = pools[Number(id)];
      if (location.pathname === `/app/pool/remove-liquidity/${pool.id}`) {
        setRemoveLiquidityModalOpenState({ isOpen: true, pool });
      } else if (location.pathname === `/app/pool/add-liquidity/${pool.id}`) {
        setAddLiquidityModalOpenState({ isOpen: true, pool });
      }
    }
  }, [id, pools]);
  const [currentFilterPools, setCurrentFilterPools] = useState(FilterPoolsEnum['All Pools']);

  const mainInfo: IMainInfo[] = [
    {
      title: 'Total Value Locked',
      label: '-',
    },
    {
      title: 'Total 24h Volume',
      label: '-',
    },
    {
      title: 'JUMBO Price',
      label: '-',
    },
    {
      title: 'Weekly Emissions',
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

      <PoolSettings currentFilterPools={currentFilterPools} />
      <PoolResult currentFilterPools={currentFilterPools} />
    </Container>
  );
}
