import Big from 'big.js';
import FungibleTokenContract from 'services/FungibleToken';
import { TokenType } from 'store';
import { formatTokenAmount } from 'utils/calculations';
import i18n from 'i18n';

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
    return i18n.t('searchModal.priceUnavailable');
  }
  return '-';
};

export const isCurrentToken = (
  inputToken: FungibleTokenContract | null,
  outputToken: FungibleTokenContract | null,
  token: FungibleTokenContract | null,
  tokenType: TokenType,
) => {
  if (inputToken === token && tokenType === TokenType.Input) {
    return true;
  } if (outputToken === token && tokenType === TokenType.Output) {
    return true;
  }
  return false;
};
