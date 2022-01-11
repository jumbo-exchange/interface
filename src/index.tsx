import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {
  Route, BrowserRouter as Router, Routes,
} from 'react-router-dom';
import { LANDING } from 'utils/routes';
import { ThemeProvider } from 'styled-components';
import { StoreContextProvider, ModalsContextProvider } from 'store';

import Landing from 'pages/Landing';
import theme from 'theme';
import useFullHeightHook from 'hooks/useFullHeightHook';

import App from 'pages/App';

const AppWrapper = () => {
  useFullHeightHook();

  return (
    <ThemeProvider theme={theme}>
      <StoreContextProvider>
        <ModalsContextProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/app/*" element={<App />} />
            </Routes>
          </Router>
        </ModalsContextProvider>
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
