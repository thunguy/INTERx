import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { Grid, Select, Button, TextField, FormControl, FormLabel, RadioGroup, Checkbox, FormControlLabel, Radio } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import '../../index.css';
import ProviderRegister from '../ProviderRegister/ProviderRegister';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const ManageProviderDetails = ({history}) => {
  const [provider, setProvider] = useState({})
  const [allActivities, setAllActivities] = useState([])
  const [values, setValues] = useState({})
  const [links, setLinks] = useState([])

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

  // fetch list of activities
  useEffect(() => {
    fetch("/activities")
    .then((response) => response.json())
    .then((result) => setAllActivities(result))
    .catch(error => console.log('error', error));
  }, [])

  // fetch list of user's activities
  useEffect(() => {
    fetch("/providers/activities")
    .then((response) => response.json())
    .then((result) => {
      console.log(result)
      return result
    })
    .then((result) => setLinks(result))
    .catch(error => console.log('error', error));
  }, [])

  const handleChange = (event) => {
    event.persist();
    const {name, value, type, checked} = event.target

    type === 'checkbox' ? setValues({ [name]: checked }) : setValues({ [name]: value })
    // if (type === 'checkbox')
    // return setValues({ [name]: checked })
    // return setValues({ [name]: value })
  }

  // BUTTON COMPONENT: submit to update user account information
  const UpdateDetails = () => {
    return (<Button type="submit" variant="outlined" color="primary" fullWidth>SAVE CHANGES</Button>)
  }

  // BUTTON COMPONENT: update to ADD activities to provider's list of activities
  const AddActivities = () => {
    return (<Button type="submit" variant="outlined" color="primary" fullWidth>ADD ACTIVITIES</Button>)
  }

  // BUTTON COMPONENT: update to REMOVE activities to provider's list of activities
  const RemoveActivities = () => {
    return (<Button type="submit" variant="outlined" color="primary" fullWidth>REMOVE ACTIVITIES</Button>)
  }

  const handleRemoveActivities = (values, { setSubmitting }) => {
    values.npi = provider.npi
    values.activities = values.activities.map((activity) => activity.activityid)
    console.log(values)

    fetch(`/providers/${provider.npi}/delete-activities`, {
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
  }

  const handleSubmit = (values, { setSubmitting }) => {
    values.npi = provider.npi

    if (values.activities)
      values.activities = values.activities.map((activity) => activity.activityid)

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
    history.go(0)
  };

  return (
    <div>
      <h2><center>UPDATE PROVIDER ACTIVITIES</center></h2>
      <Grid container spacing={2} direction="row" justify="center" alignItems="stretch">
        <Grid item xs>
          <Formik initialValues={{ activities: provider.activities }} onSubmit={handleSubmit}>
            {({values, handleChange, handleSubmit}) => {
              return (
                <form onSubmit={handleSubmit}>
                  <Form>
                    <Autocomplete
                      multiple
                      options={allActivities.filter((activity) => !links.find(({ activityid }) => activity.activityid === activityid))|| []}
                      onChange={(event, values) => {
                        event.target = {name: 'activities', value: values}
                        handleChange(event);
                      }}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.activityid}
                      renderOption={(option, { selected }) => (
                        <React.Fragment>
                          <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                            {option.activityid}
                        </React.Fragment>
                      )}
                      style={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} variant="outlined" label="ADD ACTIVITIES" placeholder="Add an Activity"/>
                      )}
                    />
                    <br/>
                    <AddActivities/>
                  </Form>
                </form>
              )
            }}
          </Formik>
        </Grid>
        <Grid item xs>
          <Formik initialValues={{ activities: provider.activities }} onSubmit={handleRemoveActivities}>
            {({values, handleChange, handleRemoveActivities}) => {
              return (
                <form onSubmit={handleRemoveActivities}>
                  <Form>
                    <Grid item xs>
                      <Autocomplete
                        multiple
                        options={links || []}
                        onChange={(event, values) => {
                          event.target = {name: 'activities', value: values}
                          handleChange(event);
                        }}
                        disableCloseOnSelect
                        getOptionLabel={(option) => option.activityid}
                        renderOption={(option, { selected }) => (
                          <React.Fragment>
                            <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected}/>
                              {option.activityid}
                          </React.Fragment>
                        )}
                        style={{ width: 300 }}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" label="REMOVE ACTIVITIES" placeholder="Remove an Activity"/>
                        )}
                      />
                    </Grid>
                    <br/>
                    <RemoveActivities/>
                  </Form>
                </form>
              )
            }}
          </Formik>
        </Grid>
      </Grid>
      <br/><br/>
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
          // accepting_new_patients: provider.accepting_new_patients,
          // inperson: provider.inperson,
          // virtual: provider.virtual,
        }}
        onSubmit={handleSubmit}
      >
        {({values, handleChange, handleSubmit}) => {
          return (
            <form onSubmit={handleSubmit}>
              <h3><center>UPDATE PROVIDER INFORMATION</center></h3>
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
                      placeholder={provider.fname}
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
                      placeholder={provider.lname}
                      InputLabelProps={{shrink: true}}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <br/>
                <Grid container spacing={2} direction="row" justify="center" alignItems="center">
                  <Grid item xs>
                    <TextField
                      label="SPECIALTY"
                      name="specialty"
                      onChange={handleChange}
                      type="text"
                      value={values.specialty}
                      variant="outlined"
                      placeholder={provider.specialty}
                      InputLabelProps={{shrink: true}}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField
                      label="CREDENTIAL"
                      name="credential"
                      onChange={handleChange}
                      type="text"
                      value={values.credential}
                      variant="outlined"
                      placeholder={provider.credential}
                      InputLabelProps={{shrink: true}}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <br/>
                <Grid container direction="row" justify="center" alignItems="center">
                  <Grid item xs>
                    <TextField
                      label="ADDRESS"
                      name="address"
                      onChange={handleChange}
                      type="text"
                      value={values.address}
                      variant="outlined"
                      placeholder={provider.address}
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
                      placeholder={provider.city}
                      InputLabelProps={{shrink: true}}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs>
                    <FormControl variant="outlined">
                      <Select native value={values.state} onChange={handleChange} name="state">
                        <option value={provider.state}>{provider.state}</option><option value="AL">AL</option><option value="AK">AK</option><option value="AZ">AZ</option><option value="AR">AR</option><option value="CA">CA</option><option value="CO">CO</option><option value="CT">CT</option><option value="DE">DE</option><option value="DC">DC</option><option value="FL">FL</option><option value="GA">GA</option><option value="HI">HI</option><option value="ID">ID</option><option value="IL">IL</option><option value="IN">IN</option><option value="IA">IA</option><option value="KS">KS</option><option value="KY">KY</option><option value="LA">LA</option><option value="ME">ME</option><option value="MD">MD</option><option value="MA">MA</option><option value="MI">MI</option><option value="MN">MN</option><option value="MS">MS</option><option value="MO">MO</option><option value="MT">MT</option><option value="NE">NE</option><option value="NV">NV</option><option value="NH">NH</option><option value="NJ">NJ</option><option value="NM">NM</option><option value="NY">NY</option><option value="NC">NC</option><option value="ND">ND</option><option value="OH">OH</option><option value="OK">OK</option><option value="OR">OR</option><option value="PA">PA</option><option value="RI">RI</option><option value="SC">SC</option><option value="SD">SD</option><option value="TN">TN</option><option value="TX">TX</option><option value="UT">UT</option><option value="VT">VT</option><option value="VA">VA</option><option value="WA">WA</option><option value="WV">WV</option><option value="WI">WI</option><option value="WY">WY</option><option value="AS">AS</option><option value="FM">FM</option><option value="GU">GU</option><option value="MH">MH</option><option value="MP">MP</option><option value="PW">PW</option><option value="PR">PR</option><option value="VI">VI</option><option value="AA">AA</option><option value="AE">AE</option><option value="AP">AP</option>
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
                      placeholder={provider.zipcode}
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
                      placeholder={provider.phone}
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
                      placeholder={provider.virtualid}
                      InputLabelProps={{shrink: true}}
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <br/>
                <Grid container spacing={2} direction="row" justify="center" alignItems="center">
                  <Grid item xs>
                    <TextField
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
                    />
                  </Grid>
                  <Grid item xs>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">SEX</FormLabel>
                      <RadioGroup name="sex" onChange={handleChange} row>
                        <FormControlLabel value="Female" control={<Radio/>} label="Female" labelPlacement="start"/>
                        <FormControlLabel value="Male" control={<Radio/>} label="Male" labelPlacement="start"/>
                        <FormControlLabel value="Other" control={<Radio/>} label="Other" labelPlacement="start"/>
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
                <br/>
                <Grid container direction="row" justify="center" alignItems="center">
                  <Grid item xs>
                    <TextField
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
    </div>
  )
}

ManageProviderDetails.propTypes = {
    history: PropTypes.object
};

export default withRouter(ManageProviderDetails);