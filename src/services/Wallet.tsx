/* eslint-disable no-underscore-dangle */
/* eslint-disable max-classes-per-file */
import { baseDecode } from 'borsh';
import { ConnectedWalletAccount, Near, WalletConnection } from 'near-api-js';
import { Action, createTransaction } from 'near-api-js/lib/transaction';
import { PublicKey } from 'near-api-js/lib/utils';
import * as nearAPI from 'near-api-js';

class SpecialWalletAccount extends ConnectedWalletAccount {
  async sendTransactionWithActions(receiverId: string, actions: Action[]) {
    return this.signAndSendTransaction(receiverId, actions);
  }

  async createTransaction({
    receiverId,
    actions,
    nonceOffset = 1,
  }: {
    receiverId: string;
    actions: Action[];
    nonceOffset?: number;
  }) {
    const localKey = await this.connection.signer.getPublicKey(
      this.accountId,
      this.connection.networkId,
    );
    const accessKey = await this.accessKeyForTransaction(
      receiverId,
      actions,
      localKey,
    );
    if (!accessKey) {
      throw new Error(
        `Cannot find matching key for transaction sent to ${receiverId}`,
      );
    }

    const block = await this.connection.provider.block({ finality: 'final' });
    const blockHash = baseDecode(block.header.hash);

    const publicKey = PublicKey.from(accessKey.public_key);
    const nonce = accessKey.access_key.nonce + nonceOffset;

    return createTransaction(
      this.accountId,
      publicKey,
      receiverId,
      nonce,
      actions,
      blockHash,
    );
  }
}

export default class SpecialWallet extends WalletConnection {
  constructor(near: Near, appKeyPrefix: string | null) {
    super(near, appKeyPrefix);
    this._connectedAccount = new SpecialWalletAccount(
      this,
      this._near.connection,
      this._authData.accountId,
    );
  }

  _connectedAccount: SpecialWalletAccount;

  account() {
    if (!this._connectedAccount) {
      this._connectedAccount = new SpecialWalletAccount(
        this,
        this._near.connection,
        this._authData.accountId,
      );
    }

    return this._connectedAccount;
  }

  createTransaction({
    receiverId,
    actions,
    nonceOffset = 1,
  }: {
    receiverId: string;
    actions: Action[];
    nonceOffset?: number;
  }) {
    return this._connectedAccount.createTransaction({
      receiverId,
      actions,
      nonceOffset,
    });
  }
}

export function createContract(wallet: SpecialWallet,
  contractId: string,
  viewMethods : string[] = [],
  changeMethods: string[] = []) {
  return new nearAPI.Contract(
    wallet.account(),
    contractId,
    {
      viewMethods,
      changeMethods,
    },
  );
}
