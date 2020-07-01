import React, { useState, useEffect } from "react";
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const PatientDashboard = (props) => {
  const { history } = props;
  const [patient, setPatient] = useState({})
  const [appointments, setAppointments] = useState({})
  const [providers, setProviders] = useState({})

  // fetch user in session object
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

  // fetch all user in session appointments
  useEffect(() => {
    fetch('/appointments')
    .then((response) => response.json())
    .then((result) => setAppointments(result))
    .catch(console.error)
  }, [])

  // fetch all user in session medical relationships
  useEffect(() => {
    fetch('/medical-relations')
    .then((response) => response.json())
    .then((result) => setProviders(result))
    .catch(console.error)
  }, [])

  return(
    <div>
      {/* <p>{JSON.stringify(appointments, null, 2)}</p>
      <p>{JSON.stringify(providers, null, 2)}</p>
      <p>{JSON.stringify(patient, null, 2)}</p> */}
    </div>
  )
}

PatientDashboard.propTypes = {
  history: PropTypes.object
};

export default withRouter(PatientDashboard);