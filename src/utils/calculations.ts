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
