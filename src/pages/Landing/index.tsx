import React from 'react';
import gif from 'assets/images/El_4.gif';
import Footer from 'components/Footer';
import { ReactComponent as NearLogo } from 'assets/images/near-logo.svg';
import { isMobile, isTablet } from 'utils/userAgent';
import { benefitsList, benefitsCards } from './constants';
import Header from './Header';
import LandingStyles from './styles';

function MiddleBlock() {
  if (isMobile) {
    return (
      <LandingStyles.MobileBlockInformation>
        <LandingStyles.MobileUpperBlock>Smart Pools</LandingStyles.MobileUpperBlock>
        <LandingStyles.MobileMiddleLeftBlock>Jets</LandingStyles.MobileMiddleLeftBlock>
        <LandingStyles.MobileMiddleRightBlock>
          On-the-fly
          <br />
          Pool Transition
        </LandingStyles.MobileMiddleRightBlock>
        <LandingStyles.MobileLowerBlock>
          Lower Slippage
          <br />
          Volume & Liquidity
          <br />
          Homogenization
          <br />
          Liquid Market
        </LandingStyles.MobileLowerBlock>
        <LandingStyles.MobileCentralArrowContainer />
        <LandingStyles.MobileUpperLeftArrowContainer />
        <LandingStyles.MobileUpperRightArrowContainer />
        <LandingStyles.MobileLowerLeftArrowContainer />
        <LandingStyles.MobileLowerRightArrowContainer />
      </LandingStyles.MobileBlockInformation>
    );
  }
  return (
    <LandingStyles.BlockInformation>
      <LandingStyles.UpperBlock>Smart Pools</LandingStyles.UpperBlock>
      <LandingStyles.MiddleLeftBlock>Jets</LandingStyles.MiddleLeftBlock>
      <LandingStyles.MiddleRightBlock>
        On-the-fly
        <br />
        Pool Transition
      </LandingStyles.MiddleRightBlock>
      <LandingStyles.LowerBlock>
        Lower Slippage
        <br />
        Volume & Liquidity Homogenization
        <br />
        Liquid Market

      </LandingStyles.LowerBlock>
      {isTablet
        ? <LandingStyles.TabletCentralArrowContainer />
        : <LandingStyles.CentralArrowContainer />}
      <LandingStyles.LowerLeftArrowContainer />
      <LandingStyles.LowerRightArrowContainer />
    </LandingStyles.BlockInformation>
  );
}

export default function Landing() {
  return (
    <LandingStyles.Container>
      <Header />
      <LandingStyles.UpperContainer>
        <LandingStyles.MainInformation>
          <LandingStyles.NearContainer>
            Powered by
            <NearLogo />
          </LandingStyles.NearContainer>
          {isTablet ? (
            <LandingStyles.MainTitle>
              The Most Intuitive  DeFi <br />
              Experience You Will Ever Have
            </LandingStyles.MainTitle>
          ) : (
            <LandingStyles.MainTitle>
              The Most Intuitive <br />
              DeFi Experience <br />
              You Will Ever Have
            </LandingStyles.MainTitle>
          )}
          {benefitsList.map((el) => (
            <LandingStyles.ListElement key={el}>{el}</LandingStyles.ListElement>
          ))}
        </LandingStyles.MainInformation>
        <LandingStyles.Gif src={gif} alt="gif" />
      </LandingStyles.UpperContainer>
      <LandingStyles.GreyCardContainer>
        <LandingStyles.CardWrapper>
          {benefitsCards.map(({ Image, title, subtitle }) => (
            <LandingStyles.GreyCard key={title}>
              <Image />
              <h2>{title}</h2>
              <h5>{subtitle}</h5>
            </LandingStyles.GreyCard>
          ))}
        </LandingStyles.CardWrapper>
        <LandingStyles.BlackCardContainer>
          <LandingStyles.Title>Ecosystem</LandingStyles.Title>
          <LandingStyles.Label>
            Jumbo provides Ecosystem-Wide <br />
            Liquidity for users and projects
          </LandingStyles.Label>
          <MiddleBlock />
          <Footer />
        </LandingStyles.BlackCardContainer>
      </LandingStyles.GreyCardContainer>
    </LandingStyles.Container>
  );
}
