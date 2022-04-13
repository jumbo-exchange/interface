import React, {
  useEffect, useState, useMemo, useCallback,
} from 'react';
import { FilterButton } from 'components/Button';
import { isMobile } from 'utils/userAgent';
import {
  IFarm, IPool, useModalsStore, useStore,
} from 'store';
import { useLocation, useParams } from 'react-router-dom';
import { toArray } from 'utils';
import { useTranslation } from 'react-i18next';

import getConfig from 'services/config';
import Big from 'big.js';
import { displayPriceWithComma } from 'utils/calculations';
import FarmContract from 'services/contracts/FarmContract';
import { wallet } from 'services/near';
import moment from 'moment';
import { UPDATE_CLAIM_REWARD_DATE, CLAIM_REWARD_DATE_KEY, INITIAL_INPUT_PLACEHOLDER } from 'utils/constants';
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
import ClaimAllButton, { getCanClaimAll } from './ClaimAllButton';

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
    pools, loading, prices, userRewards, farms, setUserRewards,
  } = useStore();
  const { openModalByUrl } = useModalsStore();
  const { id } = useParams<'id'>();
  const config = getConfig();
  const location = useLocation();
  const [totalValueLocked, setTotalValueLocked] = useState('0');
  const [totalDayVolume, setTotalDayVolume] = useState('0');
  const [poolsArray, setPoolsArray] = useState<IPool[]>([]);
  const [searchValue, setSearchValue] = useState<string>(INITIAL_INPUT_PLACEHOLDER);
  const [currentFilterPools, setCurrentFilterPools] = useState(FilterPoolsEnum.AllPools);
  const [isShowingEndedOnly, setIsShowingEndedOnly] = useState<boolean>(false);

  const rewardList = Object.entries(userRewards);
  const canClaimAll = useMemo(() => getCanClaimAll(rewardList), [rewardList]);

  useEffect(() => {
    if (id && pools[Number(id)]) {
      const pool = pools[Number(id)];
      openModalByUrl(pool, location.pathname);
    }
  }, [id, pools, location.pathname]);

  useEffect(() => {
    const newPools = toArray(pools);
    if (loading) setPoolsArray(newPools);
    if (newPools.length !== poolsArray.length && searchValue === INITIAL_INPUT_PLACEHOLDER) {
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
  }, [pools, poolsArray.length, loading, searchValue]);

  const mainInfo: IMainInfo[] = [
    {
      title: t('pool.totalValueLocked'),
      label: Big(totalValueLocked ?? 0).lte(0) ? '-' : `$${displayPriceWithComma(totalValueLocked)}`,
      show: true,
    },
    {
      title: t('pool.totalDayLocked'),
      label: Big(totalDayVolume).lte(0) ? '-' : `$${displayPriceWithComma(totalDayVolume)}`,
      show: true,
    },
    {
      title: t('pool.jumboPrice'),
      label: `$${prices[config.jumboAddress].price}` || '-',
      show: true,
    },
    {
      title: t('pool.weeklyEmissions'),
      label: '-',
      show: !canClaimAll,
    },
  ];

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
      return moment(currentDate).valueOf() - UPDATE_CLAIM_REWARD_DATE;
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
    if (loading) return;
    const currentDate = moment().valueOf();
    const previousDate = tryGetLocalStorage(CLAIM_REWARD_DATE_KEY);
    if (!isConnected
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
            <ClaimAllButton rewardList={rewardList} />
          </InformationBlock>
        )}

      <PoolSettings
        setPoolsArray={setPoolsArray}
        currentFilterPools={currentFilterPools}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setIsShowingEndedOnly={setIsShowingEndedOnly}
      />
      <PoolResult
        poolsArray={poolsArray}
        currentFilterPools={currentFilterPools}
        setCurrentFilterPools={setCurrentFilterPools}
        isShowingEndedOnly={isShowingEndedOnly}
      />
    </Container>
  );
}
