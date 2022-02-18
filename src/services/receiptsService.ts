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

export const FT_TRANSFER = 'ft_transfer_call';
const propertyName = 'FunctionCall';

const getTransaction = (tx: any) => tx.transaction.actions[0][propertyName];

export function analyzeTransactions(
  transactions: any,
): {type: TransactionType, status:StatusType } {
  if (transactions.length === 1) {
    const [transaction] = transactions;
    const statusLength = transaction.status.SuccessValue.length > 0;
    const transactionType = getTransaction(transaction) === FT_TRANSFER;
    console.log(transactionType);
    return {
      type: TransactionType.Swap,
      status: statusLength ? StatusType.Succeeded : StatusType.Failed,
    };
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
      break;
    case TransactionType.CreatePool:
      break;
    case TransactionType.RemoveLiquidity:
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
            (res) => parseTransactions(res),
          );
        } catch (e) {
          console.warn(e, ' error while loading tx');
        }
      }
    }
  }, [query, wallet]);
}
