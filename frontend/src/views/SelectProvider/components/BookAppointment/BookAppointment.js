import React, { Fragment, useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, TextField } from '@material-ui/core';
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';
import './style.css';
import { setHours, setMinutes, getDay, setMilliseconds } from 'date-fns';
import { Formik } from 'formik';
import moment from 'moment';


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
      <div>
        <TextField
          required
          multiline
          margin="dense"
          name="reason"
          value={props.reason}
          label="Appointment Reason:"
          placeholder="What is the reason for this appointment? Please be descriptive and provide any information the patient would like their provider to know (e.g. patient medical history, allergies, restrictions, concerns, prescriptions, supplements, etc.)."
          rows={4}
          variant="outlined"
          fullWidth
          onChange={props.onChange}
        />
        <TextField
          required
          multiline
          margin="dense"
          name="goal"
          value={props.goal}
          label="Patient Goal:"
          placeholder="What are the patient's goals and desired outcomes for this appointment?"
          rows={4}
          variant="outlined"
          fullWidth
          onChange={props.onChange}
        />
      </div>
    </div>
  );
}


// COMPONENT: book appointment with provider
const Book = ({fname}) => {
  return (<Button type="submit" variant="outlined" color="primary">BOOK {fname}</Button>)
}


const BookAppointment = ({provider, patient, activity}) => {

  const [patientAppts, setPatientAppts] = useState([]);
  const [providerAppts, setProviderAppts] = useState([]);

  console.log(activity, 'line74')

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

    alert(JSON.stringify(values, null, 2));
    setSubmitting(false);
  };

  return (
    <div
      style={{
        fontSize: 70,
        textAlign: 'center',
        color: '#E53935',
        backgroundColor: '#FFFFFF',
      }}
    >
      {provider.fname}'S AVAILABILITY
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
            <form onSubmit={handleSubmit}>
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
              <PatientText onChange={handleChange}/>
              <Book fname={provider.fname}/>
            </form>
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