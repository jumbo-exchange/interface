import React, {
  createContext, Dispatch, SetStateAction, useContext, useState,
} from 'react';
import { wallet as nearWallet } from 'services/near';
import {
  contractMethods, IPool, NEAR_TOKEN_ID,
} from 'store';

import getConfig from 'services/config';

import { formatPool } from 'utils';
import useUpdateService from './updatePoolService';
import { createContract } from './wallet';
import FungibleTokenContract from './FungibleToken';

const config = getConfig();

export type RefreshContextType = {
  refreshEnabled: boolean;
  setRefreshEnabled: Dispatch<SetStateAction<boolean>>;
  trackedPools: IPool[];
  setTrackedPools: (newPools: IPool[]) => void;
  trackedTokensBalances: string[];
  setTrackedTokensBalances: Dispatch<SetStateAction<string[]>>;
}

const initialState: RefreshContextType = {
  refreshEnabled: true,
  setRefreshEnabled: () => {},
  trackedPools: [],
  setTrackedPools: () => {},
  trackedTokensBalances: [],
  setTrackedTokensBalances: () => {},
};

const RefreshContextHOC = createContext<RefreshContextType>(initialState);

export const RefreshContextProvider = (
  {
    children,
    updatePools,
    updateTokensBalances,
  }:
  {
    children: JSX.Element,
    updatePools: (newPools: IPool[]) => void,
    updateTokensBalances: (newBalances: { [key: string]: string; }) => void
  },
) => {
  const contract: any = createContract(nearWallet, config.contractId, contractMethods);
  const [trackedPools, setTrackedPools] = useState<IPool[]>([]);
  const [trackedTokensBalances, setTrackedTokensBalances] = useState<string[]>(
    [NEAR_TOKEN_ID, config.nearAddress],
  );
  const [refreshEnabled, setRefreshEnabled] = useState<boolean>(initialState.refreshEnabled);

  useUpdateService(async () => {
    if (!trackedPools.length || !refreshEnabled) return;
    try {
      const results: any = await Promise.all(trackedPools.map(async (pool) => {
        const poolInfo = await contract.get_pool(
          { pool_id: pool.id },
        );
        return { poolInfo, id: pool.id };
      }));
      if (!results.length) return;
      const parsedPools: IPool[] = results.map((pool: any) => formatPool(pool.poolInfo, pool.id));
      updatePools(parsedPools);
    } catch (e) {
      console.warn('error', e, `while updating pools with id ${trackedPools.map((el) => el.id)}`);
    }
  });

  useUpdateService(async () => {
    if (!trackedTokensBalances.length || !refreshEnabled) return;
    const isSignedIn = nearWallet.isSignedIn();
    if (!isSignedIn) return;
    const accountId = nearWallet.getAccountId();

    try {
      const balancesArray = await Promise.all(
        Array.from(new Set(
          [
            ...trackedTokensBalances,
            NEAR_TOKEN_ID,
            config.nearAddress,
          ],
        )).map(async (token) => {
          const ftTokenContract: FungibleTokenContract = new FungibleTokenContract(
            { wallet: nearWallet, contractId: token },
          );
          const balance = await ftTokenContract.getBalanceOf({ accountId });
          return { contractId: token, balance };
        }),
      );
      if (!balancesArray.length) return;

      const balancesMap = balancesArray.reduce((acc, curr) => (
        { ...acc, [curr.contractId]: curr.balance }
      ), {});
      updateTokensBalances(balancesMap);
    } catch (e) {
      console.warn('error', e, `while updating tokens with id ${trackedTokensBalances}`);
    }
  });

  const setNewTrackedPools = (newPools: IPool[]) => {
    const newIds = newPools.map((pool) => pool.id);
    const oldIds = trackedPools.map((pool) => pool.id);
    if (!newIds.every((id) => oldIds.includes(id))) {
      setTrackedPools(newPools);

      const isSignedIn = nearWallet.isSignedIn();
      if (!isSignedIn) return;
      const tokensIds = newPools.map((pool) => pool.tokenAccountIds).flat();
      setTrackedTokensBalances(tokensIds);
    }
  };

  return (
    <RefreshContextHOC.Provider value={{
      refreshEnabled,
      setRefreshEnabled,
      trackedPools,
      setTrackedPools: setNewTrackedPools,
      trackedTokensBalances,
      setTrackedTokensBalances,
    }}
    >
      {children}
    </RefreshContextHOC.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContextHOC);
