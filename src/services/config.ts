export default function getConfig(
  env: string | undefined = process.env.REACT_APP_NEAR_ENV,
) {
  switch (env) {
    case 'development':
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
        indexerUrl: 'https://testnet-indexer.ref-finance.com',
        contractId: 'ref-contract.solniechniy.testnet',
        nearAddress: 'wrap.testnet',
      };
    default:
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
        indexerUrl: 'https://indexer.ref-finance.net',
        contractId: 'ref-contract.solniechniy.testnet',
        nearAddress: 'wrap.near',
      };
  }
}
