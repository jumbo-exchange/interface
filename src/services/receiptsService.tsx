/* eslint-disable no-prototype-builtins */
/* eslint-disable default-case */
/* eslint-disable max-len */
import getConfig from 'services/config';
import SpecialWallet from 'services/wallet';
import styled from 'styled-components';
import Big from 'big.js';
import i18n from 'i18n';

import { providers } from 'near-api-js';
import { useEffect } from 'react';
import { toast, Slide } from 'react-toastify';
import { colors } from 'theme';

const config = getConfig();

const Link = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.globalWhite};
  & > p {
    color: ${({ theme }) => theme.globalGrey};
    margin: 0;
    font-size: .75rem;
  }
`;

enum ToastType {
  Success,
  Error,
}

enum TransactionType {
  None = 0,
  Swap,
  CreatePool,
  AddLiquidity,
  RemoveLiquidity,
  NearDeposit,
  NearWithdraw
}

enum StatusType {
  None,
  SuccessValue,
  Failure,
}

const swapMethod = ['ft_transfer_call'];

const methodName: { [key: string]: string } = {
  createPoolMethod: 'add_simple_pool',
  addLiquidityMethod: 'add_liquidity',
  removeLiquidityMethod: 'remove_liquidity',
  nearDeposit: 'near_deposit',
  nearWithdraw: 'near_withdraw',

  // TODO: add toasty and clear url
  stake: 'mft_transfer_call',
  unStake: 'withdraw_seed',
  withdrawReward: 'withdraw_reward',
};

const PROPERTY_NAME = 'FunctionCall';

const getToast = (href: string, title: string, type: ToastType) => {
  const link = (
    <Link href={href} target="_blank" rel="noreferrer">
      {title}
      <p>Open Transaction</p>
    </Link>
  );
  if (type === ToastType.Success) {
    return toast.success(link, {
      theme: 'dark',
      transition: Slide,
      closeOnClick: false,
      style: {
        background: colors.backgroundCard,
        boxShadow: '0px 0px 10px 10px rgba(0, 0, 0, 0.15)',
        borderRadius: '12px',
      },
    });
  }
  return toast.error(link, {
    theme: 'dark',
    transition: Slide,
    closeOnClick: false,
    style: {
      background: colors.warningBg,
      boxShadow: '0px 0px 10px 10px rgba(0, 0, 0, 0.15)',
      borderRadius: '12px',
    },
  });
};

const detailsTransaction = (transaction: any, type: TransactionType) => {
  const { hash } = transaction.transaction;
  const successStatus = transaction.status.hasOwnProperty('SuccessValue');

  if (type === TransactionType.Swap) {
    const successValue = atob(transaction.status.SuccessValue);
    const swapStatus = Big(successValue.replace(/"/g, '') || 0).gt(0);
    return {
      hash,
      status: swapStatus && successStatus ? StatusType.SuccessValue : StatusType.Failure,
    };
  }
  return {
    hash,
    status: successStatus ? StatusType.SuccessValue : StatusType.Failure,
  };
};

const getTransaction = (transactions: any, method: { [key: string]: string }) => {
  const [transaction] = transactions.filter((tx:any) => Object.values(method).indexOf(tx.transaction.actions[0][PROPERTY_NAME].method_name) !== -1);

  let type = TransactionType.None;
  if (!transaction) {
    const [swapTransaction] = transactions.filter((tx:any) => swapMethod.indexOf(tx.transaction.actions[0][PROPERTY_NAME].method_name) !== -1);
    if (swapTransaction) {
      return {
        type: TransactionType.Swap,
        transaction: swapTransaction,
      };
    }
    return {
      type,
      transaction,
    };
  }

  switch (transaction.transaction.actions[0][PROPERTY_NAME].method_name) {
    case method.createPoolMethod: {
      type = TransactionType.CreatePool;
      break;
    }
    case method.addLiquidityMethod: {
      type = TransactionType.AddLiquidity;
      break;
    }
    case method.removeLiquidityMethod: {
      type = TransactionType.RemoveLiquidity;
      break;
    }
    case method.nearDeposit: {
      type = TransactionType.NearDeposit;
      break;
    }
    case method.nearWithdraw: {
      type = TransactionType.NearWithdraw;
      break;
    }
  }
  return {
    type,
    transaction,
  };
};

export function analyzeTransactions(
  transactions: any,
): {type: TransactionType, status: StatusType, hash: string } {
  const { type, transaction } = getTransaction(transactions, methodName);
  if (!transaction || type === TransactionType.None) {
    return {
      type,
      status: StatusType.None,
      hash: '',
    };
  }
  const { hash, status } = detailsTransaction(transaction, type);
  return {
    type,
    status,
    hash,
  };
}

function parseTransactions(txs: any) {
  const result: {
    type: TransactionType,
    status: StatusType,
    hash: string
  } = analyzeTransactions(txs);
  const href = `${config.explorerUrl}/transactions/${result.hash}`;
  switch (result.type) {
    case TransactionType.Swap:
      if (result.status === StatusType.SuccessValue) {
        getToast(href, i18n.t('toast.swap'), ToastType.Success);
      } else if (result.status === StatusType.Failure) {
        getToast(href, i18n.t('toast.swap'), ToastType.Error);
      }
      break;
    case TransactionType.NearDeposit:
      if (result.status === StatusType.SuccessValue) {
        getToast(href, i18n.t('toast.nearDeposit'), ToastType.Success);
      } else if (result.status === StatusType.Failure) {
        getToast(href, i18n.t('toast.nearDeposit'), ToastType.Error);
      }
      break;
    case TransactionType.NearWithdraw:
      if (result.status === StatusType.SuccessValue) {
        getToast(href, i18n.t('toast.nearWithdraw'), ToastType.Success);
      } else if (result.status === StatusType.Failure) {
        getToast(href, i18n.t('toast.nearWithdraw'), ToastType.Error);
      }
      break;
    case TransactionType.AddLiquidity:
      if (result.status === StatusType.SuccessValue) {
        getToast(href, i18n.t('toast.addLiquidity'), ToastType.Success);
      } else if (result.status === StatusType.Failure) {
        getToast(href, i18n.t('toast.addLiquidity'), ToastType.Error);
      }
      break;
    case TransactionType.CreatePool:
      if (result.status === StatusType.SuccessValue) {
        getToast(href, i18n.t('toast.createPool'), ToastType.Success);
      } else if (result.status === StatusType.Failure) {
        getToast(href, i18n.t('toast.createPool'), ToastType.Error);
      }
      break;
    case TransactionType.RemoveLiquidity:
      if (result.status === StatusType.SuccessValue) {
        getToast(href, i18n.t('toast.removeLiquidity'), ToastType.Success);
      } else if (result.status === StatusType.Failure) {
        getToast(href, i18n.t('toast.removeLiquidity'), ToastType.Error);
      }
      break;
  }
}

export default function useTransactionHash(
  query: string | undefined,
  wallet: SpecialWallet | null,
) {
  return useEffect(() => {
    if (wallet) {
      const queryParams = new URLSearchParams(query);
      const transactions = queryParams?.get('transactionHashes');
      const errorCode = queryParams?.get('errorCode');
      const errorMessage = queryParams?.get('errorMessage');
      if (errorCode || errorMessage) {
        toast.error(i18n.t('toast.transactionFailed'), {
          theme: 'dark',
          transition: Slide,
          style: {
            background: colors.warningBg,
            boxShadow: '0px 0px 10px 10px rgba(0, 0, 0, 0.15)',
            borderRadius: '12px',
          },
        });
      }

      if (transactions) {
        const provider = new providers.JsonRpcProvider(
          config.nodeUrl,
        );
        try {
          Promise.all(transactions.split(',').map(
            (txHash) => provider.txStatus(txHash, wallet.getAccountId()),
          )).then(
            (res) => parseTransactions(res),
          );
        } catch (e) {
          console.warn(`${e} error while loading tx`);
        }
      }
    }
  }, [query, wallet]);
}
