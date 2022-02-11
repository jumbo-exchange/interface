import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {
  Route, BrowserRouter as Router, Routes,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { StoreContextProvider, ModalsContextProvider } from 'store';

import Landing from 'pages/Landing';
import theme from 'theme';
import useFullHeightHook from 'hooks/useFullHeightHook';

import App from 'pages/App';
import Error from 'pages/Error';

const AppWrapper = () => {
  useFullHeightHook();

  return (
    <ThemeProvider theme={theme}>
      <StoreContextProvider>
        <Router>
          <ModalsContextProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/app/*" element={<App />} />
              <Route path="/*" element={<Error />} />
            </Routes>
          </ModalsContextProvider>
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
