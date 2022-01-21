import { Dispatch, SetStateAction } from 'react';
import SpecialWallet from 'services/wallet';

export enum StatusLink { Swap = 'swap', Pool ='pool', Farm = 'farm' }
export enum TokenType { 'Input', 'Output'}

export interface IPool {
  id: number;
  poolKind: string;
  tokenAccountIds: string[];
  amounts: string[];
  totalFee: number;
  sharesTotalSupply: string;
  poolFee?: string;
  poolVolumes?: string;
  poolSharePrice?: string;
  poolShares?: string;
  poolTotalShares?: string;
  amp: string;

  volumes?: string;
  myShares?: string;
}

export interface IToken {
  contract: any;
  contractId: string;
  metadata: ITokenMetadata;
}
export interface ITokenMetadata {
  version:string;
  name:string;
  symbol:string;
  reference:string;
  decimals:number;
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

  pools: IPool[];
  setPools: Dispatch<SetStateAction<IPool[]>>;
  currentPool: IPool | null;
  setCurrentPool: (pool: IPool) => void;
  tokens: {[key: string]: IToken};
  setTokens: Dispatch<SetStateAction<{[key: string]: IToken}>>;
  setCurrentToken: (tokenAddress: string, tokenType: TokenType) => void;

  inputToken: IToken | null;
  setInputToken: Dispatch<SetStateAction<IToken | null>>;
  outputToken: IToken | null;
  setOutputToken: Dispatch<SetStateAction<IToken | null>>;
}

export const contractMethods = [
  'get_pools', // from_index: u64, limit: u64

  'get_guardians',
  'get_number_of_pools',

  'get_pool', // pool_id: u64
  'get_pool_fee', // pool_id: u64
  'get_pool_volumes', // pool_id: u64
  'get_pool_share_price', // pool_id: u64
  'get_pool_shares', // pool_id: u64, account_id: ValidAccountId
  'get_pool_total_shares', // pool_id: u64

  // Returns balances of the deposits for given user outside of any pools.
  /// Returns empty list if no tokens deposited.
  'get_deposits', // account_id: ValidAccountId
  // Returns balance of the deposit for given user outside of any pools.
  'get_deposit', // account_id: ValidAccountId, token_id: ValidAccountId
];
