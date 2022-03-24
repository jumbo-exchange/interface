import {
  ONE_YOCTO_NEAR,
} from 'utils/constants';

import Big from 'big.js';
import { parseTokenAmount } from 'utils/calculations';
import { wallet } from './near';
import { createContract, Transaction } from './wallet';
import getConfig from './config';
import { SWAP_GAS } from './SwapContract';

const basicViewMethods: string[] = [
  'mft_balance_of',
  'storage_balance_of',
];
const basicChangeMethods: string[] = [
  'near_deposit',
  'near_withdraw',
];

const config = getConfig();
const LP_TOKEN_DECIMALS = 24;
const LP_STABLE_TOKEN_DECIMALS = 18;

const EX_CONTRACT_ID = config.contractId;
const FARM_CONTRACT_ID = config.farmContractId;
const STABLE_POOL_ID = config.stablePoolId;

const STORAGE_TO_REGISTER_MFT = '0.045';
const MIN_DEPOSIT_PER_TOKEN_FARM = new Big('45000000000000000000000');

export default class MultiFungibleTokenContract {
  contract: any = createContract(
    wallet,
    FARM_CONTRACT_ID,
    basicViewMethods,
    basicChangeMethods,
  )

  contractId = FARM_CONTRACT_ID;

  async getStorageBalance({ accountId } : { accountId: string }) {
    return this.contract.storage_balance_of({ account_id: accountId });
  }

  async checkFarmStorageBalance({ accountId }: { accountId: string }) {
    const transactions: Transaction[] = [];
    try {
      const storageAvailable = await this.getStorageBalance({ accountId });
      const farmStorage = Big(storageAvailable).lte(MIN_DEPOSIT_PER_TOKEN_FARM);

      if (storageAvailable === null || storageAvailable.total === '0') {
        if (farmStorage) {
          transactions.push(
            {
              receiverId: this.contractId,
              functionCalls: [{
                methodName: 'storage_deposit',
                args: {
                  registration_only: true,
                  account_id: accountId,
                },
                amount: STORAGE_TO_REGISTER_MFT,
              }],
            },
          );
        }
      }
      return transactions;
    } catch (e) {
      return [];
    }
  }

  async mftTransfer({
    accountId,
    tokenId,
    amount,
    poolId,
    message = '',
  }:
  {
    accountId: string,
    tokenId: number,
    amount: string,
    poolId: number,
    message?: string,
  }): Promise<Transaction[]> {
    const transactions: Transaction[] = [];
    const checkStorage = await this.checkFarmStorageBalance({ accountId });
    transactions.push(...checkStorage);
    transactions.push({
      receiverId: EX_CONTRACT_ID,
      functionCalls: [{
        methodName: 'mft_transfer_call',
        args: {
          receiver_id: FARM_CONTRACT_ID,
          token_id: tokenId,
          amount: STABLE_POOL_ID === poolId
            ? parseTokenAmount(amount, LP_STABLE_TOKEN_DECIMALS)
            : parseTokenAmount(amount, LP_TOKEN_DECIMALS),
          msg: message,
        },
        amount: ONE_YOCTO_NEAR,
        gas: SWAP_GAS,
      }],
    });
    return transactions;
  }
}
