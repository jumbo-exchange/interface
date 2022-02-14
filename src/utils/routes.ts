export const LANDING = '/';
export const SWAP = 'swap';
export const POOL = 'pool';
export const ALL_MATCH = '/*';
export const toAddLiquidityPage = (id : string|number = ':id') => `/pool/add-liquidity/${id}`;
export const toRemoveLiquidityPage = (id : string|number = ':id') => `/pool/remove-liquidity/${id}`;
