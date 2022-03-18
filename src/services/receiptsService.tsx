/* eslint-disable max-len */
import getConfig from 'services/config';
import SpecialWallet from 'services/wallet';
import styled from 'styled-components';
import Big from 'big.js';

import { providers } from 'near-api-js';
import { useEffect } from 'react';
import { toast, Slide } from 'react-toastify';
import { colors } from 'theme';

const config = getConfig();

const Link = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.globalWhite};
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
}

enum StatusType {
  None,
  Succeeded,
  Failed,
}

const swapMethod = [
  'ft_transfer_call',
  'near_deposit',
  'near_withdraw',
];

const methodName: { [key: string]: string } = {
  createPoolMethod: 'add_simple_pool',
  addLiquidityMethod: 'add_liquidity',
  removeLiquidityMethod: 'remove_liquidity',
};

const PROPERTY_NAME = 'FunctionCall';

const getToast = (href: string, title: string, type: ToastType) => {
  const link = (
    <Link href={href} target="_blank" rel="noreferrer">
      {title}.&nbsp;Click to view
    </Link>
  );
  if (type === ToastType.Success) {
    return toast.success(link, {
      theme: 'dark',
      transition: Slide,
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
    style: {
      background: colors.warningBg,
      boxShadow: '0px 0px 10px 10px rgba(0, 0, 0, 0.15)',
      borderRadius: '12px',
    },
  });
};

const getSwapTransaction = (transactions: any, method: string[]) => {
  const [transaction] = transactions.filter((tx:any) => method.indexOf(tx.transaction.actions[0][PROPERTY_NAME].method_name) !== -1);
  if (transaction === undefined) return null;
  return {
    transaction,
  };
};

const detailsTransaction = (transaction: any, type: TransactionType) => {
  const { hash } = transaction.transaction;

  if (type === TransactionType.Swap) {
    const successValue = atob(transaction.status.SuccessValue);
    const status = Big(successValue.replace(/"/g, '') || 0).gt(0);
    const nearMethod = ['near_deposit', 'near_withdraw'];
    const actionWithNear = nearMethod.some((el) => el === transaction.transaction.actions[0][PROPERTY_NAME].method_name);
    return {
      hash,
      status: status || actionWithNear ? StatusType.Succeeded : StatusType.Failed,
    };
  }
  return {
    hash,
    status: StatusType.Succeeded,
  };
};

const getTransaction = (transactions: any, method: { [key: string]: string }) => {
  const [transaction] = transactions.filter((tx:any) => Object.values(method).indexOf(tx.transaction.actions[0][PROPERTY_NAME].method_name) !== -1);

  let type = TransactionType.None;
  if (transactions.length <= 2) {
    const swap = getSwapTransaction(transactions, swapMethod);
    if (swap && swap.transaction) {
      return {
        type: TransactionType.Swap,
        transaction: swap.transaction,
      };
    }
  } else {
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
      default:
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
      if (result.status === StatusType.Succeeded) {
        getToast(href, 'Swap', ToastType.Success);
      } else if (result.status === StatusType.Failed) {
        getToast(href, 'Swap', ToastType.Error);
      }
      break;
    case TransactionType.AddLiquidity:
      if (result.status === StatusType.Succeeded) {
        getToast(href, 'Add Liquidity', ToastType.Success);
      } else if (result.status === StatusType.Failed) {
        getToast(href, 'Add Liquidity', ToastType.Error);
      }
      break;
    case TransactionType.CreatePool:
      if (result.status === StatusType.Succeeded) {
        getToast(href, 'Create Pool', ToastType.Success);
      } else if (result.status === StatusType.Failed) {
        getToast(href, 'Create Pool', ToastType.Error);
      }
      break;
    case TransactionType.RemoveLiquidity:
      if (result.status === StatusType.Succeeded) {
        getToast(href, 'Remove Liquidity', ToastType.Success);
      } else if (result.status === StatusType.Failed) {
        getToast(href, 'Remove Liquidity', ToastType.Error);
      }
      break;
    default:
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
        toast.error('Transaction failed', {
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
          console.warn(e, ' error while loading tx');
        }
      }
    }
  }, [query, wallet]);
}
