import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { Grid, Button, TextField } from '@material-ui/core';
import '../../index.css';


const ManageProviderSecurity= ({history}) => {
  const [provider, setProvider] = useState({})

  // fetch session object and appointments of user in session
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

  // BUTTON COMPONENT: submit to update user password
  const UpdatePassword = () => {
    return (<Button type="submit" variant="outlined" color="primary" fullWidth>UPDATE PASSWORD</Button>)
  }

  // HANDLE PASSWORD UPDATE SUBMISSION: post fetch request to update user password
  const handleUpdatePassword = (values, { setSubmitting }) => {
    values.npi = provider.npi
    console.log(values)

    fetch(`http://localhost:3000/providers/${provider.npi}/update-password`, {
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
    return (<Button type="submit" variant="outlined" color="primary" fullWidth>UPDATE EMAIL</Button>)
  }

  // HANDLE EMAIL UPDATE SUBMISSION: post fetch request to update user email
  const handleUpdateEmail = (values, { setSubmitting }) => {
    values.npi = provider.npi
    console.log(values)

    fetch(`http://localhost:3000/providers/${provider.npi}/update-email`, {
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
                <h2><center>UPDATE LOGIN PASSWORD</center></h2>
                <Form>
                  <Grid container spacing={2} direction="row" justify="center" alignItems="center">
                    <Grid item xs>
                      <TextField
                        label="CURRENT PASSWORD"
                        name="old_password"
                        onChange={handleChange}
                        type="password"
                        value={values.old_password}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        label="NEW PASSWORD"
                        name="new_password"
                        onChange={handleChange}
                        type="password"
                        value={values.new_password}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <br/>
                  <UpdatePassword/>
                </Form>
              </form>
            )
          }}
        </Formik>
      </div>
      <br/><br/>
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
                <h2><center>UPDATE CONTACT EMAIL</center></h2>
                <Form>
                  <Grid container spacing={2} direction="row" justify="center" alignItems="center">
                    <Grid item xs>
                      <TextField
                        label="CURRENT EMAIL"
                        name="old_email"
                        onChange={handleChange}
                        type="email"
                        value={values.old_email}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} direction="row" justify="center" alignItems="center">
                    <Grid item xs>
                      <TextField
                        label="NEW EMAIL"
                        name="new_email"
                        onChange={handleChange}
                        type="email"
                        value={values.new_email}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} direction="row" justify="center" alignItems="center">
                    <Grid item xs>
                      <TextField
                        label="CURRENT PASSWORD"
                        name="password"
                        onChange={handleChange}
                        type="password"
                        value={values.password}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <br/>
                  <UpdateEmail/>
                </Form>
              </form>
            )
          }}
        </Formik>
      </div>
    </div>
  )
}

ManageProviderSecurity.propTypes = {
  history: PropTypes.object
};

export default withRouter(ManageProviderSecurity);