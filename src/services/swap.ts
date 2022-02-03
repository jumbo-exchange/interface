import Big from 'big.js';
import { IPool } from 'store';
import { formatTokenAmount, percent } from 'utils/calculations';
import FungibleTokenContract from './FungibleToken';

export const calculateAmountReceived = (
  pool: IPool,
  amountIn: string,
  tokenIn: FungibleTokenContract,
  tokenOut: FungibleTokenContract,
) => {
  const partialAmountIn = formatTokenAmount(amountIn, tokenIn.metadata.decimals);

  const inBalance = formatTokenAmount(
    pool.supplies[tokenIn.contractId],
    tokenIn.metadata.decimals,
  );
  const outBalance = formatTokenAmount(
    pool.supplies[tokenOut.contractId],
    tokenOut.metadata.decimals,
  );

  const bigInBalance = Big(inBalance);
  const bigOutBalance = Big(outBalance);

  const constantProduct = bigInBalance.mul(bigOutBalance);

  const newInBalance = bigInBalance.plus(partialAmountIn);

  const newOutBalance = constantProduct.div(newInBalance);

  const tokenOutReceived = bigOutBalance.minus(newOutBalance);

  return tokenOutReceived;
};

export const calculatePriceImpact = (
  pool: IPool,
  tokenIn: FungibleTokenContract,
  tokenOut: FungibleTokenContract,
  tokenInAmount: string,
) => {
  const inBalance = formatTokenAmount(
    pool.supplies[tokenIn.contractId],
    tokenIn.metadata.decimals,
  );

  const outBalance = formatTokenAmount(
    pool.supplies[tokenOut.contractId],
    tokenOut.metadata.decimals,
  );

  const finalMarketPrice = Big(inBalance).minus(outBalance);

  const amountReceived = calculateAmountReceived(
    pool,
    tokenInAmount,
    tokenIn,
    tokenOut,
  );

  const newMarketPrice = Big(tokenInAmount).div(amountReceived).toFixed(0);

  const priceImpact = percent(
    Big(newMarketPrice).minus(finalMarketPrice).toFixed(0),
    newMarketPrice,
  ).toString();

  return priceImpact;
};
