import Big from 'big.js';
import FungibleTokenContract from 'services/FungibleToken';
import { IPool, PoolType } from 'store';
import { formatTokenAmount } from './calculations';

const ACCOUNT_TRIM_LENGTH = 8;

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
  };
}

export interface IVertex {
  name: string;
  distance: number;
  predecessor: IVertex | null;
}

export const sortPoolsByLiquidity = (
  pools:IPool[], tokens: {[key:string]: FungibleTokenContract},
) => (
  pools.sort((first, second) => {
    const firstPoolLiquidity = Object.entries(first.supplies)
      .reduce((acc, [key, value]) => acc.add(
        formatTokenAmount(value, tokens[key as string].metadata.decimals),
      ), Big(0));
    const secondPoolLiquidity = Object.entries(second.supplies)
      .reduce((acc, [key, value]) => acc.add(
        formatTokenAmount(value, tokens[key as string].metadata.decimals),
      ), Big(0));
    return secondPoolLiquidity.minus(firstPoolLiquidity).toNumber();
  })
);

export function getPoolsPath(
  tokenAddressInput: string,
  tokenAddressOutput: string,
  pools: IPool[],
  tokensMap: {[key:string]: FungibleTokenContract},
) :IPool[] {
  const tokens = pools.map((pool) => pool.tokenAccountIds).flat();
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

export const toArray = (map: {[key: string]: any}) => Object.values(map);
export const toMap = (array: any[]) => array.reduce(
  (acc, item) => ({ ...acc, [item.id]: item }), {},
);
