import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

// import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import { PatientRegister, ProviderRegister } from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/providers/register"/>

      <Route exact path="/patients/register">
        <PatientRegister/>
      </Route>

      <Route exact path="/providers/register">
        <ProviderRegister/>
      </Route>

      {/* <Route exact path="/patients/login">
        <PatientLogin/>
      </Route> */}

      {/* <Route exact path="/providers/login">
        <ProviderLogin/>
      </Route> */}
    </Switch>
  );
};

export default Routes;