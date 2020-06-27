import React, { useState, useEffect } from "react";
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';


const ProviderDashboard = (props) => {
  const { history } = props;
  const [provider, setProvider] = useState({})
  const [appointments, setAppointments] = useState({})
  const [patients, setPatients] = useState({})

  // fetch user in session object
  useEffect(() => {
    fetch('/session')
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .then((result) => fetch(`/providers/${result.npi}`))
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result
    })
    .then((result) => setProvider(result))
    .catch(console.error)
  }, [])

  // fetch all user in session appointments
  useEffect(() => {
    fetch('/appointments')
    .then((response) => response.json())
    .then((result) => setAppointments(result))
    .catch(console.error)
  }, [])

  // fetch all user in seesion medical relationships
  useEffect(() => {
    fetch('/medical-relations')
    .then((response) => response.json())
    .then((result) => setPatients(result))
    .catch(console.error)
  }, [])

  // COMPONENT: log out user button
  const Logout = () => {
    const handleLogout = (event) => {
      fetch('http://localhost:3000/logout', {
        method: 'DELETE',
        mode: 'cors',
      })
      .then((response) => response.json())
      .then((result) => console.log('Success', result))
      .catch((error) => console.error('Error', error))
      event.preventDefault();
      history.push('/');
    };
    return (<div><Button color="primary" onClick={handleLogout}>LOGOUT</Button></div>)
  }

  return (
    <div>
      <p>{JSON.stringify(provider, null, 2)}</p>
      <p>{JSON.stringify(appointments, null, 2)}</p>
      <p>{JSON.stringify(patients, null, 2)}</p>
      <Logout/>
    </div>
  )
}

ProviderDashboard.propTypes = {
  history: PropTypes.object
};

export default withRouter(ProviderDashboard);