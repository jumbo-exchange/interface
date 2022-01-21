import { functionCall } from 'near-api-js/lib/transaction';
import { IPool } from 'store/interfaces';
import FungibleTokenContract, { FT_MINIMUM_STORAGE_BALANCE } from './FungibleToken';
import { getAmount, getGas, wallet } from './near';
import { createContract, Transaction } from './wallet';
import getConfig from './config';

export const ONE_YOCTO_NEAR = '0.000000000000000000000001';

const basicViewMethods = ['ft_metadata', 'ft_balance_of', 'storage_balance_of'];
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

  static generateTransferMessage(pools: IPool[]):string {
    return '{"force":0,"actions":[{"pool_id":3,"token_in":"ref.fakes.testnet","token_out":"token.solniechniy.testnet","min_amount_out":"50653"}, {"pool_id":3,"token_in":"token.solniechniy.testnet","token_out":"ref.fakes.testnet","min_amount_out":"10"}]}';
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
    const swapAction = {
      pool_id: pools[0].id,
      token_in: pools[0].tokenAccountIds[0],
      token_out: pools[0].tokenAccountIds[1],
      min_amount_out: '50653',
    };
    const transactionsReceipts: Transaction[] = [];
    const outputTokenStorage = await outputToken.checkStorageBalance({ accountId });
    transactionsReceipts.push(...outputTokenStorage);

    transactionsReceipts.push({
      receiverId: inputToken.contractId,
      functionCalls: [{
        methodName: 'ft_transfer_call',
        args: {
          receiver_id: CONTRACT_ID,
          msg: JSON.stringify({
            force: 0,
            actions: [swapAction],
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
