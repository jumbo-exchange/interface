import { isMobile } from 'utils/userAgent';
import { ReactComponent as TelegramImg } from 'assets/images/Telegram.svg';
import { ReactComponent as TwitterImg } from 'assets/images/Twitter.svg';
import { ReactComponent as MediumImg } from 'assets/images/Medium.svg';
import { ReactComponent as HapiLogo } from 'assets/images/hapi-logo.svg';
import {
  hapiLink, mediumLink, twitterLink, telegramLink,
} from 'utils/constants';
import { useTranslation } from 'react-i18next';
import { ISocialNetwork } from './interfaces';
import {
  Container,
  ContainerMobile,
  ChildContainer,
  SocialNetworkContainer,
  ChildSocialNetwork,
  TextContainer,
  LeftContainer,
  HapiButton,
  HapiLogoContainer,
  HapiTitle,
} from './styles';

const socialNetwork: ISocialNetwork[] = [
  {
    Image: TelegramImg,
    title: 'Telegram',
    href: telegramLink,
  },
  {
    Image: TwitterImg,
    title: 'Twitter',
    href: twitterLink,
  },
  {
    Image: MediumImg,
    title: 'Medium',
    href: mediumLink,
  },
];

export default function Footer() {
  const { t } = useTranslation();

  return isMobile ? (
    <ContainerMobile>
      <SocialNetworkContainer>
        {socialNetwork.map(({ Image, title, href }) => (
          <ChildSocialNetwork
            key={title}
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            <Image />
            <div>{title}</div>
          </ChildSocialNetwork>
        ))}
      </SocialNetworkContainer>
      <ChildContainer>
        <HapiButton
          href={hapiLink}
          target="_blank"
          rel="noreferrer"
        >
          <HapiLogoContainer>
            <HapiLogo />
          </HapiLogoContainer>
          <HapiTitle>
            {t('footer.protectBy')}
            <span>{t('footer.hapiProtocol')}</span>
          </HapiTitle>
        </HapiButton>
        <TextContainer>{t('footer.copyright')}</TextContainer>
      </ChildContainer>
    </ContainerMobile>
  ) : (
    <Container>
      <LeftContainer>
        <HapiButton
          href={hapiLink}
          target="_blank"
          rel="noreferrer"
        >
          <HapiLogoContainer>
            <HapiLogo />
          </HapiLogoContainer>
          <HapiTitle>
            {t('footer.protectBy')}
            <span>{t('footer.hapiProtocol')}</span>
          </HapiTitle>
        </HapiButton>
      </LeftContainer>
      <SocialNetworkContainer>
        {socialNetwork.map(({ Image, title, href }) => (
          <ChildSocialNetwork
            key={title}
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            <Image />
            <div>{title}</div>
          </ChildSocialNetwork>
        ))}
      </SocialNetworkContainer>
      <TextContainer>{t('footer.copyright')}</TextContainer>
    </Container>
  );
}
