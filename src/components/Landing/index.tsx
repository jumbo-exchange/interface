import Header from 'components/Header';
import { ReactComponent as NearLogo } from 'assets/images/near-logo.svg';
import { ReactComponent as JetLogo } from 'assets/images/jets-icon.svg';
import { ReactComponent as SlippageLogo } from 'assets/images/slippage-icon.svg';
import { ReactComponent as FarmingLogo } from 'assets/images/farming-icon.svg';
import tabletImg from 'assets/images/tablet-image.png';
import mobileImg from 'assets/images/mobile-image.png';
import Footer from 'components/Footer';
import { isMobile, isTablet } from 'utils/userAgent';
import gif from 'assets/images/El_4.gif';
import {
  UpperContainer,
  MainInformation,
  Gif,
  NearContainer,
  MainTitle,
  ListElement,
  GreyCardContainer,
  CardWrapper,
  GreyCard,
  BlackCardContainer,
  Title,
  Label,
  BlockInformation,
  UpperBlock,
  MiddleLeftBlock,
  MiddleRightBlock,
  LowerBlock,
  CentralArrowContainer,
  LowerLeftArrowContainer,
  LowerRightArrowContainer,
  TabletImgContainer,
  MobileImgContainer,
} from './styles';

const benefitsList = [
  'Instanteneous Swaps',
  'Highest Yields and Seamless Pool Transition',
  'Permissionless Liquidity Pools',
];

const benefitsCards = [
  {
    Image: JetLogo,
    title: 'Jets',
    subtitle:
      'Interface-embedded system that helps to find the most promising pools',
  },
  {
    Image: SlippageLogo,
    title: 'Low Slippage',
    subtitle:
      'The lowest slippage possible thanks to NEAR and proprietary algorithms',
  },
  {
    Image: FarmingLogo,
    title: 'Yield Finder',
    subtitle: 'Find the best Yields and Transition between pools in ONE Click',
  },
];

function MiddleBlock() {
  if (isTablet) {
    return (
      <TabletImgContainer>
        <img src={tabletImg} alt="table img" />
      </TabletImgContainer>
    );
  }
  if (isMobile) {
    return (
      <MobileImgContainer>
        <img src={mobileImg} alt="mobile img" />
      </MobileImgContainer>
    );
  }
  return (
    <BlockInformation>
      <UpperBlock>Smart Pools</UpperBlock>
      <MiddleLeftBlock>Jets</MiddleLeftBlock>
      <MiddleRightBlock>
        On-the-fly
        <br />
        Pool Transition
      </MiddleRightBlock>
      <LowerBlock>
        Lower Slippage
        <br />
        Volume & Liquidity Homogenization
        <br />
        Liquid Market
      </LowerBlock>
      <CentralArrowContainer />
      <LowerLeftArrowContainer />
      <LowerRightArrowContainer />
    </BlockInformation>
  );
}

export default function Landing() {
  return (
    <>
      <Header />
      <UpperContainer>
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
          {benefitsList.map((el) => (
            <ListElement key={el}>{el}</ListElement>
          ))}
        </MainInformation>
        <Gif src={gif} alt="gif" />
      </UpperContainer>
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
          <Label>
            Jumbo provides Ecosystem-Wide <br />
            Liquidity for users and projects
          </Label>
          <MiddleBlock />
          <Footer />
        </BlackCardContainer>
      </GreyCardContainer>
    </>
  );
}
