import Big from 'big.js';
import { parseNearAmount } from 'near-api-js/lib/utils/format';

export const docsLink = 'https://jumbo-exchange.gitbook.io/product-docs/';
export const telegramLink = 'https://t.me/jumbo_ann';
export const twitterLink = 'https://twitter.com/jumbo_exchange';
export const mediumLink = 'https://medium.com/jumbo-dex';
export const hapiLink = 'https://hapi.one/';

export const SLIPPAGE_TOLERANCE_DEFAULT = '3.33';
export const TOTAL_FEE_DEFAULT = '0.33';

export const MAX_TOGGLE_AMOUNT = 100;
export const MIN_TOGGLE_AMOUNT = 0;

export const MAX_SLIPPAGE_TOLERANCE = 100;
export const MIN_SLIPPAGE_TOLERANCE = 0;

export const MAX_TOTAL_FEE = 20;
export const MIN_TOTAL_FEE = 0;

export const COEFFICIENT_SLIPPAGE = 0.5;
export const COEFFICIENT_TOTAL_FEE = 0.5;

export const tooltipTitle = {
  back: 'Back',
  slippageTolerance: 'Slippage means the difference between what  you expect to get and what you actually get due to other executing first',
};

export const poolFeeOptions = [
  { label: '0.20%', value: '0.20' },
  { label: '0.30%', value: '0.30' },
  { label: '0.60%', value: '0.60' },
];

export const slippageToleranceOptions = [
  { label: '0.1%', value: '0.1' },
  { label: '0.5%', value: '0.5' },
  { label: '1%', value: '1' },
];

export const ONE_YOCTO_NEAR = '0.000000000000000000000001';
export const FT_MINIMUM_STORAGE_BALANCE = parseNearAmount('0.00125') ?? '0';
export const FT_STORAGE_DEPOSIT_GAS = parseNearAmount('0.00000000003');
export const FT_TRANSFER_GAS = parseNearAmount('0.00000000003');
export const ONE_MORE_DEPOSIT_AMOUNT = '0.01';
export const ACCOUNT_MIN_STORAGE_AMOUNT = '0.005';
export const MIN_DEPOSIT_PER_TOKEN = new Big('5000000000000000000000');
export const STORAGE_PER_TOKEN = '0.005';
export const LP_STORAGE_AMOUNT = '0.01';
export const YOCTO_IN_NEAR_DECIMALS = 24;
