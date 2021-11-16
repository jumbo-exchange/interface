import { FunctionComponent, SVGProps } from 'react';

import styled from 'styled-components';

import { isMobile } from 'utils/userAgent';
import { ReactComponent as TelegramImg } from 'assets/images/Telegram.svg';
import { ReactComponent as TwitterImg } from 'assets/images/Twitter.svg';
import { ReactComponent as MediumImg } from 'assets/images/Medium.svg';
import { ReactComponent as JumboLogo } from 'assets/images/jumbo-logo.svg';
import { ReactComponent as HapiLogo } from 'assets/images/hapi-logo.svg';
import {
  hapiLink, mediumLink, twitterLink, telegramLink,
} from 'utils/constants';

const Container = styled.footer`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  color: ${({ theme }) => theme.globalWhite};
  padding: 0 12.5rem 2.563rem 12.5rem;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    padding: 0 4.375rem 2.563rem 4.375rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 0 3rem 2.563rem 3rem;
  `}
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 1.25rem 2.563rem 1.25rem;
  `}
`;

const ContainerMobile = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  color: ${({ theme }) => theme.globalWhite};
`;
const ChildContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  align-self: normal;
  white-space: nowrap;
  margin: ${isMobile ? '1.5rem 0' : '0'};
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-right: ${isMobile ? '0' : '1.875rem'};
  & > svg {
    margin-right: .25rem;
    width: 1.188rem;
    height: 0.938rem;
    path {
      fill: ${({ theme }) => theme.greyFooterLogo};
    }
  }
`;

const LogoTitle = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 1rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.greyFooterLogo};
`;

const SocialNetworkContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 0 1 0;
  border-radius: 32px;
  padding: 0 1.938rem;
  background: ${({ theme }) => theme.greySocialNetworkBg};
`;

const ChildSocialNetwork = styled.a`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0.938rem 1.188rem;
  text-decoration: none;
  & > div {
    margin-top: 0.5rem;
    font-style: normal;
    font-weight: 300;
    font-size: 0.75rem;
    line-height: 1.063rem;
    text-align: center;
    color: ${({ theme }) => theme.globalWhite};
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex: ${isMobile ? '0' : '1 1 0'};
  justify-content: flex-end;
  font-style: normal;
  font-weight: 300;
  font-size: 0.75rem;
  line-height: 1.031rem;
  color: ${({ theme }) => theme.globalWhite};
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  justify-content: flex-start;
`;

const HapiButton = styled.a`
  min-height: 2.25rem;
  cursor: pointer;
  font-family: Arial;
  font-style: normal;
  font-weight: bold;
  font-size: .625rem;
  line-height: 0.688rem;
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.yellowHapi};
  border-radius: 8px;

  :visited, :hover {
    color: ${({ theme }) => theme.yellowHapi};
    & span {
      text-decoration: underline;
    }
  }
`;

const HapiLogoContainer = styled.div`
  background-color: ${({ theme }) => theme.yellowHapi};
  border-radius: 6px 0 0 6px;
`;

const HapiTitle = styled.p`
  color: ${({ theme }) => theme.yellowHapi};
  margin-block-start: 0;
  margin-block-end: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 0.375rem 0.313rem;
  white-space: nowrap;
`;

interface ISocialNetwork {
  Image: FunctionComponent<SVGProps<SVGSVGElement>>;
  title: string;
  href: string;
}
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
        <LogoContainer>
          <JumboLogo />
          <LogoTitle>Jumbo</LogoTitle>
        </LogoContainer>
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
        <LogoContainer>
          <JumboLogo />
          <LogoTitle>Jumbo</LogoTitle>
        </LogoContainer>
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
