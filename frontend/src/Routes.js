import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

// import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import { Register } from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/register"/>
      <Route exact path="/register">
        <Register/>
      </Route>
    </Switch>
  );
};

export default Routes;