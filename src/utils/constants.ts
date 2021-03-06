import Big from 'big.js';
import { parseNearAmount } from 'near-api-js/lib/utils/format';

export const docsLink = 'https://jumbo-exchange.gitbook.io/product-docs/';
export const telegramLink = 'https://t.me/jumbo_ann';
export const twitterLink = 'https://twitter.com/jumbo_exchange';
export const mediumLink = 'https://medium.com/jumbo-dex';
export const hapiLink = 'https://hapi.one/';

export const SLIPPAGE_TOLERANCE_DEFAULT = '1';
export const SLIPPAGE_TOLERANCE_DEFAULT_ADD_STABLE_LIQ = '0.1';
export const TOTAL_FEE_DEFAULT = '0.3';

export const MAX_TOGGLE_AMOUNT = 100;
export const MIN_TOGGLE_AMOUNT = 0;

export const MAX_SLIPPAGE_TOLERANCE = 100;
export const MIN_SLIPPAGE_TOLERANCE = 0;

export const MAX_TOTAL_FEE = 20;
export const MIN_TOTAL_FEE = 0;

export const COEFFICIENT_SLIPPAGE = 0.33;
export const COEFFICIENT_TOTAL_FEE = 0.33;

export const MIN_FEE_CREATE_POOL = '0.01';
export const MAX_FEE_CREATE_POOL = '20';

export const poolFeeOptions = [
  { label: '0.2%', value: '0.2' },
  { label: '0.3%', value: '0.3' },
  { label: '0.6%', value: '0.6' },
];

export const slippageToleranceOptions: {label: string, value: string}[] = [
  { label: '0.1%', value: '0.1' },
  { label: '1%', value: '1' },
  { label: '5%', value: '5' },
];

export const slippageToleranceOptionsAddStableLiq: {label: string, value: string}[] = [
  { label: '0.05%', value: '0.05' },
  { label: '0.1%', value: '0.1' },
  { label: '0.2%', value: '0.2' },
];

export const FT_GAS = '180000000000000';

export const ONE_YOCTO_NEAR = '0.000000000000000000000001';
export const FT_STORAGE_DEPOSIT_GAS = parseNearAmount('0.00000000003');
export const FT_TRANSFER_GAS = parseNearAmount('0.00000000003');
export const ONE_MORE_DEPOSIT_AMOUNT = '0.01';
export const ACCOUNT_MIN_STORAGE_AMOUNT = '0.005';
export const MIN_DEPOSIT_PER_TOKEN = new Big('5000000000000000000000');
export const STORAGE_PER_TOKEN = '0.005';
export const LP_STORAGE_AMOUNT = '0.01';
export const YOCTO_IN_NEAR_DECIMALS = 24;
export const FEE_DIVISOR = 100;
export const STORAGE_TO_REGISTER_MFT = '0.045';
export const MIN_DEPOSIT_PER_TOKEN_FARM = new Big('45000000000000000000000');

export const LP_TOKEN_DECIMALS = 24;
export const STABLE_LP_TOKEN_DECIMALS = 18;

export const BAD_PRICE_IMPACT = 2;
export const SHOW_WARNING_PRICE_IMPACT = 10;

export const NEAR_TOKEN_ID = 'NEAR';

export const SWAP_INPUT_KEY = 'JUMBO_SWAP_INPUT_TOKEN';
export const SWAP_OUTPUT_KEY = 'JUMBO_SWAP_OUTPUT_TOKEN';

export const URL_INPUT_TOKEN = 'inputToken';
export const URL_OUTPUT_TOKEN = 'outputToken';

export const INITIAL_INPUT_PLACEHOLDER = '';
export const ZERO_AMOUNT = '0';
export const SMALL_SHARE = '0.001';

export const UPDATE_CLAIM_REWARD_DATE = 10 * 60 * 1000;
export const CLAIM_REWARD_DATE_KEY = 'CLAIM_REWARD_DATE';

export const MIN_DEPOSIT_SHARES = '10000000000000000000';

export const SECONDS_IN_A_DAY = 86400;
export const DAYS_A_YEAR = 365;
export const ONE_HUNDRED = 100;
export const SHOW_MIN_TOTAL_LIQUIDITY = '1000';
