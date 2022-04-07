import Big from 'big.js';
import { IPool, PoolType } from 'store';
import { formatTokenAmount, percent, scientificNotationToString } from 'utils/calculations';
import FungibleTokenContract from './FungibleToken';
import { SWAP_ENUM } from './interfaces';

export const calculateMarketPrice = (
  pool: IPool,
  tokenIn: FungibleTokenContract,
  tokenOut: FungibleTokenContract,
) => {
  // TODO: Check for stable swap
  if (pool.type === PoolType.STABLE_SWAP) {
    return '1';
  }
  if (!pool.supplies[tokenIn.contractId] || !pool.supplies[tokenOut.contractId]) return 0;
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

  if (!pool.supplies[tokenIn.contractId] || !pool.supplies[tokenOut.contractId]) return Big(0);

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
  const amounts = pools.map((pool) => pool.amounts).flat();
  if (!amounts.every((amount) => Big(amount).gt('0'))) return '0';

  if (Big(tokenInAmount).lte(0)) return '0';
  let generalMarketPrice = new Big(0);

  let tokenOutReceived = new Big(0);
  if (pools.length === SWAP_ENUM.DIRECT_SWAP) {
    const [currentPool] = pools;
    if (!currentPool.supplies[tokenIn.contractId]
      || !currentPool.supplies[tokenOut.contractId]) return '0';

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
    if (!firstPool.supplies[tokenIn.contractId] || !firstPool.supplies[tokenMid.contractId]) return '0';
    if (!secondPool.supplies[tokenMid.contractId] || !secondPool.supplies[tokenOut.contractId]) return '0';

    const firstPoolMarketPrice = calculateMarketPrice(firstPool, tokenIn, tokenMid);
    const secondPoolMarketPrice = calculateMarketPrice(secondPool, tokenMid, tokenOut);
    generalMarketPrice = Big(firstPoolMarketPrice).mul(secondPoolMarketPrice);

    const tokenMidReceived = calculateAmountReceived(
      firstPool,
      tokenInAmount,
      tokenIn,
      tokenMid,
    );

    tokenOutReceived = calculateAmountReceived(
      secondPool,
      tokenMidReceived.toFixed(),
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
