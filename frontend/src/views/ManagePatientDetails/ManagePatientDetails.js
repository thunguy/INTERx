import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { RegionDropdown } from 'react-country-region-selector';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { Grid, Button, TextField, IconButton, Link, FormHelperText, Checkbox, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const ManagePatientDetails = (props) => {
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


  // BUTTON COMPONENT: submit to update user account information
  const UpdateDetails = () => {
    return (<Button type="submit" variant="outlined" color="primary">SAVE CHANGES</Button>)
  }


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
              <Form>
                <p><TextField
                  label="FIRST NAME"
                  name="fname"
                  onChange={handleChange}
                  type="text"
                  value={values.fname}
                  variant="outlined"
                  placeholder={patient.fname}
                  InputLabelProps={{shrink: true}}
                  fullWidth
                /></p>
                <p><TextField
                  label="LAST NAME"
                  name="lname"
                  onChange={handleChange}
                  type="text"
                  value={values.lname}
                  variant="outlined"
                  placeholder={patient.lname}
                  InputLabelProps={{shrink: true}}
                  fullWidth
                /></p>
                <p><TextField
                  label="ADDRESS"
                  name="address"
                  onChange={handleChange}
                  type="text"
                  value={values.address}
                  variant="outlined"
                  placeholder={patient.address}
                  InputLabelProps={{shrink: true}}
                  fullWidth
                /></p>
                <p><TextField
                  label="CITY"
                  name="city"
                  onChange={handleChange}
                  type="text"
                  value={values.city}
                  variant="outlined"
                  placeholder={patient.city}
                  InputLabelProps={{shrink: true}}
                  fullWidth
                /></p>
                <RegionDropdown
                  defaultOptionLabel={patient.state}
                  name="state"
                  country="United States"
                  labelType="full"
                  valueType="short"
                  value={values.state}
                  onChange={(_, e) => handleChange(e)}
                />
                <p><TextField
                  label="ZIP CODE"
                  name="zipcode"
                  onChange={handleChange}
                  type="text"
                  value={values.zipcode}
                  variant="outlined"
                  placeholder={patient.zipcode}
                  InputLabelProps={{shrink: true}}
                  fullWidth
                /></p>
                <p><TextField
                  label="PRIMARY PHONE"
                  name="phone"
                  onChange={handleChange}
                  type="tel"
                  value={values.phone}
                  variant="outlined"
                  placeholder={patient.phone}
                  InputLabelProps={{shrink: true}}
                  fullWidth
                /></p>
                <p><TextField
                  label="VIRTUAL ID"
                  name="virtualid"
                  onChange={handleChange}
                  type="text"
                  value={values.virtualid}
                  variant="outlined"
                  placeholder={patient.virtualid}
                  InputLabelProps={{shrink: true}}
                  fullWidth
                /></p>
                <p><TextField
                  label="BIRTHDATE"
                  name="dob"
                  onChange={handleChange}
                  type="date"
                  variant="outlined"
                  InputLabelProps={{shrink: true}}
                  fullWidth
                /></p>
                <FormControl component="fieldset">
                  <FormLabel component="legend">SEX</FormLabel>
                  <RadioGroup aria-label="sex" name="sex" onChange={handleChange} row>
                    <FormControlLabel value="Female" control={<Radio/>} label="Female" />
                    <FormControlLabel value="Male" control={<Radio/>} label="Male" />
                    <FormControlLabel value="Other" control={<Radio/>} label="Other" />
                  </RadioGroup>
                </FormControl>
                <p><TextField
                  multiline
                  margin="dense"
                  name="summary"
                  value={values.summary}
                  label="PATIENT SUMMARY"
                  placeholder={patient.summary ? patient.summary : "Introduce yourself..."}
                  rows={4}
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  InputLabelProps={{shrink: true}}
                /></p>
                <center><UpdateDetails/></center>
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