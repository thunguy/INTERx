import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { PatientNavigationBar, ProviderNavigationBar } from './navbars';
import { WithNavigationBar } from './components';
import { PatientRegister,
         ProviderRegister,
         PatientLogin,
         ProviderLogin,
         SelectProvider,
         Homepage,
         PatientDashboard,
         ProviderDashboard,
         ManagePatientDetails,
         ManagePatientSecurity,
         ViewAppointments,
         ViewProviders,
         ManageProviderDetails,
         ManageProviderSecurity
        } from './views';

// import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';


const Routes = () => {
  return (
    <Switch>
      <Redirect exact from='/' to='/home'/>
      <Route exact path='/home'> <Homepage/> </Route>
      <Route exact path='/patients/register'> <PatientRegister/> </Route>
      <Route exact path='/providers/register'> <ProviderRegister/> </Route>
      <Route exact path='/patients/login'> <PatientLogin/> </Route>
      <Route exact path='/providers/login'> <ProviderLogin/> </Route>

      <WithNavigationBar exact path='/patients/dashboard' navbar={PatientNavigationBar} component={PatientDashboard}/>
      <WithNavigationBar exact path='/patients/select-provider' navbar={PatientNavigationBar} component={SelectProvider}/>
      <WithNavigationBar exact path='/patients/account-details' navbar={PatientNavigationBar} component={ManagePatientDetails}/>
      <WithNavigationBar exact path='/patients/manage-security' navbar={PatientNavigationBar} component={ManagePatientSecurity}/>
      <WithNavigationBar exact path='/patients/view-appointments' navbar={PatientNavigationBar} component={ViewAppointments}/>
      <WithNavigationBar exact path='/patients/view-providers' navbar={PatientNavigationBar} component={ViewProviders}/>

      <WithNavigationBar exact path='/providers/dashboard' navbar={ProviderNavigationBar} component={ProviderDashboard}/>
      <WithNavigationBar exact path='/providers/account-details' navbar={ProviderNavigationBar} component={ManageProviderDetails}/>
      <WithNavigationBar exact path='/providers/manage-security' navbar={ProviderNavigationBar} component={ManageProviderSecurity}/>
    </Switch>
  );
};

export default Routes;