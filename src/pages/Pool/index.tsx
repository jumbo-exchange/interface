import React, { useEffect, useState } from 'react';
import { FilterButton } from 'components/Button';
import { isMobile } from 'utils/userAgent';
import { useModalsStore, useStore } from 'store';
import { useParams } from 'react-router-dom';
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
  const { setAddLiquidityModalOpenState } = useModalsStore();
  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id && pools[Number(id)]) {
      const pool = pools[Number(id)];
      setAddLiquidityModalOpenState({ isOpen: true, pool });
    }
  }, [id, pools]);
  const [currentFilterPools, setCurrentFilterPools] = useState(FilterPoolsEnum['All Pools']);

  const mainInfo: IMainInfo[] = [
    {
      title: 'Total Value Locked',
      label: '$935,059,293',
      show: true,
    },
    {
      title: 'Total 24h Volume',
      label: '$88,890,241',
      show: true,
    },
    {
      title: 'JUMBO Price',
      label: '$9.26',
      show: true,
    },
    {
      title: 'Weekly Emissions',
      label: '300k NEAR',
      show: !!isMobile, // TODO: checking if some brand is available
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
        <BtnClaim>
          <span>50.5004648 DAI</span>
          <span>Claim</span>
        </BtnClaim>
      </InformationBlock>
      <PoolSettings />
      <PoolResult currentFilterPools={currentFilterPools} />
    </Container>
  );
}
