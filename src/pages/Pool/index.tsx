import React, { useEffect } from 'react';
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
  PoolResult,
} from './styles';
import PoolSettings from './PoolSettings';
import PoolCard from './PoolCard';

const filters = [
  {
    title: 'All Pools',
    isActive: true,
  },
  {
    title: 'Your Liquidity',
    isActive: false,
  },
  {
    title: 'LP Farming',
    isActive: false,
  },
  {
    title: 'Deprecated',
    isActive: false,
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
            isActive={el.isActive}
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
      <PoolResult>
        {pools.map((pool) => (
          <PoolCard
            key={pool.id}
            pool={pool}
          />
        ))}
      </PoolResult>
    </Container>
  );
}
