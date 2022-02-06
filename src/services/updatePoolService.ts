import { useEffect } from 'react';
import { contractMethods, IPool } from 'store';
import { formatPool } from 'utils';
import getConfig from './config';
import SpecialWallet, { createContract } from './wallet';

const DEFAULT_UPDATE_TIMEOUT = 5000;
export const useUpdateService = (
  callback: () => {},
  updateTimeout?: number,
) => useEffect(() => {
  const interval = setInterval(async () => {
    await callback();
  }, updateTimeout || DEFAULT_UPDATE_TIMEOUT);

  return () => clearInterval(interval);
});

export const useUpdatePoolsService = (
  walletInstance: SpecialWallet, pools: IPool[], updatePools: (pools: IPool[]) => void,
) => useUpdateService(async () => {
  const config = getConfig();
  const contract: any = createContract(walletInstance, config.contractId, contractMethods);
  try {
    const results: any = await Promise.all(pools.map(async (pool) => {
      const poolInfo = await contract.get_pool(
        { pool_id: pool.id },
      );
      return { poolInfo, id: pool.id };
    }));
    if (!results.length) return;
    const parsedPools: IPool[] = results.map((pool: any) => formatPool(pool.poolInfo, pool.id));
    updatePools(parsedPools);
  } catch (e) {
    console.warn('error', e, `while loading pools with id ${pools.map((el) => el.id)}`);
  }
});
