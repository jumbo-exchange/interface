import Big from 'big.js';
import { IPool } from 'store';
import { formatTokenAmount } from 'utils/calculations';

import FungibleTokenContract from './FungibleToken';

export const POOL_TOKEN_REFRESH_INTERVAL = 1000;
export const ONLY_ZEROS = /^0*\.?0*$/;

// export interface EstimateSwapView {
//   estimate: string;
//   pool: IPool;s
//   dy?: string;
//   token?: FungibleTokenContract;
// }

// export function formatWithCommas(value: string): string {
//   const pattern = /(-?\d+)(\d{3})/;
//   let result = value;
//   while (pattern.test(result)) {
//     result = value.replace(pattern, '$1,$2');
//   }
//   return result;
// }

// export const getLiquidity = (
//   pool: IPool,
//   tokenIn: FungibleTokenContract,
//   tokenOut: FungibleTokenContract,
// ) => {
//   const amount1 =
// formatTokenAmount(pool.supplies[tokenIn.contractId], tokenIn.metadata.decimals);
//   const amount2 = formatTokenAmount(
//     pool.supplies[tokenOut.contractId],
//     tokenOut.metadata.decimals,
//   );

//   const lp = new Big(amount1).times(new Big(amount2));

//   return Number(lp);
// };

// export const toPrecision = (
//   number: string,
//   precision: number,
//   withCommas: boolean = false,
//   atLeastOne: boolean = true,
// ): string => {
//   const [whole, decimal = ''] = number.split('.');

//   let str = `${withCommas ? formatWithCommas(whole) : whole}.${decimal.slice(
//     0,
//     precision,
//   )}`.replace(/\.$/, '');
//   if (atLeastOne && Number(str) === 0 && str.length > 1) {
//     const n = str.lastIndexOf('0');
//     str = str.slice(0, n) + str.slice(n).replace('0', '1');
//   }

//   return str;
// };
