import Big from 'big.js';

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

export const formatTokenAmount = (value: string, decimals = 18, precision = 2) => value
  && Big(value).div(Big(BASE).pow(decimals)).toFixed(precision);
export const parseTokenAmount = (value:string, decimals = 18) => value
  && Big(value).times(Big(BASE).pow(decimals)).toFixed();
export const removeTrailingZeros = (amount: string) => amount.replace(/\.?0*$/, '');

export const percentLess = (
  percent: number | string,
  num: number | string,
  precision: number = 6,
): string => {
  const FULL_AMOUNT_PERCENT = 100;
  const percentDiff = Big(FULL_AMOUNT_PERCENT).minus(percent);
  return removeTrailingZeros(Big(num).div(FULL_AMOUNT_PERCENT).mul(percentDiff).toFixed(precision));
};
