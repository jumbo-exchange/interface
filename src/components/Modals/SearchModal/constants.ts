import Big from 'big.js';
import FungibleTokenContract from 'services/FungibleToken';
import { ITokenPrice } from 'store';
import { formatTokenAmount, removeTrailingZeros } from 'utils/calculations';

export const getCurrentBalance = (
  balances: {[key: string]: string;},
  token: FungibleTokenContract,
) => {
  const currentBalance = formatTokenAmount(balances[token.contractId], token.metadata.decimals);
  if (currentBalance !== '0') {
    return new Big(currentBalance).toFixed(3);
  }
  return 0;
};

export const getCurrentPrice = (
  prices: {[key: string]: ITokenPrice;},
  balances: {[key: string]: string;},
  token: FungibleTokenContract,
) => {
  const currentBalance = balances[token.contractId];
  const priceForToken = prices[token.contractId] ?? null;
  const currentBalanceBig = new Big(currentBalance);
  if (priceForToken && currentBalanceBig.gt(0)) {
    const currentBalances = currentBalanceBig.mul(priceForToken.price).toFixed();
    return removeTrailingZeros(formatTokenAmount(currentBalances, token.metadata.decimals, 5));
  }
  return '-';
};
