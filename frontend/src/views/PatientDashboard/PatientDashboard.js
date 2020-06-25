import React, { useState, useEffect } from "react";
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';


const PatientDashboard = (props) => {
  const { history } = props;
  const [patient, setPatient] = useState({})
  const [appointments, setAppointments] = useState({})
  const [providers, setProviders] = useState({})

  // fetch session object and appointments of user in session
  useEffect(() => {
    fetch('/session')
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result;
    })
    .then((result) => fetch(`/patients/${result.patientid}`))
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      return result
    })
    .then((result) => setPatient(result))
    .catch(console.error)
  }, [])

  // fetch all user's appointments
  useEffect(() => {
    fetch('/appointments')
    .then((response) => response.json())
    .then((result) => setAppointments(result))
    .catch(console.error)
  }, [])

  // fetch all user's medical relationships
  useEffect(() => {
    fetch('/medical-relations')
    .then((response) => response.json())
    .then((result) => setProviders(result))
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
      .then((data) => console.log('Success', data))
      .catch((error) => console.error('Error', error))
      event.preventDefault();
      history.push('/');
    };
    return (<div><Button color="primary" onClick={handleLogout}>LOGOUT</Button></div>)
  }

  return(
    <div>
      <p>{JSON.stringify(patient, null, 2)}</p>
      <p>{JSON.stringify(appointments, null, 2)}</p>
      <p>{JSON.stringify(providers, null, 2)}</p>
      <Logout/>
    </div>
  )
}

PatientDashboard.propTypes = {
  history: PropTypes.object
};

export default withRouter(PatientDashboard);