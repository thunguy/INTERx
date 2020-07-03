
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button, IconButton, TextField, Link, Select, FormHelperText, Checkbox, Typography } from '@material-ui/core';
import { FcLeft } from 'react-icons/fc';
import { RegionDropdown } from 'react-country-region-selector';
import '../../index.css';

const PatientRegister = (props) => {
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
    history.goBack('/');
  };

  const handlePatientRegister = (event) => {
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
      headers: {'Content-Type': 'application/json'},
      mode: 'cors',
      body: JSON.stringify(formState.values),
    })
    .then((response) => response.json())
    .then((data) => console.log('Success', data))
    .catch((error) => console.error('Error', error))
    event.preventDefault();
    history.push('/patients/login');
  };

  const hasError = (field) =>
    formState.touched[field] && formState.errors[field] ? true : false;

  return (
    <div>
      <div>
        <IconButton onClick={handleBack}> <FcLeft/> </IconButton>
      </div>
      <div>
        <form onSubmit={handlePatientRegister}>
          <h1><center>PATIENT REGISTRATION</center></h1>
          <Grid container spacing={1} direction="row" justify="center" alignItems="center">
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
            <Grid item xs={6}>
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
              <FormControl variant="outlined">
                <Select native value={formState.values.state || ''} onChange={handleChange} name="state">
                  <option>STATE</option><option value="AL">AL</option><option value="AK">AK</option><option value="AZ">AZ</option><option value="AR">AR</option><option value="CA">CA</option><option value="CO">CO</option><option value="CT">CT</option><option value="DE">DE</option><option value="DC">DC</option><option value="FL">FL</option><option value="GA">GA</option><option value="HI">HI</option><option value="ID">ID</option><option value="IL">IL</option><option value="IN">IN</option><option value="IA">IA</option><option value="KS">KS</option><option value="KY">KY</option><option value="LA">LA</option><option value="ME">ME</option><option value="MD">MD</option><option value="MA">MA</option><option value="MI">MI</option><option value="MN">MN</option><option value="MS">MS</option><option value="MO">MO</option><option value="MT">MT</option><option value="NE">NE</option><option value="NV">NV</option><option value="NH">NH</option><option value="NJ">NJ</option><option value="NM">NM</option><option value="NY">NY</option><option value="NC">NC</option><option value="ND">ND</option><option value="OH">OH</option><option value="OK">OK</option><option value="OR">OR</option><option value="PA">PA</option><option value="RI">RI</option><option value="SC">SC</option><option value="SD">SD</option><option value="TN">TN</option><option value="TX">TX</option><option value="UT">UT</option><option value="VT">VT</option><option value="VA">VA</option><option value="WA">WA</option><option value="WV">WV</option><option value="WI">WI</option><option value="WY">WY</option><option value="AS">AS</option><option value="FM">FM</option><option value="GU">GU</option><option value="MH">MH</option><option value="MP">MP</option><option value="PW">PW</option><option value="PR">PR</option><option value="VI">VI</option><option value="AA">AA</option><option value="AE">AE</option><option value="AP">AP</option>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
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
          <Grid container>
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
          </Grid>
          <br/>
          <Grid container spacing={1} direction="row" justify="center" alignItems="center">
            <Grid item xs>
              <TextField
                required
                error={hasError('dob')}
                fullWidth
                helperText={ hasError('dob') ? formState.errors.dob[0] : null }
                label="BIRTHDAY"
                name="dob"
                onChange={handleChange}
                type="date"
                defaultValue="new Date()"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
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
          <Button color="primary" disabled={!formState.isValid} size="large" type="submit" variant="contained" fullWidth> REGISTER </Button>
          <h5><center> HAVE AN ACCOUNT?{' '} <Link component={RouterLink} to="/patients/login"> PATIENT LOGIN </Link></center></h5>
        </form>
      </div>
    </div>
  );
};

PatientRegister.propTypes = {
  history: PropTypes.object
};

export default withRouter(PatientRegister);