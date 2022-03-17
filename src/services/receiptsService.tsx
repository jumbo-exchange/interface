/* eslint-disable max-len */
import { providers } from 'near-api-js';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import getConfig from 'services/config';
import SpecialWallet from 'services/wallet';
import { colors } from 'theme';

const config = getConfig();

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

const methodName = {
  swapMethod: [
    'swap',
    'ft_transfer_call',
    'near_deposit',
    'near_withdraw',
  ],
  createPoolMethod: 'add_simple_pool',
  addLiquidityMethod: 'add_liquidity',
  removeLiquidityMethod: 'remove_liquidity',
};

const propertyName = 'FunctionCall';

const getSwapIntersectTransaction = (transactions: any, method: string[]) => {
  const transaction = transactions.filter((tx:any) => method.indexOf(tx.transaction.actions[0][propertyName].method_name) !== -1);
  const hash: string = transaction.map((el:any) => el.transaction.hash);
  const status: boolean = transaction.some((el:any) => el.status.SuccessValue.length > 0);
  const actionWithNear: boolean = methodName.swapMethod.some((el) => el === transaction[0].transaction.actions[0][propertyName].method_name);
  return {
    transaction,
    hash,
    isFindTransaction: transaction.length > 0,
    status,
    actionWithNear,
  };
};

const getTransaction = (transactions: any, method: string) => {
  const transaction = transactions.filter((el: any) => el.transaction.actions[0][propertyName].method_name === method);
  const hash: string = transaction.map((el:any) => el.transaction.hash);
  const status: boolean = transaction.some((el:any) => el.status.SuccessValue.length > 0);
  return {
    transaction,
    hash,
    isFindTransaction: transaction.length > 0,
    status,
  };
};

const getToast = (href: string, title: string, type: ToastType) => {
  const link = (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        textDecoration: 'none',
        color: colors.globalWhite,
      }}
    >{title}.&nbsp;
      <span style={{
        fontSize: '.9rem',
      }}
      >Click to view
      </span>
    </a>
  );
  if (type === ToastType.Success) {
    return toast.success(link, { theme: 'dark' });
  }
  return toast.error(link, { theme: 'dark' });
};

export function analyzeTransactions(
  transactions: any,
): {type: TransactionType, status: StatusType, hash: string } {
  if (transactions.length === 1) {
    const swap = getSwapIntersectTransaction(transactions, methodName.swapMethod);
    if (swap.isFindTransaction) {
      return {
        type: TransactionType.Swap,
        status: swap.status || swap.actionWithNear ? StatusType.Succeeded : StatusType.Failed,
        hash: swap.hash,
      };
    }
  }
  const createPool = getTransaction(transactions, methodName.createPoolMethod);
  if (createPool.isFindTransaction) {
    return {
      type: TransactionType.CreatePool,
      status: createPool.status ? StatusType.Succeeded : StatusType.Failed,
      hash: createPool.hash,
    };
  }
  const addLiquidity = getTransaction(transactions, methodName.addLiquidityMethod);
  if (addLiquidity.isFindTransaction) {
    return {
      type: TransactionType.AddLiquidity,
      status: StatusType.Succeeded,
      hash: addLiquidity.hash,
    };
  }
  const removeLiquidity = getTransaction(transactions, methodName.removeLiquidityMethod);
  if (removeLiquidity.isFindTransaction) {
    return {
      type: TransactionType.RemoveLiquidity,
      status: StatusType.Succeeded,
      hash: removeLiquidity.hash,
    };
  }
  return {
    type: TransactionType.None,
    status: StatusType.None,
    hash: '',
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
        toast.error('Transaction failed');
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
