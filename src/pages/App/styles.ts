import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { ReactComponent as Wallet } from 'assets/images/wallet.svg';

interface ICurrentTab {
  isActive?: boolean
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  color: ${({ theme }) => theme.globalWhite};
  padding: 1.5rem 12.5rem 2.563rem 12.5rem;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 1.5rem 4.375rem 2.563rem 4.375rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1.5rem 3rem 2.563rem 3rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 1.5rem 1.25rem 2.563rem 1.25rem;
  `}
`;

export const MobileHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  white-space: nowrap;
  color: ${({ theme }) => theme.globalWhite};
  padding: 1.5rem 2.063rem 2.563rem 2.063rem;
`;

export const UpperRow = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const LowerRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  & > svg {
    margin-right: 0.438rem;
  }
`;

export const LogoTitle = styled.h1`
  font-style: normal;
  font-weight: bold;
  font-size: 2rem;
  line-height: 2.438rem;
  color: ${({ theme }) => theme.white};
`;

export const NavBar = styled.div`
  display: flex;
  color: white;
`;

export const NavButton = styled.div<PropsWithChildren<ICurrentTab>>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: Arial;
  font-style: normal;
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 1.438rem;
  color: ${({ theme, isActive }) => (isActive ? theme.pink : theme.greyNavText)};
  margin: 0 12px;
  position: relative;
  :after {
    content: '';
    transition: all .3s ease;
    position: absolute;
    height: 3px;
    top: 30px;
    border-radius: 1.47856px;
    width: ${({ isActive }) => (isActive ? '36px' : '0')};
    background: ${({ theme, isActive }) => (isActive ? theme.pink : theme.greyNavText)};
    ${({ theme, isActive }) => theme.mediaWidth.upToExtraSmall`
      top: 25px;
      height: 2px;
      width: ${(isActive ? '24px' : '0')};
  `}
  }
  :hover {
    cursor: pointer;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1rem;
    line-height: 1.188rem;
    margin: 0 8px;
  `}
`;

export const WalletIcon = styled(Wallet)`
  margin-right: 0.625rem;
`;

export const Body = styled.div`
  flex: 1;
  text-align: center;
  color: white;
  display: flex;
  justify-content: center;
`;
