import {
  Near, keyStores,
} from 'near-api-js';
import SpecialWallet from 'services/wallet';

import getConfig from './config';

const config = getConfig();
const CONTRACT_ID = config.contractId;

export const near = new Near({
  keyStore: new keyStores.BrowserLocalStorageKeyStore(),
  ...config,
  headers: {},
});

export const wallet = new SpecialWallet(near, CONTRACT_ID);
