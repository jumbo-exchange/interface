import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { MAX_TOGGLE_AMOUNT, MIN_TOGGLE_AMOUNT } from 'utils/constants';
import { ReactComponent as Minus } from 'assets/images-app/minus.svg';
import { ReactComponent as Plus } from 'assets/images-app/plus.svg';

interface IActive {
  isActive?: boolean
}

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const InputBlock = styled.div`
  display: flex;
  align-items: center;
`;
// TODO: when the warm stroke worked red
const WrapperInput = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundCard};
  color: ${({ theme }) => theme.globalWhite};
  border: 1px solid ${({ theme }) => theme.globalGreyOp04};
  border-radius: 8px;
  width: 93px;
  height: 40px;
  margin: 0 .5rem;
  text-align: center;
`;

const Input = styled.input`
  display: flex;
  background-color: transparent;
  border: none;
  outline: none;
  text-align: right;
  width: 55%;
  color: white;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  svg {
    justify-self: center;
  }
  :hover {
  cursor: pointer;
  background-color: ${({ theme }) => theme.globalGreyOp02};
    svg {
      path {
        fill: ${({ theme }) => theme.globalWhite};
      }
    }
  }
`;

const ButtonBlock = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const PercentBtn = styled.button<PropsWithChildren<IActive>>`
  outline: none;
  border: none;
  background-color: transparent;
  color: ${({ theme, isActive }) => (isActive ? theme.globalWhite : theme.globalGrey)};
  margin: 0 .5rem;
  padding: 0;
  :hover {
    cursor: pointer;
    color: ${({ theme }) => theme.globalWhite};
  }
`;

export default function Toggle({
  value,
  coefficient,
  options,
  onChange,
}:{
  value: string;
  coefficient: number;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  const getMinus = () => {
    if (Number(value) <= coefficient || Number(value) === MIN_TOGGLE_AMOUNT) {
      onChange(MIN_TOGGLE_AMOUNT.toString());
      return;
    }
    onChange((Number(value) - coefficient).toFixed(2));
  };
  const getPlus = () => {
    if (Number(value) + coefficient >= MAX_TOGGLE_AMOUNT || Number(value) === MAX_TOGGLE_AMOUNT) {
      onChange(MAX_TOGGLE_AMOUNT.toString());
      return;
    }
    onChange((Number(value) + coefficient).toFixed(2));
  };

  return (
    <Container>
      <InputBlock>
        <LogoContainer onClick={getMinus}>
          <Minus />
        </LogoContainer>
        <WrapperInput>
          <Input
            type="number"
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
            }}
          />
          %
        </WrapperInput>
        <LogoContainer onClick={getPlus}>
          <Plus />
        </LogoContainer>
      </InputBlock>
      <ButtonBlock>
        {options.map((element) => {
          const active = Number(element.value) === Number(value);
          return (
            <PercentBtn
              key={element.value}
              isActive={active}
              onClick={() => {
                onChange(element.value);
              }}
            >
              {element.label}
            </PercentBtn>
          );
        })}
      </ButtonBlock>
    </Container>
  );
}
