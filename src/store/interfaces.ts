import { FarmStatusEnum } from 'components/FarmStatus';
import { Dispatch, SetStateAction } from 'react';
import FungibleTokenContract from 'services/contracts/FungibleToken';
import { IPoolVolumes } from 'services/interfaces';
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
  lpTokenId: string;
  lpTokenDecimals: number;
  type: PoolType;
  tokenAccountIds: string[];
  amounts: string[];
  totalFee: number;
  sharesTotalSupply: string;
  supplies: { [key: string]: string };
  amp: string;

  shares?: string;
  volumes?: IPoolVolumes ;
  farms: string[] | null,

  totalLiquidity: string;
  dayVolume: string;
  apy: string;
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

export interface IFarm {
  id: number;
  type: string;
  status: FarmStatusEnum;
  seedId: string;
  rewardTokenId: string;
  startAt: number;
  rewardPerSession: string;
  sessionInterval: number;
  totalReward: string;
  curRound: number;
  lastRound: number;
  claimedReward: string;
  unclaimedReward: string;

  poolId: number;
  totalSeedAmount: string;

  userStaked?: string;
  userUnclaimedReward?: string;
  totalStaked?: string;
  yourStaked?: string;
  apy: string;
}

export interface IDayVolume {
  id: string,
  volume24hFirst: string,
  volume24hSecond: string,
  tokenFirst: string,
  tokenSecond: string,
  updatedAt: string,
}

export type StoreContextType = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>
  priceLoading: boolean;
  setPriceLoading: Dispatch<SetStateAction<boolean>>

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

  setCurrentToken: (activeToken: FungibleTokenContract, tokenType: TokenType) => void;
  prices: {[key: string]: ITokenPrice},
  setPrices: Dispatch<SetStateAction<{[key: string]: ITokenPrice}>>;

  inputToken: FungibleTokenContract | null;
  setInputToken: Dispatch<SetStateAction<FungibleTokenContract | null>>;
  outputToken: FungibleTokenContract | null;
  setOutputToken: Dispatch<SetStateAction<FungibleTokenContract | null>>;
  updatePools: (newPools: IPool[]) => void;
  farms: {[key: string]: IFarm};
  setFarms: Dispatch<SetStateAction<{[key:string]: IFarm}>>;

  userRewards: {[key:string]: string};
  setUserRewards: Dispatch<SetStateAction<{[key:string]: string}>>;
}
