import React from 'react';
import styled from 'styled-components';

export enum ButtonVariant {
  Primary,
  Secondary,
  Third,
  Fourth,
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
  }
  :active {
  }
  :disabled{
    background: ${({ theme }) => theme.grayHover};
    border: 1px solid ${({ theme }) => theme.grayHover};
  }
`;

export const ButtonSecondary = styled(ButtonPrimary)`
  background: transparent;
  
`;

export const ButtonThird = styled(ButtonPrimary)`
  background: ${({ theme }) => theme.greyButton};
  border: 2px solid ${({ theme }) => theme.greyButton};
  border-radius: 28px;
  padding: 9px 5px;
  :hover {
    cursor: pointer;
  }
`;
export const ButtonFourth = styled(ButtonPrimary)`
  border: 2px solid ${({ theme }) => theme.darkGreyButton};
  background: ${({ theme }) => theme.darkGreyButton};
  border-radius: 12px;
  :hover {
    cursor: pointer;
    background: ${({ theme }) => theme.darkGreyButtonHv};
    border: 2px solid ${({ theme }) => theme.darkGreyButtonHv};
  }
`;

export function Button({ variant }: { variant: ButtonVariant }) {
  switch (variant) {
    case ButtonVariant.Primary:
      return <ButtonPrimary />;
    case ButtonVariant.Secondary:
      return <ButtonSecondary />;
    case ButtonVariant.Third:
      return <ButtonThird />;
    case ButtonVariant.Fourth:
      return <ButtonFourth />;
    default:
      return <ButtonPrimary />;
  }
}
