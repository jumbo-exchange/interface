import Big from 'big.js';

import {
  ACCOUNT_MIN_STORAGE_AMOUNT,
  MIN_DEPOSIT_PER_TOKEN,
  ONE_MORE_DEPOSIT_AMOUNT,
  STORAGE_PER_TOKEN,
  NEAR_TOKEN_ID,
} from 'utils/constants';
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
];

const basicChangeMethods = [
  'storage_deposit',
];

const config = getConfig();
const CREATE_POOL_NEAR_AMOUNT = '0.05';
const CONTRACT_ID = config.farmContractId;

export interface IPoolVolumes {
  [tokenId: string]: { input: string; output: string };
}

export default class FarmContract {
  contract = createContract(
    wallet,
    CONTRACT_ID,
    basicViewMethods,
    basicChangeMethods,
  )

  nonce = 0;

  walletInstance = wallet;

  contractId = CONTRACT_ID;

  async getNumberOfFarms() {
    // @ts-expect-error: Property 'get_number_of_farms' does not exist on type 'Contract'.
    return this.contract.get_number_of_farms();
  }

  async getListFarms(fromIndex: number, limit: number) {
    // @ts-expect-error: Property 'list_farms' does not exist on type 'Contract'.
    return this.contract.list_farms({ from_index: fromIndex, limit });
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

  async checkStorageState(accountId = wallet.getAccountId()) {
    const storage = await this.getStorageState(accountId);
    return storage ? new Big(storage?.deposit).lte(new Big(storage?.usage)) : true;
  }

  async getStorageState(accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'get_user_storage_state' does not exist on type 'Contract'.
    return this.contract.get_user_storage_state({ account_id: accountId });
  }

  async currentStorageBalance(accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'get_user_storage_state' does not exist on type 'Contract'.
    return this.contract.storage_balance_of({ account_id: accountId });
  }

  async checkStorageBalance(accountId: string = wallet.getAccountId()) {
    const transactions: Transaction[] = [];

    let storageAmount = new Big(0);

    const storageAvailable = await this.getStorageState(accountId);

    if (!storageAvailable) {
      storageAmount = new Big(ONE_MORE_DEPOSIT_AMOUNT);
    } else {
      const balance = await this.currentStorageBalance(accountId);

      if (!balance) {
        storageAmount = new Big(ACCOUNT_MIN_STORAGE_AMOUNT);
      }

      if (new Big(balance?.available || '0').lt(MIN_DEPOSIT_PER_TOKEN)) {
        storageAmount = storageAmount.plus(Number(STORAGE_PER_TOKEN));
      }
    }

    if (storageAmount.gt(0) && this.contractId !== NEAR_TOKEN_ID) {
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

  // TODO: delete MFT.ts and add everything here
}
