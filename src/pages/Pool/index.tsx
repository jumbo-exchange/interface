import React, { useState } from 'react';
import { FilterButton } from 'components/Button';
import { isMobile } from 'utils/userAgent';
import { useStore } from 'store';
import {
  Container,
  FilterBlock,
  InformationBlock,
  WrapperInfoBLock,
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

const filters = [
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
  },
];

interface IMainInfo {
  title: string,
  label: string,
  show: boolean,
}

export default function Pool() {
  const { pools } = useStore();
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
          >
            {el.title}
          </FilterButton>
        ))}
      </FilterBlock>
      <InformationBlock>
        <WrapperInfoBLock>
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
        </WrapperInfoBLock>
        <BtnClaim>
          <span>50.5004648 DAI</span>
          <span>Claim</span>
        </BtnClaim>
      </InformationBlock>
      <PoolSettings currentFilterPools={currentFilterPools} />
      <PoolResult currentFilterPools={currentFilterPools} />
    </Container>
  );
}
