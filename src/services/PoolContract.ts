import { functionCall } from 'near-api-js/lib/transaction';
import Big from 'big.js';

import {
  ACCOUNT_MIN_STORAGE_AMOUNT,
  MIN_DEPOSIT_PER_TOKEN,
  ONE_MORE_DEPOSIT_AMOUNT,
  LP_STORAGE_AMOUNT,
  STORAGE_PER_TOKEN,
  ONE_YOCTO_NEAR,
} from 'utils/constants';
import { calculateFairShare, percentLess, toNonDivisibleNumber } from 'utils/calculations';
import { IPool } from 'store';
import sendTransactions, { getAmount, getGas, wallet } from './near';
import { createContract, Transaction } from './wallet';
import getConfig from './config';
import FungibleTokenContract from './FungibleToken';

const basicViewMethods = [
  'get_return',
  'get_user_storage_state',
  'storage_balance_of',
  'get_pool_shares',
  'get_pool_volumes',
  'get_deposits',
];
const basicChangeMethods = [
  'swap',
  'storage_deposit',
  'add_liquidity',
  'remove_liquidity',
  'withdraw',
];
const config = getConfig();
const CREATE_POOL_NEAR_AMOUNT = '0.05';
const CONTRACT_ID = config.contractId;

interface IPoolVolumes {
  [tokenId: string]: { input: string; output: string };
}

interface ILiquidityToken {
  token: FungibleTokenContract;
  amount: string
}
export default class PoolContract {
  contract = createContract(
    wallet,
    CONTRACT_ID,
    basicViewMethods,
    basicChangeMethods,
  )

  nonce = 0;

  walletInstance = wallet;

  contractId = CONTRACT_ID;

  async createPool({ tokens, fee }: { tokens: string[], fee: string }) {
    const formattedFee = new Big(fee).mul(100).toFixed(0, 0);
    const action = functionCall(
      'add_simple_pool',
      { tokens, fee: Number(formattedFee) },
      getGas(),
      getAmount(CREATE_POOL_NEAR_AMOUNT),
    );

    const transaction = await wallet.createTransaction({
      receiverId: this.contractId,
      nonceOffset: this.nonce,
      actions: [action],
    });
    this.nonce += 1;

    this.walletInstance.requestSignTransactions(
      { transactions: [transaction] },
    );
  }

  async addLiquidity(
    {
      tokenAmounts,
      pool,
    }:
    {
      tokenAmounts: ILiquidityToken[],
      pool: IPool,
    },
  ) {
    const transactions: Transaction[] = [];
    const storageAmount = await this.checkStorage();
    const [inputToken, outputToken] = tokenAmounts;
    const [firstTokenName, secondTokenName] = pool.tokenAccountIds;
    const firstToken = tokenAmounts.find((el) => el.token.contractId === firstTokenName);
    const secondToken = tokenAmounts.find((el) => el.token.contractId === secondTokenName);
    if (!firstToken || !secondToken) return;

    const tokenInAmount = toNonDivisibleNumber(
      firstToken.token.metadata.decimals,
      firstToken.amount,
    );

    const tokenOutAmount = toNonDivisibleNumber(
      secondToken.token.metadata.decimals,
      secondToken.amount,
    );
    if (Big(storageAmount).gt(0)) {
      transactions.push({
        receiverId: this.contractId,
        functionCalls: [{
          methodName: 'storage_deposit',
          args: { registration_only: false },
          amount: storageAmount,
        }],
      });
    }
    const isInputTokenStorage = await inputToken.token.contract.transfer(
      {
        accountId: this.contractId,
        inputToken: inputToken.token.contractId,
        amount: tokenInAmount,
      },
    );
    if (isInputTokenStorage.length) transactions.push(...isInputTokenStorage);

    const isOutputTokenStorage = await outputToken.token.contract.transfer(
      {
        accountId: this.contractId,
        inputToken: outputToken.token.contractId,
        amount: tokenOutAmount,
      },
    );
    if (isOutputTokenStorage.length) transactions.push(...isOutputTokenStorage);

    transactions.push({
      receiverId: this.contractId,
      functionCalls: [{
        methodName: 'add_liquidity',
        args: { pool_id: pool.id, amounts: [tokenInAmount, tokenOutAmount] },
        amount: LP_STORAGE_AMOUNT,
      }],
    });

    sendTransactions(transactions, this.walletInstance);
  }

  async checkStorageState(accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'get_user_storage_state' does not exist on type 'Contract'.
    const storage = await this.contract.get_user_storage_state({ account_id: accountId });
    return storage ? new Big(storage?.deposit).lte(new Big(storage?.usage)) : true;
  }

  async currentStorageBalance(accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'get_user_storage_state' does not exist on type 'Contract'.
    return this.contract.storage_balance_of({ account_id: accountId });
  }

  async checkStorage() {
    let storageNeeded = Big(0);
    const needDeposit = await this.checkStorageState();
    if (needDeposit) {
      storageNeeded = Big(ONE_MORE_DEPOSIT_AMOUNT);
    } else {
      const balance = await this.currentStorageBalance(wallet.getAccountId());

      if (!balance) {
        storageNeeded = storageNeeded.plus(Number(ACCOUNT_MIN_STORAGE_AMOUNT));
      }

      if (new Big(balance?.available || '0').lt(MIN_DEPOSIT_PER_TOKEN)) {
        storageNeeded = storageNeeded.plus(Number(STORAGE_PER_TOKEN));
      }
    }

    return storageNeeded.toString();
  }

  async removeLiquidity(
    {
      pool,
      shares,
      minAmounts,
    }:
    {
      pool: IPool,
      shares: string | undefined;
      minAmounts: { [tokenId: string]: string; };
      slippageTolerance?: string
    },
  ) {
    const transactions: Transaction[] = [];
    const storageAmount = await this.checkStorage();

    if (storageAmount) {
      transactions.push({
        receiverId: this.contractId,
        functionCalls: [{
          methodName: 'storage_deposit',
          args: { registration_only: false },
          amount: storageAmount,
        }],
      });
    }

    transactions.push({
      receiverId: this.contractId,
      functionCalls: [{
        methodName: 'remove_liquidity',
        args: { pool_id: pool.id, shares, min_amounts: Object.values(minAmounts) },
        amount: ONE_YOCTO_NEAR,
      }],
    });
    pool.tokenAccountIds.map((tokenId) => transactions.push({
      receiverId: this.contractId,
      functionCalls: [
        {
          methodName: 'withdraw',
          args: {
            token_id: tokenId,
            amount: minAmounts[tokenId],
          },
          gas: '100000000000000',
          amount: ONE_YOCTO_NEAR,
        },
      ],
    }));

    sendTransactions(transactions, this.walletInstance);
  }

  async getPoolVolumes(pool: IPool) {
    // @ts-expect-error: Property 'get_pool_volumes' does not exist on type 'Contract'.
    const volumes = this.contract.get_pool_volumes(
      { pool_id: pool.id },
    );

    const sumValues = pool.tokenAccountIds.reduce((acc: IPoolVolumes, tokenId, i) => {
      acc[tokenId] = volumes[i];
      return acc;
    }, {});
    return sumValues;
  }

  async getSharesInPool(poolId: any, accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'get_pool_shares' does not exist on type 'Contract'.
    return this.contract.get_pool_shares(
      { pool_id: poolId, account_id: accountId },
    );
  }
}
