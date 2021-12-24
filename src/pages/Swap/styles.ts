import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import { ReactComponent as WalletImage } from 'assets/images-app/wallet.svg';
import { ReactComponent as IconArrowDown } from 'assets/images-app/icon-arrow-down.svg';
import { ReactComponent as Exchange } from 'assets/images-app/exchange.svg';
import { ReactComponent as PlaceHolderLoader } from 'assets/images-app/placeholder-loader.svg';
import { ReactComponent as Loading } from 'assets/images-app/loading.svg';

interface ICurrent {
  isActive?: boolean
}

export const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ArrowDown = styled(IconArrowDown)`
  margin-left: 0.875rem;
`;

export const ChangeTokenContainer = styled.div`
  display: flex;
  align-self: center;
  color: ${({ theme }) => theme.globalGrey};
  margin: 1.125rem 0;
  & > span {
    font-style: normal;
    font-weight: 500;
    font-size: .75rem;
    line-height: .875rem;
  }
  :hover {
    & > svg {
      path {
        fill: ${({ theme }) => theme.globalWhite};
      }
    }
    cursor: pointer;
    color: ${({ theme }) => theme.globalWhite};
  }
`;

export const ChangeTokenLogo = styled(Exchange)`
  margin-right: .5rem;
`;

export const ExchangeBlock = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1.125rem .75rem 1.375rem .75rem;
  font-style: normal;
  font-weight: normal;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalGrey};
`;

export const RefreshBlock = styled.div`
  display: flex;
  justify-content: space-between;
  white-space: nowrap;
  margin-right: 1.25rem;
`;

export const PlaceHolderGif = styled(PlaceHolderLoader)`
  margin-right: .438rem;
`;
export const GifLoading = styled(Loading)`
  margin-right: .438rem;
`;

export const ExchangeLabel = styled.div`
  display: flex;
  white-space: nowrap;
  overflow: hidden;
`;

export const SettingsBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2.5rem;
`;

export const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  margin-right: .453rem;
::before {
    content: '';
    background: ${({ theme }) => theme.globalGreyOp02};
    height: 1px;
    width: 100%;
  }
`;

export const SettingsLabel = styled.div<PropsWithChildren<ICurrent>>`
  display: flex;
  align-items: center;
  & > span {
    font-size: .75rem;
    line-height: .875rem;
    color: ${({ theme, isActive }) => (isActive ? theme.globalWhite : theme.globalGrey)};
    margin-left: 1rem;
  }
  & > svg {
    width: .594rem;
    height: .344rem;
    margin-left: .453rem;
    transform: ${({ isActive }) => (isActive && 'rotate(0.5turn)')};
    transition: all 0.3s ease-out;
    path {
      fill: ${({ theme, isActive }) => (isActive ? theme.globalWhite : theme.globalGrey)};
    }
  }
  :hover {
    cursor: pointer;
    & > span {
    color: ${({ theme }) => theme.globalWhite};
  }
    & > svg {
      path {
        fill: ${({ theme }) => theme.globalWhite};
      }
    }
  }
`;

export const Wallet = styled(WalletImage)`
  margin-right: .625rem;
  width: 16px;
  height: 12px;
  path {
    fill: ${({ theme }) => theme.globalWhite};
  }
`;
