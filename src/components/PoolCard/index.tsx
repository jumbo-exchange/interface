import React from 'react';
import { ButtonPrimary } from 'components/Button';
import { IPool, useModalsStore, useStore } from 'store';
import {
  Wrapper,
  Row,
  BlockTitle,
  LogoPool,
  TitlePool,
  LabelPool,
  BlockVolume,
  Column,
  TitleVolume,
  LogoInfo,
  LabelVolume,
  BlockButton,
} from './styles';

const volume = [
  {
    title: 'Total Liquidity',
    label: '$34550.53',
  },
  {
    title: '24h Volume',
    label: '$5321.03',
  },
  {
    title: 'APR',
    label: '45.6%',
  },
];

export default function PoolCard({ pool } : {pool:IPool}) {
  const {
    tokens,
    setInputToken,
    setOutputToken,
  } = useStore();
  const { setLiquidityModalOpen } = useModalsStore();

  const [inputToken, outputToken] = pool.tokenAccountIds;
  const tokenInput = tokens[inputToken] ?? null;
  const tokenOutput = tokens[outputToken] ?? null;

  if (!tokenInput || !tokenOutput) return null;

  return (
    <Wrapper>
      <Row>
        <BlockTitle>
          <LogoPool>
            <img src={tokenInput.metadata.icon} alt="logo token" />
            <img src={tokenOutput.metadata.icon} alt="logo token" />
          </LogoPool>
          <TitlePool>
            <p>{tokenInput.metadata.symbol}</p>
            <p>/</p>
            <p>{tokenOutput.metadata.symbol}</p>
          </TitlePool>
        </BlockTitle>
        <LabelPool>
          <p><strong>0.2 NEAR</strong> / day / $1K</p>
        </LabelPool>
      </Row>
      <Row>
        <BlockVolume>
          {volume.map((el) => (
            <Column key={el.title}>
              <TitleVolume>{el.title} <LogoInfo /></TitleVolume>
              <LabelVolume>{el.label}</LabelVolume>
            </Column>
          ))}
        </BlockVolume>
        <BlockButton>
          <ButtonPrimary
            onClick={() => {
              setInputToken(tokenInput);
              setOutputToken(tokenOutput);
              setLiquidityModalOpen(true);
            }}
          >
            Add Liquidity
          </ButtonPrimary>
        </BlockButton>
      </Row>
    </Wrapper>
  );
}
