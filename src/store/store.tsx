import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { wallet as nearWallet } from 'services/near';
import {
  contractMethods, IPool, StoreContextType, TokenType,
} from 'store';
import { formatPool, getPoolsPath } from 'utils';

import getConfig from 'services/config';
import SpecialWallet, { createContract } from 'services/wallet';
import FungibleTokenContract from 'services/FungibleToken';
import PoolContract from 'services/PoolContract';

const config = getConfig();
const INITIAL_POOL_ID = 0;

const initialState: StoreContextType = {
  loading: false,
  setLoading: () => {},

  contract: null,
  wallet: null,
  setWallet: () => {},
  balances: {},
  setBalances: () => {},

  pools: [],
  setPools: () => {},
  currentPools: [],
  setCurrentPools: () => {},
  tokens: {},
  setTokens: () => {},

  inputToken: null,
  setInputToken: () => {},
  outputToken: null,
  setOutputToken: () => {},
  setCurrentToken: () => {},
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

  const [pools, setPools] = useState<IPool[]>(initialState.pools);
  const [currentPools, setCurrentPools] = useState<IPool[]>(initialState.currentPools);
  const [tokens, setTokens] = useState<{[key: string]: FungibleTokenContract}>(initialState.tokens);

  const [inputToken, setInputToken] = useState<FungibleTokenContract | null>(
    initialState.inputToken,
  );
  const [outputToken, setOutputToken] = useState<FungibleTokenContract | null>(
    initialState.outputToken,
  );

  const setCurrentToken = (tokenAddress: string, tokenType: TokenType) => {
    if (tokenType === TokenType.Output) {
      if (!inputToken) return;
      const outputTokenData = tokens[tokenAddress] ?? null;
      setOutputToken(outputTokenData);
      const availablePools = getPoolsPath(inputToken.contractId, tokenAddress, pools);
      setCurrentPools(availablePools);
    } else {
      if (!outputToken) return;
      const inputTokenData = tokens[tokenAddress] ?? null;
      setInputToken(inputTokenData);
      const availablePools = getPoolsPath(tokenAddress, outputToken.contractId, pools);
      setCurrentPools(availablePools);
    }
  };

  const initialLoading = async () => {
    try {
      setLoading(true);
      const isSignedIn = nearWallet.isSignedIn();

      const poolsResult = await contract.get_pools({ from_index: 0, limit: 100 });
      const tokenAddresses = poolsResult.flatMap((pool: any) => pool.token_account_ids);
      const poolArray = poolsResult.map((pool:any, index:number) => formatPool(pool, index));
      let newPoolArray = poolArray;

      const tokensMetadata: any[] = await Promise.all(
        tokenAddresses.map(async (address: string) => {
          const ftTokenContract: FungibleTokenContract = new FungibleTokenContract(
            { wallet: nearWallet, contractId: address },
          );
          const metadata = await ftTokenContract.getMetadata();
          return { metadata, contractId: address, contract: ftTokenContract };
        }),
      );

      if (isSignedIn) {
        setWallet(nearWallet);
        const accountId = nearWallet.getAccountId();
        const balancesArray = await Promise.all(
          tokensMetadata.map(async (token) => {
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
      }
      setTokens(tokensMetadata.reduce((acc, curr) => ({ ...acc, [curr.contractId]: curr }), {}));

      setPools(newPoolArray);
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
    if (pools.length) {
      const initialPool = pools[INITIAL_POOL_ID];
      const outputTokenData = tokens[initialPool.tokenAccountIds[0]] ?? null;
      setOutputToken(outputTokenData);
      const inputTokenData = tokens[initialPool.tokenAccountIds[1]] ?? null;
      setInputToken(inputTokenData);

      const availablePools = getPoolsPath(
        inputTokenData.contractId,
        outputTokenData.contractId,
        pools,
      );
      setCurrentPools(availablePools);
    }
  }, [pools.length]);

  return (
    <StoreContextHOC.Provider value={{
      loading,
      setLoading,

      contract,
      wallet,
      setWallet,
      balances,
      setBalances,

      pools,
      setPools,
      currentPools,
      setCurrentPools,
      tokens,
      setTokens,

      inputToken,
      setInputToken,
      outputToken,
      setOutputToken,
      setCurrentToken,
    }}
    >
      {children}
    </StoreContextHOC.Provider>
  );
};

export const useStore = () => useContext(StoreContextHOC);
