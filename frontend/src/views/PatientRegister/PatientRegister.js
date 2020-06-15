
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button, IconButton, TextField, Link, FormHelperText, Checkbox, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const schema = {
    fname: {
      presence: { allowEmpty: false, message: 'is required' },
      length: {
        maximum: 32
      }
    },
    lname: {
      presence: { allowEmpty: false, message: 'is required' },
      length: {
        maximum: 32
      }
    },
    email: {
      presence: { allowEmpty: false, message: 'is required' },
      email: true,
      length: {
        maximum: 64
      }
    },
    username: {
      presence: { allowEmpty: false, message: 'is required' },
      length: {
        maximum: 128
      }
    },
    password: {
      presence: { allowEmpty: false, message: 'is required' },
      length: {
        maximum: 128
      }
    },
    dob: {
      presence: { allowEmpty: false, message: 'is required' },
      length: {
        maximum: 128
      }
    },
    sex: {
      presence: { allowEmpty: false, message: 'is required' },
      length: {
        maximum: 128
      }
    },
    policy: {
      presence: { allowEmpty: false, message: 'is required' },
      checked: true
    }
  };

  // const Register = (props) => {
  //   const history = props.history;

  const Register = (props) => {
    const {history} = props;

    const [formState, setFormState] = useState({
      isValid: false,
      values: {},
      touched: {},
      errors: {}
    });

    useEffect(() => {
      // const errors = validate(formState.values, schema);
      const errors = null;

      setFormState((formState) => ({
        ...formState,
        isValid: errors ? false : true,
        errors: errors || {}
      }));
    }, [formState.values]);

    const handleChange = (event) => {
      event.persist();
      console.log('line 91', event.target.name, event.target.value);
      setFormState((formState) => ({
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

    const handleBack = () => {
      history.goBack();
    };

    const handleRegister = (event) => {
      console.log('An essay was submitted:');
      console.log('An essay was submitted:', event);
      console.log('An essay was submitted:', formState);

      // const data = {
      //   fname: formState.values.fname,
      //   lname: formState.values.lname,
      //   email: formState.values.email,
      //   username: formState.values.username,
      //   password: formState.values.password,
      //   dob: formState.values.dob,
      //   sex: formState.values.sex
      // };

      console.log('line 129', JSON.stringify(formState.values, null, 2))

      fetch('http://localhost:5000/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(formState.values),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success', data);
      })
      .catch((error) => {
        console.error('Error', error);
      });

      event.preventDefault();
      history.push('/');
    };

    const hasError = (field) =>
      formState.touched[field] && formState.errors[field] ? true : false;

    return (
      <div>
        <div>
          <div>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
          </div>
          <div>
            <form onSubmit={handleRegister}>
              <Typography variant="h2">
                <center>NEW PATIENT</center>
              </Typography>
              <TextField
                error={hasError('fname')}
                fullWidth
                helperText={
                  hasError('fname') ? formState.errors.fname[0] : null
                }
                label="First name"
                name="fname"
                onChange={handleChange}
                type="text"
                value={formState.values.fname || ''}
                variant="outlined"
              />

              <TextField
                error={hasError('lname')}
                fullWidth
                helperText={
                  hasError('lname') ? formState.errors.lname[0] : null
                }
                label="Last name"
                name="lname"
                onChange={handleChange}
                type="text"
                value={formState.values.lname || ''}
                variant="outlined"
              />

              <TextField
                error={hasError('email')}
                fullWidth
                helperText={
                  hasError('email') ? formState.errors.email[0] : null
                }
                label="Email address"
                name="email"
                onChange={handleChange}
                type="text"
                value={formState.values.email || ''}
                variant="outlined"
              />

              <TextField
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
              />

              <TextField
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
              />

              <TextField
                error={hasError('dob')}
                fullWidth
                helperText={
                  hasError('dob') ? formState.errors.dob[0] : null
                }
                label="Birthdate"
                name="dob"
                onChange={handleChange}
                type="date"
                defaultValue="new Date()"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                error={hasError('address')}
                fullWidth
                helperText={
                  hasError('address') ? formState.errors.address[0] : null
                }
                label="Address"
                name="address"
                onChange={handleChange}
                type="text"
                value={formState.values.address || ''}
                variant="outlined"
              />

              <TextField
                error={hasError('city')}
                fullWidth
                helperText={
                  hasError('city') ? formState.errors.city[0] : null
                }
                label="City"
                name="city"
                onChange={handleChange}
                type="text"
                value={formState.values.city || ''}
                variant="outlined"
              />

              <TextField
                error={hasError('state')}
                fullWidth
                helperText={
                  hasError('state') ? formState.errors.state[0] : null
                }
                label="State"
                name="state"
                onChange={handleChange}
                type="text"
                value={formState.values.state || ''}
                variant="outlined"
              />

              <TextField
                error={hasError('zipcode')}
                fullWidth
                helperText={
                  hasError('zipcode') ? formState.errors.zipcode[0] : null
                }
                label="Zip Code"
                name="zipcode"
                onChange={handleChange}
                type="text"
                value={formState.values.zipcode || ''}
                variant="outlined"
              />

              <TextField
                error={hasError('phone')}
                fullWidth
                helperText={
                  hasError('phone') ? formState.errors.phone[0] : null
                }
                label="Primary Phone"
                name="phone"
                onChange={handleChange}
                type="text"
                value={formState.values.phone || ''}
                variant="outlined"
              />

              <FormControl component="fieldset">
                <FormLabel component="legend">Sex</FormLabel>
                <RadioGroup aria-label="sex" name="sex" onChange={handleChange} row>
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Other" control={<Radio />} label="Other" />
                </RadioGroup>
              </FormControl>

              <div>
                <span>
                  <Checkbox
                    checked={formState.values.policy || false}
                    color="primary"
                    name="policy"
                    onChange={handleChange}
                  />
                    I have read the{' '}
                    <Link
                      color="primary"
                      component={RouterLink}
                      to="#"
                      underline="always"
                      variant="h6"
                    >
                      Terms and Conditions
                    </Link>
                </span>
              </div>
              {hasError('policy') && (
                <FormHelperText error>
                  {formState.errors.policy[0]}
                </FormHelperText>
              )}

              <Button
                color="primary"
                disabled={!formState.isValid}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Register
              </Button>

              <Typography
                color="textSecondary"
                variant="body1"
              >
                Have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/patients/login"
                  variant="h6"
                >
                  Log In
                </Link>
              </Typography>
            </form>
          </div>
        </div>
      </div>
    );
  };

  Register.propTypes = {
    history: PropTypes.object
  };

export default withRouter(Register);