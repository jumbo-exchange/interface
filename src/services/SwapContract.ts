import { functionCall } from 'near-api-js/lib/transaction';
import { IPool } from 'store/interfaces';
import { SWAP_FAILED, SWAP_TOKENS_NOT_IN_SWAP_POOL } from 'utils/errors';
import FungibleTokenContract from './FungibleToken';
import { getAmount, getGas, wallet } from './near';
import { createContract, Transaction } from './wallet';
import getConfig from './config';

export const ONE_YOCTO_NEAR = '0.000000000000000000000001';

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

  // TODO: REFACTOR
  async generateTransferMessage(
    pools: IPool[],
    amount: string,
    inputToken: FungibleTokenContract,
    outputToken:FungibleTokenContract,
  ) {
    const DIRECT_SWAP = 1;
    const INDIRECT_SWAP = 2;
    if (pools.length === DIRECT_SWAP) {
      const [currentPool] = pools;
      const tokens = currentPool.tokenAccountIds;
      if (!tokens.includes(inputToken.contractId) || !tokens.includes(outputToken.contractId)) {
        throw Error(SWAP_TOKENS_NOT_IN_SWAP_POOL);
      }
      // @ts-expect-error: Property 'get_return' does not exist on type 'Contract'.
      const minAmountOut = await this.contract.get_return(
        {
          pool_id: currentPool.id,
          token_in: inputToken.contractId,
          amount_in: amount,
          token_out: outputToken.contractId,
        },
      );

      return [{
        pool_id: currentPool.id,
        token_in: inputToken.contractId,
        token_out: outputToken.contractId,
        min_amount_out: minAmountOut,
      }];
    }
    if (pools.length === INDIRECT_SWAP) {
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
      // @ts-expect-error: Property 'get_return' does not exist on type 'Contract'.
      const minAmountOutFirst = await this.contract.get_return(
        {
          pool_id: firstPool.id,
          token_in: inputToken.contractId,
          amount_in: amount,
          token_out: swapToken,
        },
      );
      // @ts-expect-error: Property 'get_return' does not exist on type 'Contract'.
      const minAmountOutSecond = await this.contract.get_return(
        {
          pool_id: secondPool.id,
          token_in: swapToken,
          amount_in: minAmountOutFirst,
          token_out: outputToken.contractId,
        },
      );

      return [
        {
          pool_id: firstPool.id,
          token_in: inputToken.contractId,
          token_out: swapToken,
          min_amount_out: minAmountOutFirst,
        }, {
          pool_id: secondPool.id,
          token_in: swapToken,
          token_out: outputToken.contractId,
          min_amount_out: minAmountOutSecond,
        },
      ];
    }
    throw Error(SWAP_FAILED);
  }

  async swap({
    accountId,
    inputToken,
    outputToken,
    amount,
    pools,
  }: {
    accountId: string,
    inputToken: FungibleTokenContract,
    outputToken: FungibleTokenContract,
    amount: string,
    pools: IPool[],
  }) {
    const transactionsReceipts: Transaction[] = [];
    const outputTokenStorage = await outputToken.checkStorageBalance({ accountId });
    transactionsReceipts.push(...outputTokenStorage);
    const swapAction = await this.generateTransferMessage(pools, amount, inputToken, outputToken);
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
