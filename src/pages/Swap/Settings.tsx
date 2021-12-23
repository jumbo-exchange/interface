import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { ReactComponent as Info } from 'assets/images-app/info.svg';

interface ICurrent {
  isActive?: boolean
}

interface IColor {
  isColor?: boolean
}

// TODO: add transition to container
const Container = styled.div<PropsWithChildren<ICurrent>>`
  display: ${({ isActive }) => (isActive ? 'flex' : 'none')};
  flex-direction: column;
  margin-top: 1.375rem;
`;

const LogoInfo = styled(Info)`
  margin-left: .397rem;
`;

const RouteBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2rem;
  & > div {
    margin-top: 1rem;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.p`
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalGrey};
  margin: 0;
`;

const Label = styled.p<PropsWithChildren<IColor>>`
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
  color: ${({ theme, isColor }) => (isColor ? theme.globalGreen : theme.globalWhite)};
  margin: 0;
`;

export default function Settings({ isActive }:{isActive:boolean}) {
  const settingsArray = [
    {
      title: 'Minimum Recieved',
      label: '0.005053 USDT',
      color: false,
    },
    {
      title: 'Price Impact',
      label: '0.02%',
      color: true,
    },
    {
      title: 'Liquidity Provider Fee',
      label: '0.000000007477 ETH',
      color: false,
    },
    {
      title: 'Slippage Tolerance',
      label: '0.50%',
      color: false,
    },
  ];

  return (
    <Container isActive={isActive}>
      <RouteBlock>
        <Title>Route <LogoInfo /> </Title>
        <div> ETH {'>'} USTD {'>'} NEAR </div>
      </RouteBlock>
      {settingsArray.map(({ title, label, color }) => (
        <Row key={title}>
          <Title>{title} <LogoInfo /></Title>
          <Label isColor={color}>{label}</Label>
        </Row>
      ))}
    </Container>
  );
}
