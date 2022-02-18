import React, { useEffect, useState } from 'react';
import { FilterButton } from 'components/Button';
import { isMobile } from 'utils/userAgent';
import { IPool, useModalsStore, useStore } from 'store';
import { useLocation, useParams } from 'react-router-dom';
import { toAddLiquidityPage, toRemoveLiquidityPage } from 'utils/routes';
import { toArray } from 'utils';
import Big from 'big.js';
import { formatTokenAmount } from 'utils/calculations';
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

const JUMBO_POOL_ID = 4;

const calculatePriceForToken = (
  firstAmount: string,
  secondAmount: string,
  price: string,
) => (Big(firstAmount).gt(0) ? (new Big(secondAmount)
  .mul(price).div(firstAmount).toFixed(2)) : '0');

export default function Pool() {
  const {
    pools, loading, getToken, prices, priceLoading,
  } = useStore();
  const { setAddLiquidityModalOpenState, setRemoveLiquidityModalOpenState } = useModalsStore();
  const { id } = useParams<'id'>();
  const [jumboPrice, setJumboPrice] = useState('0');

  const location = useLocation();

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
    if (pools[JUMBO_POOL_ID] || !priceLoading) {
      const jumboPool = pools[JUMBO_POOL_ID];
      const [firstToken, secondToken] = jumboPool.tokenAccountIds;
      const secondPrice = prices[secondToken]?.price;
      const firstDecimals = getToken(firstToken)?.metadata.decimals;
      const secondDecimals = getToken(secondToken)?.metadata.decimals;

      const firstAmount = formatTokenAmount(
        jumboPool.supplies[firstToken], firstDecimals,
      );
      const secondAmount = formatTokenAmount(
        jumboPool.supplies[secondToken], secondDecimals,
      );

      const newJumboPrice = calculatePriceForToken(firstAmount, secondAmount, secondPrice);
      setJumboPrice(newJumboPrice);
    }
  }, [id, pools]);

  useEffect(() => {
    const newPools = toArray(pools);
    if (newPools.length !== poolsArray.length) {
      setPoolsArray(newPools);
    }
  }, [pools, loading]);

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
      label: jumboPrice || '-',
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

      <PoolSettings
        setPoolsArray={setPoolsArray}
        currentFilterPools={currentFilterPools}
      />
      <PoolResult
        poolsArray={poolsArray}
        currentFilterPools={currentFilterPools}
      />
    </Container>
  );
}
