import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {
  Redirect, Route, BrowserRouter as Router, Switch,
} from 'react-router-dom';
import { LANDING } from 'utils/routes';
import Landing from 'components/Landing';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path={LANDING}><Landing /></Route>
        <Redirect to={LANDING} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);
