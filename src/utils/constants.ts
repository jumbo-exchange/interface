import Big from 'big.js';
import { parseNearAmount } from 'near-api-js/lib/utils/format';

export const docsLink = 'https://jumbo-exchange.gitbook.io/product-docs/';
export const telegramLink = 'https://t.me/jumbo_ann';
export const twitterLink = 'https://twitter.com/jumbo_exchange';
export const mediumLink = 'https://medium.com/jumbo-dex';
export const hapiLink = 'https://hapi.one/';

export const SLIPPAGE_TOLERANCE_DEFAULT = '1';
export const TOTAL_FEE_DEFAULT = '0.3';

export const MAX_TOGGLE_AMOUNT = 100;
export const MIN_TOGGLE_AMOUNT = 0;

export const MAX_SLIPPAGE_TOLERANCE = 100;
export const MIN_SLIPPAGE_TOLERANCE = 0;

export const MAX_TOTAL_FEE = 20;
export const MIN_TOTAL_FEE = 0;

export const COEFFICIENT_SLIPPAGE = 0.3;
export const COEFFICIENT_TOTAL_FEE = 0.3;

export const MIN_FEE_CREATE_POOL = '0.01';
export const MAX_FEE_CREATE_POOL = '20';

export const tooltipTitle = {
  // Swap
  slippageTolerance: 'Permitted margin of disparity between the current price of an asset and the final one after swap',
  routes: 'Path from one asset to another consisting of zero or more segments between pairs',
  minimumReceived: 'The lowest amount received after swap initiation',
  priceImpact: 'The effect on the price the given swap action incurs',
  liquidityProviderFee: 'A small sum paid to liquidity providers',

  // Pool
  APYBasis: 'Annual Percentage Yield accrued. Includes your interest rate and the frequency of compounding interest',
  totalLiquidity: 'Amount of liquidity currently available in the given pool',
  dayVolume: 'Daily volume of trading activity',
  APY: 'Annual Percentage Yield',

  // Create Pool
  totalFee: 'A sum paid for creating a pool',
  lPFee: 'A sum paid for providing liquidity',
  protocolFee: 'A sum deducted from pool creation that accrues on platform',
  referralFee: 'A sum you get from referred user as reward',
};

export const warningMessage = {
  zeroBalance: 'Zero balance',
  zeroBalanceDesc: 'Insufficient balance of wNEAR. Swap NEAR to wNEAR in order to proceed by clicking “Go to Pair”',

  doesNotExist: 'The given pair doesn\'t exist',

  noSuchPairExists: 'No such pair exists',
  noSuchPairExistsDesc: 'There is additional pair with wNEAR',

  zeroPoolLiquidity: 'Zero liquidity pool',
  zeroPoolLiquidityDesc: 'Zero liquidity pool, you can add liquidity to the pool',

  transactionMayFail: 'Your transaction may be frontrun',
  zeroFee: 'Total Fee cannot be zero',
};

export const noResult = {
  yourLiquidity: 'Your active liquidity positions will appear here.',
  noResultFound: 'No results found',
};

export const poolFeeOptions = [
  { label: '0.2%', value: '0.2' },
  { label: '0.3%', value: '0.3' },
  { label: '0.6%', value: '0.6' },
];

export const slippageToleranceOptions = [
  { label: '0.1%', value: '0.1' },
  { label: '0.5%', value: '0.5' },
  { label: '1%', value: '1' },
];

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

export const POOL_SHARES_DECIMALS = 24;

export const BAD_PRICE_IMPACT = 2;

export const NEAR_TOKEN_ID = 'NEAR';
