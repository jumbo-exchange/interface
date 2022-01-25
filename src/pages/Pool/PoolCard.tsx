import React from 'react';
import { ButtonPrimary } from 'components/Button';
import { IPool, useModalsStore, useStore } from 'store';
import styled from 'styled-components';
import { SpecialContainer } from 'components/SpecialContainer';
import { ReactComponent as InfoIcon } from 'assets/images-app/info.svg';
import Tooltip from 'components/Tooltip';

const Wrapper = styled(SpecialContainer)`
  max-width: 736px;
  width: 100%;
  border-radius: 24px;
  justify-content: space-between;
  margin: 0;
  margin-bottom: 1rem;
  & > div:first-child {
    margin-bottom: 1.5rem;
  }
  ::before{
    border-radius: 24px;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BlockTitle = styled.div`
  display: flex;
`;

const LogoPool = styled.div`
  position: relative;
  margin-right: 1.75rem;
  & > img {
    width: 24px;
    height: 24px;
  }
  & > img:last-child {
    position: absolute;
    left: 19px;
    top: -5px;
    filter: drop-shadow(0px 4px 8px #202632);
  }
`;

const TitlePool = styled.div`
  display: flex;
  & > p {
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.188rem;
    color: ${({ theme }) => theme.globalWhite};
    margin: 0;
  }
`;

const LabelPool = styled.div`
  p {
    font-style: normal;
    font-weight: 500;
    font-size: .75rem;
    line-height: .875rem;
    color: ${({ theme }) => theme.globalWhite};
  }
`;

const BlockVolume = styled.div`
  display: flex;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 2.125rem;
`;

const TitleVolume = styled.div`
  display: flex;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalGrey};
  margin-bottom: .75rem;
`;

const LabelVolume = styled.div`
  display: flex;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalWhite};
`;

const LogoInfo = styled(InfoIcon)`
  margin-left: 6.35px;
`;

const BlockButton = styled.div`
  display: flex;
`;

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
      label: '12%',
    },
  ];

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
              <TitleVolume>
                {el.title}
                <Tooltip title="YES" />
              </TitleVolume>
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
