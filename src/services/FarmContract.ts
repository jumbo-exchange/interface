import Big from 'big.js';

import {
  ACCOUNT_MIN_STORAGE_AMOUNT,
  ONE_YOCTO_NEAR,
} from 'utils/constants';
import { parseTokenAmount } from 'utils/calculations';
import sendTransactions, { wallet } from './near';
import { createContract, Transaction } from './wallet';
import getConfig from './config';
import FungibleTokenContract from './FungibleToken';

const basicViewMethods = [
  'get_number_of_farms',
  'get_number_of_outdated_farms',

  'list_farms', // (from_index: u64, limit: u64)
  'list_outdated_farms', // (from_index: u64, limit: u64)
  'list_farms_by_seed', // (seed_id: SeedId)

  'list_rewards',
  'list_seeds',
  'list_user_seeds',
  'get_unclaimed_reward',
  'storage_balance_of',

  'get_reward',
];

const basicChangeMethods = [
  'storage_deposit',
  'withdraw_reward',
];

const config = getConfig();

const LP_TOKEN_DECIMALS = 24;
const LP_STABLE_TOKEN_DECIMALS = 18;

const EX_CONTRACT_ID = config.contractId;
const FARM_CONTRACT_ID = config.farmContractId;
const STABLE_POOL_ID = config.stablePoolId;

const MFT_GAS = '180000000000000';

const STORAGE_TO_REGISTER_MFT = '0.045';
const MIN_DEPOSIT_PER_TOKEN_FARM = new Big('45000000000000000000000');

export interface IPoolVolumes {
  [tokenId: string]: { input: string; output: string };
}

export default class FarmContract {
  contract = createContract(
    wallet,
    FARM_CONTRACT_ID,
    basicViewMethods,
    basicChangeMethods,
  )

  nonce = 0;

  walletInstance = wallet;

  contractId = FARM_CONTRACT_ID;

  async getNumberOfFarms() {
    // @ts-expect-error: Property 'get_number_of_farms' does not exist on type 'Contract'.
    return this.contract.get_number_of_farms();
  }

  async getListFarms(fromIndex: number, limit: number) {
    // @ts-expect-error: Property 'list_farms' does not exist on type 'Contract'.
    return this.contract.list_farms({ from_index: fromIndex, limit });
  }

  async getRewardByTokenId(tokenId: string, accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'get_reward' does not exist on type 'Contract'.
    return this.contract.get_reward({ account_id: accountId, token_id: tokenId });
  }

  async getRewards(accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'list_rewards' does not exist on type 'Contract'.
    return this.contract.list_rewards({ account_id: accountId });
  }

  async getStakedListByAccountId(accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'list_user_seeds' does not exist on type 'Contract'.
    return this.contract.list_user_seeds({ account_id: accountId });
  }

  async getSeeds(fromIndex: number, limit: number) {
    // @ts-expect-error: Property 'list_seeds' does not exist on type 'Contract'.
    return this.contract.list_seeds({ from_index: fromIndex, limit });
  }

  async getUnclaimedReward(farmId: string, accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'get_unclaimed_reward' does not exist on type 'Contract'.
    return this.contract.get_unclaimed_reward({ account_id: accountId, farm_id: farmId });
  }

  async currentStorageBalance(accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'storage_balance_of' does not exist on type 'Contract'.
    return this.contract.storage_balance_of({ account_id: accountId });
  }

  async checkFarmStorageBalance(accountId: string = wallet.getAccountId()) {
    const transactions: Transaction[] = [];

    let storageAmount = new Big(0);
    const balance = await this.currentStorageBalance(accountId);

    if (!balance) {
      storageAmount = new Big(ACCOUNT_MIN_STORAGE_AMOUNT);
    }

    if (new Big(balance?.available || '0').lt(MIN_DEPOSIT_PER_TOKEN_FARM)) {
      storageAmount = storageAmount.plus(STORAGE_TO_REGISTER_MFT);
    }

    if (storageAmount.gt(0)) {
      transactions.push({
        receiverId: this.contractId,
        functionCalls: [{
          methodName: 'storage_deposit',
          args: {
            registration_only: false,
            account_id: accountId,
          },
          amount: storageAmount.toFixed(),
        }],
      });
    }
    return transactions;
  }

  async stake(
    tokenId: string,
    amount: string,
    poolId: number,
    message: string = '',
  ) {
    const transactions: Transaction[] = [];
    const checkStorage = await this.checkFarmStorageBalance();
    transactions.push(...checkStorage);
    transactions.push({
      receiverId: EX_CONTRACT_ID,
      functionCalls: [{
        methodName: 'mft_transfer_call',
        args: {
          receiver_id: this.contractId,
          token_id: tokenId,
          amount: STABLE_POOL_ID === poolId
            ? parseTokenAmount(amount, LP_STABLE_TOKEN_DECIMALS)
            : parseTokenAmount(amount, LP_TOKEN_DECIMALS),
          msg: message,
        },
        amount: ONE_YOCTO_NEAR,
        gas: MFT_GAS,
      }],
    });
    sendTransactions(transactions, this.walletInstance);
  }

  async unstake(
    seedId: string,
    amount: string,
    poolId: number,
    message: string = '',
  ) {
    const transactions: Transaction[] = [];
    const checkStorage = await this.checkFarmStorageBalance();
    transactions.push(...checkStorage);
    transactions.push({
      receiverId: this.contractId,
      functionCalls: [{
        methodName: 'withdraw_seed',
        args: {
          seed_id: seedId,
          amount: STABLE_POOL_ID === poolId
            ? parseTokenAmount(amount, LP_STABLE_TOKEN_DECIMALS)
            : parseTokenAmount(amount, LP_TOKEN_DECIMALS),
          msg: message,
        },
        amount: ONE_YOCTO_NEAR,
        gas: '200000000000000',
      }],
    });
    sendTransactions(transactions, this.walletInstance);
  }

  // async claimRewardBySeed(seedId: string) {
  //   const transactions: Transaction[] = [];
  //   transactions.push({
  //     receiverId: this.contractId,
  //     functionCalls: [{
  //       methodName: 'claim_reward_by_seed',
  //       args: { seed_id: seedId },
  //       amount: '0',
  //       gas: '100000000000000',
  //     }],
  //   });
  //   return transactions;
  // }

  async withdrawAllReward(
    //! the seed farms and the array to be output should be returned
    rewardList: {
      token: FungibleTokenContract;
      seedId: string;
      userRewardAmount: string;
  }[],
  ) {
    let transactions: Transaction[] = [];

    const storageDeposits = await Promise.all(
      rewardList.map((reward) => reward
        .token.contract.checkSwapStorageBalance(wallet.getAccountId())),
    );
    if (storageDeposits.length) transactions = transactions.concat(...storageDeposits);

    rewardList.map(async (farmReward) => {
      // const claimReward = await this.claimRewardBySeed(farmReward.seedId);
      // transactions.push(...claimReward);

      transactions.push({
        receiverId: this.contractId,
        functionCalls: [{
          methodName: 'claim_reward_by_seed',
          args: { seed_id: farmReward.seedId },
          amount: '0',
          gas: '100000000000000',
        }],
      });

      transactions.push({
        receiverId: this.contractId,
        functionCalls: [{
          methodName: 'withdraw_reward',
          args: {
            token_id: farmReward.token.contractId,
            amount: farmReward.userRewardAmount,
          },
          gas: '40000000000000',
          amount: ONE_YOCTO_NEAR,
        }],
      });
    });

    sendTransactions(transactions, this.walletInstance);
  }
}
