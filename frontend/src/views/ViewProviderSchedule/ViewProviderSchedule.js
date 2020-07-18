import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { IoMdSkipForward, IoMdSkipBackward, IoIosArrowForward, IoIosArrowBack, IoMdClose } from "react-icons/io";
import { FaAngleDown, FaEyeSlash } from "react-icons/fa";
import { FcCancel, FcInfo, FcEmptyFilter, FcCheckmark } from "react-icons/fc";
import '../../index.css'

const ViewProviderSchedule = (props) => {
  const { history } = props;
  const [provider, setProvider] = useState({})
  const [appointments, setAppointments] = useState([])

  const getDuration = (datetime1, datetime2) => {
    return ((datetime2.getMinutes()) - (datetime1.getMinutes()))
  }

  // fetch user in session object
  useEffect(() => {
    fetch('/session')
    .then((response) => response.json())
    .then((result) => {console.log(result); return result})
    .then((result) => fetch(`/providers/${result.npi}`))
    .then((response) => response.json())
    .then((result) => {console.log(result); return result})
    .then((result) => setProvider(result))
    .catch(console.error)
  }, [])

  // fetch all user in session appointments
  useEffect(() => {
    fetch('/appointments')
    .then((response) => response.json())
    .then((result) => setAppointments(result))
    .catch(console.error)
  }, [])

  return (
    <div>
      {console.log(appointments)}
      <MaterialTable
        title="ALL APPOINTMENTS"
        options={{
          search: false,
          filtering: true,
          actionsColumnIndex: -1,
          pageSize: 10,
          sorting: false,
        }}
        icons={{
          ResetSearch: IoMdClose,
          FirstPage: IoMdSkipBackward,
          LastPage: IoMdSkipForward,
          NextPage: IoIosArrowForward,
          PreviousPage: IoIosArrowBack,
          Filter: FcEmptyFilter,
          SortArrow: FaAngleDown,
        }}
        columns={[
          { title: 'Date', field: 'date', type: 'date', cellStyle: {width: 150, minWidth: 150}, headerStyle: {width:150, minWidth: 150} },
          { title: 'Time', field: 'time', cellStyle: {width: 180, minWidth: 180}, headerStyle: {width: 180, minWidth: 180} },
          { title: 'Duration', field: 'duration', filtering: false, cellStyle: {width: 110, minWidth: 110}, headerStyle: {width:110, minWidth: 110} },
          { title: 'Patient (ID)', field: 'patient', cellStyle: {width: 200, minWidth: 200}, headerStyle: {width:200, minWidth: 200} },
          { title: 'Birthdate', field: 'dob', cellStyle: {width: 120, minWidth: 120}, headerStyle: {width:120, minWidth: 120} },
          { title: 'Activity', field: 'activityid', cellStyle: {width: 200, minWidth: 200}, headerStyle: {width:200, minWidth: 200}},
          { title: 'Status', field: 'status', cellStyle: {width: 100, maxWidth: 100}, headerStyle: {width:100, maxWidth: 100} },
        ]}
        data={appointments.map((appointment) => ({
          ...appointment,
          patient: `${appointment.patient} (${appointment.patientid})`,
          dob: `${new Date(appointment.dob).toLocaleDateString('en-US', {timeZone: 'UTC'})}`,
          date: `${new Date(appointment.start).toLocaleString('en-us', {  weekday: 'short' })} ${new Date(appointment.start).toLocaleDateString()}`,
          time: `${new Date(appointment.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(appointment.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
          duration: `${getDuration(new Date(appointment.start), new Date(appointment.end))} minutes`
        }))}
        actions={[
          (rowData) => ({
            icon: (rowData.status === 'Completed') || (new Date() < new Date(rowData.start)) ? '' : FcCheckmark,
            tooltip: rowData.status !== 'Completed' && (new Date() > new Date(rowData.start)) ? 'Check-Out Patient' : null,
            onClick: (event, rowData) => {
              const values = {
                patientid: rowData.patientid,
                npi: rowData.npi,
                start: rowData.start,
                apptid: rowData.apptid,
                status: "Completed"
              }
              fetch(`/appointments/${rowData.apptid}/update-status`, {
                method: 'PUT',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                mode: 'cors',
                body: JSON.stringify(values)
              })
              .then((response) => response.json())
              .then((result) => setAppointments(appointments.map((appointment) => appointment.apptid === result.apptid ? {...rowData, ...result} : appointment)))
              .catch(console.error)
              // alert("You have marked your appointment with " + rowData.patient + " on " + rowData.date + " at " + rowData.time + " as completed.")
              // history.go(0)
            },
            disabled: rowData.status === 'Completed' || new Date() < new Date(rowData.start)
          }),
          (rowData) => ({
            icon: rowData.status === 'Canceled' ? '' : FcCancel,
            tooltip: rowData.status !== 'Canceled' ? 'Cancel Appointment' : null,
            onClick: (event, rowData) => {
              const values = {
                patientid: rowData.patientid,
                npi: rowData.npi,
                start: rowData.start,
                apptid: rowData.apptid,
                status: "Canceled"
              }
              fetch(`/appointments/${rowData.apptid}/update-status`, {
                method: 'PUT',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                mode: 'cors',
                body: JSON.stringify(values)
              })
              .then((response) => response.json())
              .then((result) => setAppointments(appointments.map((appointment) => appointment.apptid === result.apptid ? {...rowData, ...result} : appointment)))
              .catch(console.error)
              // alert("You have canceled your appointment with " + rowData.patient + " on " + rowData.date + " at " + rowData.time)
              // history.go(0)
            },
            disabled: rowData.status === 'Canceled'
          }),
          (rowData) => ({
            icon: (rowData.status === 'No-Show') || (new Date() < new Date(rowData.start)) ? '' : FaEyeSlash,
            tooltip: rowData.status !== 'No-Show' && (new Date() > new Date(rowData.start)) ? 'No-Show Patient' : null,
            onClick: (event, rowData) => {
              const values = {
                patientid: rowData.patientid,
                npi: rowData.npi,
                start: rowData.start,
                apptid: rowData.apptid,
                status: "No-Show"
              }
              fetch(`/appointments/${rowData.apptid}/update-status`, {
                method: 'PUT',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                mode: 'cors',
                body: JSON.stringify(values)
              })
              .then((response) => response.json())
              .then((result) => {
                console.log(result)
                return result
              })
              .then((result) => setAppointments(appointments.map((appointment) => appointment.apptid === result.apptid ? {...rowData, ...result} : appointment)))
              .catch(console.error)
              // alert("You have marked " + rowData.patient + " as 'No-Show' for " + rowData.date + " at " + rowData.time)
              // history.go(0)
            },
            disabled: rowData.status === 'No-Show' || (new Date() < new Date(rowData.start))
          })
        ]}
        detailPanel={[
          (rowData) => ({
            icon: FcInfo,
            tooltip: 'Details',
            render: () => {
              return (
                <div class='container-table' style={{ fontSize: 18, textAlign: 'justify', color: '#3754A4' }}>
                  <div class='item'><b>Location:</b> {rowData.location}</div>
                  <div class='item'><b>Reason:</b> {rowData.reason}</div>
                  <div class='item'><b>Goal:</b> {rowData.goal}</div>
                </div>
              )
            },
          })
        ]}
      />
    </div>
  )
}

ViewProviderSchedule.propTypes = {
  history: PropTypes.object
};

export default withRouter(ViewProviderSchedule);