import { Dispatch, SetStateAction } from 'react';
import FungibleTokenContract from 'services/FungibleToken';
import { IPoolVolumes } from 'services/PoolContract';
import SpecialWallet from 'services/wallet';

export enum StatusLink { Swap = 'swap', Pool ='pool', Farm = 'farm' }
export enum TokenType { 'Input', 'Output'}
export enum PoolType {'SIMPLE_POOL' = 'SIMPLE_POOL', 'STABLE_SWAP' = 'STABLE_SWAP'}
export enum CurrentButton {
  'Swap',
  'AddLiquidity',
  'CreatePool',
  'Withdraw',
  'Stake',
  'UnStake'
}

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
  farm: string[] | null,
  // Views
  totalLiquidity: string;
}

export interface ITokenMetadata {
  version: string;
  name: string;
  symbol: string;
  reference: string;
  decimals: number;
  icon: string;
}

export interface ITokenPrice {
    id: string,
    decimal: number,
    price: string,
    symbol: string
}

export interface Farm {
  id: number;
  farmId: string;
  type: string;
  status: string;
  seedId: string;
  rewardToken: FungibleTokenContract;
  startAt: number;
  rewardPerSession: number;
  sessionInterval: number;
  totalReward: number;
  curRound: number;
  lastRound: number;
  claimedReward: string;
  unclaimedReward: number;
  currentUserReward?: number;

  pool: IPool;
  lpTokenId: string;
  rewardNumber?: string;
  userStaked?: string;
  rewardsPerWeek: string;
  tokenAccountIds: string[];
  seedAmount: string;
  // userRewardsPerWeek: string;
  // userUnclaimedReward: string;
  // totalStaked: number;
  // apr: string;
}

export type StoreContextType = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>
  priceLoading: boolean;
  setPriceLoading: Dispatch<SetStateAction<boolean>>

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

  setCurrentToken: (activeToken: FungibleTokenContract, tokenType: TokenType) => void;
  prices: {[key: string]: ITokenPrice},
  setPrices: Dispatch<SetStateAction<{[key: string]: ITokenPrice}>>;

  inputToken: FungibleTokenContract | null;
  setInputToken: Dispatch<SetStateAction<FungibleTokenContract | null>>;
  outputToken: FungibleTokenContract | null;
  setOutputToken: Dispatch<SetStateAction<FungibleTokenContract | null>>;
  updatePools: (newPools: IPool[]) => void;
  findTokenBySymbol: (symbol: string,) => void;

  farms: {[key:string]: Farm};
  setFarms: Dispatch<SetStateAction<{[key:string]: Farm}>>;
}

export const contractMethods = [
  'get_pools', // from_index: u64, limit: u64
  'get_number_of_pools',
  'get_pool', // pool_id: u64
];
