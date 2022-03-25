import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import { getUserWalletTokens, wallet as nearWallet } from 'services/near';
import {
  contractMethods, IPool, StoreContextType, TokenType,
} from 'store';
import {
  formatPool, getPoolsPath, toArray, toMap, calculateTotalAmount,
} from 'utils';

import getConfig from 'services/config';
import SpecialWallet, { createContract } from 'services/wallet';
import FungibleTokenContract from 'services/FungibleToken';
import PoolContract from 'services/PoolContract';
import {
  NEAR_TOKEN_ID, SWAP_INPUT_KEY, SWAP_OUTPUT_KEY, URL_INPUT_TOKEN, URL_OUTPUT_TOKEN,
} from 'utils/constants';
import { ITokenPrice, PoolType } from './interfaces';
import {
  JUMBO_INITIAL_DATA,
  DEFAULT_PAGE_LIMIT,
  retrievePoolResult,
  retrieveTokenAddresses,
  retrieveFilteredTokenMetadata,
  retrieveBalancesMap,
  retrieveNewPoolArray,
  retrievePricesData,
  tryTokenByKey,
} from './helpers';

const config = getConfig();

const pricesInitialState = {
  [config.nearAddress]: {
    id: config.nearAddress,
    decimal: 24,
    symbol: 'near',
    price: '12.28',
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
  const contract: any = useMemo(
    () => createContract(nearWallet, config.contractId, contractMethods),
    [],
  );
  const poolContract = useMemo(() => new PoolContract(), []);

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
        const poolsLength = await contract.get_number_of_pools();
        const pages = Math.ceil(poolsLength / DEFAULT_PAGE_LIMIT);

        const poolsResult = (await retrievePoolResult(pages, contract)).flat();
        let pricesData;

        try {
          pricesData = await getPriceData();
        } catch (e) {
          pricesData = initialState.prices;
          console.warn('Price data loading failed');
        }

        const userTokens = await getUserWalletTokens();

        const tokenAddresses = retrieveTokenAddresses(poolsResult, userTokens);

        const poolArray = poolsResult
          .map((pool: any, index: number) => formatPool(pool, index))
          .filter((pool: IPool) => pool.type === PoolType.SIMPLE_POOL);
          // WILL BE OPENED AS SOON AS STABLE SWAP WILL BE AVAILABLE
          // || (pool.type === PoolType.STABLE_SWAP && pool.id === config.stablePoolId)

        let newPoolArray = poolArray;
        const tokensMetadataFiltered: any[] = await retrieveFilteredTokenMetadata(tokenAddresses);

        if (isSignedIn) {
          setWallet(nearWallet);
          const accountId = nearWallet.getAccountId();
          try {
            const balancesMap = await retrieveBalancesMap(tokensMetadataFiltered, accountId);
            setBalances(balancesMap);
            newPoolArray = await retrieveNewPoolArray(poolArray, poolContract);
          } catch (e) {
            console.warn(e, 'while initial loading user specific data');
          }
        }
        const metadataMap = tokensMetadataFiltered.reduce(
          (acc, curr) => ({ ...acc, [curr.contractId]: curr }), {},
        );
        const newPoolMap = toMap(newPoolArray);

        if (
          newPoolMap[config.jumboPoolId]
          && pricesData
          && pricesData[config.nearAddress]
        ) {
          pricesData = retrievePricesData(pricesData, newPoolMap, prices, metadataMap);
        }

        const resultedPoolsArray = calculateTotalAmount(
          pricesData,
          metadataMap,
          newPoolMap,
        );

        setTokens(metadataMap);
        setPools(resultedPoolsArray);
        setPrices(pricesData);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    };

    initialLoading();
  }, []);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toArray(tokens).length, toArray(pools).length]);

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

  const getToken = useCallback(
    (tokenId: string | undefined) => (tokenId ? tokens[tokenId] ?? null : null),
    [tokens],
  );

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
      // findTokenBySymbol,
    }}
    >
      {children}
    </StoreContextHOC.Provider>
  );
};

export const useStore = () => useContext(StoreContextHOC);
