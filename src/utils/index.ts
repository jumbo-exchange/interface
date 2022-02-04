import Big from 'big.js';
import { IPool } from 'store';

const BASE = 10;
const ACCOUNT_TRIM_LENGTH = 8;

export const formatAmount = (amount: string, decimals?: number): string => (
  new Big(amount).div(new Big(BASE).pow(decimals ?? 0)).toFixed()
);

export const trimAccountId = (isMobile: boolean, accountId: string) => (isMobile
  ? `${accountId.slice(0, ACCOUNT_TRIM_LENGTH)}...` : accountId
);

export const getUpperCase = (value:string) => value.toUpperCase();

export const inputRegex = RegExp('^\\d*(?:\\\\[.])?\\d*$'); // match escaped "." characters via in a non-capturing group

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function formatPool(pool: any, id: number): IPool {
  return {
    id,
    poolKind: pool.pool_kind,
    tokenAccountIds: pool.token_account_ids,
    amounts: pool.amounts,
    totalFee: pool.total_fee,
    sharesTotalSupply: pool.shares_total_supply,
    amp: pool.amp,
    supplies: pool.amounts.reduce(
      (acc: { [tokenId: string]: string }, amount: string, i: number) => {
        acc[pool.token_account_ids[i]] = amount;
        return acc;
      },
      {},
    ),
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
