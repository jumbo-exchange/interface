import getConfig from 'services/config';
import FungibleTokenContract from 'services/FungibleToken';
import PoolContract from 'services/PoolContract';
import FarmContract from 'services/FarmContract';
import { wallet as nearWallet } from 'services/near';
import { calculatePriceForToken, isNotNullOrUndefined, toArray } from 'utils';
import { formatTokenAmount } from 'utils/calculations';
import { NEAR_TOKEN_ID } from 'utils/constants';
import { IDayVolume, IPool, ITokenPrice } from './interfaces';
import { pricesInitialState } from './store';

const config = getConfig();
const url = new URL(window.location.href);

export const DEFAULT_PAGE_LIMIT = 100;
export const JUMBO_INITIAL_DATA = {
  id: config.nearAddress,
  decimal: 18,
  symbol: 'JUMBO',
  price: '0',
};
export const NEAR_INITIAL_DATA = {
  id: config.nearAddress,
  decimal: 24,
  symbol: 'near',
  price: '0',
};

function assertFulfilled<T>(item: PromiseSettledResult<T>): item is PromiseFulfilledResult<T> {
  return item.status === 'fulfilled';
}

export async function retrievePoolResult(pages: number, contract: PoolContract) {
  return (await Promise.allSettled(
    [...Array(pages)]
      .map((_, i) => contract.getPools(i * DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_LIMIT)),
  )).filter(assertFulfilled)
    .map(({ value }) => value)
    .flat();
}

export async function retrieveFarmsResult(farmsPages: number, farmContract: FarmContract) {
  return (await Promise.allSettled(
    [...Array(farmsPages)]
      .map((_, i) => farmContract.getListFarms(
        i * DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_LIMIT,
      )),
  )).filter(assertFulfilled)
    .map(({ value }) => value)
    .flat();
}

export function retrieveTokenAddresses(poolsResult: any, userTokens: any): string[] {
  return Array.from(
    new Set(
      [...poolsResult
        .flatMap((pool: any) => pool.token_account_ids),
      NEAR_TOKEN_ID,
      config.nearAddress,
      ...userTokens,
      ],
    ),
  );
}

export async function getPriceData(): Promise<{[key: string]: ITokenPrice}> {
  try {
    const pricesData = await fetch(`${config.indexerUrl}/token-prices`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
      .then((res) => res.json())
      .then((list) => list);
    return pricesData.reduce(
      (acc: {[key: string]: ITokenPrice}, item: ITokenPrice) => ({
        ...acc, [item.id]: item,
      }), {},
    );
  } catch (e) {
    console.warn(`Error ${e} while loading prices from ${config.indexerUrl}/token-prices`);
    return pricesInitialState;
  }
}

export async function getNearPrice(): Promise<string | null> {
  try {
    const pricesData = await fetch(`${config.helperUrl}/fiat`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
      .then((res) => res.json())
      .then((list) => list.near.usd || 0);
    return pricesData;
  } catch (e) {
    console.warn('Near price loading failed');
    return null;
  }
}

export async function getPrices(): Promise<{[key: string]: ITokenPrice}> {
  const allPrices = await getPriceData();
  const nearPrice = await getNearPrice();

  if (nearPrice) {
    return {
      ...allPrices,
      [config.nearAddress]: { ...allPrices[config.nearAddress], price: nearPrice },
    };
  }
  return allPrices;
}

export async function retrieveFilteredTokenMetadata(tokenAddresses: string[]):
Promise<FungibleTokenContract[]> {
  const tokensMetadata: (FungibleTokenContract | null)[] = await Promise.all(
    tokenAddresses.map(async (address: string) => {
      const ftTokenContract: FungibleTokenContract = new FungibleTokenContract(
        { wallet: nearWallet, contractId: address },
      );
      const metadata = await ftTokenContract.getMetadata();
      if (!metadata) return null;
      return ftTokenContract;
    }),
  );
  const tokensMetadataFiltered = tokensMetadata.filter(isNotNullOrUndefined);
  return tokensMetadataFiltered;
}

export async function retrieveBalancesMap(
  tokensMetadataFiltered: FungibleTokenContract[],
  accountId: string,
): Promise<{ [key: string]: string; }> {
  const balancesArray: {contractId: string, balance: string}[] = await Promise.all(
    tokensMetadataFiltered.map(async (tokenContract: FungibleTokenContract) => {
      const balance: string = await tokenContract.getBalanceOf({ accountId }) || 0;
      return { contractId: tokenContract.contractId, balance };
    }),
  );

  return balancesArray.reduce((acc, curr) => (
    { ...acc, [curr.contractId]: curr.balance }
  ), {});
}

export async function retrieveNewPoolArray(
  poolArray: IPool[],
  poolContract: PoolContract,
): Promise<IPool[]> {
  return Promise.all(poolArray.map(async (pool: IPool) => {
    const [volumes, shares] = await Promise.all([
      poolContract.getPoolVolumes(pool),
      poolContract.getSharesInPool(pool.id),
    ]);

    return {
      ...pool,
      volumes,
      shares,
    };
  }));
}

export function retrievePricesData(
  pricesData: {[key: string]: ITokenPrice},
  newPoolMap: {[key: string]: IPool},
  metadataMap: {[key: string]: FungibleTokenContract},
): {[key: string]: ITokenPrice} {
  const jumboPool = newPoolMap[config.jumboPoolId];
  const [firstToken, secondToken] = jumboPool.tokenAccountIds;
  const [wrapNear, jumboToken] = firstToken === config.nearAddress
    ? [firstToken, secondToken] : [secondToken, firstToken];
  const nearPrice = pricesData[config.nearAddress].price || '0';
  const firstDecimals = metadataMap[wrapNear]?.metadata.decimals;
  const secondDecimals = metadataMap[jumboToken]?.metadata.decimals;

  const firstAmount = formatTokenAmount(
    jumboPool.supplies[wrapNear], firstDecimals,
  );
  const secondAmount = formatTokenAmount(
    jumboPool.supplies[jumboToken], secondDecimals,
  );
  const newJumboPrice = calculatePriceForToken(firstAmount, secondAmount, nearPrice);
  return {
    ...pricesData,
    [config.jumboAddress]: {
      ...JUMBO_INITIAL_DATA, price: newJumboPrice,
    },
  };
}

export const findTokenBySymbol = (
  symbol: string,
  tokens: {[key: string]: FungibleTokenContract},
) => toArray(tokens)
  .find((el) => el.metadata.symbol.toLowerCase() === symbol.toLowerCase());

export const tryTokenByKey = (
  tokensMap: { [key: string]: FungibleTokenContract},
  tokenId: string,
  localStorageKey: string,
  urlKey: string,
) => {
  const urlToken = url.searchParams.get(urlKey) || '';
  const tokenFromMap = findTokenBySymbol(urlToken, tokensMap);
  if (
    url.searchParams.has(urlKey) && tokenFromMap
  ) return tokensMap[tokenFromMap.contractId];

  const key = localStorage.getItem(localStorageKey) || '';
  if (key && tokensMap[key]) return tokensMap[key];
  return tokensMap[tokenId];
};

export const getToken = (
  tokenId: string,
  tokens: {[key: string]: FungibleTokenContract},
): FungibleTokenContract | null => (tokenId ? tokens[tokenId] ?? null : null);

export async function getDayVolumeData(): Promise<{[key: string]: IDayVolume}> {
  try {
    const dayVolumesData = await fetch(`${config.indexerUrl}/pool-volumes`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
      .then((res) => res.json())
      .then((list) => list);
    return dayVolumesData.reduce(
      (acc: {[key: string]: IDayVolume}, item: IDayVolume) => ({
        ...acc, [item.id]: item,
      }), {},
    );
  } catch (e) {
    console.warn(`Error ${e} while loading prices from ${config.indexerUrl}/pool-volumes`);
    return {};
  }
}
