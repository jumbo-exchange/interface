import Big, { BigSource } from 'big.js';
import FungibleTokenContract from 'services/FungibleToken';
import { toArray } from 'utils';
import { STABLE_LP_TOKEN_DECIMALS } from './constants';

const BASE = 10;
Big.RM = Big.roundDown;
Big.DP = 30;
const FEE_DIVISOR = 10000;

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
  && Big(value).times(Big(BASE).pow(decimals)).toFixed(0);

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

  let symbol = true;
  if (/e-/.test(strParam)) {
    symbol = false;
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

  if (symbol) {
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
  if (formattedValue.gt('100000')) return formattedValue.toPrecision(5);
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
  return Big(amount).gt(formatTokenAmount(balance, token.metadata.decimals));
};

export const calcD = (amp: number, comparableAmounts: number[]) => {
  const tokenNumber = comparableAmounts.length;
  const sumAmounts = comparableAmounts.reduce((acc, item) => acc + item, 0);
  let dPrev = 0;
  let d = sumAmounts;
  for (let i = 0; i < 256; i += 1) {
    let dProd = d;
    for (let k = 0; k < comparableAmounts.length; k += 1) {
      dProd = (dProd * d) / (comparableAmounts[k] * tokenNumber);
    }
    dPrev = d;
    const ann = amp * tokenNumber ** tokenNumber;
    const numerator = dPrev * (dProd * tokenNumber + ann * sumAmounts);
    const denominator = dPrev * (ann - 1) + dProd * (tokenNumber + 1);
    d = numerator / denominator;
    if (Math.abs(d - dPrev) <= 1) break;
  }
  return d;
};

export const calcY = (
  amp: number,
  xcamount: number,
  currentComparableAmounts: number[],
  indexX: number,
  indexY: number,
) => {
  const tokenNumber = currentComparableAmounts.length;
  const ann = amp * tokenNumber ** tokenNumber;
  const d = calcD(amp, currentComparableAmounts);
  let s = xcamount;
  let c = (d * d) / xcamount;
  for (let i = 0; i < tokenNumber; i += 1) {
    if (i !== indexX && i !== indexY) {
      s += currentComparableAmounts[i];
      c = (c * d) / currentComparableAmounts[i];
    }
  }
  c = (c * d) / (ann * tokenNumber ** tokenNumber);
  const b = d / ann + s;
  let yPrev = 0;
  let y = d;
  for (let i = 0; i < 256; i += 1) {
    yPrev = y;
    const yNumerator = y ** 2 + c;
    const yDenominator = 2 * y + b - d;
    y = yNumerator / yDenominator;
    if (Math.abs(y - yPrev) <= 1) break;
  }

  return y;
};

const normalizedTradeFee = (
  tokenNumber: number,
  amount: number,
  tradeFee: number,
) => {
  const adjustedTradeFee = Number(
    Math.floor((tradeFee * tokenNumber) / (4 * (tokenNumber - 1))),
  );
  return (amount * adjustedTradeFee) / FEE_DIVISOR;
};

export const calculateAddLiquidity = (
  amp: number,
  depositAmounts: number[],
  oldAmounts: number[],
  poolTokenSupply: number,
  tradeFee: number,
) => {
  const tokenNum = oldAmounts.length;
  const d0 = calcD(amp, oldAmounts);
  const comparableAmounts = [];
  for (let i = 0; i < oldAmounts.length; i += 1) {
    comparableAmounts[i] = oldAmounts[i] + depositAmounts[i];
  }
  const d1 = calcD(amp, comparableAmounts);

  if (Number(d1) <= Number(d0)) { throw new Error('D1 need less then or equal to D0.'); }

  for (let i = 0; i < tokenNum; i += 1) {
    const idealBalance = (oldAmounts[i] * d1) / d0;
    const difference = Math.abs(idealBalance - comparableAmounts[i]);
    const fee = normalizedTradeFee(tokenNum, difference, tradeFee);
    comparableAmounts[i] -= fee;
  }
  const d2 = calcD(amp, comparableAmounts);

  if (Number(d1) < Number(d2)) throw new Error('D2 need less then D1.');

  if (Number(d2) <= Number(d0)) { throw new Error('D1 need less then or equal to D0.'); }
  const mintShares = (poolTokenSupply * (d2 - d0)) / d0;
  const diffShares = (poolTokenSupply * (d1 - d0)) / d0;

  return [mintShares, diffShares - mintShares];
};

export const toComparableAmount = (
  supplies: { [key: string]: string }, tokens: FungibleTokenContract[],
): number[] | null => {
  try {
    const suppliesArray = Object.entries(supplies);
    return suppliesArray.map(([tokenId, supply]) => {
      const token = tokens.find((el) => el.contractId === tokenId);
      if (!token) return 0;
      return Big(supply).mul(Big(BASE).pow(
        STABLE_LP_TOKEN_DECIMALS - token.metadata.decimals,
      )).toNumber();
    });
  } catch (e) {
    return null;
  }
};
