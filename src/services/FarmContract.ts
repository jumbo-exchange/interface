import Big from 'big.js';

import {
  ACCOUNT_MIN_STORAGE_AMOUNT,
  FT_GAS,
  ONE_YOCTO_NEAR,
} from 'utils/constants';
import { parseTokenAmount } from 'utils/calculations';
import { BN } from 'bn.js';
import { IPool } from 'store';
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

const EXCHANGE_CONTRACT_ID = config.contractId;
const FARM_CONTRACT_ID = config.farmContractId;

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
    // @ts-expect-error: Property 'getNumberOfFarms' does not exist on type 'Contract'.
    return this.contract.get_number_of_farms();
  }

  async getListFarms(fromIndex: number, limit: number) {
    // @ts-expect-error: Property 'getListFarms' does not exist on type 'Contract'.
    return this.contract.list_farms({ from_index: fromIndex, limit });
  }

  async getRewardByTokenId(tokenId: string, accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'getRewardByTokenId' does not exist on type 'Contract'.
    return this.contract.get_reward({ account_id: accountId, token_id: tokenId });
  }

  async getRewards(accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'getRewards' does not exist on type 'Contract'.
    return this.contract.list_rewards({ account_id: accountId });
  }

  async getStakedListByAccountId(accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'getStakedListByAccountId' does not exist on type 'Contract'.
    return this.contract.list_user_seeds({ account_id: accountId });
  }

  async getSeeds(fromIndex: number, limit: number) {
    // @ts-expect-error: Property 'getSeeds' does not exist on type 'Contract'.
    return this.contract.list_seeds({ from_index: fromIndex, limit });
  }

  async getUnclaimedReward(farmId: string | number, accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'getUnclaimedReward' does not exist on type 'Contract'.
    return this.contract.get_unclaimed_reward({ account_id: accountId, farm_id: farmId });
  }

  async currentStorageBalance(accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'currentStorageBalance' does not exist on type 'Contract'.
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
    pool: IPool,
    message: string = '',
  ) {
    const transactions: Transaction[] = [];
    const checkStorage = await this.checkFarmStorageBalance();
    transactions.push(...checkStorage);
    transactions.push({
      receiverId: EXCHANGE_CONTRACT_ID,
      functionCalls: [{
        methodName: 'mft_transfer_call',
        args: {
          receiver_id: this.contractId,
          token_id: tokenId,
          amount: parseTokenAmount(amount, pool.lpTokenDecimals),
          msg: message,
        },
        amount: ONE_YOCTO_NEAR,
        gas: FT_GAS,
      }],
    });
    sendTransactions(transactions, this.walletInstance);
  }

  async unstake(
    seedId: string,
    amount: string,
    pool: IPool,
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
          amount: parseTokenAmount(amount, pool.lpTokenDecimals),
          msg: message,
        },
        amount: ONE_YOCTO_NEAR,
        gas: FT_GAS,
      }],
    });
    sendTransactions(transactions, this.walletInstance);
  }

  async claimRewardBySeed(seedIds: string[]) {
    seedIds.forEach((seedId) => {
      wallet
        .account()
        .functionCall({
          contractId: this.contractId,
          methodName: 'claim_reward_by_seed',
          args: { seed_id: seedId },
          attachedDeposit: new BN('0'),
          gas: new BN('100000000000000'),
        });
    });
  }

  async withdrawAllReward(
    rewardList: {
      token: FungibleTokenContract;
      value: string;
  }[],
  ) {
    let transactions: Transaction[] = [];

    const storageDeposits = await Promise.all(
      rewardList.map((reward) => reward.token.checkSwapStorageBalance(wallet.getAccountId())),
    );
    if (storageDeposits.length) transactions = transactions.concat(...storageDeposits);

    rewardList.forEach((farmReward) => {
      transactions.push({
        receiverId: this.contractId,
        functionCalls: [{
          methodName: 'withdraw_reward',
          args: {
            token_id: farmReward.token.contractId,
            amount: farmReward.value,
          },
          gas: '40000000000000',
          amount: ONE_YOCTO_NEAR,
        }],
      });
    });

    sendTransactions(transactions, this.walletInstance);
  }
}
