import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { Select, Grid, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { Button, TextField } from '@material-ui/core';
import '../../index.css';


const ManagePatientDetails = ({history}) => {
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

  // BUTTON COMPONENT: submit to update user account information
  const UpdateDetails = () => {
    return (<Button type="submit" variant="outlined" color="primary" fullWidth>SAVE CHANGES</Button>)
  }

  // HANDLE SUBMIT ACTION:
  const handleSubmit = (values, { setSubmitting }) => {
    values.patientid = patient.patientid
    console.log(values)

    fetch(`http://localhost:3000/patients/${patient.patientid}`, {
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
    history.go(0)
  };

  return (
    <div>
      <Formik
        initialValues={{
          fname: patient.fname,
          lname: patient.lname,
          dob: patient.dob,
          sex: patient.sex,
          address: patient.address,
          city: patient.city,
          state: patient.state,
          zipcode: patient.zipcode,
          phone: patient.phone,
          virtualid: patient.virtualid,
          summary: patient.summary
        }}
        onSubmit={handleSubmit}
      >
        {({values, handleChange, handleSubmit}) => {
          return (
            <form onSubmit={handleSubmit}>
              <h2><center>UPDATE PATIENT INFORMATION</center></h2>
              <Form>
                <Grid container spacing={2} direction="row" justify="center" alignItems="center">
                  <Grid item xs>
                    <TextField
                      label="FIRST NAME"
                      name="fname"
                      onChange={handleChange}
                      type="text"
                      value={values.fname}
                      variant="outlined"
                      placeholder={patient.fname}
                      InputLabelProps={{shrink: true}}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      label="LAST NAME"
                      name="lname"
                      onChange={handleChange}
                      type="text"
                      value={values.lname}
                      variant="outlined"
                      placeholder={patient.lname}
                      InputLabelProps={{shrink: true}}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <br/>
                <Grid container>
                  <Grid item xs={12}>
                    <TextField
                      label="ADDRESS"
                      name="address"
                      onChange={handleChange}
                      type="text"
                      value={values.address}
                      variant="outlined"
                      placeholder={patient.address}
                      InputLabelProps={{shrink: true}}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <br/>
                <Grid container spacing={2} direction="row" justify="center" alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      label="CITY"
                      name="city"
                      onChange={handleChange}
                      type="text"
                      value={values.city}
                      variant="outlined"
                      placeholder={patient.city}
                      InputLabelProps={{shrink: true}}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs>
                    <FormControl variant="outlined">
                      <Select native value={values.state} onChange={handleChange} name="state">
                        <option value={patient.state}>{patient.state}</option><option value="AL">AL</option><option value="AK">AK</option><option value="AZ">AZ</option><option value="AR">AR</option><option value="CA">CA</option><option value="CO">CO</option><option value="CT">CT</option><option value="DE">DE</option><option value="DC">DC</option><option value="FL">FL</option><option value="GA">GA</option><option value="HI">HI</option><option value="ID">ID</option><option value="IL">IL</option><option value="IN">IN</option><option value="IA">IA</option><option value="KS">KS</option><option value="KY">KY</option><option value="LA">LA</option><option value="ME">ME</option><option value="MD">MD</option><option value="MA">MA</option><option value="MI">MI</option><option value="MN">MN</option><option value="MS">MS</option><option value="MO">MO</option><option value="MT">MT</option><option value="NE">NE</option><option value="NV">NV</option><option value="NH">NH</option><option value="NJ">NJ</option><option value="NM">NM</option><option value="NY">NY</option><option value="NC">NC</option><option value="ND">ND</option><option value="OH">OH</option><option value="OK">OK</option><option value="OR">OR</option><option value="PA">PA</option><option value="RI">RI</option><option value="SC">SC</option><option value="SD">SD</option><option value="TN">TN</option><option value="TX">TX</option><option value="UT">UT</option><option value="VT">VT</option><option value="VA">VA</option><option value="WA">WA</option><option value="WV">WV</option><option value="WI">WI</option><option value="WY">WY</option><option value="AS">AS</option><option value="FM">FM</option><option value="GU">GU</option><option value="MH">MH</option><option value="MP">MP</option><option value="PW">PW</option><option value="PR">PR</option><option value="VI">VI</option><option value="AA">AA</option><option value="AE">AE</option><option value="AP">AP</option>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="ZIP CODE"
                      name="zipcode"
                      onChange={handleChange}
                      type="text"
                      value={values.zipcode}
                      variant="outlined"
                      placeholder={patient.zipcode}
                      InputLabelProps={{shrink: true}}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <br/>
                <Grid container spacing={2} direction="row" justify="center" alignItems="center">
                  <Grid item xs>
                    <TextField
                      label="PRIMARY PHONE"
                      name="phone"
                      onChange={handleChange}
                      type="tel"
                      value={values.phone}
                      variant="outlined"
                      placeholder={patient.phone}
                      InputLabelProps={{shrink: true}}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      label="VIRTUAL ID"
                      name="virtualid"
                      onChange={handleChange}
                      type="text"
                      value={values.virtualid}
                      variant="outlined"
                      placeholder={patient.virtualid}
                      InputLabelProps={{shrink: true}}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <br/>
                <Grid container spacing={2} direction="row" justify="center" alignItems="center">
                  <Grid item xs>
                    <TextField
                      label="BIRTHDATE"
                      name="dob"
                      onChange={handleChange}
                      type="date"
                      variant="outlined"
                      value={values.dob}
                      InputLabelProps={{shrink: true}}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">SEX</FormLabel>
                      <RadioGroup aria-label="sex" name="sex" onChange={handleChange} row>
                        <FormControlLabel value="Female" control={<Radio/>} label="Female" labelPlacement="start"/>
                        <FormControlLabel value="Male" control={<Radio/>} label="Male" labelPlacement="start"/>
                        <FormControlLabel value="Other" control={<Radio/>} label="Other" labelPlacement="start"/>
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
                <br/>
                <Grid container>
                  <Grid item xs={12}>
                    <TextField
                      label="PATIENT SUMMARY"
                      name="summary"
                      multiline
                      margin="dense"
                      value={values.summary}
                      placeholder={patient.summary ? patient.summary : "Introduce yourself..."}
                      rows={4}
                      variant="outlined"
                      fullWidth
                      onChange={handleChange}
                      InputLabelProps={{shrink: true}}
                    />
                  </Grid>
                </Grid>
                <br/>
                <UpdateDetails/>
              </Form>
            </form>
          )
        }}
      </Formik>
    </div>
  )
}

ManagePatientDetails.propTypes = {
    history: PropTypes.object
};

export default withRouter(ManagePatientDetails);