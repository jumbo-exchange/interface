import Big from 'big.js';
import { IPool, PoolType } from 'store';
import { formatTokenAmount, percent, scientificNotationToString } from 'utils/calculations';
import FungibleTokenContract from './FungibleToken';
import { SWAP_ENUM } from './SwapContract';

export const calculateMarketPrice = (
  pool: IPool,
  tokenIn: FungibleTokenContract,
  tokenOut: FungibleTokenContract,
) => {
  if (pool.type === PoolType.STABLE_SWAP) {
    return '1';
  }
  const tokenInBalance = formatTokenAmount(
    pool.supplies[tokenIn.contractId],
    tokenIn.metadata.decimals,
  );

  const tokenOutBalance = formatTokenAmount(
    pool.supplies[tokenOut.contractId],
    tokenOut.metadata.decimals,
  );
  return Big(tokenInBalance).div(tokenOutBalance).toFixed();
};

export const calculateAmountReceived = (
  pool: IPool,
  amountIn: string,
  tokenIn: FungibleTokenContract,
  tokenOut: FungibleTokenContract,
) => {
  const partialAmountIn = amountIn;

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
  pools: IPool[],
  tokenIn: FungibleTokenContract | null,
  tokenOut: FungibleTokenContract | null,
  tokenInAmount: string,
  tokens: {[key: string]: FungibleTokenContract},
) => {
  if (!tokenIn || !tokenOut || !tokenInAmount || !pools.length) return '0';
  if (Big(tokenInAmount).lte(0)) return '0';
  let generalMarketPrice = new Big(0);

  let tokenOutReceived = new Big(0);
  if (pools.length === SWAP_ENUM.DIRECT_SWAP) {
    const [currentPool] = pools;
    const marketPrice = calculateMarketPrice(currentPool, tokenIn, tokenOut);

    generalMarketPrice = generalMarketPrice.add(marketPrice);
    tokenOutReceived = calculateAmountReceived(
      currentPool,
      tokenInAmount,
      tokenIn,
      tokenOut,
    );
  } else {
    const [firstPool, secondPool] = pools;
    const tokenMidId = firstPool.tokenAccountIds.find((token) => token !== tokenIn.contractId);
    const tokenMid = tokens[tokenMidId as string];
    const firstPoolMarketPrice = calculateMarketPrice(firstPool, tokenIn, tokenMid);
    const secondPoolMarketPrice = calculateMarketPrice(secondPool, tokenMid, tokenOut);
    generalMarketPrice = Big(firstPoolMarketPrice).mul(secondPoolMarketPrice);

    const tokenMidReceived = calculateAmountReceived(
      firstPool,
      formatTokenAmount(tokenInAmount, tokenIn.metadata.decimals),
      tokenIn,
      tokenMid,
    );
    tokenOutReceived = calculateAmountReceived(
      secondPool,
      formatTokenAmount(tokenMidReceived.toFixed(0), tokenMid.metadata.decimals),
      tokenMid,
      tokenOut,
    );
  }
  const newMarketPrice = new Big(tokenInAmount).div(tokenOutReceived).toFixed();

  const PriceImpact = percent(
    new Big(newMarketPrice).minus(generalMarketPrice).toFixed(),
    newMarketPrice,
  ).toString();
  return scientificNotationToString(PriceImpact);
};
