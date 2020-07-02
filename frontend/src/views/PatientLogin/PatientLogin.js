import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { Button, IconButton, TextField, Link, Typography } from '@material-ui/core';
import { FcLeft } from 'react-icons/fc';

const schema = {
  username: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const PatientLogin = (props) => {
  const { history } = props;

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleBack = () => {
    history.goBack('/');
  };

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handlePatientLogin = event => {
    event.preventDefault();

    fetch('http://localhost:3000/patients/login', {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      mode: 'cors',
      body: JSON.stringify(formState.values)
    })
    .then((response) => {
      if (response.status === 200)
        history.push('/patients/dashboard')
      else
        history.push('/patients/login')
      return response.json()
    })
    .then((result) => console.log(result))
    .catch(console.error)
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div>
      <div>
        <IconButton onClick={handleBack}> <FcLeft/> </IconButton>
      </div>
      <div className="container">
        <form onSubmit={handlePatientLogin}>

          <Typography variant="h2">
            <center>PATIENT LOGIN</center>
          </Typography>

          <p><TextField
            error={hasError('username')}
            fullWidth
            helperText={
              hasError('username') ? formState.errors.username[0] : null
            }
            label="Username"
            name="username"
            onChange={handleChange}
            type="text"
            value={formState.values.username || ''}
            variant="outlined"
          /></p>
          <p><TextField
            error={hasError('password')}
            fullWidth
            helperText={
              hasError('password') ? formState.errors.password[0] : null
            }
            label="Password"
            name="password"
            onChange={handleChange}
            type="password"
            value={formState.values.password || ''}
            variant="outlined"
          /></p>
          <Button color="primary" disabled={!formState.isValid} fullWidth size="large" type="submit" variant="contained"> LOG IN </Button>
          <Typography color="textSecondary" variant="body1">
            <p>Don't have an account?{' '} <Link component={RouterLink} to="/patients/register" variant="h6"> Register </Link></p>
          </Typography>
        </form>
      </div>
      <div>
        <img id="login-photo" src="/photo5.jpg"/>
      </div>
    </div>
  );
};

PatientLogin.propTypes = {
  history: PropTypes.object
};

export default withRouter(PatientLogin);