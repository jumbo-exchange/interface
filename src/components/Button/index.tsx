import { PropsWithChildren } from 'react';
import styled from 'styled-components';

interface IFilterButton {
  isActive?: boolean
}

export const ButtonPrimary = styled.button`
  max-height: 54px;
  outline: none;
  display: flex;
  display: -webkit-box;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12.5px 15px;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 19px;
  border: 2px solid ${({ theme }) => theme.pink};
  background: ${({ theme }) => theme.pink};
  color: ${({ theme }) => theme.globalWhite};
  border-radius: 12px;
  :hover {
    cursor: pointer;
    border: 2px solid ${({ theme }) => theme.pinkHover};
    background: ${({ theme }) => theme.pinkHover};
  }
  :active {
    border: 2px solid ${({ theme }) => theme.pinkActive};
    background: ${({ theme }) => theme.pinkActive};
  }
  :disabled{
    cursor: default;
    background: ${({ theme }) => theme.globalGreyOp01};
    border: 1px solid ${({ theme }) => theme.globalGreyOp01};
    color: ${({ theme }) => theme.globalGrey};
    & svg > {
      path {
        fill: ${({ theme }) => theme.globalGrey};
      }
    }
  }
`;

export const ButtonSecondary = styled(ButtonPrimary)`
  background: transparent;
  border-color: ${({ theme }) => theme.darkPink};
  :hover {
    cursor: pointer;
    background: transparent;
    border-color: ${({ theme }) => theme.pinkHover};
  }
  :active {
    background: transparent;
    border-color: ${({ theme }) => theme.pinkActive};
  }
  :disabled{
    cursor: default;
    background: transparent;
    border: 1px solid ${({ theme }) => theme.globalGreyOp01};
    color: ${({ theme }) => theme.globalGrey};
    & svg > {
      path {
        fill: ${({ theme }) => theme.globalGrey};
      }
    }
  }
`;

export const ButtonThird = styled(ButtonPrimary)`
  background: ${({ theme }) => theme.greyButton};
  border: 2px solid ${({ theme }) => theme.greyButton};
  border-radius: 28px;
  padding: 9px 5px;
  :hover {
    cursor: pointer;
    background: ${({ theme }) => theme.greyButton};
    border: 2px solid ${({ theme }) => theme.greyButton};
  }
  :active {
    background: ${({ theme }) => theme.greyButton};
    border: 2px solid ${({ theme }) => theme.greyButton};
  }
`;

export const ButtonFourth = styled(ButtonPrimary)`
  border: none;
  background: ${({ theme }) => theme.globalGreyOp02};
  border-radius: 12px;
  :hover {
    cursor: pointer;
    background: ${({ theme }) => theme.globalGreyOp04};
    border: none;
  }
  :active {
    background: ${({ theme }) => theme.globalGreyOp04};
    border: none;
  }
`;

export const FilterButton = styled.button<PropsWithChildren<IFilterButton>>`
  display: flex;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: ${({ theme, isActive }) => (isActive ? theme.globalWhite : theme.globalGrey)};
  border: none;
  background: ${({ theme, isActive }) => (isActive ? theme.globalGreyOp02 : 'none')};
  border-radius: 4px;
  padding: 2px 4px;
  :hover {
    cursor: ${({ isActive }) => (isActive ? 'default' : 'pointer')};
  }
  :disabled {
    cursor: default;
    color: ${({ theme }) => theme.globalGreyOp02};
  }
`;
