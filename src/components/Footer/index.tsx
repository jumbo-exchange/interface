import { isMobile } from 'utils/userAgent';
import { ReactComponent as TelegramImg } from 'assets/images/Telegram.svg';
import { ReactComponent as TwitterImg } from 'assets/images/Twitter.svg';
import { ReactComponent as MediumImg } from 'assets/images/Medium.svg';
import { ReactComponent as HapiLogo } from 'assets/images/hapi-logo.svg';
import {
  hapiLink, mediumLink, twitterLink, telegramLink,
} from 'utils/constants';
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
            Protected by
            <span>HAPI Protocol</span>
          </HapiTitle>
        </HapiButton>
        <TextContainer>Copyright 2021</TextContainer>
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
            Protected by
            <span>HAPI Protocol</span>
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
      <TextContainer>Copyright 2021</TextContainer>
    </Container>
  );
}
