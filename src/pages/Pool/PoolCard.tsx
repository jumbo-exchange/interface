import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import Tooltip from 'components/Tooltip';
import Big from 'big.js';
import { ButtonPrimary, ButtonSecondary } from 'components/Button';
import { IPool, useStore } from 'store';
import { SpecialContainer } from 'components/SpecialContainer';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as AddIcon } from 'assets/images-app/icon-add.svg';

interface IColor {
  isColor?: boolean
}

const Wrapper = styled(SpecialContainer)`
  max-width: 736px;
  width: 100%;
  border-radius: 24px;
  justify-content: space-between;
  margin: 0 0 1rem 0;
  & > div:first-child {
    margin-bottom: 1.5rem;
  }
  ::before{
    border-radius: 24px;
  }
`;

const UpperRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column-reverse;
    align-items: flex-start;
  `}
`;

const LowerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
    align-items: flex-start;
  `}
`;

const BlockTitle = styled.div`
  display: flex;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 1.5rem;
  `}
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
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    & > img {
      width: 32px;
      height: 32px;
    }
  `}
`;

const TitlePool = styled.div`
  display: flex;
  width: 100%;
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
  display: flex;
  align-items: center;
  p {
    font-weight: 500;
    font-size: .75rem;
    line-height: .875rem;
    color: ${({ theme }) => theme.globalWhite};
    margin: 0 1rem 0 0;
  }
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
    justify-content: flex-end;
    p {
      flex: 1;
      text-align: left;
    }
  `}
`;

const JumboBlock = styled.div`
  display: flex;
  margin-left: .5rem;
  padding: 4px;
  font-style: normal;
  font-weight: normal;
  font-size: .75rem;
  line-height: .875rem;
  background-color: ${({ theme }) => theme.jumboLabel};
  border-radius: 4px;
`;

const MiceBlock = styled(JumboBlock)`
  background-color: ${({ theme }) => theme.miceLabel};
`;

const BlockVolume = styled.div`
  display: flex;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
  `}
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 2.125rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0 0 1.125rem;
    flex-direction: row;
    justify-content: space-between;
  `}
`;

const TitleVolume = styled.div`
  display: flex;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme }) => theme.globalGrey};
  margin-bottom: .75rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0;
  `}
`;

const LabelVolume = styled.div<PropsWithChildren<IColor>>`
  display: flex;
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: .875rem;
  color: ${({ theme, isColor }) => (isColor ? theme.globalGreen : theme.globalWhite)};
`;

const BlockButton = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column-reverse;
  `}
`;

const BtnPrimary = styled(ButtonPrimary)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: .75rem 0;
  `}
`;

const BtnSecondary = styled(ButtonSecondary)`
  margin-right: .75rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0;
  `}
`;

const LogoButton = styled(AddIcon)`
  width: 12px;
  height: 12px;
  margin-right: .625rem;
`;

interface IVolume {
  title: string;
  label: string;
  color?: boolean;
}

export default function PoolCard({ pool } : { pool:IPool }) {
  const { tokens } = useStore();
  const navigate = useNavigate();

  const [inputToken, outputToken] = pool.tokenAccountIds;
  const tokenInput = tokens[inputToken] ?? null;
  const tokenOutput = tokens[outputToken] ?? null;

  if (!tokenInput || !tokenOutput) return null;

  const volume: IVolume[] = [
    {
      title: 'Total Liquidity',
      label: '-',
    },
    {
      title: '24h Volume',
      label: '-',
    },
    {
      title: 'APR',
      label: '-',
      color: true,
    },
  ];

  const canWithdraw = pool.shares === '0' || pool.shares === undefined || Big(pool.shares) === Big('0');

  return (
    <Wrapper>
      <UpperRow>
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
          <JumboBlock>Jumbo</JumboBlock>
          {/* <MiceBlock>Mice</MiceBlock> */}
        </LabelPool>
      </UpperRow>
      <LowerRow>
        <BlockVolume>
          {volume.map((el) => (
            <Column key={el.title}>
              <TitleVolume>
                {el.title}
                <Tooltip title="YES" />
              </TitleVolume>
              <LabelVolume isColor={el.color}>{el.label}</LabelVolume>
            </Column>
          ))}
        </BlockVolume>
        <BlockButton>
          {!canWithdraw && (
          <BtnSecondary
            onClick={() => {
              navigate(`/app/pool/remove-liquidity/${pool.id}`);
            }}
          >
            Withdraw
          </BtnSecondary>
          )}

          <BtnPrimary
            onClick={() => {
              navigate(`/app/pool/add-liquidity/${pool.id}`);
            }}
          >
            <LogoButton />Add Liquidity
          </BtnPrimary>
        </BlockButton>
      </LowerRow>
    </Wrapper>
  );
}
