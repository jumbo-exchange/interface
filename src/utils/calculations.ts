import Big, { BigSource } from 'big.js';
import FungibleTokenContract from 'services/FungibleToken';
import { toArray } from 'utils';

const BASE = 10;

export const round = (decimals: number, minAmountOut: string) => (
  Number.isInteger(Number(minAmountOut))
    ? minAmountOut
    : Math.ceil(
      Math.round(Number(minAmountOut) * (BASE ** decimals))
          / (BASE ** decimals),
    ).toString());

export const toNonDivisibleNumber = (
  decimals: number,
  number: string,
): string => {
  if (decimals === null || decimals === undefined) return number;
  const [wholePart, fracPart = ''] = number.split('.');

  return `${wholePart}${fracPart.padEnd(decimals, '0').slice(0, decimals)}`
    .replace(/^0+/, '')
    .padStart(1, '0');
};

export const formatTokenAmount = (value: string, decimals = 18, precision?: number) => value
  && Big(value).div(Big(BASE).pow(decimals)).toFixed(precision && precision);
export const parseTokenAmount = (value:string, decimals = 18) => value
  && Big(value).times(Big(BASE).pow(decimals)).toFixed();
export const removeTrailingZeros = (amount: string) => {
  if (amount.includes('.') || amount.includes(',')) {
    return amount.replace(/\.?0*$/, '');
  }
  return amount;
};

export const percentLess = (
  percent: number | string,
  num: number | string,
  precision: number = 6,
): string => {
  const FULL_AMOUNT_PERCENT = 100;
  const percentDiff = Big(FULL_AMOUNT_PERCENT).minus(percent);
  return Big(num).div(FULL_AMOUNT_PERCENT).mul(percentDiff).toFixed(precision);
};

export const percent = (numerator: string, denominator: string) => Big(numerator)
  .div(denominator).mul(100);

export function scientificNotationToString(strParam: string) {
  const flag = /e/.test(strParam);
  if (!flag) return strParam;

  let sysbol = true;
  if (/e-/.test(strParam)) {
    sysbol = false;
  }

  const negative = Number(strParam) < 0 ? '-' : '';

  const index = Number((strParam).match(/\d+$/)?.[0] ?? '0');

  // eslint-disable-next-line no-useless-escape
  const basis = strParam.match(/[\d\.]+/)?.[0] ?? '0';

  const ifFraction = basis.includes('.');

  let wholeStr;
  let fractionStr;

  if (ifFraction) {
    [wholeStr, fractionStr] = basis.split('.');
  } else {
    wholeStr = basis;
    fractionStr = '';
  }

  if (sysbol) {
    if (!ifFraction) {
      return negative + wholeStr.padEnd(index + wholeStr.length, '0');
    }
    if (fractionStr.length <= index) {
      return negative + wholeStr + fractionStr.padEnd(index, '0');
    }
    return (
      `${negative
            + wholeStr
            + fractionStr.substring(0, index)
      }.${
        fractionStr.substring(index)}`
    );
  }
  if (!ifFraction) {
    return (
      negative
          + wholeStr.padStart(index + wholeStr.length, '0').replace(/^0/, '0.')
    );
  }

  return (
    negative
          + wholeStr.padStart(index + wholeStr.length, '0').replace(/^0/, '0.')
          + fractionStr
  );
}

export const calculateFairShare = (
  totalSupply: string,
  shares: BigSource,
  sharesTotalSupply: BigSource,
) => {
  const mul = new Big(totalSupply).mul(shares);
  const div = new Big(mul).div(sharesTotalSupply);
  return div.toFixed();
};

export const formatBalance = (value: string): string => {
  const formattedValue = new Big(value);
  if (!value || formattedValue.eq(0)) return value;

  if (formattedValue.lte('0.00001')) return '>0.00001';
  if (formattedValue.lt('1000')) return formattedValue.toFixed(5);
  if (formattedValue.gt('100000')) return formattedValue.toPrecision(1);
  return formattedValue.toFixed(0);
};

export const checkInvalidAmount = (
  balances: {[key:string]: string},
  token: FungibleTokenContract | null,
  amount: string,
) => {
  if (amount === '') return true;
  if (!token || !toArray(balances).length) return false;
  const balance = token ? balances[token.contractId] : '0';
  return Big(formatTokenAmount(amount, token.metadata.decimals, 0))
    .gt(formatTokenAmount(balance, token.metadata.decimals, 0));
};
