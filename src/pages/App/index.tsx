import React, { Dispatch, SetStateAction, useState } from 'react';
import Swap from 'pages/Swap';
import Footer from 'components/Footer';
import { ReactComponent as JumboLogo } from 'assets/images/jumbo-logo.svg';

import { isMobile } from 'utils/userAgent';
import { StatusLink } from 'store';
import {
  Container,
  Header,
  LogoContainer,
  LogoTitle,
  NavBar,
  NavButton,
  Body,
} from './styles';
import ConnectionButton from './ConnectionButton';

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

      <Header>
        <LogoContainer>
          <JumboLogo />
          {isMobile ? null : (<LogoTitle>jumbo</LogoTitle>)}
        </LogoContainer>
        <Navigation
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
        <ConnectionButton />
      </Header>

      <Body>
        <CurrentTab currentTab={currentTab} />
      </Body>
      <Footer />
    </Container>
  );
}
