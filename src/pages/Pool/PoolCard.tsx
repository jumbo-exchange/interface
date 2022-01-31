import React, { PropsWithChildren } from 'react';
import { ButtonPrimary, ButtonSecondary, ButtonClaim } from 'components/Button';
import { IPool, useModalsStore, useStore } from 'store';
import styled from 'styled-components';
import { SpecialContainer } from 'components/SpecialContainer';
import Tooltip from 'components/Tooltip';
import { isMobile } from 'utils/userAgent';

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
    justify-content: space-between;
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
  background-color: ${({ theme }) => theme.hakunaLabel};
  border-radius: 4px;
`;

const MiceBlock = styled(JumboBlock)`
  background-color: ${({ theme }) => theme.matataLabel};
`;

const BtnClaim = styled(ButtonClaim)`
  margin-left: 1.5rem;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 48px;
    margin: 0;
    width: 100%;
  `}
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
interface IVolume {
  title: string;
  label: string;
  color?: boolean;
}

const RenderClaimButton = (
  {
    show,
    getClaim,
  }:{
    show:boolean,
    getClaim:() => void
  },
) => {
  if (show) {
    return (
      <BtnClaim onClick={getClaim}>
        <span>50.5004648 DAI</span>
        <span>Claim</span>
      </BtnClaim>
    );
  }
  return null;
};

export default function PoolCard({ pool } : { pool:IPool }) {
  const {
    tokens,
    setInputToken,
    setOutputToken,
  } = useStore();
  const { setAddLiquidityModalOpen } = useModalsStore();

  const [inputToken, outputToken] = pool.tokenAccountIds;
  const tokenInput = tokens[inputToken] ?? null;
  const tokenOutput = tokens[outputToken] ?? null;

  if (!tokenInput || !tokenOutput) return null;

  const volume: IVolume[] = [
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
      color: true,
    },
  ];

  const getWithdraw = () => {
    console.log('Withdraw');
  };

  const getClaim = () => {
    console.log('Claim');
  };

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
          <p><strong>0.2 NEAR</strong> / day / $1K</p>
          <JumboBlock>Jumbo</JumboBlock>
          <MiceBlock>Mice</MiceBlock>
          <RenderClaimButton show={!isMobile} getClaim={getClaim} />
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
        <RenderClaimButton show={isMobile} getClaim={getClaim} />
        <BlockButton>
          <BtnSecondary
            onClick={() => getWithdraw()}
          >
            Withdraw
          </BtnSecondary>
          <BtnPrimary
            onClick={() => {
              setInputToken(tokenInput);
              setOutputToken(tokenOutput);
              setAddLiquidityModalOpen(true);
            }}
          >
            Add Liquidity
          </BtnPrimary>
        </BlockButton>
      </LowerRow>
    </Wrapper>
  );
}
