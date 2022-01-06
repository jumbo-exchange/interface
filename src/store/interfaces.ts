import { Dispatch, SetStateAction } from 'react';

export interface ICard {

}

export type StoreContextType = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>
}
