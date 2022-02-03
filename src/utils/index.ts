import Big from 'big.js';
import { IPool, PoolType } from 'store';

const ACCOUNT_TRIM_LENGTH = 8;

export const trimAccountId = (isMobile: boolean, accountId: string) => (isMobile
  ? `${accountId.slice(0, ACCOUNT_TRIM_LENGTH)}...` : accountId
);

export const formatBalance = (value:string):string => {
  if (!value || value === '0') return '0';
  const formattedValue = new Big(value);

  if (formattedValue.lte('0.00001')) return '>0.00001';
  return formattedValue.toFixed(5);
};

export const getUpperCase = (value:string) => value.toUpperCase();

export const inputRegex = RegExp('^\\d*(?:\\\\[.])?\\d*$'); // match escaped "." characters via in a non-capturing group

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function formatPool(pool: any, id: number): IPool {
  return {
    id,
    type: pool === PoolType.STABLE_SWAP ? PoolType.STABLE_SWAP : PoolType.SIMPLE_POOL,
    poolKind: pool.pool_kind,
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
  };
}

export interface IVertex {
  name: string;
  distance: number;
  predecessor: IVertex | null;
}

export function getPoolsPath(
  tokenAddressInput: string,
  tokenAddressOutput: string,
  pools: IPool[],
) :IPool[] {
  const tokens = pools.map((pool) => pool.tokenAccountIds).flat();
  if (!tokens.includes(tokenAddressInput) || !tokens.includes(tokenAddressOutput)) return [];
  if (tokenAddressInput === tokenAddressOutput) return [];

  const directSwap = pools.find(
    (pool) => pool.tokenAccountIds.includes(tokenAddressInput)
    && pool.tokenAccountIds.includes(tokenAddressOutput),
  );
  if (directSwap) return [directSwap];
  const inputTokenPools = pools.filter((pool) => pool.tokenAccountIds.includes(tokenAddressInput));
  const outputTokenPools = pools.filter(
    (pool) => pool.tokenAccountIds.includes(tokenAddressOutput),
  );
  const outputTokens = outputTokenPools.map((el) => el.tokenAccountIds).flat();
  const intersectionPairs = inputTokenPools
    .map((el) => el.tokenAccountIds)
    .flat()
    .find((el) => outputTokens.includes(el));
  if (intersectionPairs?.length) {
    const FIRST_TOKEN = 1;
    const intersectionToken = intersectionPairs[FIRST_TOKEN];
    const firstSwap = inputTokenPools.find(
      (el) => el.tokenAccountIds.includes(intersectionToken),
    );
    const secondSwap = outputTokenPools.find(
      (el) => el.tokenAccountIds.includes(intersectionToken),
    );
    if (!firstSwap || !secondSwap) return [];
    return [firstSwap, secondSwap];
  }
  return [];
}
