import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Grid, Button, TextField } from '@material-ui/core';
import DatePicker from "react-datepicker"
import { setHours, setMinutes, getDay, setMilliseconds } from 'date-fns';
import { Formik } from 'formik';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';
import '../../../../index.css';


const isWeekday = (date) => {
  const day = getDay(date);
  return day !== 0;
};

const fetchAndSet = (url, setter) => {
  fetch(url)
  .then((response) => response.json())
  .then((result) => {
    console.log(result);
    return setter(result);
  });
};

// COMPONENT: appointment reason and patient goal form
const PatientText = (props) => {
  return (
    <div>
      <Grid container direction="row" spacing={2} justify="center" alignItems="stretch">
        <Grid item xs>
          <TextField
            required
            multiline
            name="reason"
            value={props.reason}
            label="Appointment Reason:"
            placeholder="What is the reason for this appointment? Please be descriptive and provide any information the patient would like their provider to know (e.g. medical history, allergies, restrictions, medication, etc.)."
            rows={4}
            fullWidth
            variant="outlined"
            onChange={props.onChange}
          />
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={2} justify="center" alignItems="stretch">
        <Grid item xs>
          <TextField
            required
            multiline
            name="goal"
            value={props.goal}
            label="Patient Goal:"
            placeholder="What are the patient's goals and desired outcomes for this appointment?"
            rows={4}
            fullWidth
            variant="outlined"
            onChange={props.onChange}
          />
        </Grid>
      </Grid>
    </div>
  );
}

// BUTTON COMPONENT: book appointment with provider
const Book = ({fname, lname, credential}) => {
return (<Button type="submit" variant="outlined" color="primary" >BOOK: {fname} {lname}, {credential}</Button>)
}

const BookAppointment = ({provider, patient, activity, history}) => {

  const [patientAppts, setPatientAppts] = useState([]);
  const [providerAppts, setProviderAppts] = useState([]);

  useEffect(() => fetchAndSet('/appointments', setPatientAppts), []);
  useEffect(() => fetchAndSet(`/providers/${provider.npi}/appointments`, setProviderAppts), []);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
  }

  const handleSubmit = (values, { setSubmitting }) => {

    values.end = moment(values.start).add(45, 'm').toDate();
    values.location = `${provider.address}, ${provider.city}, ${provider.state}, ${provider.zipcode}`
    values.npi = provider.npi
    values.patientid = patient.patientid
    values.activityid = activity
    values.status = 'Scheduled'
    console.log(values)

    fetch('http://localhost:3000/appointments', {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      mode: 'cors',
      body: JSON.stringify(values)
    })
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch(console.error)
    // alert(JSON.stringify(values, null, 2));
    setSubmitting(false);
    history.push('/patients/view-appointments')
  };

  return (
    <div style={{ textAlign: 'center', color: '#000000', backgroundColor: '#FFFFFF' }}>
      <Formik
        initialValues={{
          start: isWeekday(today) ? today : tomorrow,
          reason: '',
          goal: '',
        }}
        onSubmit={handleSubmit}
      >
        {({values, handleChange, handleSubmit, setFieldValue}) => {
          console.log(values.start)
          return (
            <div className="schedule-module">
              <form onSubmit={handleSubmit}>
                <Grid container direction="row" justify="center" alignItems="center">
                  <Grid item xs>
                    <DatePicker
                      selected={values.start}
                      onChange={(value) => setFieldValue("start", setMilliseconds(value, 0))}
                      minDate={new Date()}
                      showTimeSelect
                      inline
                      timeIntervals={60}
                      filterDate={isWeekday}
                      minTime={setHours(setMinutes(new Date(), 0), 8)}
                      maxTime={setHours(setMinutes(new Date(), 30), 18)}
                      excludeTimes={providerAppts.map((appt) => new Date(appt.start)).filter((date) => isSameDay(date, values.start))}
                      dateFormat="MMMM d, yyyy h:mm aa"
                    />
                  </Grid>
                  <Grid item xs>
                    <PatientText onChange={handleChange}/>
                  </Grid>
                </Grid>
                <br/>
                <Book fname={provider.fname} lname={provider.lname} credential={provider.credential}/>
              </form>
            </div>
          )
        }}
      </Formik>
    </div>
  );
};

BookAppointment.propTypes = {
  history: PropTypes.object
};

export default withRouter(BookAppointment);