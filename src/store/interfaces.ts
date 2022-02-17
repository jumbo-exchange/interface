import { Dispatch, SetStateAction } from 'react';
import FungibleTokenContract from 'services/FungibleToken';
import { IPoolVolumes } from 'services/PoolContract';
import SpecialWallet from 'services/wallet';

export enum StatusLink { Swap = 'swap', Pool ='pool', Farm = 'farm' }
export enum TokenType { 'Input', 'Output'}
export enum PoolType {'SIMPLE_POOL' = 'SIMPLE_POOL', 'STABLE_SWAP' = 'STABLE_SWAP'}

export interface IPool {
  id: number;
  type: PoolType;
  tokenAccountIds: string[];
  amounts: string[];
  totalFee: number;
  sharesTotalSupply: string;
  poolFee?: string;
  poolVolumes?: string;
  poolSharePrice?: string;
  poolShares?: string;
  poolTotalShares?: string;
  supplies: { [key: string]: string };
  amp: string;

  shares?: string;
  volumes?: IPoolVolumes ;
}

export interface ITokenMetadata {
  version: string;
  name: string;
  symbol: string;
  reference: string;
  decimals: number;
  icon: string;
}

export type StoreContextType = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>

  contract: any;
  wallet: SpecialWallet | null;
  setWallet: Dispatch<SetStateAction<SpecialWallet | null>>;
  balances: {[key: string]: string};
  setBalances: Dispatch<SetStateAction<{[key: string]: string}>>;
  getTokenBalance: (tokenId: string | undefined) => string;
  updateTokensBalances: (newBalances: { [key: string]: string; }) => void;

  pools: {[key:string]: IPool};
  setPools: Dispatch<SetStateAction<{[key:string]: IPool}>>;
  currentPools: IPool[];
  setCurrentPools: (pools: IPool[]) => void;
  tokens: {[key: string]: FungibleTokenContract};
  setTokens: Dispatch<SetStateAction<{[key: string]: FungibleTokenContract}>>;
  getToken: (tokenAddress: string) => FungibleTokenContract | null;

  activeModalToken: FungibleTokenContract | null;
  serActiveModalToken: Dispatch<SetStateAction<FungibleTokenContract | null>>;

  inputToken: FungibleTokenContract | null;
  setInputToken: Dispatch<SetStateAction<FungibleTokenContract | null>>;
  outputToken: FungibleTokenContract | null;
  setOutputToken: Dispatch<SetStateAction<FungibleTokenContract | null>>;
  updatePools: (newPools: IPool[]) => void;
  swapTokens: () => void;
}

export const contractMethods = [
  'get_pools', // from_index: u64, limit: u64
  'get_number_of_pools',
  'get_pool', // pool_id: u64
];
