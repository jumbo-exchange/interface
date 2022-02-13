import Big from 'big.js';
import FungibleTokenContract from 'services/FungibleToken';
import { formatTokenAmount } from 'utils/calculations';

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
  balances: {[key: string]: string;},
  token: FungibleTokenContract,
) => {
  const currentBalance = formatTokenAmount(balances[token.contractId], token.metadata.decimals);
  if (currentBalance !== '0') {
    return 'Price Unavailable';
  }
  return '-';
};
