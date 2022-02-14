import React, { Suspense, lazy } from 'react';
import Footer from 'components/Footer';
import { isMobile } from 'utils/userAgent';
import GifLoading from 'assets/gif/loading.gif';
import { ReactComponent as JumboLogo } from 'assets/images/jumbo-logo.svg';

import {
  Route, Routes, useMatch, useResolvedPath, Link, useLocation,
} from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import useTransactionHash from 'services/receiptsService';
import { wallet } from 'services/near';
import Error from 'pages/Error';
import {
  ALL_MATCH,
  LANDING,
  POOL,
  SWAP,
  toAddLiquidityPage,
  toRemoveLiquidityPage,
} from 'utils/routes';
import { RefreshContextProvider } from 'services/refreshService';
import { ModalsContextProvider, useStore } from 'store';
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
  const { search } = useLocation();
  useTransactionHash(search, wallet);
  const { updatePools, updateTokensBalances } = useStore();

  return (
    <RefreshContextProvider
      updatePools={updatePools}
      updateTokensBalances={updateTokensBalances}
    >
      <ModalsContextProvider>
        <Container>
          <Header>
            <LinkContainer>
              <Link to={LANDING}>
                <LogoContainer>
                  <JumboLogo />
                  {isMobile ? null : (<LogoTitle>jumbo</LogoTitle>)}
                </LogoContainer>
              </Link>
            </LinkContainer>
            <NavBar>
              <CustomLink to={SWAP}>
                Swap
              </CustomLink>
              <CustomLink to={POOL}>
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
            <Suspense fallback={(
              <LoadingBlock>
                <img src={GifLoading} alt="loading" />
              </LoadingBlock>
        )}
            >
              <Routes>
                <Route path={POOL} element={<Pool />} />
                <Route path={SWAP} element={<Swap />} />
                <Route path={toAddLiquidityPage()} element={<Pool />} />
                <Route path={toRemoveLiquidityPage()} element={<Pool />} />
                <Route path={ALL_MATCH} element={<Error />} />
              </Routes>
            </Suspense>
          </Body>
          <Footer />
        </Container>
      </ModalsContextProvider>
    </RefreshContextProvider>
  );
}
