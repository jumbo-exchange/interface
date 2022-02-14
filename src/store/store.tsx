import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { getUserWalletTokens, wallet as nearWallet } from 'services/near';
import {
  contractMethods, IPool, StoreContextType,
} from 'store';
import {
  formatPool, getPoolsPath, toArray, toMap,
} from 'utils';
import { NEAR_TOKEN_ID } from 'utils/constants';

import getConfig from 'services/config';
import SpecialWallet, { createContract } from 'services/wallet';
import FungibleTokenContract from 'services/FungibleToken';
import PoolContract from 'services/PoolContract';
import { PoolType } from './interfaces';

const config = getConfig();
const DEFAULT_PAGE_LIMIT = 100;

const initialState: StoreContextType = {
  loading: false,
  setLoading: () => {},

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

  inputToken: null,
  setInputToken: () => {},
  outputToken: null,
  setOutputToken: () => {},
  updatePools: () => {},
  swapTokens: () => {},
};

const StoreContextHOC = createContext<StoreContextType>(initialState);

export const StoreContextProvider = (
  { children }:{ children: JSX.Element },
) => {
  const contract: any = createContract(nearWallet, config.contractId, contractMethods);
  const poolContract = new PoolContract();

  const [loading, setLoading] = useState<boolean>(initialState.loading);

  const [wallet, setWallet] = useState<SpecialWallet| null>(initialState.wallet);
  const [balances, setBalances] = useState<{[key:string]: string}>(initialState.balances);

  const [pools, setPools] = useState<{[key:string]: IPool}>(initialState.pools);
  const [currentPools, setCurrentPools] = useState<IPool[]>(initialState.currentPools);
  const [tokens, setTokens] = useState<{[key: string]: FungibleTokenContract}>(initialState.tokens);

  const [inputToken, setInputToken] = useState<FungibleTokenContract | null>(
    initialState.inputToken,
  );
  const [outputToken, setOutputToken] = useState<FungibleTokenContract | null>(
    initialState.outputToken,
  );

  const swapTokens = () => {
    const poolArray = toArray(pools);
    if (!inputToken || !outputToken || inputToken === outputToken) return;
    setInputToken(outputToken);
    setOutputToken(inputToken);

    const availablePools = getPoolsPath(
      outputToken.contractId, inputToken.contractId, poolArray, tokens,
    );
    setCurrentPools(availablePools);
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
        } catch (e) {
          console.warn(e, 'while initial loading user specific data');
        }
      }
      setTokens(tokensMetadataFiltered.reduce(
        (acc, curr) => ({ ...acc, [curr.contractId]: curr }), {},
      ));
      setPools(toMap(newPoolArray));
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialLoading();
  }, []);

  useEffect(() => {
    if (toArray(pools).length) {
      const outputTokenData = tokens[config.nearAddress] ?? null;
      setOutputToken(outputTokenData);
      const inputTokenData = tokens[NEAR_TOKEN_ID] ?? null;
      setInputToken(inputTokenData);

      const availablePools = getPoolsPath(
        inputTokenData.contractId,
        outputTokenData.contractId,
        toArray(pools),
        tokens,
      );
      setCurrentPools(availablePools);
    }
  }, [toArray(pools).length]);

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

      inputToken,
      setInputToken,
      outputToken,
      setOutputToken,
      swapTokens,
    }}
    >
      {children}
    </StoreContextHOC.Provider>
  );
};

export const useStore = () => useContext(StoreContextHOC);
