import React from 'react';
import gif from 'assets/gif/El_4.gif';
import Footer from 'components/Footer';
import { ReactComponent as NearLogo } from 'assets/images/near-logo.svg';
import { isMobile, isTablet } from 'utils/userAgent';
import { useTranslation, TFunction } from 'react-i18next';
import { benefitsList, benefitsCards } from './constants';
import Header from './Header';
import LandingStyles from './styles';

function MiddleBlock({ t }: {t: TFunction}) {
  if (isMobile) {
    return (
      <LandingStyles.MobileBlockInformation>
        <LandingStyles.MobileUpperBlock>{t('landing.middleBlock.smartPools')}</LandingStyles.MobileUpperBlock>
        <LandingStyles.MobileMiddleLeftBlock>{t('landing.middleBlock.jets')}</LandingStyles.MobileMiddleLeftBlock>
        <LandingStyles.MobileMiddleRightBlock>
          <p>{t('landing.middleBlock.onTheFly')}</p>
        </LandingStyles.MobileMiddleRightBlock>
        <LandingStyles.MobileLowerBlock>
          <p>{t('landing.middleBlock.lowerBlock.mob')}</p>
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
      <LandingStyles.UpperBlock>{t('landing.middleBlock.smartPools')}</LandingStyles.UpperBlock>
      <LandingStyles.MiddleLeftBlock>{t('landing.middleBlock.jets')}</LandingStyles.MiddleLeftBlock>
      <LandingStyles.MiddleRightBlock>
        <p>{t('landing.middleBlock.onTheFly')}</p>
      </LandingStyles.MiddleRightBlock>
      <LandingStyles.LowerBlock>
        {t('landing.middleBlock.lowerBlock.f')}
        <br />
        {t('landing.middleBlock.lowerBlock.s')}
        <br />
        {t('landing.middleBlock.lowerBlock.t')}

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
  const { t } = useTranslation();

  return (
    <LandingStyles.Container>
      <Header />
      <LandingStyles.UpperContainer>
        <LandingStyles.MainInformation>
          <LandingStyles.NearContainer>
            {t('landing.poweredBy')}
            <NearLogo />
          </LandingStyles.NearContainer>
          {isTablet ? (
            <LandingStyles.MainTitle>
              {t('landing.mainTitle')}
            </LandingStyles.MainTitle>
          ) : (
            <LandingStyles.MainTitle>
              {t('landing.mainTitle')}
            </LandingStyles.MainTitle>
          )}
          {benefitsList.map((el) => (
            <LandingStyles.ListElement key={el}>{t(el)}</LandingStyles.ListElement>
          ))}
        </LandingStyles.MainInformation>
        <LandingStyles.Gif src={gif} alt="gif" />
      </LandingStyles.UpperContainer>
      <LandingStyles.GreyCardContainer>
        <LandingStyles.CardWrapper>
          {benefitsCards.map(({ Image, title, subtitle }) => (
            <LandingStyles.GreyCard key={title}>
              <Image />
              <h2>{t(title)}</h2>
              <h5>{t(subtitle)}</h5>
            </LandingStyles.GreyCard>
          ))}
        </LandingStyles.CardWrapper>
        <LandingStyles.BlackCardContainer>
          <LandingStyles.Title>{t('landing.ecosystem.title')}</LandingStyles.Title>
          <LandingStyles.Label>
            {t('landing.ecosystem.label')}
          </LandingStyles.Label>
          <MiddleBlock t={t} />
          <Footer />
        </LandingStyles.BlackCardContainer>
      </LandingStyles.GreyCardContainer>
    </LandingStyles.Container>
  );
}
