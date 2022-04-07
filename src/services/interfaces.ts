import FungibleTokenContract from './FungibleToken';

export interface Transaction {
  receiverId: string;
  functionCalls: { gas?:
    string; amount?: string;
    methodName: string;
    args?: object;
  }[];
}

export enum FTTokenContractMethod {
  ftTransferCall = 'ft_transfer_call',
  nearDeposit = 'near_deposit',
  nearWithdraw = 'near_withdraw',
  storageDeposit = 'storage_deposit',
}

export enum SwapContractMethod {
  ftTransferCall = 'ft_transfer_call',
}

export enum PoolContractMethod {
  ftTransferCall = 'ft_transfer_call',
  storageDeposit = 'storage_deposit',
  registerTokens = 'register_tokens',
  addSimplePool = 'add_simple_pool',
  addLiquidity = 'add_liquidity',
  addStableLiquidity = 'add_stable_liquidity',
  removeLiquidity = 'remove_liquidity',
  withdraw = 'withdraw',
}

export enum FarmContractMethod {
  storageDeposit = 'storage_deposit',
  mftTransferCall = 'mft_transfer_call',
  withdrawSeed = 'withdraw_seed',
  withdrawReward = 'withdraw_reward',
  claimRewardBySeed = 'claim_reward_by_seed',
}

export enum SWAP_ENUM { DIRECT_SWAP = 1, INDIRECT_SWAP = 2 }

export interface IPoolVolumes {
  [tokenId: string]: { input: string; output: string };
}

export interface ILiquidityToken {
  token: FungibleTokenContract;
  amount: string
}
