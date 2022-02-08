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
  BtnClaim,
} from './styles';
import PoolSettings from './PoolSettings';
import PoolResult from './PoolResult';

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
  },
];

interface IMainInfo {
  title: string,
  label: string,
  show: boolean,
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
      show: true,
    },
    {
      title: 'Total 24h Volume',
      label: '-',
      show: true,
    },
    {
      title: 'JUMBO Price',
      label: '-',
      show: !isMobile,
    },
    {
      title: 'Weekly Emissions',
      label: '-',
      show: currentFilterPools === FilterPoolsEnum['All Pools'] && !isMobile, // TODO: checking if some brand is available
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
          </FilterButton>
        ))}
      </FilterBlock>
      <InformationBlock>
        <WrapperInfoBlock>
          {mainInfo.map((el) => {
            if (!el.show) return null;
            return (
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
            );
          })}
        </WrapperInfoBlock>
        {currentFilterPools !== FilterPoolsEnum['All Pools'] && (
        <BtnClaim>
          <span>50.5004648 DAI</span>
          <span>Claim</span>
        </BtnClaim>
        )}
      </InformationBlock>
      <PoolSettings currentFilterPools={currentFilterPools} />
      <PoolResult currentFilterPools={currentFilterPools} />
    </Container>
  );
}
