import Big, { BigSource } from 'big.js';

export const round = (decimals: number, minAmountOut: string) => (
  Number.isInteger(Number(minAmountOut))
    ? minAmountOut
    : Math.ceil(
      Math.round(Number(minAmountOut) * (10 ** decimals))
          / (10 ** decimals),
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

export const formatTokenAmount = (value:string, decimals = 18, precision = 2) => value
  && Big(value).div(Big(10).pow(decimals)).toFixed(precision);
export const parseTokenAmount = (value:string, decimals = 18) => value
  && Big(value).times(Big(10).pow(decimals)).toFixed();
export const removeTrailingZeros = (amount:string) => amount.replace(/\.?0*$/, '');

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
  if (!value || value === '0') return '0';
  const formattedValue = new Big(value);

  if (formattedValue.lte('0.00001')) return '>0.00001';
  if (formattedValue.lt('1000')) return formattedValue.toFixed(5);
  if (formattedValue.gt('100000')) return formattedValue.toPrecision(1);
  return formattedValue.toFixed(0);
};
