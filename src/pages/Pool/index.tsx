import React, {
  useEffect, useState, useMemo, useCallback,
} from 'react';
import { FilterButton, ButtonClaim } from 'components/Button';
import { isMobile } from 'utils/userAgent';
import {
  IFarm, IPool, useModalsStore, useStore,
} from 'store';
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
import { wallet } from 'services/near';
import moment from 'moment';
import { UPDATE_CLAIM_REWARD_DATE, CLAIM_REWARD_DATE_KEY } from 'utils/constants';
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
  'AllPools',
  'YourLiquidity',
  'Farming',
  'SmartPools',
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
    isActive: FilterPoolsEnum.AllPools,
  },
  {
    title: 'Your Liquidity',
    isActive: FilterPoolsEnum.YourLiquidity,
  },
  {
    title: 'Farming',
    isActive: FilterPoolsEnum.Farming,
  },
  {
    title: 'Smart Pools',
    isActive: FilterPoolsEnum.SmartPools,
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
  const isConnected = wallet.isSignedIn();
  const { t } = useTranslation();
  const farmContract = useMemo(() => new FarmContract(), []);
  const {
    pools, loading, prices, userRewards, tokens, farms, setUserRewards,
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
  const [totalDayVolume, setTotalDayVolume] = useState('0');
  const [poolsArray, setPoolsArray] = useState<IPool[]>([]);
  const [isShowingEndedOnly, setIsShowingEndedOnly] = useState<boolean>(false);

  const rewardList = Object.entries(userRewards);

  const canClaimAll = rewardList.length > 0
  && rewardList.filter(([, value]) => Big(value).gt(0)).length > 0;

  const rewardPrice = rewardList.reduce((sum, [tokenId, value]) => {
    const priceToken = prices[tokenId ?? ''] || '0';
    const amountInUSD = Big(value).mul(priceToken?.price ?? '0');
    return sum.plus(amountInUSD);
  }, new Big(0));

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
    farmContract.withdrawAllReward(filteredRewards);
  }, [farmContract, canClaimAll, tokens, rewardList]);

  useEffect(() => {
    const newPools = toArray(pools);
    if (newPools.length !== poolsArray.length) {
      setPoolsArray(newPools);
    }
    const newTotalValueLocked = newPools.reduce(
      (acc, item:IPool) => acc.add(item.totalLiquidity), Big(0),
    );
    const newTotalDayVolume = newPools.reduce(
      (acc, item:IPool) => acc.add(item.dayVolume), Big(0),
    );
    setTotalValueLocked(newTotalValueLocked.toFixed(2));
    setTotalDayVolume(newTotalDayVolume.toFixed());
  }, [pools, poolsArray.length, loading]);

  const [currentFilterPools, setCurrentFilterPools] = useState(FilterPoolsEnum.AllPools);

  const mainInfo: IMainInfo[] = [
    {
      title: t('pool.totalValueLocked'),
      label: Big(totalValueLocked ?? 0).lte(0) ? '-' : `$${totalValueLocked}`,
      show: true,
    },
    {
      title: t('pool.totalDayLocked'),
      label: Big(totalValueLocked ?? 0).lte(0) ? '-' : `$${totalDayVolume}`,
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

  const rewardListArray = useMemo(() => rewardList.map(([token, value]) => {
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
  }), [tokens, rewardList]);

  const userUnclaimedRewards = Object.values(farms)
    .reduce((acc: {[key: string]: string}, farm: IFarm) => {
      if (!farm.userUnclaimedReward) return acc;
      const rewardAmount = acc[farm.seedId];
      if (rewardAmount) {
        acc[farm.seedId] = Big(rewardAmount).add(farm.userUnclaimedReward).toString();
        return acc;
      }
      if (Big(farm.userUnclaimedReward || 0).lte(0)) {
        return acc;
      }
      return {
        ...acc,
        [farm.seedId]: farm.userUnclaimedReward,
      };
    }, {});

  const haveUserUnclaimReward = Object.values(userUnclaimedRewards).length > 0;

  const tryGetLocalStorage = (localKey: string) => {
    const date = localStorage.getItem(localKey);
    if (!date) {
      const currentDate = moment().format();
      localStorage.setItem(localKey, currentDate);
      return moment(currentDate).valueOf();
    }
    return moment(date).valueOf();
  };

  const getUpdateUserReward = useCallback(async () => {
    await farmContract.claimRewardBySeed(Object.keys(userUnclaimedRewards));
    const newRewards = await farmContract.getRewards();
    setUserRewards(newRewards);
    localStorage.setItem(CLAIM_REWARD_DATE_KEY, moment().format());
  }, [farmContract, setUserRewards, userUnclaimedRewards]);

  useEffect(() => {
    const currentDate = moment().valueOf();
    const previousDate = tryGetLocalStorage(CLAIM_REWARD_DATE_KEY);
    if (!isConnected
      || loading
      || !haveUserUnclaimReward
      || currentDate - previousDate < UPDATE_CLAIM_REWARD_DATE) return;

    getUpdateUserReward();
  }, [getUpdateUserReward, haveUserUnclaimReward, isConnected, loading, userUnclaimedRewards]);

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
        ? <Slider mainInfo={mainInfo} rewardList={rewardList} />
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
                  <span>${removeTrailingZeros(rewardPrice.toFixed(2))} </span>
                  <span>Claim All</span>
                </ButtonClaim>
                <RewardList>
                  {rewardListArray}
                </RewardList>
              </ButtonAndClaimList>
            )}
          </InformationBlock>
        )}

      <PoolSettings
        setPoolsArray={setPoolsArray}
        currentFilterPools={currentFilterPools}
        setIsShowingEndedOnly={setIsShowingEndedOnly}
      />
      <PoolResult
        poolsArray={poolsArray}
        currentFilterPools={currentFilterPools}
        isShowingEndedOnly={isShowingEndedOnly}
      />
    </Container>
  );
}
