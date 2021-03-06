import React, { Suspense, lazy } from 'react';
import Footer from 'components/Footer';
import { isMobile } from 'utils/userAgent';
import GifLoading from 'assets/gif/loading.gif';
import { ReactComponent as JumboLogo } from 'assets/images/jumbo-logo.svg';

import {
  Route, Routes, useMatch, useResolvedPath, Link, useLocation,
} from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import useTransactionHash from 'services/helpers/receiptsService';
import { wallet } from 'services/near';

import {
  ALL_MATCH,
  LANDING,
  POOL,
  SWAP,
  toAddLiquidityPage,
  toRemoveLiquidityPage,
  toStakePage,
  toUnStakeAndClaimPage,
} from 'utils/routes';
import { RefreshContextProvider } from 'services/helpers/refreshService';
import { ModalsContextProvider, useStore } from 'store';
import { ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Menu from 'components/Menu';
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
const Error = lazy(() => import('pages/Error'));

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
  const { t } = useTranslation();
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
                {t('general.swap')}
              </CustomLink>
              <CustomLink to={POOL}>
                {t('general.pool')}
              </CustomLink>
              <NavButton disabled>{t('general.staking')}</NavButton>
            </NavBar>
            <BlockButton>
              <ConnectionButton />
            </BlockButton>
            <Menu />
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
                <Route path={toStakePage()} element={<Pool />} />
                <Route path={toUnStakeAndClaimPage()} element={<Pool />} />
                <Route path={ALL_MATCH} element={<Error />} />
              </Routes>
            </Suspense>
          </Body>
          <Footer />
          <ToastContainer />
        </Container>
      </ModalsContextProvider>
    </RefreshContextProvider>
  );
}
