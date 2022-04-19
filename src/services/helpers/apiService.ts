import { IDayVolume, ITokenPrice, pricesInitialState } from 'store';
import getConfig from '../config';
import { wallet } from '../near';

enum RequestTypes {
 GET = 'GET'
}

const HEADERS = { 'Content-type': 'application/json; charset=UTF-8' };

export class ApiService {
  config = getConfig();

  async getUserWalletTokens() {
    const account = wallet.getAccountId();
    const url = `${this.config.helperUrl}/account/${account}/likelyTokens`;
    try {
      if (!account) return [];
      return await fetch(
        url,
        {
          method: RequestTypes.GET,
          headers: HEADERS,
        },
      )
        .then((res) => res.json())
        .then((tokens) => tokens);
    } catch (e) {
      console.warn(`Error ${e} while loading likely tokens from ${url}`);
      return [];
    }
  }

  async getPriceData(): Promise<{[key: string]: ITokenPrice}> {
    const url = `${this.config.indexerUrl}/token-prices`;
    try {
      const pricesData = await fetch(url, {
        method: RequestTypes.GET,
        headers: HEADERS,
      })
        .then((res) => res.json())
        .then((list) => list);
      return pricesData.reduce(
        (acc: {[key: string]: ITokenPrice}, item: ITokenPrice) => ({
          ...acc, [item.id]: item,
        }), {},
      );
    } catch (e) {
      console.warn(`Error ${e} while loading prices from ${url}`);
      return pricesInitialState;
    }
  }

  async getNearPrice(): Promise<string | null> {
    const url = `${this.config.helperUrl}/fiat`;
    try {
      const pricesData = await fetch(url, {
        method: RequestTypes.GET,
        headers: HEADERS,
      })
        .then((res) => res.json())
        .then((list) => list.near.usd || 0);
      return pricesData;
    } catch (e) {
      console.warn(`Error ${e} while loading near price from ${url}`);
      return null;
    }
  }

  async getDayVolumeData(): Promise<{[key: string]: IDayVolume}> {
    const url = `${this.config.indexerUrl}/pool-volumes`;
    try {
      const dayVolumesData = await fetch(url, {
        method: RequestTypes.GET,
        headers: HEADERS,
      })
        .then((res) => res.json())
        .then((list) => list);
      return dayVolumesData.reduce(
        (acc: {[key: string]: IDayVolume}, item: IDayVolume) => ({
          ...acc, [item.id]: item,
        }), {},
      );
    } catch (e) {
      console.warn(`Error ${e} while loading prices from ${url}`);
      return {};
    }
  }
}

export default new ApiService();
