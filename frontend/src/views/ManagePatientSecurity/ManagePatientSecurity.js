import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { Grid, Button, TextField, IconButton, Link, FormHelperText, Checkbox, Typography } from '@material-ui/core';

const ManagePatientSecurity= (props) => {
  const {history} = props
  const [patient, setPatient] = useState({})


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


  // BUTTON COMPONENT: submit to update user password
  const UpdatePassword = () => {
    return (<Button type="submit" variant="outlined" color="primary">CHANGE PASSWORD</Button>)
  }

  const handleUpdatePassword = (values, { setSubmitting }) => {
    values.patientid = patient.patientid
    console.log(values)

    fetch(`http://localhost:3000/patients/${patient.patientid}/update-password`, {
      method: 'PUT',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      mode: 'cors',
      body: JSON.stringify(values)
    })
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch(console.error)

    alert(JSON.stringify(values, null, 2));
    setSubmitting(false);
  };


  // BUTTON COMPONENT: submit to update user email
  const UpdateEmail = () => {
    return (<Button type="submit" variant="outlined" color="primary">CHANGE EMAIL</Button>)
  }

  const handleUpdateEmail = (values, { setSubmitting }) => {
    values.patientid = patient.patientid
    console.log(values)

    fetch(`http://localhost:3000/patients/${patient.patientid}/update-email`, {
      method: 'PUT',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      mode: 'cors',
      body: JSON.stringify(values)
    })
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch(console.error)

    alert(JSON.stringify(values, null, 2));
    setSubmitting(false);
  };

  return (
    <div>
      <div>
        <Formik
          initialValues={{
            old_password: '',
            new_password: ''
          }}
          onSubmit={handleUpdatePassword}
        >
          {({values, handleChange, handleUpdatePassword}) => {
            return (
              <form onSubmit={handleUpdatePassword}>
                <Form>
                  <p><TextField
                    label="Old Password"
                    name="old_password"
                    onChange={handleChange}
                    type="password"
                    value={values.old_password}
                    variant="outlined"
                    fullWidth
                  /></p>
                  <p><TextField
                    label="New Password"
                    name="new_password"
                    onChange={handleChange}
                    type="password"
                    value={values.new_password}
                    variant="outlined"
                    fullWidth
                  /></p>
                  <center><UpdatePassword/></center>
                </Form>
              </form>
            )
          }}
        </Formik>
      </div>
      <br/>
      <br/>
      <br/>
      <br/>
      <div>
        <Formik
          initialValues={{
            old_email: '',
            new_email: '',
            password: ''
          }}
          onSubmit={handleUpdateEmail}
        >
          {({values, handleChange, handleUpdateEmail}) => {
            return (
              <form onSubmit={handleUpdateEmail}>
                <Form>
                  <p><TextField
                    label="Old Email"
                    name="old_email"
                    onChange={handleChange}
                    type="email"
                    value={values.old_email}
                    variant="outlined"
                    fullWidth
                  /></p>
                  <p><TextField
                    label="New Email"
                    name="new_email"
                    onChange={handleChange}
                    type="email"
                    value={values.new_email}
                    variant="outlined"
                    fullWidth
                  /></p>
                  <p><TextField
                    label="Current Password"
                    name="password"
                    onChange={handleChange}
                    type="password"
                    value={values.password}
                    variant="outlined"
                    fullWidth
                  /></p>
                  <center><UpdateEmail/></center>
                </Form>
              </form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

ManagePatientSecurity.propTypes = {
  history: PropTypes.object
};

export default withRouter(ManagePatientSecurity);