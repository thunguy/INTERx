import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { RegionDropdown } from 'react-country-region-selector';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { Button, TextField } from '@material-ui/core';

const ManageProviderDetails = (props) => {
  const { history } = props
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

  // BUTTON COMPONENT: submit to update user account information
  const UpdateDetails = () => {
    return (<Button type="submit" variant="outlined" color="primary">SAVE CHANGES</Button>)
  }

  const handleSubmit = (values, { setSubmitting }) => {
    values.npi = provider.npi
    console.log(values)

    fetch(`http://localhost:3000/providers/${provider.npi}`, {
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
          npi: provider.npi,
          fname: provider.fname,
          lname: provider.lname,
          credential: provider.credential,
          specialty: provider.specialty,
          sex: provider.sex,
          address: provider.address,
          city: provider.city,
          state: provider.state,
          zipcode: provider.zipcode,
          phone: provider.phone,
          virtualid: provider.virtualid,
          summary: provider.summary,
          // activities: provider.activities,
          // accepting_new_patients: provider.accepting_new_patients,
          // inperson: provider.inperson,
          // virtual: provider.virtual,
        }}
        onSubmit={handleSubmit}
      >
        {({values, handleChange, handleSubmit}) => {
          return (
            <form onSubmit={handleSubmit}>
              <Form>
                <p><TextField
                  label="NPI (cannot be modified)"
                  name="npi"
                  type="number"
                  value={provider.npi}
                  variant="outlined"
                  onChange={handleChange}
                  defaultValue={provider.npi}
                  InputProps={{readOnly: true}}
                  InputLabelProps={{shrink: true}}
                  fullWidth
                /></p>
                <p><TextField
                  label="FIRST NAME"
                  name="fname"
                  onChange={handleChange}
                  type="text"
                  value={values.fname}
                  variant="outlined"
                  placeholder={provider.fname}
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
                  placeholder={provider.lname}
                  InputLabelProps={{shrink: true}}
                  fullWidth
                /></p>
                <p><TextField
                  label="CREDENTIAL"
                  name="credential"
                  onChange={handleChange}
                  type="text"
                  value={values.credential}
                  variant="outlined"
                  placeholder={provider.credential}
                  InputLabelProps={{shrink: true}}
                  fullWidth
                /></p>
                <p><TextField
                  label="SPECIALTY"
                  name="specialty"
                  onChange={handleChange}
                  type="text"
                  value={values.specialty}
                  variant="outlined"
                  placeholder={provider.specialty}
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
                  placeholder={provider.address}
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
                  placeholder={provider.city}
                  InputLabelProps={{shrink: true}}
                  fullWidth
                /></p>
                <RegionDropdown
                  defaultOptionLabel={provider.state}
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
                  placeholder={provider.zipcode}
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
                  placeholder={provider.phone}
                  InputLabelProps={{shrink: true}}
                  fullWidth
                /></p>
                <div display="flex">
                  <FormControl component="fieldset">
                    <FormLabel component="legend">SEX</FormLabel>
                    <RadioGroup aria-label="sex" name="sex" onChange={handleChange} row>
                      <FormControlLabel value="Female" control={<Radio/>} label="Female" />
                      <FormControlLabel value="Male" control={<Radio/>} label="Male" />
                      <FormControlLabel value="Other" control={<Radio/>} label="Other" />
                    </RadioGroup>
                  </FormControl>
                </div>
                <p><TextField
                  label="VIRTUAL ID"
                  name="virtualid"
                  onChange={handleChange}
                  type="text"
                  value={values.virtualid}
                  variant="outlined"
                  placeholder={provider.virtualid}
                  InputLabelProps={{shrink: true}}
                  fullWidth
                /></p>
                <p><TextField
                  label="PROVIDER SUMMARY"
                  name="summary"
                  multiline
                  margin="dense"
                  value={values.summary}
                  placeholder={provider.summary ? provider.summary : "Introduce yourself..."}
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

ManageProviderDetails.propTypes = {
    history: PropTypes.object
};

export default withRouter(ManageProviderDetails);