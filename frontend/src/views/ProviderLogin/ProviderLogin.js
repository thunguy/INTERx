import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button, IconButton, TextField, Link, Typography } from '@material-ui/core';
import { FcLeft } from 'react-icons/fc';
import '../../index.css';


const schema = {
  username: {
    presence: { allowEmpty: false, message: 'is required' },
    // email: true,
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

const ProviderLogin = props => {
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
        [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };

  const handleProviderLogin = event => {
    event.preventDefault();

    fetch('http://localhost:3000/providers/login', {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      mode: 'cors',
      body: JSON.stringify(formState.values)
    })
    .then((response) => {
      if (response.status === 200)
        history.push('/providers/view-schedule')
      else
        history.push('/providers/login')
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
        <form onSubmit={handleProviderLogin}>
          <h1><center>PROVIDER LOGIN</center></h1>
          <p><TextField
            error={hasError('username')}
            fullWidth
            helperText={hasError('username') ? formState.errors.username[0] : null}
            label="USERNAME"
            name="username"
            onChange={handleChange}
            type="text"
            value={formState.values.username || ''}
            variant="outlined"
          /></p>
          <p><TextField
            error={hasError('password')}
            fullWidth
            helperText={hasError('password') ? formState.errors.password[0] : null}
            label="PASSWORD"
            name="password"
            onChange={handleChange}
            type="password"
            value={formState.values.password || ''}
            variant="outlined"
          /></p>
          <Button color="primary" disabled={!formState.isValid} fullWidth size="large" type="submit" variant="contained"> LOG IN </Button>
          <Typography color="textSecondary" variant="body1">
            <h5><center> DON'T HAVE AN ACCOUNT{' '} <Link component={RouterLink} to="/providers/register"> PROVIDER REGISTRATION </Link></center></h5>
          </Typography>
        </form>
      </div>
      <div>
        <img id="login-photo" src="/photo5.jpg"/>
      </div>
    </div>
  );
};

ProviderLogin.propTypes = {
  history: PropTypes.object
};

export default withRouter(ProviderLogin);