import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import { isMobile } from 'utils/userAgent';
import { ReactComponent as WalletImage } from 'assets/images-app/wallet.svg';
import { ReactComponent as IconArrowDown } from 'assets/images-app/icon-arrow-down.svg';
import { ReactComponent as Exchange } from 'assets/images-app/exchange.svg';

interface ICurrent {
  isActive?: boolean
}

export const ActionContainer = styled.div`
  background: ${({ theme }) => theme.BgCardGrey};
  border-radius: ${isMobile ? '2px' : '8px'};
  display: flex;
  flex-direction: column;
`;

export const Block = styled.div`
  background: ${({ theme }) => theme.BgCardGrey};
  border-radius: ${isMobile ? '2px' : '8px'};
  display: flex;
  flex-direction: column;
  padding: 10px 0px 0px 0px;
`;

export const InputLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 .8rem;
`;

export const WalletInformation = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0.6rem;
  align-items: center;
  font-style: normal;
  font-weight: normal;
  font-size: 0.75rem;
  line-height: .875rem;
`;

export const LogoWallet = styled(WalletImage)`
  margin-right: 0.438rem;
  width: 16px;
  height: 12px;
`;

export const ButtonHalfWallet = styled.button`
  background: none;
  border: none;
  padding: 0;
  & > span {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text-align: right;
    font-style: normal;
    font-weight: normal;
    font-size: 0.75rem;
    line-height: .875rem;
    color: ${({ theme }) => theme.globalGrey};
  }
  :hover {
    cursor: pointer;
    & > span {
      color: ${({ theme }) => theme.globalWhite};
    }
  }
`;

export const ButtonMaxWallet = styled(ButtonHalfWallet)`
  margin-left: 1rem;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 12px 22px 12px 12px;
  border: 1px solid ${({ theme }) => theme.globalGreyOp04};
  border-radius: 12px;
`;

export const LogoContainer = styled.div`
  margin-right: 1rem;
  display: flex;
  >img{
    height: 2.25rem;
    width: 2.25rem;
  }
`;

export const TokenContainer = styled.div`
  flex: 1;
  font-style: normal;
  font-weight: normal;
  font-size: 2rem;
  line-height: 2rem;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  :hover {
    cursor: pointer;
  }
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
    font-size: 0.75rem;
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
  margin-right: 0.5rem;
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
  margin-right: 20px;
`;

export const ExchangeLabel = styled.div`
  display: flex;
  white-space: nowrap;
  overflow: hidden;
`;

export const SettingsBlock = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2.5rem;
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

export const Wallet = styled(LogoWallet)`
  margin-right: .625rem;
  path {
    fill: ${({ theme }) => theme.globalWhite};
  }
`;
