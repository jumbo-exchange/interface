import { IPool } from 'store/interfaces';
import { SWAP_FAILED, SWAP_TOKENS_NOT_IN_SWAP_POOL } from 'utils/errors';
import { ONE_YOCTO_NEAR } from 'utils/constants';
import { NEAR_TOKEN_ID } from 'store';
import { percentLess } from 'utils/calculations';
import Big from 'big.js';
import FungibleTokenContract from './FungibleToken';
import sendTransactions, { wallet } from './near';
import { createContract, Transaction } from './wallet';
import getConfig from './config';

enum SWAP_ENUM { DIRECT_SWAP = 1, INDIRECT_SWAP = 2 }
const basicViewMethods = ['get_return'];
const basicChangeMethods = ['swap'];
const config = getConfig();
const FEE_DIVISOR = 10000;

const CONTRACT_ID = config.contractId;

export default class SwapContract {
  contract = createContract(
    wallet,
    CONTRACT_ID,
    basicViewMethods,
    basicChangeMethods,
  )

  walletInstance = wallet;

  contractId = CONTRACT_ID;

  async getReturn(poolId: number, tokenIn: string, amount: string, tokenOut: string) {
    // @ts-expect-error: Property 'get_return' does not exist on type 'Contract'.
    return this.contract.get_return(
      {
        pool_id: poolId,
        token_in: tokenIn,
        amount_in: amount,
        token_out: tokenOut,
      },
    );
  }

  static getLocalReturn(
    tokenIn: FungibleTokenContract,
    tokenOut: FungibleTokenContract,
    pool: IPool,
    tokenInAmount: string,
  ) {
    const allocation = tokenInAmount;

    const amountWithFee = Number(allocation) * (FEE_DIVISOR - pool.totalFee);
    const inBalance = pool.supplies[tokenIn.contractId];

    const outBalance = pool.supplies[tokenOut.contractId];

    return new Big(
      (
        (amountWithFee * Number(outBalance))
        / (FEE_DIVISOR * Number(inBalance) + amountWithFee)
      ).toString(),
    ).toFixed();
  }

  static getReturnForPools(
    pools: IPool[],
    amount: string,
    tokenIn: FungibleTokenContract,
    tokenOut: FungibleTokenContract,
    tokens: {[key: string]: FungibleTokenContract},
  ) {
    if (tokenIn.contractId === config.nearAddress && tokenOut.contractId === config.nearAddress) {
      return [amount, amount];
    }

    if (pools.length === SWAP_ENUM.DIRECT_SWAP) {
      const [currentPool] = pools;
      const tokensIds = currentPool.tokenAccountIds;
      if (!tokensIds.includes(tokenIn.contractId) || !tokensIds.includes(tokenOut.contractId)) {
        throw Error(SWAP_TOKENS_NOT_IN_SWAP_POOL);
      }
      const minOutput = SwapContract.getLocalReturn(
        tokenIn,
        tokenOut,
        currentPool,
        amount,
      );
      return [minOutput];
    } if (pools.length === SWAP_ENUM.INDIRECT_SWAP) {
      const [firstPool, secondPool] = pools;
      const firstPoolTokens = firstPool.tokenAccountIds;
      const secondPoolTokens = secondPool.tokenAccountIds;
      if (
        !firstPoolTokens.includes(tokenIn.contractId)
        && !secondPoolTokens.includes(tokenOut.contractId)
      ) {
        throw Error(SWAP_TOKENS_NOT_IN_SWAP_POOL);
      }
      const swapToken = firstPoolTokens.find((tokenName) => tokenName !== tokenIn.contractId);
      if (!swapToken || !tokens[swapToken]) throw Error(SWAP_FAILED);

      const minAmountOutFirst = SwapContract.getLocalReturn(
        tokenIn,
        tokens[swapToken],
        firstPool,
        amount,
      );

      const minAmountOutSecond = SwapContract.getLocalReturn(
        tokens[swapToken],
        tokenOut,
        secondPool,
        minAmountOutFirst,
      );

      return [
        minAmountOutFirst,
        minAmountOutSecond,
      ];
    }
    return ['0', '0'];
  }

  // TODO: REFACTOR
  static generateTransferMessage(
    pools: IPool[],
    amount: string,
    inputToken: FungibleTokenContract,
    outputToken:FungibleTokenContract,
    tokens: {[key: string]: FungibleTokenContract},
    slippage: string = '0',
  ) {
    const [firstMinOutput, secondMinOutput] = SwapContract.getReturnForPools(
      pools, amount, inputToken, outputToken, tokens,
    );

    if (pools.length === SWAP_ENUM.DIRECT_SWAP) {
      const [currentPool] = pools;

      return [{
        pool_id: currentPool.id,
        token_in: inputToken.contractId,
        token_out: outputToken.contractId,
        min_amount_out: percentLess(slippage, firstMinOutput, 0),
      }];
    }
    if (pools.length === SWAP_ENUM.INDIRECT_SWAP) {
      const [firstPool, secondPool] = pools;
      const firstPoolTokens = firstPool.tokenAccountIds;
      const secondPoolTokens = secondPool.tokenAccountIds;
      if (
        !firstPoolTokens.includes(inputToken.contractId)
        && !secondPoolTokens.includes(outputToken.contractId)
      ) {
        throw Error(SWAP_TOKENS_NOT_IN_SWAP_POOL);
      }
      const swapToken = firstPoolTokens.find((tokenName) => tokenName !== inputToken.contractId);
      if (!swapToken) throw Error(SWAP_FAILED);

      return [
        {
          pool_id: firstPool.id,
          token_in: inputToken.contractId,
          token_out: swapToken,
          min_amount_out: 0,
        }, {
          pool_id: secondPool.id,
          token_in: swapToken,
          token_out: outputToken.contractId,
          min_amount_out: percentLess(slippage, secondMinOutput, 0),
        },
      ];
    }
    throw Error(SWAP_FAILED);
  }

  async swap({
    inputToken,
    outputToken,
    amount,
    pools,
    tokens,
    slippageAmount,
  }: {
    inputToken: FungibleTokenContract,
    outputToken: FungibleTokenContract,
    amount: string,
    pools: IPool[],
    tokens: {[key: string]: FungibleTokenContract},
    slippageAmount: string
  }) {
    const tokensIds = [inputToken.contractId, outputToken.contractId];

    const transactions: Transaction[] = [];
    const accountId = this.walletInstance.getAccountId();
    const outputTokenStorage = await outputToken.contract.checkStorageBalance({ accountId });
    transactions.push(...outputTokenStorage);

    if (tokensIds.includes(NEAR_TOKEN_ID) && tokensIds.includes(config.nearAddress)) {
      if (inputToken.contractId === NEAR_TOKEN_ID) {
        transactions.push(...outputToken.contract.wrap({ amount }));
      } else {
        transactions.push(...inputToken.contract.unwrap({ amount }));
      }
    } else {
      const swapAction = SwapContract.generateTransferMessage(
        pools, amount, inputToken, outputToken, tokens, slippageAmount,
      );
      transactions.push({
        receiverId: inputToken.contractId,
        functionCalls: [{
          methodName: 'ft_transfer_call',
          args: {
            receiver_id: CONTRACT_ID,
            msg: JSON.stringify({
              force: 0,
              actions: [...swapAction],
            }),
            amount,
          },
          amount: ONE_YOCTO_NEAR,
        }],
      });
    }

    sendTransactions(transactions, this.walletInstance);
  }
}
