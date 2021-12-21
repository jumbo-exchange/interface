import React, { Dispatch, SetStateAction, useState } from 'react';
import Footer from 'components/Footer';
import { ButtonPrimary } from 'components/Button';
import { ReactComponent as JumboLogo } from 'assets/images/jumbo-logo.svg';

import { isMobile, isTablet } from 'utils/userAgent';
import { StatusLink } from 'store';
import Swap from 'pages/Swap';
import {
  Container,
  Header,
  MobileHeader,
  UpperRow,
  LowerRow,
  LogoContainer,
  LogoTitle,
  NavBar,
  NavButton,
  WalletIcon,
  Body,
} from './styles';

interface INavigation {
  currentTab: StatusLink,
  setCurrentTab: Dispatch<SetStateAction<StatusLink>>,
}

const Navigation = ({ currentTab, setCurrentTab }:INavigation) => (
  <NavBar>
    <NavButton
      isActive={currentTab === StatusLink.Swap}
      onClick={() => setCurrentTab(StatusLink.Swap)}
    >Swap
    </NavButton>
    <NavButton
      isActive={currentTab === StatusLink.Pool}
      onClick={() => setCurrentTab(StatusLink.Pool)}
    >Pool
    </NavButton>
    <NavButton
      isActive={currentTab === StatusLink.Farm}
      onClick={() => setCurrentTab(StatusLink.Farm)}
    >Farm
    </NavButton>
  </NavBar>
);

function CurrentTab({ currentTab }: { currentTab: StatusLink }) {
  switch (currentTab) {
    case StatusLink.Pool:
      return <p>Pool</p>;
    case StatusLink.Farm:
      return <p>Farm</p>;
    default:
      return <Swap />;
  }
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<StatusLink>(StatusLink.Swap);

  return (
    <Container>

      {isMobile || isTablet
        ? (
          <MobileHeader>
            <UpperRow>
              <LogoContainer>
                <JumboLogo />
                {isMobile ? null : (<LogoTitle>jumbo</LogoTitle>)}
              </LogoContainer>
              <ButtonPrimary>
                <WalletIcon />
                {isMobile ? 'Connect' : 'Connect wallet'}
              </ButtonPrimary>
            </UpperRow>
            <LowerRow>
              <Navigation
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
            </LowerRow>
          </MobileHeader>
        )
        : (
          <Header>
            <LogoContainer>
              <JumboLogo />
              {isMobile ? null : (<LogoTitle>jumbo</LogoTitle>)}
            </LogoContainer>
            <Navigation
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
            <ButtonPrimary>
              <WalletIcon />
              {isMobile ? 'Connect' : 'Connect wallet'}
            </ButtonPrimary>
          </Header>
        )}

      <Body>
        <CurrentTab currentTab={currentTab} />
      </Body>
      <Footer />
    </Container>
  );
}
