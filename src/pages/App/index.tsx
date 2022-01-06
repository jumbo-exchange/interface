import React, {
  Dispatch, SetStateAction, useState, Suspense, lazy,
} from 'react';
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

const Swap = lazy(() => import('pages/Swap'));
const Pool = lazy(() => import('pages/Pool'));

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
      return <Pool />;
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
        <Suspense fallback={<div>Loading...</div>}>
          <CurrentTab currentTab={currentTab} />
        </Suspense>
      </Body>
      <Footer />
    </Container>
  );
}
