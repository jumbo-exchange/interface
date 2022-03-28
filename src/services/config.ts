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
        contractId: 'jumbo-exchange-v1.rkonoval.testnet',

        //!
        farmContractId: 'jumbo-farming-v2.rkonoval.testnet',
        //!

        nearAddress: 'wrap.testnet',
        jumboAddress: 'jumbo_exchange_v2.solniechniy.testnet',
        jumboPoolId: 4,
        stablePoolId: 1513, // ?
      };
    default:
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
        indexerUrl: 'https://price-service.jumbo.exchange',
        contractId: 'v1.jumbo_exchange.near',

        //!
        farmContractId: 'jumbo-farming-v2.rkonoval.testnet',
        //!

        nearAddress: 'wrap.near',
        jumboAddress: 'token.jumbo_exchange.near',
        jumboPoolId: 4,
        stablePoolId: 0,
      };
  }
}
