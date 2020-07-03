import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { Grid, Button, IconButton, TextField, Link, FormHelperText, Checkbox, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { FcLeft } from 'react-icons/fc';
import '../../index.css';
// import { makeStyles } from '@material-ui/styles';
// import validate from 'validate.js';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const ProviderRegister = (props) => {
  const { history } = props;

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    fetch("http://localhost:5000/activities")
    .then(response => response.json())
    .then(data => setFormState((formState) => {
      return {
        ...formState,
        "activities": data
      }
    }))
    .catch(error => console.log('error', error));
  }, [])

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
    if (event.target.name === 'npi' && event.target.value.length >= 10) {
      handleNPI(event.target.value);
    }
  };

  const handleNPI = (npi) => {
    fetch(`/api/?number=${npi}&version=2.1`)
    .then((response) => response.json())
    .then((data) => {
      console.log('Success', data);

      if (data.Errors)
        setFormState((formState) => ({
          ...formState,
          isValid: false,
          errors: {
            ...formState.errors,
            'npi': [data.Errors[0].description]
          }
        }));

      else if (data.results.length !== 0)
        setFormState((formState) => ({
          ...formState,
          values: {
            ...formState.values,
            'fname': data.results[0].basic.first_name,
            'lname': data.results[0].basic.last_name,
            'credential': data.results[0].basic.credential,
            'specialty': data.results[0].taxonomies[0].desc,
            'state': data.results[0].taxonomies[0].state            }
        }));

      else
        setFormState((formState) => ({
          ...formState,
          isValid: false,
          errors: {
            ...formState.errors,
            "npi": ["NPI does not exist"]
          }
        }));
    })
    .catch((error) => {
      console.error('Error', error);
    });
  };

  const handleBack = () => {
    history.goBack();
  };

  const handleProviderRegister = (event) => {
    if (formState.values.activities)
      formState.values.activities = formState.values.activities.map((activity) => activity.activityid)

    fetch('http://localhost:3000/providers', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      mode: 'cors',
      body: JSON.stringify(formState.values)
    })
    .then((response) => response.json())
    .then((data) => console.log('Success', data))
    .catch((error) => console.error('Error', error))
    event.preventDefault();
    history.push('/providers/login');
  };

  const hasError = (field) => {
    return formState.touched[field] && formState.errors[field] ? true : false;
  }

  return (
    <div>
      <IconButton onClick={handleBack}> <FcLeft/> </IconButton>
      <form onSubmit={handleProviderRegister}>
        <div className="provider-reg-title">PROVIDER REGISTRATION</div>
        <Grid container spacing={1} direction="row" justify="center" alignItems="center">
          <Grid item xs>
            <TextField
              required
              error={hasError('npi')}
              fullWidth
              helperText={ hasError('npi') ? formState.errors.npi[0] : null }
              label="NPI"
              name="npi"
              onChange={handleChange}
              type="text"
              value={formState.values.npi || ''}
              variant="outlined"
            />
          </Grid>
          <Grid item xs>
            <TextField
              required
              error={hasError('fname')}
              fullWidth
              helperText={ hasError('fname') ? formState.errors.fname[0] : null }
              label="FIRST NAME"
              name="fname"
              onChange={handleChange}
              type="text"
              value={formState.values.fname || ''}
              variant="outlined"
            />
          </Grid>
          <Grid item xs>
            <TextField
              required
              error={hasError('lname')}
              fullWidth
              helperText={ hasError('lname') ? formState.errors.lname[0] : null }
              label="LAST NAME"
              name="lname"
              onChange={handleChange}
              type="text"
              value={formState.values.lname || ''}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <br/>
        <Grid container spacing={1} direction="row" justify="center" alignItems="center">
          <Grid item xs>
            <TextField
              required
              error={hasError('specialty')}
              fullWidth
              helperText={ hasError('specialty') ? formState.errors.specialty[0] : null }
              label="SPECIALTY"
              name="specialty"
              onChange={handleChange}
              type="text"
              value={formState.values.specialty || ''}
              variant="outlined"
            />
          </Grid>
          <Grid item xs>
            <TextField
              required
              error={hasError('credential')}
              fullWidth
              helperText={ hasError('credential') ? formState.errors.credential[0] : null }
              label="CREDENTIAL"
              name="credential"
              onChange={handleChange}
              type="text"
              value={formState.values.credential || ''}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <br/>
        <Grid container>
          <Grid item xs>
            <TextField
              required
              error={hasError('email')}
              fullWidth
              helperText={ hasError('email') ? formState.errors.email[0] : null }
              label="EMAIL ADDRESS"
              name="email"
              onChange={handleChange}
              type="text"
              value={formState.values.email || ''}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <br/>
        <Grid container spacing={1} direction="row" justify="center" alignItems="center">
          <Grid item xs>
            <TextField
              required
              error={hasError('username')}
              fullWidth
              helperText={ hasError('username') ? formState.errors.username[0] : null }
              label="USERNAME"
              name="username"
              onChange={handleChange}
              type="text"
              value={formState.values.username || ''}
              variant="outlined"
            />
          </Grid>
          <Grid item xs>
            <TextField
              required
              error={hasError('password')}
              fullWidth
              helperText={ hasError('password') ? formState.errors.password[0] : null }
              label="PASSWORD"
              name="password"
              onChange={handleChange}
              type="password"
              value={formState.values.password || ''}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <br/>
        <Grid container>
          <Grid item xs>
            <TextField
              required
              error={hasError('address')}
              fullWidth
              helperText={ hasError('address') ? formState.errors.address[0] : null }
              label="ADDRESS"
              name="address"
              onChange={handleChange}
              type="text"
              value={formState.values.address || ''}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <br/>
        <Grid container spacing={1} direction="row" justify="center" alignItems="center">
          <Grid item xs>
            <TextField
              required
              error={hasError('city')}
              fullWidth
              helperText={ hasError('city') ? formState.errors.city[0] : null }
              label="CITY"
              name="city"
              onChange={handleChange}
              type="text"
              value={formState.values.city || ''}
              variant="outlined"
            />
          </Grid>
          <Grid item xs>
            <TextField
              required
              error={hasError('state')}
              fullWidth
              helperText={ hasError('state') ? formState.errors.state[0] : null }
              label="STATE"
              name="state"
              onChange={handleChange}
              type="text"
              value={formState.values.state || ''}
              variant="outlined"
            />
          </Grid>
          <Grid item xs>
            <TextField
              required
              error={hasError('zipcode')}
              fullWidth
              helperText={ hasError('zipcode') ? formState.errors.zipcode[0] : null }
              label="ZIP CODE"
              name="zipcode"
              onChange={handleChange}
              type="text"
              value={formState.values.zipcode || ''}
              variant="outlined"
            />
          </Grid>
        </Grid>
        <br/>
        <Grid container spacing={1} direction="row" justify="center" alignItems="center">
          <Grid item xs>
            <TextField
              required
              error={hasError('phone')}
              fullWidth
              helperText={ hasError('phone') ? formState.errors.phone[0] : null }
              label="PRIMARY PHONE"
              name="phone"
              onChange={handleChange}
              type="text"
              value={formState.values.phone || ''}
              variant="outlined"
            />
          </Grid>
          <Grid item xs>
            <FormControl component="fieldset" required>
            <FormLabel component="legend">SEX</FormLabel>
              <RadioGroup aria-label="sex" name="sex" onChange={handleChange} row>
                <FormControlLabel value="Female" control={<Radio />} label="FEMALE" labelPlacement="start"/>
                <FormControlLabel value="Male" control={<Radio />} label="MALE" labelPlacement="start"/>
                <FormControlLabel value="Other" control={<Radio />} label="OTHER" labelPlacement="start"/>
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <br/>
        <Grid container>
          <Grid item xs>
            <Autocomplete
              multiple
              options={formState.activities || []}
              onChange={(event, values) => {
                event.target = {name: 'activities', value: values}
                handleChange(event);
              }}
              disableCloseOnSelect
              getOptionLabel={(option) => option.activityid}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                    {option.activityid}
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="ACTIVITIES" placeholder="Add an Activity" fullWidth/>
              )}
            />
          </Grid>
        </Grid>
        <br/>
        <Button color="primary" disabled={!formState.isValid} size="large" type="submit" variant="contained" fullWidth> REGISTER </Button>
        <Typography color="textSecondary" variant="body1">
          <h5><center> HAVE AN ACCOUNT{' '} <Link component={RouterLink} to="/providers/login"> PROVIDER LOGIN </Link></center></h5>
        </Typography>
      </form>
    </div>
  );
};

ProviderRegister.propTypes = {
  history: PropTypes.object
};

export default withRouter(ProviderRegister);