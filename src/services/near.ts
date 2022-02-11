import {
  Near, keyStores, utils,
} from 'near-api-js';
import SpecialWallet, { Transaction } from 'services/wallet';
import BN from 'bn.js';

import { functionCall } from 'near-api-js/lib/transaction';

import getConfig from './config';

const config = getConfig();
const CONTRACT_ID = config.contractId;

export const getGas = (gas?: string) => (gas ? new BN(gas) : new BN('100000000000000'));
export const getAmount = (amount?: string) => (amount ? new BN(utils.format.parseNearAmount(amount) ?? 0) : new BN('0'));

export const near = new Near({
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  ...config,
  headers: {},
});

export const wallet = new SpecialWallet(near, CONTRACT_ID);

export const sendTransactions = async (
  transactions: Transaction[],
  walletInstance: SpecialWallet,
) => {
  if (!transactions.length) return;
  const nearTransactions = await Promise.all(
    transactions.map((t, i) => walletInstance.createTransaction({
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

  walletInstance.requestSignTransactions({ transactions: nearTransactions });
};

export const getUserWalletTokens = async (): Promise<any> => {
  try {
    const account = wallet.getAccountId();
    if (!account) return [];
    return await fetch(
      `${config.helperUrl}/account/${account}/likelyTokens`,
      {
        method: 'GET',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      },
    )
      .then((res) => res.json())
      .then((tokens) => tokens);
  } catch (e) {
    return [];
  }
};
export default sendTransactions;
