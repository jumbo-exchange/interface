import { parseNearAmount } from 'near-api-js/lib/utils/format';

export const docsLink = 'https://jumbo-exchange.gitbook.io/product-docs/';
export const telegramLink = 'https://t.me/jumbo_ann';
export const twitterLink = 'https://twitter.com/jumbo_exchange';
export const mediumLink = 'https://medium.com/jumbo-dex';
export const hapiLink = 'https://hapi.one/';

export const tooltipTitle = {
  back: 'Back',
};
export const poolFeeOptions = [
  { label: '0.20%', value: '0.20' },
  { label: '0.30%', value: '0.30' },
  { label: '0.60%', value: '0.60' },
];

export const ONE_YOCTO_NEAR = '0.000000000000000000000001';
export const FT_MINIMUM_STORAGE_BALANCE = parseNearAmount('0.00125') ?? '0';
export const FT_STORAGE_DEPOSIT_GAS = parseNearAmount('0.00000000003');
export const FT_TRANSFER_GAS = parseNearAmount('0.00000000003');
