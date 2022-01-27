import styled from 'styled-components';
import Header from 'components/Header';
import { ReactComponent as NearLogo } from 'assets/images/near-logo.svg';
import { ReactComponent as JetLogo } from 'assets/images/jets-icon.svg';
import { ReactComponent as SlippageLogo } from 'assets/images/slippage-icon.svg';
import { ReactComponent as FarmingLogo } from 'assets/images/farming-icon.svg';
import { ReactComponent as CentralArrow } from 'assets/images/arrow-central.svg';
import { ReactComponent as LowerLeftArrow } from 'assets/images/arrow-lower-left.svg';
import { ReactComponent as LowerRightArrow } from 'assets/images/arrow-lower-right.svg';
import Footer from 'components/Footer';

const benefitsList = [
  'Instanteneous Swaps',
  'Highest Yields and Seamless Pool Transition',
  'Permissionless Liquidity Pools',
];

const MainInformation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 60%;
  margin: 70px auto;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: unset;
    margin: 70px 72px;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
      width: unset;
      margin: 70px 32px;
  `}
`;

const NearContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  font-style: normal;
  font-weight: 300;
  font-size: 1rem;
  line-height: 19px;
  color: ${({ theme }) => theme.greyText};
  & > svg {
    margin-left: 1rem;
  }
`;

const MainTitle = styled.h1`
  font-style: normal;
  font-weight: 500;
  font-size: 3rem;
  line-height: 57px;
  color: ${({ theme }) => theme.white};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 2rem;
    line-height: 38px;
  `}
`;

const ListElement = styled.li`
  font-style: normal;
  font-weight: 300;
  font-size: 1.25rem;
  line-height: 140%;
  color: ${({ theme }) => theme.white};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 1rem;
  `}
`;
const GreyCardContainer = styled.section`
  background-color:  ${({ theme }) => theme.greyCard};
  border-radius: 240px 240px 0 0;
  
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  box-shadow: 0px 0px 72px -12px ${({ theme }) => theme.greyCardShadow};
  padding: 0 10%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0%;
    border-radius: 120px 120px 0 0;
  `}

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    border-radius: 48px 48px 0 0;
    padding: 0%;
  `}
`;

const GreyCard = styled.div`
    color: ${({ theme }) => theme.white};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 60px;
    padding:  0 5%;

    & > h2 {
      font-style: normal;
      font-weight: 500;
      font-size: 1.5rem;
      line-height: 1.75rem;
      text-align: center;
    }
    
    & > h5 {
      font-style: normal;
      font-weight: 300;
      font-size: 1rem;
      line-height: 1.185rem;
      text-align: center;
      margin-block-start: 0;
    }
    
    ${({ theme }) => theme.mediaWidth.upToSmall`
      padding:  0 10%;
    `}
`;

const BlackCardContainer = styled.div`
  background-color:  ${({ theme }) => theme.globalBlack};
  border-radius: 240px 240px 0 0;
`;

const Title = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 2rem;
  line-height: 38px;
  text-align: center;
  color: ${({ theme }) => theme.white};
  padding-top: 72px;
  margin-bottom: 24px;
`;

const Label = styled.div`
  font-weight: 300;
  font-size: 1.5rem;
  line-height: 34px;
  text-align: center;
  color: ${({ theme }) => theme.blackCardText};
  margin-top: 24px;
  margin-bottom: 72px;
`;

const BlockInformation = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr) 0.2fr 0.5fr 0.2fr 2fr 0.2fr 0.5fr 0.2fr repeat(2, 1fr);
  grid-template-rows: 1fr 0.5fr 1fr 0.3fr 2fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  color: ${({ theme }) => theme.globalWhite};
  margin: 0 200px;
  padding-bottom: 100px;
`;

const Block = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 34px;
  box-sizing: border-box;
  border-radius: 32px;
  padding: 10px;
`;

const UpperBlock = styled(Block)`
  grid-area: 1 / 4 / 2 / 9;
  border: 2px dashed ${({ theme }) => theme.redBorder};
`;

const MiddleLeftBlock = styled(Block)`
  grid-area: 3 / 1 / 4 / 5;
  border: 2px dashed ${({ theme }) => theme.globalWhite};
`;

const MiddleRightBlock = styled(Block)`
  grid-area: 3 / 8 / 4 / 12;
  border: 2px dashed ${({ theme }) => theme.globalWhite};
  line-height: 34px;
`;

const LowerBlock = styled(Block)`
  width: 100%;
  grid-area: 5 / 4 / 6 / 9;
  font-style: normal;
  line-height: 32px;
  color: ${({ theme }) => theme.greenText};
  background: ${({ theme }) => theme.darkGreenBg};
  border-radius: 32px;
`;

const CentralArrowContainer = styled(CentralArrow)`
  grid-area: 2 / 6 / 5 / 7;
`;
const LowerLeftArrowContainer = styled(LowerLeftArrow)`
  grid-area: 4 / 2 / 6 / 3;
`;
const LowerRightArrowContainer = styled(LowerRightArrow)`
  grid-area: 4 / 10 / 6 / 11;
`;

const benefitsCards = [
  {
    Image: JetLogo,
    title: 'Jets',
    subtitle: 'Interface-embedded system that helps to find the most promising pools',
  },
  {
    Image: SlippageLogo,
    title: 'Low Slippage',
    subtitle: 'The lowest slippage possible thanks to NEAR and proprietary algorithms',
  },
  {
    Image: FarmingLogo,
    title: 'Yield Finder',
    subtitle: 'Find the best Yields and Transition between pools in ONE Click',
  },
];

export default function Landing() {
  return (
    <>
      <Header />
      <MainInformation>
        <NearContainer>
          Powered by
          <NearLogo />
        </NearContainer>
        <MainTitle>
          The Most Intuitive <br />
          DeFi Experience <br />
          You Will Ever Have
        </MainTitle>
        {benefitsList.map((el) => <ListElement key={el}>{el}</ListElement>)}
      </MainInformation>
      <GreyCardContainer>
        <CardWrapper>
          {benefitsCards.map(({ Image, title, subtitle }) => (
            <GreyCard key={title}>
              <Image />
              <h2>{title}</h2>
              <h5>{subtitle}</h5>
            </GreyCard>
          ))}
        </CardWrapper>
        <BlackCardContainer>
          <Title>Ecosystem</Title>
          <Label>Jumbo provides Ecosystem-Wide Liquidity for users and projects</Label>
          <BlockInformation>
            <UpperBlock>Smart Pools</UpperBlock>
            <MiddleLeftBlock>Jets</MiddleLeftBlock>
            <MiddleRightBlock>
              On-the-fly<br />
              Pool Transition
            </MiddleRightBlock>
            <LowerBlock>
              Lower Slippage<br />
              Volume & Liquidity Homogenization<br />
              Liquid Market
            </LowerBlock>
            <CentralArrowContainer />
            <LowerLeftArrowContainer />
            <LowerRightArrowContainer />
          </BlockInformation>
          <Footer />
        </BlackCardContainer>
      </GreyCardContainer>
    </>
  );
}
