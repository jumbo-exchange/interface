import Big from 'big.js';
import { farmStatus, getFarmStatus } from 'components/FarmStatus';
import getConfig from 'services/config';
import FungibleTokenContract from 'services/contracts/FungibleToken';
import {
  IFarm, IPool, ITokenPrice, PoolType, IDayVolume,
} from 'store';
import { formatTokenAmount, removeTrailingZeros } from './calculations';
import {
  DAYS_A_YEAR,
  LP_TOKEN_DECIMALS,
  SECONDS_IN_A_DAY,
  STABLE_LP_TOKEN_DECIMALS,
  SWAP_INPUT_KEY,
  SWAP_OUTPUT_KEY,
  ONE_HUNDRED,
} from './constants';

const ACCOUNT_TRIM_LENGTH = 10;

Big.RM = Big.roundDown;
Big.DP = 30;

export const trimAccountId = (accountId: string) => {
  if (accountId.length > 20) {
    return `${accountId.slice(0, ACCOUNT_TRIM_LENGTH)}...`;
  }
  return accountId;
};

export const getUpperCase = (value:string) => value.toUpperCase();

export const inputRegex = RegExp('^\\d*(?:\\\\[.])?\\d*$'); // match escaped "." characters via in a non-capturing group

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function formatPool(pool: any): IPool {
  const CURRENT_LP_TOKEN_DECIMALS = pool.pool_kind === PoolType.SIMPLE_POOL
    ? LP_TOKEN_DECIMALS
    : STABLE_LP_TOKEN_DECIMALS;

  return {
    id: pool.id,
    lpTokenId: `:${pool.id}`,
    lpTokenDecimals: CURRENT_LP_TOKEN_DECIMALS,
    type: pool.pool_kind === PoolType.STABLE_SWAP ? PoolType.STABLE_SWAP : PoolType.SIMPLE_POOL,
    tokenAccountIds: pool.token_account_ids,
    amounts: pool.amounts,
    supplies: pool.amounts.reduce(
      (acc: { [tokenId: string]: string }, amount: string, i: number) => {
        acc[pool.token_account_ids[i]] = amount;
        return acc;
      },
      {},
    ),
    totalFee: pool.total_fee,
    sharesTotalSupply: pool.shares_total_supply,
    amp: pool.amp,
    totalLiquidity: '0',
    farms: null,
    dayVolume: '0',
    apy: '0',
  };
}

export const sortPoolsByLiquidity = (
  pools: IPool[], tokens: {[key:string]: FungibleTokenContract},
) => {
  try {
    return pools.sort((first, second) => {
      const firstPoolLiquidity = Object.entries(first.supplies)
        .reduce((acc, [key, value]) => acc.add(
          formatTokenAmount(value, tokens[key as string].metadata.decimals),
        ), Big(0));
      const secondPoolLiquidity = Object.entries(second.supplies)
        .reduce((acc, [key, value]) => acc.add(
          formatTokenAmount(value, tokens[key as string].metadata.decimals),
        ), Big(0));
      return secondPoolLiquidity.minus(firstPoolLiquidity).toNumber();
    });
  } catch (e) {
    return [];
  }
};

export function getPoolsPath(
  tokenAddressInput: string,
  tokenAddressOutput: string,
  pools: IPool[],
  tokensMap: {[key:string]: FungibleTokenContract},
) :IPool[] {
  const tokens = pools.map((pool) => pool.tokenAccountIds).flat();
  if (!tokenAddressInput || !tokenAddressOutput) return [];
  if (!tokens.includes(tokenAddressInput) || !tokens.includes(tokenAddressOutput)) return [];
  if (tokenAddressInput === tokenAddressOutput) return [];
  const sortedPools = sortPoolsByLiquidity(pools, tokensMap);
  const directSwap = sortedPools.find(
    (pool) => pool.tokenAccountIds.includes(tokenAddressInput)
    && pool.tokenAccountIds.includes(tokenAddressOutput),
  );
  if (directSwap) return [directSwap];

  const inputTokenPools = sortedPools
    .filter((pool) => pool.tokenAccountIds.includes(tokenAddressInput));
  const outputTokenPools = sortedPools
    .filter((pool) => pool.tokenAccountIds.includes(tokenAddressOutput));
  const outputTokens = outputTokenPools.map((el) => el.tokenAccountIds).flat();
  const intersectionPairToken = inputTokenPools
    .map((el) => el.tokenAccountIds)
    .flat()
    .find((el) => outputTokens.includes(el));
  if (intersectionPairToken) {
    const firstSwap = inputTokenPools.find(
      (el) => el.tokenAccountIds.includes(intersectionPairToken),
    );
    const secondSwap = outputTokenPools.find(
      (el) => el.tokenAccountIds.includes(intersectionPairToken),
    );
    if (!firstSwap || !secondSwap) return [];
    return [firstSwap, secondSwap];
  }
  return [];
}

export const toArray = (map: {[key: string]: any}) => Object.values(map);
export const toMap = (array: any[]) => array.reduce(
  (acc, item) => ({ ...acc, [item.id]: item }), {},
);

export const calculatePriceForToken = (
  firstAmount: string,
  secondAmount: string,
  price: string,
) => {
  if (!price) return '0';
  if (Big(firstAmount).lte(0)) return '0';
  return new Big(firstAmount)
    .mul(price).div(secondAmount).toFixed(2);
};

export const calcPoolApy = (pool: IPool, dayVolume: string, totalLiquidity: string): string => {
  const firstMultiplier = Big(1).div(totalLiquidity);
  const secondMultiplier = Big(pool.totalFee).mul(dayVolume).div(10);
  const mulFirstAndSecond = firstMultiplier.mul(secondMultiplier);
  const poolAPY = mulFirstAndSecond.mul(365);
  return poolAPY.toFixed();
};

export const calculateTotalAmountAndDayVolume = (
  pricesData: {[key: string]: ITokenPrice},
  metadataMap: {[key: string]: FungibleTokenContract},
  newPoolMap: {[key: string]: IPool},
  dayVolumesData: {[key: string]: IDayVolume},
):{[key:string]: IPool} => {
  const calculatedPools = toArray(newPoolMap).map((pool: IPool) => {
    const config = getConfig();

    const [firstToken, secondToken] = pool.tokenAccountIds;
    let firstPrice = pricesData[firstToken]?.price ?? 0;
    let secondPrice = pricesData[secondToken]?.price ?? 0;
    let firstDecimals = metadataMap[firstToken]?.metadata.decimals;
    let secondDecimals = metadataMap[secondToken]?.metadata.decimals;

    const firstAmount = formatTokenAmount(
      pool.supplies[firstToken], firstDecimals,
    );
    const secondAmount = formatTokenAmount(
      pool.supplies[secondToken], secondDecimals,
    );

    if (firstToken === config.nearAddress || secondToken === config.nearAddress) {
      if (firstToken === config.nearAddress) {
        secondPrice = Big(secondAmount).gt(0) ? (new Big(firstAmount)
          .mul(firstPrice).div(secondAmount).toFixed(2)) : '0';
        secondDecimals = metadataMap[secondToken]?.metadata.decimals ?? 0;
      } else {
        firstPrice = Big(firstAmount).gt(0) ? (new Big(secondAmount)
          .mul(secondPrice).div(firstAmount).toFixed(2)) : '0';
        firstDecimals = metadataMap[secondToken]?.metadata.decimals ?? 0;
      }
    }

    if (firstPrice && secondPrice) {
      const firstLiquidity = new Big(firstAmount).mul(firstPrice);
      const secondLiquidity = new Big(secondAmount).mul(secondPrice);
      const totalLiquidityAmount = new Big(firstLiquidity).add(secondLiquidity);
      const totalLiquidityValue = removeTrailingZeros(totalLiquidityAmount.toFixed());

      const dayVolumeData = dayVolumesData[pool.id] || null;
      if (!dayVolumeData) return { ...pool, totalLiquidity: totalLiquidityValue };

      const tokenFirst = pricesData[dayVolumeData.tokenFirst]?.price ?? 0;
      const tokenSecond = pricesData[dayVolumeData.tokenSecond]?.price ?? 0;
      const tokenFirstDecimals = metadataMap[dayVolumeData.tokenFirst]?.metadata.decimals;
      const tokenSecondDecimals = metadataMap[dayVolumeData.tokenSecond]?.metadata.decimals;
      const tokenFirstAmount = formatTokenAmount(
        dayVolumeData.volume24hFirst, tokenFirstDecimals,
      );
      const tokenSecondAmount = formatTokenAmount(
        dayVolumeData.volume24hSecond, tokenSecondDecimals,
      );

      const firstDayVolume = new Big(tokenFirst).mul(tokenFirstAmount);
      const secondDayVolume = new Big(tokenSecond).mul(tokenSecondAmount);
      const totalDayVolumeAmount = firstDayVolume.add(secondDayVolume);
      const totalDayVolumeValue = removeTrailingZeros(totalDayVolumeAmount.toFixed());
      return {
        ...pool,
        totalLiquidity: totalLiquidityValue,
        dayVolume: totalDayVolumeValue,
        apy: calcPoolApy(pool, totalDayVolumeValue, totalLiquidityValue),
      };
    }
    return {
      ...pool,
    };
  });

  return toMap(calculatedPools);
};

export function formatFarm(
  farm: any,
  pools: IPool[],
  seeds: any,
): IFarm | null {
  const lpTokenId = farm.farm_id.slice(farm.farm_id.indexOf('@') + 1, farm.farm_id.lastIndexOf('#'));
  const pool = pools.find(
    (poolItem: IPool) => poolItem.id === Number(lpTokenId),
  );
  if (!pool) return null;

  const totalSeedAmount = seeds[farm.seed_id] ?? '0';

  if (farm.farm_status === farmStatus.created) return null;
  const statusFarm = getFarmStatus(farm.farm_status, farm.start_at);

  return {
    id: farm.farm_id,
    type: farm.farm_kind,
    status: statusFarm,
    seedId: farm.seed_id,
    rewardTokenId: farm.reward_token,
    startAt: farm.start_at,
    rewardPerSession: farm.reward_per_session,
    sessionInterval: farm.session_interval,
    totalReward: farm.total_reward,
    curRound: farm.cur_round,
    lastRound: farm.last_round,
    claimedReward: farm.claimed_reward,
    unclaimedReward: farm.unclaimed_reward,

    poolId: pool.id,
    totalSeedAmount,
    apy: '0',
  };
}

export function isNotNullOrUndefined<T extends Object>(input: null | undefined | T): input is T {
  return input != null;
}

export function onlyUniqueValues(values: string[]) {
  return Array.from(new Set(values));
}

export const saveSwapTokens = (
  inputToken: string | null | undefined, outputToken: string | null| undefined,
) => {
  if (!inputToken || !outputToken) return;
  localStorage.setItem(SWAP_INPUT_KEY, inputToken);
  localStorage.setItem(SWAP_OUTPUT_KEY, outputToken);
};

export const calcStakedAmount = (shares: string, pool: IPool) => {
  const { sharesTotalSupply, totalLiquidity } = pool;
  if (Big(sharesTotalSupply).lte('0') || Big(shares).lte('0')) return null;
  const formatTotalShares = formatTokenAmount(sharesTotalSupply, pool.lpTokenDecimals);
  const formatShares = formatTokenAmount(shares, pool.lpTokenDecimals);

  const numerator = Big(formatShares).times(totalLiquidity);
  const sharesInUsdt = Big(numerator).div(formatTotalShares).toFixed(2);
  return removeTrailingZeros(sharesInUsdt);
};

export const getTotalApy = (farms: IFarm[]) => {
  let apy = new Big('0');
  if (farms.length > 1) {
    farms.forEach((item) => {
      apy = Big(item.apy).add(apy);
    });
  } else {
    apy = Big(farms[0].apy);
  }
  return apy.toFixed();
};

export const calcAprAndStakedAmount = (
  pricesData: {[key: string]: ITokenPrice},
  metadataMap: {[key: string]: FungibleTokenContract},
  resultedPoolsArray: {[key:string]: IPool},
  newFarmMap: {[key:string]: IFarm},
) => {
  const calculatedFarms = toArray(newFarmMap).map((farm: IFarm) => {
    const pool: IPool = toArray(resultedPoolsArray)
      .find((item: IPool) => item.id === farm.poolId);

    const rewardToken = metadataMap[farm.rewardTokenId] || null;
    const rewardTokenPrice = pricesData[farm.rewardTokenId]?.price || '0';
    const totalStaked = calcStakedAmount(farm.totalSeedAmount, pool);
    const yourStaked = calcStakedAmount(farm.userStaked || '0', pool);
    if (totalStaked && Big(totalStaked).gt(0)) {
      const rewardNumberPerDay = Big(farm.rewardPerSession)
        .div(farm.sessionInterval)
        .mul(SECONDS_IN_A_DAY).toFixed();

      const rewardsPerDay = formatTokenAmount(rewardNumberPerDay, rewardToken.metadata.decimals);
      const firstMultiplier = Big(1).div(totalStaked);
      const secondMultiplier = Big(rewardsPerDay).mul(rewardTokenPrice);
      const mulFirstAndSecond = firstMultiplier.mul(secondMultiplier);
      const farmAPY = mulFirstAndSecond.mul(DAYS_A_YEAR).mul(ONE_HUNDRED).toFixed();
      return {
        ...farm,
        totalStaked,
        yourStaked,
        apy: farmAPY,
      };
    }
    return {
      ...farm,
      totalStaked,
      yourStaked,
      apy: '0',
    };
  });

  return toMap(calculatedFarms);
};
