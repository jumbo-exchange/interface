import { providers } from 'near-api-js';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import getConfig from 'services/config';
import SpecialWallet from 'services/wallet';

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
        Promise.all(transactions.split(',').map(
          (txHash) => provider.txStatus(txHash, wallet.getAccountId()),
        )).then(
          (res) => console.log('Result: ', res),
        );
      }
    }
  }, [query, wallet]);
}
