import React, {
  useEffect, useState, useMemo, useCallback,
} from 'react';
import { FilterButton, ButtonClaim } from 'components/Button';
import { isMobile } from 'utils/userAgent';
import { IPool, useModalsStore, useStore } from 'store';
import { useLocation, useParams } from 'react-router-dom';
import {
  toAddLiquidityPage, toRemoveLiquidityPage, toStakePage, toUnStakeAndClaimPage,
} from 'utils/routes';
import { toArray } from 'utils';
import { useTranslation } from 'react-i18next';

import getConfig from 'services/config';
import Big from 'big.js';
import { formatTokenAmount, removeTrailingZeros } from 'utils/calculations';
import FarmContract from 'services/FarmContract';
import {
  Container,
  FilterBlock,
  InformationBlock,
  WrapperInfoBlock,
  InfoBLock,
  TitleInfo,
  LabelInfo,
  LogoSoon,
  ButtonAndClaimList,
  RewardList,
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

export interface IFilters {
  title: string
  isActive: FilterPoolsEnum,
  disabled?: boolean,
  logoSoon?: boolean,
}

export const filters: IFilters[] = [
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
    logoSoon: !isMobile,
  },
];

export interface IMainInfo {
  title: string,
  label: string,
  show: boolean,
}

export default function Pool() {
  const { t } = useTranslation();
  const contract = useMemo(() => new FarmContract(), []);
  const {
    pools, loading, prices, userRewards, tokens,
  } = useStore();
  const {
    setAddLiquidityModalOpenState,
    setRemoveLiquidityModalOpenState,
    setStakeModalOpenState,
    setUnStakeModalOpenState,
  } = useModalsStore();
  const { id } = useParams<'id'>();
  const config = getConfig();
  const location = useLocation();
  const [totalValueLocked, setTotalValueLocked] = useState('0');
  const [poolsArray, setPoolsArray] = useState<IPool[]>([]);

  const rewardList = Object.entries(userRewards);

  const canClaimAll = rewardList.length > 0 && rewardList.find(([, value]) => Big(value).gt(0));

  const rewardPrice = rewardList.reduce((sum, [tokenId, value]) => {
    const priceToken = prices[tokenId ?? ''] || '0';
    const amount = Big(value).mul(priceToken?.price ?? '0');
    return Big(sum).plus(amount).toFixed(2);
  }, '0');

  useEffect(() => {
    if (id && pools[Number(id)]) {
      const pool = pools[Number(id)];
      if (location.pathname === toRemoveLiquidityPage(pool.id)) {
        setRemoveLiquidityModalOpenState({ isOpen: true, pool });
      } else if (location.pathname === toAddLiquidityPage(pool.id)) {
        setAddLiquidityModalOpenState({ isOpen: true, pool });
      } else if (location.pathname === toStakePage(pool.id)) {
        setStakeModalOpenState({ isOpen: true, pool });
      } else if (location.pathname === toUnStakeAndClaimPage(pool.id)) {
        setUnStakeModalOpenState({ isOpen: true, pool });
      }
    }
  }, [
    id,
    pools,
    location.pathname,
    setRemoveLiquidityModalOpenState,
    setAddLiquidityModalOpenState,
    setStakeModalOpenState,
    setUnStakeModalOpenState,
  ]);

  const onClaimReward = useCallback(() => {
    if (!canClaimAll) return;
    const rewards = rewardList.map(([tokenId, value]) => {
      const token = tokens[tokenId] || null;
      return {
        token, value,
      };
    });
    const filteredRewards = rewards.filter((el) => el.token !== null && Big(el.value).gt(0));
    if (!filteredRewards.length) return;
    contract.withdrawAllReward(filteredRewards);
  }, [contract, canClaimAll, tokens, rewardList]);

  useEffect(() => {
    const newPools = toArray(pools);
    if (newPools.length !== poolsArray.length) {
      setPoolsArray(newPools);
    }
    const newTotalValueLocked = newPools.reduce(
      (acc, item:IPool) => acc.add(item.totalLiquidity), Big(0),
    );
    setTotalValueLocked(newTotalValueLocked.toFixed(2));
  }, [pools, poolsArray.length, loading]);

  // const [currentFilterPools, setCurrentFilterPools] = useState(FilterPoolsEnum['All Pools']);
  const [currentFilterPools, setCurrentFilterPools] = useState(FilterPoolsEnum.Farming);

  const mainInfo: IMainInfo[] = [
    {
      title: t('pool.totalValueLocked'),
      label: Big(totalValueLocked ?? 0).lte(0) ? '-' : `$${totalValueLocked}`,
      show: true,
    },
    {
      title: t('pool.totalDayLocked'),
      label: '-',
      show: true,
    },
    {
      title: t('pool.jumboPrice'),
      label: `$${prices[config.jumboAddress].price ?? 0}` || '-',
      show: true,
    },
    {
      title: t('pool.weeklyEmissions'),
      label: '-',
      show: !canClaimAll,
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
            {canClaimAll && (
              <ButtonAndClaimList>
                <ButtonClaim
                  onClick={onClaimReward}
                >
                  <span>${removeTrailingZeros(rewardPrice)} </span>
                  <span>Claim All</span>
                </ButtonClaim>
                <RewardList>
                  {rewardList.map(([token, value]) => {
                    const isShowing = Big(value).lte(0);
                    const tokenContract = tokens[token];
                    if (isShowing || !tokenContract) return null;
                    const claimReward = formatTokenAmount(
                      value, tokenContract.metadata.decimals, 6,
                    );
                    const tokenSymbol = tokenContract.metadata.symbol;
                    return (
                      <p key={tokenSymbol}>
                        {claimReward} <span>{tokenSymbol}</span>
                      </p>
                    );
                  })}
                </RewardList>
              </ButtonAndClaimList>
            )}
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
