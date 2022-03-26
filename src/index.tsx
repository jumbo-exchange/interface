import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {
  Route, BrowserRouter as Router, Routes,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { StoreContextProvider } from 'store';
import 'react-toastify/dist/ReactToastify.css';

import Landing from 'pages/Landing';
import theme from 'theme';
import useFullHeightHook from 'hooks/useFullHeightHook';
import App from 'pages/App';
import { ALL_MATCH, LANDING } from 'utils/routes';

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import './i18n';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_ENV,
  // dsn: process.env.REACT_APP_NEAR_ENV === 'mainnet' ? process.env.REACT_APP_SENTRY_ENV : '',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});

const AppWrapper = () => {
  useFullHeightHook();

  return (
    <ThemeProvider theme={theme}>
      <StoreContextProvider>
        <Router>
          <Routes>
            <Route path={LANDING} element={<Landing />} />
            <Route path={ALL_MATCH} element={<App />} />
          </Routes>
        </Router>
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
