import getConfig from 'services/config';
import FungibleTokenContract from 'services/FungibleToken';
import PoolContract from 'services/PoolContract';
import { wallet as nearWallet } from 'services/near';
import { calculatePriceForToken, toArray } from 'utils';
import { formatTokenAmount } from 'utils/calculations';
import { NEAR_TOKEN_ID } from 'utils/constants';
import { IPool } from './interfaces';

const config = getConfig();
const url = new URL(window.location.href);

export const DEFAULT_PAGE_LIMIT = 100;
export const JUMBO_INITIAL_DATA = {
  id: config.nearAddress,
  decimal: 18,
  symbol: 'JUMBO',
  price: '0',
};

export async function retrievePoolResult(pages: any, contract: any) {
  return Promise.all(
    [...Array(pages)]
      .map((_, i) => contract.get_pools(
        { from_index: i * DEFAULT_PAGE_LIMIT, limit: DEFAULT_PAGE_LIMIT },
      )),
  );
}

export function retrieveTokenAddresses(poolsResult: any, userTokens: any) {
  return Array.from(
    new Set(
      [...poolsResult
        .flatMap((pool: any) => pool.token_account_ids),
      config.nearAddress,
      NEAR_TOKEN_ID,
      ...userTokens,
      ],
    ),
  );
}

export async function retrieveFilteredTokenMetadata(tokenAddresses: any) {
  const tokensMetadata = await Promise.all(
    tokenAddresses.map(async (address: string) => {
      const ftTokenContract: FungibleTokenContract = new FungibleTokenContract(
        { wallet: nearWallet, contractId: address },
      );
      const metadata = await ftTokenContract.getMetadata();
      if (!metadata) return null;
      return { metadata, contractId: address, contract: ftTokenContract };
    }),
  );
  const tokensMetadataFiltered = tokensMetadata.filter((el) => !!el);
  return tokensMetadataFiltered;
}

export async function retrieveBalancesMap(tokensMetadataFiltered: any, accountId: string) {
  const balancesArray = await Promise.all(
    tokensMetadataFiltered.map(async (token: any) => {
      const balance = await token.contract.getBalanceOf({ accountId });
      return { contractId: token.contractId, balance };
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
    const volumes = await poolContract.getPoolVolumes(pool);
    const shares = await poolContract.getSharesInPool(pool.id);

    return {
      ...pool,
      volumes,
      shares,
    };
  }));
}

export function retrievePricesData(
  pricesData: any,
  newPoolMap: any,
  prices: any,
  metadataMap: any,
): any {
  const jumboPool = newPoolMap[config.jumboPoolId];
  const [firstToken, secondToken] = jumboPool.tokenAccountIds;
  const secondPrice = prices[firstToken]?.price ?? 0;
  const firstDecimals = metadataMap[firstToken]?.metadata.decimals;
  const secondDecimals = metadataMap[secondToken]?.metadata.decimals;

  const firstAmount = formatTokenAmount(
    jumboPool.supplies[firstToken], firstDecimals,
  );
  const secondAmount = formatTokenAmount(
    jumboPool.supplies[secondToken], secondDecimals,
  );
  const newJumboPrice = calculatePriceForToken(firstAmount, secondAmount, secondPrice);
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
) => {
  const [token] = toArray(tokens)
    .filter((el) => el.metadata.symbol.toLowerCase() === symbol.toLowerCase());
  return token;
};

export const tryTokenByKey = (
  tokensMap: { [key: string]: FungibleTokenContract},
  tokenId: string,
  localStorageKey: string,
  urlKey: string,
) => {
  const urlToken = url.searchParams.get(urlKey) || '';
  if (
    url.searchParams.has(urlKey) && findTokenBySymbol(urlToken, tokensMap)
  ) return tokensMap[findTokenBySymbol(urlToken, tokensMap)?.contractId];

  const key = localStorage.getItem(localStorageKey) || '';
  if (key && tokensMap[key]) return tokensMap[key];
  return tokensMap[tokenId];
};
