import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {
  Redirect, Route, BrowserRouter as Router, Switch,
} from 'react-router-dom';
import { LANDING } from 'utils/routes';
import Landing from 'pages/Landing';
import { ThemeProvider } from 'styled-components';
import theme from 'theme';
import useFullHeightHook from 'hooks/useFullHeightHook';

import App from 'pages/App';

const AppWrapper = ({ children }: {children: JSX.Element[]}) => {
  useFullHeightHook();

  return (
    <ThemeProvider theme={theme}>
      <App />
      {/* <Router>
        <Switch>{ children } </Switch>
      </Router> */}
    </ThemeProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <AppWrapper>
      {/* <Route path={LANDING} component={Landing} />
      <Redirect to={LANDING} /> */}
    </AppWrapper>
  </React.StrictMode>,
  document.getElementById('root'),
);
