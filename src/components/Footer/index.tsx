import React, { FunctionComponent, SVGProps } from 'react';
import styled from 'styled-components';
import { isMobile } from 'utils/userAgent';
import { ReactComponent as TelegramImg } from 'assets/images/Telegram.svg';
import { ReactComponent as TwitterImg } from 'assets/images/Twitter.svg';
import { ReactComponent as MediumImg } from 'assets/images/Medium.svg';
import { ReactComponent as JumboLogo } from 'assets/images/jumbo-logo.svg';

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
  justify-content: space-around;
  align-items: center;
  align-self: normal;
  white-space: nowrap;
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

const LogoTitle = styled.h1`
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
  & > div {
    margin-top: 8px;
    font-style: normal;
    font-weight: 300;
    font-size: .75rem;
    line-height: 17px;
    text-align: center;
  }
`;

const TextContainer = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: .75rem;
  line-height: 17px;
  color: ${({ theme }) => theme.globalWhite};
`;

interface ISocialNetwork {
  Image: FunctionComponent<SVGProps<SVGSVGElement>>,
  title: string;
}
const socialNetwork:ISocialNetwork[] = [
  {
    Image: TelegramImg,
    title: 'Telegram',
  },
  {
    Image: TwitterImg,
    title: 'Twitter',
  },
  {
    Image: MediumImg,
    title: 'Medium',
  },
];

export default function Footer() {
  return (isMobile ? (
    <ContainerMobile>
      <SocialNetworkContainer>
        {socialNetwork.map(({ Image, title }) => (
          <ChildSocialNetwork key={title}>
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
        <TextContainer>
          Copyright 2021
        </TextContainer>
      </ChildContainer>
    </ContainerMobile>
  )
    : (
      <Container>
        <LogoContainer>
          <JumboLogo />
          <LogoTitle>Jumbo</LogoTitle>
        </LogoContainer>
        <SocialNetworkContainer>
          {socialNetwork.map(({ Image, title }) => (
            <ChildSocialNetwork key={title}>
              <Image />
              <div>{title}</div>
            </ChildSocialNetwork>
          ))}
        </SocialNetworkContainer>
        <TextContainer>
          Copyright 2021
        </TextContainer>
      </Container>
    )
  );
}
