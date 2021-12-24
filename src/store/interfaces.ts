import { Dispatch, SetStateAction } from 'react';
import SpecialWallet from 'services/wallet';

export enum StatusLink { 'Swap', 'Pool', 'Farm' }
export enum TokenType { 'Input', 'Output'}

export type StoreContextType = {
  wallet: SpecialWallet | null;
  setWallet: Dispatch<SetStateAction<SpecialWallet | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>
}
