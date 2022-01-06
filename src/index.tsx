import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {
  Redirect, Route, BrowserRouter as Router, Switch,
} from 'react-router-dom';
import { LANDING } from 'utils/routes';
import Landing from 'components/Landing';
import { ThemeProvider } from 'styled-components';
import theme from 'theme';
import useFullHeightHook from 'hooks/useFullHeightHook';

const AppWrapper = ({ children }: {children: JSX.Element[]}) => {
  useFullHeightHook();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>{ children } </Switch>
      </Router>
    </ThemeProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <AppWrapper>
      <Route path={LANDING} component={Landing} />
      <Redirect to={LANDING} />
    </AppWrapper>
  </React.StrictMode>,
  document.getElementById('root'),
);
