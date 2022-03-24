import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { getUserWalletTokens, wallet as nearWallet } from 'services/near';
import {
  contractMethods, IPool, StoreContextType, TokenType,
} from 'store';
import {
  calculatePriceForToken,
  formatPool, getPoolsPath, toArray, toMap, calculateTotalAmount, formatFarm,
} from 'utils';

import getConfig from 'services/config';
import SpecialWallet, { createContract } from 'services/wallet';
import FungibleTokenContract from 'services/FungibleToken';
import PoolContract from 'services/PoolContract';
import {
  NEAR_TOKEN_ID, SWAP_INPUT_KEY, SWAP_OUTPUT_KEY, URL_INPUT_TOKEN, URL_OUTPUT_TOKEN,
} from 'utils/constants';
import { formatTokenAmount } from 'utils/calculations';
import FarmContract from 'services/FarmContract';
import { Farm, ITokenPrice, PoolType } from './interfaces';

const config = getConfig();
const url = new URL(window.location.href);

const DEFAULT_PAGE_LIMIT = 100;
const JUMBO_INITIAL_DATA = {
  id: config.nearAddress,
  decimal: 18,
  symbol: 'JUMBO',
  price: '0',
};

const pricesInitialState = {
  [config.nearAddress]: {
    id: config.nearAddress,
    decimal: 24,
    symbol: 'near',
    price: '10.45',
  },
  [config.jumboAddress]: JUMBO_INITIAL_DATA,
};

const initialState: StoreContextType = {
  loading: false,
  priceLoading: false,
  setLoading: () => {},
  setPriceLoading: () => {},

  contract: null,
  wallet: null,
  setWallet: () => {},
  balances: {},
  setBalances: () => {},
  getTokenBalance: () => '0',
  updateTokensBalances: () => {},

  pools: {},
  setPools: () => {},
  currentPools: [],
  setCurrentPools: () => {},
  tokens: {},
  setTokens: () => {},
  getToken: () => null,

  setCurrentToken: () => {},
  prices: pricesInitialState,
  setPrices: () => {},

  inputToken: null,
  setInputToken: () => {},
  outputToken: null,
  setOutputToken: () => {},
  updatePools: () => {},
  findTokenBySymbol: () => {},

  farms: {},
  setFarms: () => {},
};

const StoreContextHOC = createContext<StoreContextType>(initialState);

export const getPriceData = async () => {
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
};

export const StoreContextProvider = (
  { children }:{ children: JSX.Element },
) => {
  const contract: any = createContract(nearWallet, config.contractId, contractMethods);
  const poolContract = new PoolContract();
  const farmContract = new FarmContract();

  const [loading, setLoading] = useState<boolean>(initialState.loading);
  const [priceLoading, setPriceLoading] = useState<boolean>(initialState.loading);

  const [wallet, setWallet] = useState<SpecialWallet| null>(initialState.wallet);
  const [balances, setBalances] = useState<{[key:string]: string}>(initialState.balances);

  const [pools, setPools] = useState<{[key:string]: IPool}>(initialState.pools);
  const [currentPools, setCurrentPools] = useState<IPool[]>(initialState.currentPools);
  const [tokens, setTokens] = useState<{[key: string]: FungibleTokenContract}>(initialState.tokens);
  const [prices, setPrices] = useState<{[key: string]: ITokenPrice}>(initialState.prices);

  const [inputToken, setInputToken] = useState<FungibleTokenContract | null>(
    initialState.inputToken,
  );
  const [outputToken, setOutputToken] = useState<FungibleTokenContract | null>(
    initialState.outputToken,
  );

  const [farms, setFarms] = useState<{[key:string]: Farm}>(initialState.farms);

  const setCurrentToken = (activeToken: FungibleTokenContract, tokenType: TokenType) => {
    const poolArray = toArray(pools);
    if (tokenType === TokenType.Output) {
      if (!inputToken) return;
      setOutputToken(activeToken);
      const availablePools = getPoolsPath(
        inputToken.contractId, activeToken.contractId, poolArray, tokens,
      );
      setCurrentPools(availablePools);
    } else {
      if (!outputToken) return;
      setInputToken(activeToken);
      const availablePools = getPoolsPath(
        activeToken.contractId, outputToken.contractId, poolArray, tokens,
      );
      setCurrentPools(availablePools);
    }
  };

  const findTokenBySymbol = (
    symbol: string,
  ) => {
    const [token] = toArray(tokens)
      .filter((el) => el.metadata.symbol.toLowerCase() === symbol.toLowerCase());
    return token;
  };

  const initialLoading = async () => {
    try {
      setLoading(true);
      const isSignedIn = nearWallet.isSignedIn();
      const poolsLength = await contract.get_number_of_pools();
      const pages = Math.ceil(poolsLength / DEFAULT_PAGE_LIMIT);

      const poolsResult = (await Promise.all(
        [...Array(pages)]
          .map((_, i) => contract.get_pools(
            { from_index: i * DEFAULT_PAGE_LIMIT, limit: DEFAULT_PAGE_LIMIT },
          )),
      )).flat();
      let pricesData;

      try {
        pricesData = await getPriceData();
      } catch (e) {
        pricesData = initialState.prices;
        console.warn('Price data loading failed');
      }

      const userTokens = await getUserWalletTokens();

      const tokenAddresses = Array.from(
        new Set(
          [...poolsResult
            .flatMap((pool: any) => pool.token_account_ids),
          config.nearAddress,
          NEAR_TOKEN_ID,
          ...userTokens,
          ],
        ),
      );

      const poolArray = poolsResult
        .map((pool: any, index: number) => formatPool(pool, index))
        .filter((pool: IPool) => pool.type === PoolType.SIMPLE_POOL);
        // WILL BE OPENED AS SOON AS STABLE SWAP WILL BE AVAILABLE
        // || (pool.type === PoolType.STABLE_SWAP && pool.id === config.stablePoolId)

      let newPoolArray = poolArray;

      const tokensMetadata: any[] = await Promise.all(
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
      const metadataMap = tokensMetadataFiltered.reduce(
        (acc, curr) => ({ ...acc, [curr.contractId]: curr }), {},
      );

      const farmsLength = await farmContract.getNumberOfFarms();
      const farmsPages = Math.ceil(farmsLength / DEFAULT_PAGE_LIMIT);

      const farmsResult = (await Promise.all(
        [...Array(farmsPages)]
          .map((_, i) => farmContract.getListFarms(
            i * DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_LIMIT,
          )),
      )).flat();

      const farmArray = await Promise.all(farmsResult
        .map(async (farm: any, index) => {
          const seeds = await farmContract.getSeeds(index * DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_LIMIT);
          return {
            ...formatFarm(farm, index, poolArray, seeds, metadataMap),
          };
        }));
      let newFarmArray = farmArray;

      if (isSignedIn) {
        setWallet(nearWallet);
        const accountId = nearWallet.getAccountId();
        try {
          const balancesArray = await Promise.all(
            tokensMetadataFiltered.map(async (token) => {
              const balance = await token.contract.getBalanceOf({ accountId });
              return { contractId: token.contractId, balance };
            }),
          );
          const balancesMap = balancesArray.reduce((acc, curr) => (
            { ...acc, [curr.contractId]: curr.balance }
          ), {});
          setBalances(balancesMap);
          newPoolArray = await Promise.all(poolArray.map(async (pool: IPool) => {
            const volumes = await poolContract.getPoolVolumes(pool);
            const shares = await poolContract.getSharesInPool(pool.id);

            return {
              ...pool,
              volumes,
              shares,
            };
          }));

          newFarmArray = await Promise.all(farmArray
            .map(async (farm: Farm) => {
              const staked = await farmContract.getStakedListByAccountId();
              const rewards = await farmContract.getRewards();
              const currentUserReward = await farmContract.getUnclaimedReward(farm.farmId);

              return {
                ...farm,
                userStaked: staked[farm.seedId],
                rewardNumber: rewards[farm.rewardToken],
                currentUserReward,
              };
            }));
        } catch (e) {
          console.warn(e, 'while initial loading user specific data');
        }
      }
      const updatePool = newPoolArray.map((pool) => {
        const [poolWithFarm] = newFarmArray.filter((farm) => farm.pool.id === pool.id);

        return {
          ...pool,
          farm: poolWithFarm || null,
        };
      });

      const newPoolMap = toMap(updatePool);
      const newFarmMap = toMap(newFarmArray);

      if (
        newPoolMap[config.jumboPoolId]
        && pricesData
        && pricesData[config.nearAddress]
      ) {
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
        pricesData = {
          ...pricesData,
          [config.jumboAddress]: {
            ...JUMBO_INITIAL_DATA, price: newJumboPrice,
          },
        };
      }

      const resultedPoolsArray = calculateTotalAmount(
        pricesData,
        metadataMap,
        newPoolMap,
      );

      setTokens(metadataMap);
      setPools(resultedPoolsArray);
      setPrices(pricesData);
      setFarms(newFarmMap);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialLoading();
  }, []);

  const tryTokenByKey = (
    tokensMap: { [key: string]: FungibleTokenContract},
    tokenId: string,
    localStorageKey: string,
    urlKey: string,
  ) => {
    const urlToken = url.searchParams.get(urlKey) || '';
    if (
      url.searchParams.has(urlKey) && findTokenBySymbol(urlToken)
    ) return tokensMap[findTokenBySymbol(urlToken)?.contractId];

    const key = localStorage.getItem(localStorageKey) || '';
    if (key && tokensMap[key]) return tokensMap[key];
    return tokens[tokenId];
  };

  useEffect(() => {
    if (toArray(pools).length && toArray(tokens).length) {
      const inputTokenData = tryTokenByKey(
        tokens, NEAR_TOKEN_ID, SWAP_INPUT_KEY, URL_INPUT_TOKEN,
      );
      const outputTokenData = tryTokenByKey(
        tokens, config.nearAddress, SWAP_OUTPUT_KEY, URL_OUTPUT_TOKEN,
      );
      if (!inputTokenData || !outputTokenData) {
        setInputToken(null);
        setOutputToken(null);
        return;
      }
      setInputToken(inputTokenData);
      setOutputToken(outputTokenData);
      const availablePools = getPoolsPath(
        inputTokenData.contractId,
        outputTokenData.contractId,
        toArray(pools),
        tokens,
      );
      setCurrentPools(availablePools);
    }
  }, [toArray(tokens).length, toArray(pools).length]);

  const updatePools = (newPools: IPool[]) => {
    const newPoolSet = newPools.reduce((acc, item) => ({ ...acc, [item.id]: item }), pools);
    setPools(newPoolSet);
  };

  const updateTokensBalances = (newBalances: {[key: string]: string}) => {
    const newBalancesSet = Object.entries(newBalances).reduce((acc, [key, value]) => (
      { ...acc, [key]: value }
    ), balances);
    setBalances(newBalancesSet);
  };

  const getTokenBalance = (tokenId: string | undefined) => (tokenId ? balances[tokenId] ?? '0' : '0');
  const getToken = (tokenId: string | undefined) => (tokenId ? tokens[tokenId] ?? null : null);

  return (
    <StoreContextHOC.Provider value={{
      loading,
      setLoading,
      priceLoading,
      setPriceLoading,

      contract,
      wallet,
      setWallet,
      balances,
      setBalances,
      getTokenBalance,
      updateTokensBalances,

      pools,
      setPools,
      updatePools,
      currentPools,
      setCurrentPools,
      tokens,
      setTokens,
      getToken,
      prices,
      setPrices,

      setCurrentToken,

      inputToken,
      setInputToken,
      outputToken,
      setOutputToken,
      findTokenBySymbol,

      farms,
      setFarms,
    }}
    >
      {children}
    </StoreContextHOC.Provider>
  );
};

export const useStore = () => useContext(StoreContextHOC);
