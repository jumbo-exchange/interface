import { functionCall } from 'near-api-js/lib/transaction';
import { IPool } from 'store/interfaces';
import { SWAP_FAILED, SWAP_TOKENS_NOT_IN_SWAP_POOL } from 'utils/errors';
import { ONE_YOCTO_NEAR } from 'utils/constants';
import FungibleTokenContract from './FungibleToken';
import { getAmount, getGas, wallet } from './near';
import { createContract, Transaction } from './wallet';
import getConfig from './config';

enum SWAP_ENUM { DIRECT_SWAP = 1, INDIRECT_SWAP = 2 }
const basicViewMethods = ['ft_metadata', 'ft_balance_of', 'get_return'];
const basicChangeMethods = ['swap'];
const config = getConfig();

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

  async getReturnForPools(
    pools: IPool[],
    amount: string,
    tokenIn: FungibleTokenContract,
    tokenOut: FungibleTokenContract,
  ) {
    if (pools.length === SWAP_ENUM.DIRECT_SWAP) {
      const [currentPool] = pools;
      const tokens = currentPool.tokenAccountIds;
      if (!tokens.includes(tokenIn.contractId) || !tokens.includes(tokenOut.contractId)) {
        throw Error(SWAP_TOKENS_NOT_IN_SWAP_POOL);
      }
      const minOutput = await this.getReturn(
        currentPool.id,
        tokenIn.contractId,
        amount,
        tokenOut.contractId,
      );
      return [minOutput];
    }
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
    if (!swapToken) throw Error(SWAP_FAILED);

    const minAmountOutFirst = await this.getReturn(
      firstPool.id,
      tokenIn.contractId,
      amount,
      swapToken,
    );

    const minAmountOutSecond = await this.getReturn(
      secondPool.id,
      swapToken,
      minAmountOutFirst,
      tokenOut.contractId,
    );

    return [
      minAmountOutFirst,
      minAmountOutSecond,
    ];
  }

  // TODO: REFACTOR
  async generateTransferMessage(
    pools: IPool[],
    amount: string,
    inputToken: FungibleTokenContract,
    outputToken:FungibleTokenContract,
  ) {
    const [firstMinOutput, secondMinOutput] = await this.getReturnForPools(
      pools, amount, inputToken, outputToken,
    );

    if (pools.length === SWAP_ENUM.DIRECT_SWAP) {
      const [currentPool] = pools;

      return [{
        pool_id: currentPool.id,
        token_in: inputToken.contractId,
        token_out: outputToken.contractId,
        min_amount_out: firstMinOutput,
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
          min_amount_out: firstMinOutput,
        }, {
          pool_id: secondPool.id,
          token_in: swapToken,
          token_out: outputToken.contractId,
          min_amount_out: secondMinOutput,
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
  }: {
    inputToken: FungibleTokenContract,
    outputToken: FungibleTokenContract,
    amount: string,
    pools: IPool[],
  }) {
    const transactionsReceipts: Transaction[] = [];
    const accountId = this.walletInstance.getAccountId();
    const outputTokenStorage = await outputToken.checkStorageBalance({ accountId });
    transactionsReceipts.push(...outputTokenStorage);
    const swapAction = await this.generateTransferMessage(
      pools, amount, inputToken, outputToken,
    );

    transactionsReceipts.push({
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

    const transactions = await Promise.all(
      transactionsReceipts.map((t, i) => wallet.createTransaction({
        receiverId: t.receiverId,
        nonceOffset: i + 1,
        actions: t.functionCalls.map((fc: any) => functionCall(
          fc.methodName,
          fc.args,
          getGas(fc.gas),
          getAmount(fc.amount),
        )),
      })),
    );

    this.walletInstance.requestSignTransactions({ transactions });
  }
}
