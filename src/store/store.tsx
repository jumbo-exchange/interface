import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { getUserWalletTokens, wallet as nearWallet } from 'services/near';
import {
  IPool, StoreContextType, TokenType,
} from 'store';
import {
  calculatePriceForToken,
  formatPool, getPoolsPath, toArray, toMap, calculateTotalAmount, formatFarm,
} from 'utils';

import getConfig from 'services/config';
import SpecialWallet from 'services/wallet';
import FungibleTokenContract from 'services/FungibleToken';
import PoolContract from 'services/PoolContract';
import {
  NEAR_TOKEN_ID, SWAP_INPUT_KEY, SWAP_OUTPUT_KEY, URL_INPUT_TOKEN, URL_OUTPUT_TOKEN,
} from 'utils/constants';
import { formatTokenAmount } from 'utils/calculations';
import FarmContract from 'services/FarmContract';
import Big from 'big.js';
import { Farm, ITokenPrice, PoolType } from './interfaces';
import {
  JUMBO_INITIAL_DATA,
  NEAR_INITIAL_DATA,
  DEFAULT_PAGE_LIMIT,
  retrievePoolResult,
  retrieveTokenAddresses,
  retrieveFilteredTokenMetadata,
  retrieveBalancesMap,
  retrieveNewPoolArray,
  retrievePricesData,
  tryTokenByKey,
  getPrices,
} from './helpers';

const config = getConfig();

export const pricesInitialState = {
  [config.nearAddress]: NEAR_INITIAL_DATA,
  [config.jumboAddress]: JUMBO_INITIAL_DATA,
};

const initialState: StoreContextType = {
  loading: false,
  priceLoading: false,
  setLoading: () => {},
  setPriceLoading: () => {},

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

  setCurrentToken: () => {},
  prices: pricesInitialState,
  setPrices: () => {},

  inputToken: null,
  setInputToken: () => {},
  outputToken: null,
  setOutputToken: () => {},
  updatePools: () => {},
  farms: {},
  setFarms: () => {},
};

const StoreContextHOC = createContext<StoreContextType>(initialState);

export const StoreContextProvider = (
  { children }:{ children: JSX.Element },
) => {
  const poolContract = useMemo(() => new PoolContract(), []);
  const farmContract = useMemo(() => new FarmContract(), []);

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

  const setCurrentToken = useCallback(
    (activeToken: FungibleTokenContract, tokenType: TokenType) => {
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
    },
    [pools, outputToken, inputToken, tokens],
  );

  useEffect(() => {
    const initialLoading = async () => {
      try {
        setLoading(true);
        const isSignedIn = nearWallet.isSignedIn();
        const poolsLength = await poolContract.getNumberOfPools();
        const pages = Math.ceil(poolsLength / DEFAULT_PAGE_LIMIT);

        const [poolsResult, pricesData] = await Promise.all([
          await retrievePoolResult(pages, poolContract),
          await getPrices(),
        ]);

        const userTokens = await getUserWalletTokens();

        const tokenAddresses = retrieveTokenAddresses(poolsResult, userTokens);

        const poolArray = poolsResult
          .map((pool: any, index: number) => formatPool(pool, index))
          .filter((pool: IPool) => pool.type === PoolType.SIMPLE_POOL);
          // WILL BE OPENED AS SOON AS STABLE SWAP WILL BE AVAILABLE
          // || (pool.type === PoolType.STABLE_SWAP && pool.id === config.stablePoolId)

        let newPoolArray = poolArray;
        const tokensMetadataFiltered = await retrieveFilteredTokenMetadata(
          tokenAddresses,
        );

        const farmsLength = await farmContract.getNumberOfFarms();
        const farmsPages = Math.ceil(farmsLength / DEFAULT_PAGE_LIMIT);

        const farmsResult = (await Promise.all(
          [...Array(farmsPages)]
            .map((_, i) => farmContract.getListFarms(
              i * DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_LIMIT,
            )),
        )).flat();

        const metadataMap = tokensMetadataFiltered.reduce(
          (acc, curr) => ({ ...acc, [curr.contractId]: curr }), {},
        );

        const farmArray = await Promise.all(farmsResult.map(async (farm: any, index) => {
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
            const [balancesMap, poolArrayWithShares] = await Promise.all([
              retrieveBalancesMap(tokensMetadataFiltered, accountId),
              retrieveNewPoolArray(poolArray, poolContract),
            ]);
            setBalances(balancesMap);
            newPoolArray = poolArrayWithShares;
          } catch (e) {
            console.warn(`Error: ${e} while initial loading user specific data`);
          }

          newFarmArray = await Promise.all(farmArray
            .map(async (farm: Farm) => {
              const staked = await farmContract.getStakedListByAccountId();
              const userAllRewards = await farmContract.getRewards();
              const userUnclaimedReward = await farmContract.getUnclaimedReward(farm.farmId);
              const userRewardByTokenId = await farmContract.getRewardByTokenId(farm.rewardTokenId);
              const userReward = Big(userUnclaimedReward).plus(userRewardByTokenId).toFixed();

              return {
                ...farm,
                userStaked: staked[farm.seedId] || null,
                userAllRewards: userAllRewards[farm.rewardTokenId] || null,
                userUnclaimedReward,
                userRewardByTokenId,
                userReward,
              };
            }));
        }

        const updatePool = newPoolArray.map((pool) => {
          const poolWithFarm = newFarmArray.filter((farm) => farm.pool.id === pool.id);
          const farmIds = poolWithFarm.length > 0
            ? poolWithFarm.map((el) => el.farmId)
            : null;
          return {
            ...pool,
            farm: farmIds,
          };
        });
        const newPoolMap = toMap(updatePool);
        const newFarmMap = newFarmArray.reduce(
          (acc, farm) => ({ ...acc, [farm.farmId]: farm }), {},
        );

        if (
          newPoolMap[config.jumboPoolId]
          && pricesData
          && pricesData[config.nearAddress]
        ) {
          const pricesDataWithJumbo = retrievePricesData(pricesData, newPoolMap, metadataMap);
          const resultedPoolsArray = calculateTotalAmount(
            pricesDataWithJumbo,
            metadataMap,
            newPoolMap,
          );
          setTokens(metadataMap);
          setPools(resultedPoolsArray);
          setPrices(pricesDataWithJumbo);
          setFarms(newFarmMap);
        } else {
          setTokens(metadataMap);
          setPrices(pricesData);
          setFarms(newFarmMap);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    };

    initialLoading();
  }, [poolContract, farmContract]);

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
  }, [tokens, pools]);

  const updatePools = useCallback(() => (newPools: IPool[]) => {
    const newPoolSet = newPools.reduce((acc, item) => ({ ...acc, [item.id]: item }), pools);
    setPools(newPoolSet);
  }, [pools]);

  const updateTokensBalances = useCallback(() => (newBalances: {[key: string]: string}) => {
    const newBalancesSet = Object.entries(newBalances).reduce((acc, [key, value]) => (
      { ...acc, [key]: value }
    ), balances);
    setBalances(newBalancesSet);
  }, [balances]);

  const getTokenBalance = useCallback(
    (tokenId: string | undefined) => (tokenId ? balances[tokenId] ?? '0' : '0'),
    [balances],
  );

  return (
    <StoreContextHOC.Provider value={{
      loading,
      setLoading,
      priceLoading,
      setPriceLoading,

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
      prices,
      setPrices,

      setCurrentToken,

      inputToken,
      setInputToken,
      outputToken,
      setOutputToken,
      farms,
      setFarms,
    }}
    >
      {children}
    </StoreContextHOC.Provider>
  );
};

export const useStore = () => useContext(StoreContextHOC);
