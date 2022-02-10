import React, { Suspense, lazy } from 'react';
import Footer from 'components/Footer';
import { isMobile } from 'utils/userAgent';
import GifLoading from 'assets/gif/loading.gif';
import { ReactComponent as JumboLogo } from 'assets/images/jumbo-logo.svg';

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
  BlockButton,
  Body,
  LinkContainer,
  LoadingBlock,
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
        <LinkContainer>
          <Link to="/">
            <LogoContainer>
              <JumboLogo />
              {isMobile ? null : (<LogoTitle>jumbo</LogoTitle>)}
            </LogoContainer>
          </Link>
        </LinkContainer>
        <NavBar>
          <CustomLink to="swap">
            Swap
          </CustomLink>
          <CustomLink to="pool">
            Pool
          </CustomLink>
          <NavButton disabled>Staking</NavButton>
          <NavButton disabled>...</NavButton>
        </NavBar>
        <BlockButton>
          <ConnectionButton />
        </BlockButton>
      </Header>
      <Body>
        <Suspense fallback={<LoadingBlock><img src={GifLoading} alt="loading" /></LoadingBlock>}>
          <Routes>
            <Route path="pool" element={<Pool />} />
            <Route path="swap" element={<Swap />} />
            <Route path="pool/add-liquidity/:id" element={<Pool />} />
            <Route path="pool/remove-liquidity/:id" element={<Pool />} />
          </Routes>
        </Suspense>
      </Body>
      <Footer />
    </Container>
  );
}
