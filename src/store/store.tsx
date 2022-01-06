import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { wallet as nearWallet } from 'services/near';
import {
  contractMethods, IPool, IToken, StoreContextType, TokenType,
} from 'store';
import { formatPool } from 'utils';

import getConfig from 'services/config';
import SpecialWallet, { createContract } from 'services/wallet';

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
  currentPool: null,
  setCurrentPool: () => {},
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

  const [loading, setLoading] = useState<boolean>(initialState.loading);

  const [wallet, setWallet] = useState<SpecialWallet| null>(initialState.wallet);
  const [balances, setBalances] = useState<{[key:string]: string}>(initialState.balances);

  const [pools, setPools] = useState<IPool[]>(initialState.pools);
  const [currentPool, setCurrentPool] = useState<IPool| null>(initialState.currentPool);
  const [tokens, setTokens] = useState<{[key: string]: IToken}>(initialState.tokens);

  const [inputToken, setInputToken] = useState<IToken | null>(initialState.inputToken);
  const [outputToken, setOutputToken] = useState<IToken | null>(initialState.outputToken);

  const setCurrentToken = (tokenAddress: string, tokenType: TokenType) => {
    if (!inputToken || !outputToken) return;
    if (tokenType === TokenType.Output) {
      const outputTokenData = tokens[tokenAddress] ?? null;
      setOutputToken(outputTokenData);
      // const availablePool = pools.filter((pool) => pool.tokenAccountIds.includes(tokenAddress)
      // && pool.tokenAccountIds.includes(inputToken.contractId)
      // && inputToken.contractId !== tokenAddress);
      // if (availablePool.length) {
      //   setCurrentPool(availablePool[0]);
      // }
    } else {
      const inputTokenData = tokens[tokenAddress] ?? null;
      setInputToken(inputTokenData);
    //   const availablePool = pools.filter((pool) => pool.tokenAccountIds.includes(tokenAddress)
    //   && pool.tokenAccountIds.includes(outputToken.contractId)
    //   && outputToken.contractId !== tokenAddress);
    //   if (availablePool.length) {
    //     setCurrentPool(availablePool[0]);
    //   }
    }
  };

  const initialLoading = async () => {
    try {
      setLoading(true);
      const isSignedIn = nearWallet.isSignedIn();

      const poolsResult = await contract.get_pools({ from_index: 0, limit: 100 });
      const tokenAddresses = poolsResult.flatMap((pool: any) => pool.token_account_ids);
      const poolArray = poolsResult.map((pool:any) => formatPool(pool));

      const tokensMetadata: any[] = await Promise.all(
        tokenAddresses.map(async (address: string) => {
          const ftTokenContract:any = createContract(nearWallet, address, ['ft_metadata', 'ft_balance_of']);
          const metadata = await ftTokenContract.ft_metadata();
          return { metadata, contractId: address, contract: ftTokenContract };
        }),
      );

      if (isSignedIn) {
        setWallet(nearWallet);
        const accountId = nearWallet.getAccountId();
        const balancesArray = await Promise.all(
          tokensMetadata.map(async (token) => {
            const balance = await token.contract.ft_balance_of({ account_id: accountId });
            return { contractId: token.contractId, balance };
          }),
        );
        const balancesMap = balancesArray.reduce((acc, curr) => (
          { ...acc, [curr.contractId]: curr.balance }
        ), {});
        setBalances(balancesMap);
      }
      setTokens(tokensMetadata.reduce((acc, curr) => ({ ...acc, [curr.contractId]: curr }), {}));
      setPools(poolArray);
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
      currentPool,
      setCurrentPool,
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
