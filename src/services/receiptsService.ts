import { providers } from 'near-api-js';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import getConfig from 'services/config';
import SpecialWallet from 'services/wallet';

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
    'ft_transfer_call',
    'swap',
    'near_deposit',
    'near_withdraw',
  ],
  createPoolMethod: ['add_simple_pool'],
  addLiquidityMethod: [
    // 'deposit',
    // 'ft_transfer_call',
    'add_liquidity', // action[last]
  ],
  removeLiquidityMethod: [
    'remove_liquidity', // action[0]
    // 'withdraw',
  ],
};

export const FT_TRANSFER = 'ft_transfer_call';
const propertyName = 'FunctionCall';

const getTransaction = (tx: any) => {
  console.log(tx.transaction.actions[0][propertyName].method_name);
  return tx.transaction.actions[0][propertyName].method_name;
};

export function analyzeTransactions(
  transactions: any,
): {type: TransactionType, status: StatusType } {
  if (transactions.length === 1) {
    const [transaction] = transactions;
    const statusLength = transaction.status.SuccessValue.length > 0;
    const isSwap = methodName.swapMethod.some((el) => getTransaction(transaction) === el);
    console.log('isSwap: ', isSwap);
    if (isSwap) {
      return {
        type: TransactionType.Swap,
        status: statusLength ? StatusType.Succeeded : StatusType.Failed,
      };
    }
    const isCreatePoolMethod = methodName.createPoolMethod
      .some((el) => getTransaction(transaction) === el);
    console.log('isCreatePoolMethod: ', isCreatePoolMethod);
    if (isCreatePoolMethod) {
      return {
        type: TransactionType.CreatePool,
        status: statusLength ? StatusType.Succeeded : StatusType.Failed,
      };
    }
  }
  if (transactions.length > 1) {
    const [transaction] = transactions;
    const isAddLiquidityMethod = methodName.addLiquidityMethod
      .some((el) => getTransaction(transaction) === el);
    console.log('isAddLiquidityMethod: ', isAddLiquidityMethod);
    if (isAddLiquidityMethod) {
      return {
        type: TransactionType.AddLiquidity,
        status: StatusType.Succeeded,
      };
    }
    const isRemoveLiquidityMethod = methodName.removeLiquidityMethod
      .some((el) => getTransaction(transaction) === el);
    console.log('isRemoveLiquidityMethod: ', isRemoveLiquidityMethod);

    if (isRemoveLiquidityMethod) {
      return {
        type: TransactionType.RemoveLiquidity,
        status: StatusType.Succeeded,
      };
    }
  }
  return {
    type: TransactionType.None,
    status: StatusType.None,
  };
}

function parseTransactions(txs: any) {
  const result: {type: TransactionType, status:StatusType } = analyzeTransactions(txs);
  switch (result.type) {
    case TransactionType.Swap:
      if (result.status === StatusType.Succeeded) {
        toast.dark('Swap successful');
      } else if (result.status === StatusType.Failed) {
        toast.error('Swap failed');
      }
      break;
    case TransactionType.AddLiquidity:
      if (result.status === StatusType.Succeeded) {
        toast.dark('Add Liquidity successful');
      } else if (result.status === StatusType.Failed) {
        toast.error('Add Liquidity failed');
      }
      break;
    case TransactionType.CreatePool:
      if (result.status === StatusType.Succeeded) {
        toast.dark('CreatePool successful');
      } else if (result.status === StatusType.Failed) {
        toast.error('Create Pool failed');
      }
      break;
    case TransactionType.RemoveLiquidity:
      if (result.status === StatusType.Succeeded) {
        toast.dark('Remove Liquidity successful');
      } else if (result.status === StatusType.Failed) {
        toast.error('Remove Liquidity failed');
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
        const config = getConfig();
        const provider = new providers.JsonRpcProvider(
          config.nodeUrl,
        );
        try {
          Promise.all(transactions.split(',').map(
            (txHash) => provider.txStatus(txHash, wallet.getAccountId()),
          )).then(
            (res) => {
              console.log('Result: ', res);
              return parseTransactions(res);
            },
          );
        } catch (e) {
          console.warn(e, ' error while loading tx');
        }
      }
    }
  }, [query, wallet]);
}
