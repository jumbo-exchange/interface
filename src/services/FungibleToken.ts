import BN from 'bn.js';
import * as nearApiJs from 'near-api-js';

import { ITokenMetadata } from 'store';
import {
  FT_MINIMUM_STORAGE_BALANCE, FT_STORAGE_DEPOSIT_GAS, FT_TRANSFER_GAS, ONE_YOCTO_NEAR,
} from 'utils/constants';
import { formatTokenAmount, parseTokenAmount, removeTrailingZeros } from 'utils/calculations';
import { wallet } from './near';
import SpecialWallet, { createContract, Transaction } from './wallet';
import getConfig from './config';

const {
  utils: {
    format: {
      parseNearAmount,
      formatNearAmount,
    },
  },
} = nearApiJs;

const basicViewMethods: string[] = ['ft_metadata', 'ft_balance_of', 'storage_balance_of'];
const basicChangeMethods: string[] = [];
const config = getConfig();
const DECIMALS_DEFAULT_VALUE = 0;
const ICON_DEFAULT_VALUE = '';
const CONTRACT_ID = config.contractId;

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

  static getParsedTokenAmount(amount:string, symbol:string, decimals:number) {
    const parsedTokenAmount = symbol === 'NEAR'
      ? parseNearAmount(amount)
      : parseTokenAmount(amount, decimals);

    return parsedTokenAmount;
  }

  static getFormattedTokenAmount(amount:string, symbol:string, decimals:number) {
    const formattedTokenAmount = symbol === 'NEAR'
      ? formatNearAmount(amount, 5)
      : removeTrailingZeros(formatTokenAmount(amount, decimals, 5));

    return formattedTokenAmount;
  }

  async getStorageBalance({ accountId } : { accountId: string }) {
    return this.contract.storage_balance_of({ account_id: accountId });
  }

  async getMetadata() {
    if (
      this.metadata.decimals !== DECIMALS_DEFAULT_VALUE
      && this.metadata.icon !== ICON_DEFAULT_VALUE
    ) return this.metadata;
    const metadata = await this.contract.ft_metadata();
    this.metadata = { ...defaultMetadata, ...metadata };
    return metadata;
  }

  async getBalanceOf({ accountId }: { accountId: string }) {
    return this.contract.ft_balance_of({ account_id: accountId });
  }

  async getEstimatedTotalFees({ accountId = '', contractName = '' } = {}) {
    if (contractName
        && accountId
        && !await this.isStorageBalanceAvailable({ accountId })) {
      return new BN(FT_TRANSFER_GAS as string)
        .add(new BN(FT_MINIMUM_STORAGE_BALANCE as string))
        .add(new BN(FT_STORAGE_DEPOSIT_GAS as string))
        .toString();
    }
    return FT_TRANSFER_GAS as string;
  }

  async getEstimatedTotalNearAmount({ amount }:{ amount: string }) {
    return new BN(amount)
      .add(new BN(await this.getEstimatedTotalFees()))
      .toString();
  }

  async isStorageBalanceAvailable({ accountId }:{ accountId: string }) {
    const storageBalance = await this.getStorageBalance({ accountId });
    return storageBalance?.total !== undefined;
  }

  async checkStorageBalance({
    accountId,
  }:
  {
    accountId: string,
  }) {
    const transactions: Transaction[] = [];
    const storageAvailable = await this.isStorageBalanceAvailable(
      { accountId },
    );

    if (!storageAvailable) {
      transactions.push({
        receiverId: this.contractId,
        functionCalls: [{
          methodName: 'storage_deposit',
          args: {
            account_id: accountId,
            registration_only: true,
          },
          amount: FT_MINIMUM_STORAGE_BALANCE,
        }],
      });
    }
    return transactions;
  }

  async transfer({
    accountId,
    inputToken,
    amount,
    message,
  }:
  {
    accountId: string,
    inputToken: string,
    amount: string,
    message: string,
  }): Promise<Transaction[]> {
    const transactions: Transaction[] = [];
    const checkStorage = await this.checkStorageBalance({ accountId });
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
}