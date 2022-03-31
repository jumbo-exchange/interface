import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import GifLoading from 'assets/gif/loading.gif';

import {
  Route, BrowserRouter as Router, Routes,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { StoreContextProvider } from 'store';
import 'react-toastify/dist/ReactToastify.css';

import theme from 'theme';
import useFullHeightHook from 'hooks/useFullHeightHook';
import App from 'pages/App';
import { ALL_MATCH, LANDING } from 'utils/routes';

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import './i18n';
import { LoadingBlock } from 'pages/App/styles';

Sentry.init({
  dsn: process.env.REACT_APP_NEAR_ENV === 'mainnet'
    ? 'https://55b37db9db874285be63ab7d133bcfc8@o1178607.ingest.sentry.io/6290446' : '',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});
const Landing = lazy(() => import('pages/Landing'));

const AppWrapper = () => {
  useFullHeightHook();

  return (
    <ThemeProvider theme={theme}>
      <StoreContextProvider>
        <Suspense fallback={(
          <LoadingBlock>
            <img src={GifLoading} alt="loading" />
          </LoadingBlock>
        )}
        >
          <Router>
            <Routes>
              <Route path={LANDING} element={<Landing />} />
              <Route path={ALL_MATCH} element={<App />} />
            </Routes>
          </Router>
        </Suspense>
      </StoreContextProvider>
    </ThemeProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
  document.getElementById('root'),
);
