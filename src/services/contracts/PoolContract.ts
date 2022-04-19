import Big from 'big.js';

import {
  ACCOUNT_MIN_STORAGE_AMOUNT,
  MIN_DEPOSIT_PER_TOKEN,
  ONE_MORE_DEPOSIT_AMOUNT,
  LP_STORAGE_AMOUNT,
  STORAGE_PER_TOKEN,
  ONE_YOCTO_NEAR,
  NEAR_TOKEN_ID,
  STABLE_LP_TOKEN_DECIMALS,
} from 'utils/constants';
import {
  calculateAddLiquidity, percentLess, toComparableAmount, toNonDivisibleNumber,
} from 'utils/calculations';
import { IPool, PoolType } from 'store';
import sendTransactions, { wallet } from 'services/near';
import { createContract } from 'services/wallet';
import getConfig from 'services/config';
import {
  ILiquidityToken, IPoolVolumes, PoolContractMethod, Transaction,
} from 'services/interfaces';
import FungibleTokenContract from './FungibleToken';

export const registerTokensAction = (contractId: string, tokenIds: string[]) => ({
  receiverId: contractId,
  functionCalls: [{
    methodName: PoolContractMethod.registerTokens,
    args: { token_ids: tokenIds },
    amount: ONE_YOCTO_NEAR,
    gas: '30000000000000',
  }],
});

const basicViewMethods = [
  'get_return',
  'get_user_storage_state',
  'storage_balance_of',
  'get_pool_shares',
  'get_pool_volumes',
  'get_deposits',
  'get_whitelisted_tokens',
  'get_user_whitelisted_tokens',
  'get_pools', // from_index: u64, limit: u64
  'get_number_of_pools',
  'get_pool', // pool_id: u64
];

const basicChangeMethods = [
  'swap',
  'storage_deposit',
  'add_liquidity',
  'add_stable_liquidity',
  'remove_liquidity',
  'withdraw',
];

const config = getConfig();
const CREATE_POOL_NEAR_AMOUNT = '0.05';
const CONTRACT_ID = config.contractId;

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

  async createPool({ tokens, fee }: { tokens: FungibleTokenContract[], fee: string }) {
    const transactions: Transaction[] = [];
    const tokensStorages = await Promise.all(tokens.map(
      (token) => token.checkSwapStorageBalance({ accountId: this.contractId }),
    ));
    const tokensStoragesAmounts = tokensStorages.flat();
    if (tokensStoragesAmounts.length) {
      transactions.push(...tokensStoragesAmounts);
    }

    const formattedFee = new Big(fee).mul(100).toFixed(0, 0);
    transactions.push({
      receiverId: this.contractId,
      functionCalls: [{
        methodName: PoolContractMethod.addSimplePool,
        args: {
          tokens: tokens.map((token) => token.contractId),
          fee: Number(formattedFee),
        },
        amount: CREATE_POOL_NEAR_AMOUNT,
      }],
    });

    sendTransactions(transactions, this.walletInstance);
  }

  async addLiquidity(
    {
      tokenAmounts,
      pool,
      slippage = '0',
    }:
    {
      tokenAmounts: ILiquidityToken[],
      pool: IPool,
      slippage: string
    },
  ) {
    const transactions: Transaction[] = [];
    const storageAmount = await this.checkStorageBalance();
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
    if (storageAmount.length) transactions.push(...storageAmount);
    const whitelistedTokens = await this.getWhitelistedTokens();

    pool.tokenAccountIds.forEach((tokenId: string) => {
      if (!whitelistedTokens.includes(tokenId)) {
        transactions.push(registerTokensAction(
          this.contractId, [tokenId],
        ));
      }
    });

    const isInputTokenStorage = await inputToken.token.transfer(
      {
        accountId: this.contractId,
        inputToken: inputToken.token.contractId,
        amount: tokenInAmount,
      },
    );
    if (isInputTokenStorage.length) transactions.push(...isInputTokenStorage);

    const isOutputTokenStorage = await outputToken.token.transfer(
      {
        accountId: this.contractId,
        inputToken: outputToken.token.contractId,
        amount: tokenOutAmount,
      },
    );
    if (isOutputTokenStorage.length) transactions.push(...isOutputTokenStorage);

    if (pool.type === PoolType.SIMPLE_POOL) {
      transactions.push({
        receiverId: this.contractId,
        functionCalls: [{
          methodName: PoolContractMethod.addLiquidity,
          args: { pool_id: pool.id, amounts: [tokenInAmount, tokenOutAmount] },
          amount: LP_STORAGE_AMOUNT,
        }],
      });
    } else {
      const depositAmounts = [firstToken.amount, secondToken.amount].map(
        (amount) => Number(toNonDivisibleNumber(STABLE_LP_TOKEN_DECIMALS, amount)),
      );
      const comparableAmounts = toComparableAmount(
        pool.supplies,
        [firstToken.token, secondToken.token],
      );

      if (!comparableAmounts) return;

      const [shares] = calculateAddLiquidity(
        Number(pool.amp),
        depositAmounts,
        comparableAmounts,
        Number(pool.sharesTotalSupply),
        pool.totalFee,
      );

      const minShares = percentLess(slippage, Big(shares).toFixed(0), 0);

      transactions.push({
        receiverId: this.contractId,
        functionCalls: [{
          methodName: PoolContractMethod.addStableLiquidity,
          args: {
            pool_id: pool.id,
            amounts: [tokenInAmount, tokenOutAmount],
            min_shares: minShares,
          },
          amount: LP_STORAGE_AMOUNT,
        }],
      });
    }

    sendTransactions(transactions, this.walletInstance);
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

  async getNumberOfPools() {
    // @ts-expect-error: Property 'get_user_storage_state' does not exist on type 'Contract'.
    return this.contract.get_number_of_pools();
  }

  async getPool(poolId: number) {
    // @ts-expect-error: Property 'get_user_storage_state' does not exist on type 'Contract'.
    return this.contract.get_pool({ pool_id: poolId });
  }

  async getPools(from: number, limit: number) {
    // @ts-expect-error: Property 'get_user_storage_state' does not exist on type 'Contract'.
    return this.contract.get_pools({ from_index: from, limit });
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
          methodName: PoolContractMethod.storageDeposit,
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

  async removeLiquidity(
    {
      pool,
      shares,
      minAmounts,
    }:
    {
      pool: IPool,
      shares: string;
      minAmounts: { [tokenId: string]: string; };
      slippageTolerance?: string
    },
  ) {
    const transactions: Transaction[] = [];
    const storageAmount = await this.checkStorageBalance();

    if (storageAmount.length) transactions.push(...storageAmount);

    transactions.push({
      receiverId: this.contractId,
      functionCalls: [{
        methodName: PoolContractMethod.removeLiquidity,
        args: { pool_id: pool.id, shares, min_amounts: Object.values(minAmounts) },
        amount: ONE_YOCTO_NEAR,
      }],
    });

    pool.tokenAccountIds.map((tokenId) => transactions.push({
      receiverId: this.contractId,
      functionCalls: [
        {
          methodName: PoolContractMethod.withdraw,
          args: {
            token_id: tokenId,
            amount: minAmounts[tokenId],
          },
          amount: ONE_YOCTO_NEAR,
        },
      ],
    }));

    sendTransactions(transactions, this.walletInstance);
  }

  async getPoolVolumes(pool: IPool) {
    // @ts-expect-error: Property 'get_pool_volumes' does not exist on type 'Contract'.
    const volumes = await this.contract.get_pool_volumes(
      { pool_id: pool.id },
    );

    const sumValues = pool.tokenAccountIds.reduce((acc: IPoolVolumes, tokenId, i) => {
      acc[tokenId] = volumes[i];
      return acc;
    }, {});
    return sumValues;
  }

  async withdraw({ claimList }:{claimList: [string, string][]}) {
    const transactions: Transaction[] = [];
    const storageAmount = await this.checkStorageBalance();

    if (storageAmount.length) transactions.push(...storageAmount);

    claimList.map(([tokenId, value]) => transactions.push({
      receiverId: this.contractId,
      functionCalls: [
        {
          methodName: PoolContractMethod.withdraw,
          args: {
            token_id: tokenId,
            amount: value,
          },
          amount: ONE_YOCTO_NEAR,
        },
      ],
    }));

    sendTransactions(transactions, this.walletInstance);
  }

  async getWhitelistedTokens() {
    let userWhitelist = [];
    // @ts-expect-error: Property 'get_whitelisted_tokens' does not exist on type 'Contract'.
    const globalWhitelist = await this.contract.get_whitelisted_tokens();
    if (wallet.isSignedIn()) {
      // @ts-expect-error: Property 'get_user_whitelisted_tokens' does not exist on type 'Contract'.
      userWhitelist = await this.contract.get_user_whitelisted_tokens(
        { account_id: wallet.getAccountId() },
      );
    }
    const tokenList = [...globalWhitelist, ...userWhitelist];
    const uniqueTokens = new Set(tokenList);

    return Array.from(uniqueTokens);
  }

  async getSharesInPool(poolId: any, accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'get_pool_shares' does not exist on type 'Contract'.
    return this.contract.get_pool_shares(
      { pool_id: poolId, account_id: accountId },
    );
  }

  async getDeposits(accountId = wallet.getAccountId()) {
    // @ts-expect-error: Property 'get_deposits' does not exist on type 'Contract'.
    return this.contract.get_deposits(
      { account_id: accountId },
    );
  }
}
