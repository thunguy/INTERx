import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { PatientRegister, ProviderRegister, PatientLogin, ProviderLogin, SelectProvider, Homepage, TestSession } from './views';
// import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';


const Routes = () => {
    return (
        <Switch>
            <Redirect exact from="/" to="/home"/>

            <Route exact path="/home">
                <Homepage/>
            </Route>

            <Route exact path="/patients/register">
              <PatientRegister/>
            </Route>

            <Route exact path="/providers/register">
              <ProviderRegister/>
            </Route>

            <Route exact path="/patients/login">
              <PatientLogin/>
            </Route>

            <Route exact path="/providers/login">
              <ProviderLogin/>
            </Route>

            <Route exact path="/patients/select-provider">
              <SelectProvider/>
            </Route>

            <Route exact path="/test-session">
              <TestSession/>
            </Route>
        </Switch>
    );
};

export default Routes;