import { functionCall } from 'near-api-js/lib/transaction';
import Big from 'big.js';

import { getAmount, getGas, wallet } from './near';
import { createContract } from './wallet';
import getConfig from './config';

const basicViewMethods = ['get_return'];
const basicChangeMethods = ['swap'];
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
}
