import { PropsWithChildren } from 'react';
import styled from 'styled-components';

interface ICurrentTab {
  isActive?: boolean
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

export const Header = styled.div`
  transition: all 1s ease;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  color: ${({ theme }) => theme.globalWhite};
  padding: 1.5rem 4.5rem 2.563rem 4.5rem;
  & > a{
    text-decoration: none;
  }
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1.5rem 2rem 2.563rem 2rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 1.5rem 1.25rem 2.563rem 1.25rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 1.5rem 1rem 0.875rem 1rem;
  `}
`;

export const LogoContainer = styled.div`
  flex: 1;
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
  flex: 1;
  display: flex;
  justify-content: center;
  color: white;
  & > a {
    text-decoration: none;
  }
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
  color: ${({ theme, isActive }) => (isActive ? theme.pink : theme.globalGrey)};
  margin: 0 12px;
  position: relative;
  transition: all .3s ease;
  :after {
    content: '';
    transition: all .3s ease;
    position: absolute;
    height: 3px;
    top: 30px;
    border-radius: 1.47856px;
    width: ${({ isActive }) => (isActive ? '36px' : '0')};
    background: ${({ theme, isActive }) => (isActive ? theme.pink : theme.globalGrey)};
    ${({ theme, isActive }) => theme.mediaWidth.upToExtraSmall`
      top: 25px;
      height: 2px;
      width: ${(isActive ? '24px' : '0')};
  `}
  }
  :hover {
    cursor: pointer;
    color: ${({ theme }) => theme.pink}
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1rem;
    line-height: 1.188rem;
    margin: 0 8px;
  `}
`;

export const BlockButton = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

export const Body = styled.div`
  flex: 1;
  text-align: center;
  color: white;
  display: flex;
  justify-content: center;
`;
