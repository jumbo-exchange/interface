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

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path={LANDING}><Landing /></Route>
          <Redirect to={LANDING} />
        </Switch>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
