import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as Info } from 'assets/images-app/info.svg';
import { ReactComponent as Minus } from 'assets/images-app/minus.svg';
import { ReactComponent as Plus } from 'assets/images-app/plus.svg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.25rem;
`;

const LogoInfo = styled(Info)`
  margin-left: .397rem;
`;

const Title = styled.p`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalGrey};
`;

const TotalFeeBlock = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 2.25rem;
`;

const InputBlock = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  background-color: ${({ theme }) => theme.backgroundCard};
  color: ${({ theme }) => theme.globalWhite};
  border: 1px solid ${({ theme }) => theme.globalGreyOp04};
  border-radius: 8px;
  width: 93px;
  height: 40px;
  margin: 0 .5rem;
  text-align: center;

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

const PercentBtn = styled.button`
  outline: none;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.globalGrey};
  margin: 0 .5rem;
  padding: 0;
  :hover {
    cursor: pointer;
    color: ${({ theme }) => theme.globalWhite};
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const RowTitle = styled.p`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 300;
  font-size: 1rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.globalGrey};
  margin: 0;
`;

const LabelTitle = styled.p`
  font-style: normal;
  font-weight: 300;
  font-size: 1rem;
  line-height: 1.188rem;
  margin: 0;
`;

export default function AddPoolSettings() {
  const [inputSlippage, setInputSlippage] = useState<number>(0.2);

  const information = [
    {
      title: 'LP Fee',
      label: '0.16%',
    },
    {
      title: 'Protocol Fee',
      label: '0.032%',
    },
    {
      title: 'Referral Fee',
      label: '0.032%',
    },
  ];

  return (
    <Container>
      <Title>Total Fee <LogoInfo /> </Title>
      <TotalFeeBlock>
        <InputBlock>
          <LogoContainer onClick={() => setInputSlippage(inputSlippage - 1)}>
            <Minus />
          </LogoContainer>
          <Input
            type="number"
            value={inputSlippage}
            onChange={(event) => setInputSlippage(event.target.valueAsNumber)}
          />
          <LogoContainer onClick={() => setInputSlippage(inputSlippage + 1)}>
            <Plus />
          </LogoContainer>
        </InputBlock>
        <ButtonBlock>
          <PercentBtn>0.2%</PercentBtn>
          <PercentBtn>0.3%</PercentBtn>
          <PercentBtn>0.6%</PercentBtn>
        </ButtonBlock>
      </TotalFeeBlock>
      <Column>
        {information.map(({ title, label }) => (
          <Row key={title}>
            <RowTitle>{title} <LogoInfo /> </RowTitle>
            <LabelTitle>{label}</LabelTitle>
          </Row>
        ))}
      </Column>
    </Container>
  );
}
