import * as nearApiJs from 'near-api-js';
import nearIcon from 'assets/images-app/near.svg';
import wrapNearIcon from 'assets/images-app/wNEAR.svg';
import defaultToken from 'assets/images-app/defaultToken.svg';
import { ITokenMetadata } from 'store';
import {
  NEAR_TOKEN_ID,
  FT_TRANSFER_GAS,
  ONE_YOCTO_NEAR,
} from 'utils/constants';

import Big from 'big.js';
import { wallet } from './near';
import SpecialWallet, { createContract, Transaction } from './wallet';
import getConfig from './config';

const {
  utils: {
    format: {
      formatNearAmount,
    },
  },
} = nearApiJs;

const basicViewMethods: string[] = ['ft_metadata', 'ft_balance_of', 'storage_balance_of'];
const basicChangeMethods: string[] = ['near_deposit', 'near_withdraw'];
const config = getConfig();
const DECIMALS_DEFAULT_VALUE = 0;
const ICON_DEFAULT_VALUE = '';
const CONTRACT_ID = config.contractId;
export const ACCOUNT_MIN_STORAGE_AMOUNT = '0.005';
export const MIN_DEPOSIT_PER_TOKEN = new Big('5000000000000000000000');
export const STORAGE_PER_TOKEN = '0.005';
export const STORAGE_TO_REGISTER_FT = '0.00125';
export const ONE_MORE_DEPOSIT_AMOUNT = '0.01';

const NEAR_TOKEN = {
  decimals: 24,
  icon: nearIcon,
  name: 'Near token',
  version: '0',
  symbol: 'NEAR',
  reference: '',
};

interface FungibleTokenContractInterface {
  wallet: SpecialWallet;
  contractId: string;
}
const defaultMetadata = {
  decimals: DECIMALS_DEFAULT_VALUE,
  icon: ICON_DEFAULT_VALUE,
  name: 'Token',
  version: '0',
  symbol: 'TKN',
  reference: '',
};

export enum StorageType {'Swap' = 'Swap', 'Liquidity' = 'Liquidity'}

export default class FungibleTokenContract {
  constructor(props: FungibleTokenContractInterface) {
    this.contract = createContract(
      props.wallet,
      props.contractId,
      basicViewMethods,
      basicChangeMethods,
    );
    this.contractId = props.contractId;
  }

  contract: any = createContract(
    wallet,
    CONTRACT_ID,
    basicViewMethods,
    basicChangeMethods,
  )

  contractId = CONTRACT_ID;

  metadata: ITokenMetadata = defaultMetadata;

  async getStorageBalance({ accountId } : { accountId: string }) {
    return this.contract.storage_balance_of({ account_id: accountId });
  }

  async getMetadata() {
    try {
      if (this.contractId === NEAR_TOKEN_ID) {
        this.metadata = { ...defaultMetadata, ...NEAR_TOKEN };
        return NEAR_TOKEN;
      }

      if (
        this.metadata.decimals !== DECIMALS_DEFAULT_VALUE
      && this.metadata.icon !== ICON_DEFAULT_VALUE
      ) return this.metadata;

      const metadata = await this.contract.ft_metadata();
      if (this.contractId === config.nearAddress) metadata.icon = wrapNearIcon;
      if (!metadata.icon) metadata.icon = defaultToken;

      this.metadata = { ...defaultMetadata, ...metadata };
      return metadata;
    } catch (e) {
      console.warn(e, 'while loading', this.contractId);
    }
    return null;
  }

  async getBalanceOf({ accountId }: { accountId: string }) {
    if (this.contractId === NEAR_TOKEN_ID) {
      return wallet.account().getAccountBalance()
        .then((balances) => balances.available);
    }
    return this.contract.ft_balance_of({ account_id: accountId });
  }

  async checkSwapStorageBalance({ accountId }: { accountId: string }) {
    const transactions: Transaction[] = [];
    try {
      if (this.contractId === NEAR_TOKEN_ID) return [];
      const storageAvailable = await this.getStorageBalance({ accountId });

      if (storageAvailable === null || storageAvailable.total === '0') {
        transactions.push(
          {
            receiverId: this.contractId,
            functionCalls: [{
              methodName: 'storage_deposit',
              args: {
                registration_only: true,
                account_id: accountId,
              },
              amount: STORAGE_TO_REGISTER_FT,
            }],
          },
        );
      }
      return transactions;
    } catch (e) {
      return [];
    }
  }

  async transfer({
    accountId,
    inputToken,
    amount,
    message = '',
  }:
  {
    accountId: string,
    inputToken: string,
    amount: string,
    message?: string,
  }): Promise<Transaction[]> {
    const transactions: Transaction[] = [];
    const checkStorage = await this.checkSwapStorageBalance({ accountId });
    transactions.push(...checkStorage);
    transactions.push({
      receiverId: inputToken,
      functionCalls: [{
        methodName: 'ft_transfer_call',
        args: {
          receiver_id: CONTRACT_ID,
          amount,
          msg: message,
        },
        amount: ONE_YOCTO_NEAR,
      }],
    });
    return transactions;
  }

  wrap({ amount }:{ amount: string, }) {
    if (this.contractId === NEAR_TOKEN_ID) throw Error('Can\'t wrap from NEAR token');
    const transactions: Transaction[] = [];

    transactions.push({
      receiverId: this.contractId,
      functionCalls: [{
        methodName: 'near_deposit',
        amount: formatNearAmount(amount) as string,
        args: {},
        gas: FT_TRANSFER_GAS as string,
      }],
    });
    return transactions;
  }

  unwrap({ amount }:{ amount: string}) {
    if (this.contractId === NEAR_TOKEN_ID) throw Error('Can\'t wrap from NEAR token');
    const transactions: Transaction[] = [];

    transactions.push({
      receiverId: this.contractId,
      functionCalls: [{
        methodName: 'near_withdraw',
        args: { amount },
        gas: FT_TRANSFER_GAS as string,
        amount: ONE_YOCTO_NEAR,
      }],
    });

    return transactions;
  }
}
