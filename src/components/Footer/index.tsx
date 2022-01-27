import React, { FunctionComponent, SVGProps } from 'react';
import styled from 'styled-components';
import { isMobile } from 'utils/userAgent';
import { ReactComponent as TelegramImg } from 'assets/images/Telegram.svg';
import { ReactComponent as TwitterImg } from 'assets/images/Twitter.svg';
import { ReactComponent as MediumImg } from 'assets/images/Medium.svg';
import { ReactComponent as JumboLogo } from 'assets/images/jumbo-logo.svg';
import { ReactComponent as HapiLogo } from 'assets/images/hapi-logo.svg';

const Container = styled.footer`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  white-space: nowrap;
  color: ${({ theme }) => theme.globalWhite};
  padding-bottom: 41px;
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
  margin: ${isMobile ? '24px 0' : '0'};
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  & > svg {
    margin-right: 4px;
    width: 19px;
    height: 15px;
    path {
      fill: ${({ theme }) => theme.greyFooterLogo};
    }
  }
`;

const LogoTitle = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 1rem;
  line-height: 20px;
  color: ${({ theme }) => theme.greyFooterLogo};
`;

const SocialNetworkContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 32px;
  padding: 0 31px;
  background: ${({ theme }) => theme.greySocialNetworkBg};
`;

const ChildSocialNetwork = styled.a`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 15px 18px;
  text-decoration: none;
  & > div {
    margin-top: 8px;
    font-style: normal;
    font-weight: 300;
    font-size: 0.75rem;
    line-height: 17px;
    text-align: center;
    color: ${({ theme }) => theme.globalWhite};
  }
`;

const TextContainer = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 0.75rem;
  line-height: 17px;
  color: ${({ theme }) => theme.globalWhite};
`;

const HapiButton = styled.a`
  min-height: 2.25rem;
  cursor: pointer;
  font-family: Arial;
  font-style: normal;
  font-weight: bold;
  font-size: .625rem;
  line-height: 11px;
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.yellowHapi};
  border-radius: 8px;
  :hover {
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
  padding: 6px 5px;
  white-space: nowrap;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
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
    href: 'https://t.me/jumbo_ann',
  },
  {
    Image: TwitterImg,
    title: 'Twitter',
    href: 'https://twitter.com/jumbo_exchange',
  },
  {
    Image: MediumImg,
    title: 'Medium',
    href: 'https://medium.com/jumbo-dex',
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
        <HapiButton>
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
        <HapiButton>
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
