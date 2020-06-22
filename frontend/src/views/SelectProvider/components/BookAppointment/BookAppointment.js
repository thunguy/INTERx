import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { Grid, Button, IconButton, TextField, Link, FormHelperText, Checkbox, Typography } from '@material-ui/core';
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes, getDay }from 'date-fns'
import { Formik } from 'formik';
import moment from 'moment';


const isWeekday = (date) => {
  const day = getDay(date);
  return day !== 0;
};


// COMPONENT: book appointment with provider
const Book = ({fname}) => {

  return (
    <Button
      type="submit"
      variant="outlined"
      color="primary"
      // onClick={}
    >
      BOOK {fname}
    </Button>
  )
}


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


const BookAppointment = (props) => {

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const handleSubmit = (values, { setSubmitting }) => {
    values.end = moment(values.start).add(45, 'm').toDate();
    values.location = `${props.provider.address}, ${props.provider.city}, ${props.provider.state}, ${props.provider.zipcode}`
    values.npi = props.provider.npi
    console.log(values)
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
      {props.provider.fname}'S AVAILABILITY
      <Formik
        initialValues={{
          start: isWeekday(today) ? today : tomorrow,
          reason: '',
          goal: ''
        }}
        onSubmit={handleSubmit}
      >
        {({values, handleChange, handleSubmit, setFieldValue}) => {

          return (
            <form onSubmit={handleSubmit}>
              <DatePicker
                selected={values.start}
                onChange={(value) => setFieldValue("start", value)}
                minDate={new Date()}
                showTimeSelect
                inline
                timeIntervals={60}
                filterDate={isWeekday}
                minTime={setHours(setMinutes(new Date(), 0), 8)}
                maxTime={setHours(setMinutes(new Date(), 30), 18)}
                dateFormat="MMMM d, yyyy h:mm aa"
              />
              <PatientText onChange={handleChange}/>
              <Book fname={props.provider.fname}/>
            </form>
          )}
        }
      </Formik>
    </div>
  );
};

BookAppointment.propTypes = {
  history: PropTypes.object
};

export default BookAppointment;