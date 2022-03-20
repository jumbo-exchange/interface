import { URL_INPUT_TOKEN, URL_OUTPUT_TOKEN } from './constants';

export const LANDING = '/';
export const SWAP = 'swap';
export const POOL = 'pool';
export const ALL_MATCH = '/*';
export const toAddLiquidityPage = (id : string|number = ':id') => `/pool/add-liquidity/${id}`;
export const toRemoveLiquidityPage = (id : string|number = ':id') => `/pool/remove-liquidity/${id}`;

export const TO_SWAP_URL = `?${URL_INPUT_TOKEN}=:inputToken&${URL_OUTPUT_TOKEN}=:outputToken`;
