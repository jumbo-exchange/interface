import BN from 'bn.js';
import Big from 'big.js';
import * as nearApiJs from 'near-api-js';

import { wallet } from './near';
import SpecialWallet, { createContract, Transaction } from './wallet';
import getConfig from './config';

export const formatTokenAmount = (value:string, decimals = 18, precision = 2) => value
  && Big(value).div(Big(10).pow(decimals)).toFixed(precision);
export const parseTokenAmount = (value:string, decimals = 18) => value
  && Big(value).times(Big(10).pow(decimals)).toFixed();
export const removeTrailingZeros = (amount:string) => amount.replace(/\.?0*$/, '');

const {
  utils: {
    format: {
      parseNearAmount,
      formatNearAmount,
    },
  },
} = nearApiJs;

export const FT_MINIMUM_STORAGE_BALANCE = parseNearAmount('0.00125') ?? '0';
const FT_STORAGE_DEPOSIT_GAS = parseNearAmount('0.00000000003');
const FT_TRANSFER_GAS = parseNearAmount('0.00000000003');

export const ONE_YOCTO_NEAR = '0.000000000000000000000001';

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

  contract = createContract(
    wallet,
    CONTRACT_ID,
    basicViewMethods,
    basicChangeMethods,
  )

  contractId = CONTRACT_ID;

  metadata = {
    decimals: DECIMALS_DEFAULT_VALUE,
    icon: ICON_DEFAULT_VALUE,
  };

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
    // @ts-expect-error: Property 'storage_balance_of' does not exist on type 'Contract'.
    return this.contract.storage_balance_of({ account_id: accountId });
  }

  async getMetadata() {
    if (
      this.metadata.decimals !== DECIMALS_DEFAULT_VALUE
      && this.metadata.icon !== ICON_DEFAULT_VALUE
    ) return this.metadata;
    // @ts-expect-error: Property 'ft_metadata' does not exist on type 'Contract'.
    const metadata = await this.contract.ft_metadata();
    this.metadata = {
      decimals: metadata.decimals ?? DECIMALS_DEFAULT_VALUE,
      icon: metadata.icon ?? ICON_DEFAULT_VALUE,
    };
    return metadata;
  }

  async getBalanceOf({ accountId }: { accountId: string }) {
    // @ts-expect-error: Property 'ft_metadata' does not exist on type 'Contract'.
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
