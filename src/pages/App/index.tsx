import React, { Suspense, lazy } from 'react';
import Footer from 'components/Footer';
import { ReactComponent as JumboLogo } from 'assets/images/jumbo-logo.svg';
import { isMobile } from 'utils/userAgent';

import {
  Route, Routes, useMatch, useResolvedPath, Link,
} from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
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

function CustomLink({
  children, to,
}: LinkProps) {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <Link to={to}>
      <NavButton
        isActive={Boolean(match)}
      >
        {children}
      </NavButton>
    </Link>
  );
}

export default function App() {
  return (
    <Container>
      <Header>
        <LogoContainer>
          <JumboLogo />
          {isMobile ? null : (<LogoTitle>jumbo</LogoTitle>)}
        </LogoContainer>
        <NavBar>
          <CustomLink to="swap">
            Swap
          </CustomLink>
          <CustomLink to="pool">
            Pool
          </CustomLink>
          <CustomLink to="farm">
            Farm
          </CustomLink>
        </NavBar>
        <ConnectionButton />
      </Header>
      <Body>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="pool" element={<Pool />} />
            <Route path="swap" element={<Swap />} />
          </Routes>
        </Suspense>
      </Body>
      <Footer />
    </Container>
  );
}
