import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { IoMdSkipForward, IoMdSkipBackward, IoIosArrowForward, IoIosArrowBack, IoMdClose } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa";
import { FcCancel, FcInfo, FcEmptyFilter } from "react-icons/fc";
import '../../index.css'


const ViewPatientAppointments = (props) => {
  const { history } = props;
  const [patient, setPatient] = useState({})
  const [appointments, setAppointments] = useState([])

  const getDuration = (datetime1, datetime2) => {
    return ((datetime2.getMinutes()) - (datetime1.getMinutes()))
  }

  // fetch user in session object
  useEffect(() => {
    fetch('/session')
    .then((response) => response.json())
    .then((result) => {console.log(result); return result})
    .then((result) => fetch(`/patients/${result.patientid}`))
    .then((response) => response.json())
    .then((result) => {console.log(result); return result})
    .then((result) => setPatient(result))
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
          { title: 'Time', field: 'time', cellStyle: {width: 190, minWidth: 190}, headerStyle: {width: 190, minWidth: 190} },
          { title: 'Duration', field: 'duration', filtering: false, cellStyle: {width: 110, minWidth: 110}, headerStyle: {width:110, minWidth: 110} },
          { title: 'Provider', field: 'provider', cellStyle: {width: 230, minWidth: 230}, headerStyle: {width:230, minWidth: 230} },
          { title: 'Activity', field: 'activityid', cellStyle: {width: 200, minWidth: 200}, headerStyle: {width:200, minWidth: 200}},
          { title: 'Status', field: 'status', cellStyle: {width: 90, maxWidth: 90}, headerStyle: {width:90, maxWidth: 90} },
        ]}
        data={appointments.map((appointment) => ({
          ...appointment,
          date: `${new Date(appointment.start).toLocaleString('en-us', {  weekday: 'short' })} ${new Date(appointment.start).toLocaleDateString()}`,
          time: `${new Date(appointment.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(appointment.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
          duration: `${getDuration(new Date(appointment.start), new Date(appointment.end))} minutes`
        }))}
        actions={[
          (rowData) => ({
            icon: rowData.status === 'Scheduled' ? FcCancel : '',
            tooltip: rowData.status === 'Scheduled' ? 'Cancel Appointment' : null,
            onClick: (event, rowData) => {
              const values = {
                patientid: rowData.patientid,
                npi: rowData.npi,
                start:rowData.start,
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
              .then((result) => setAppointments(appointments.filter((appointment) => appointment.npi !== result.npi).concat([result])))
              .catch(console.error)
              alert("You have canceled your appointment with " + rowData.provider + " on " + rowData.date + " at " + rowData.time)
              history.go(0)
            },
            disabled: rowData.status !== 'Scheduled' || new Date() > new Date(rowData.start)
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

ViewPatientAppointments.propTypes = {
  history: PropTypes.object
};

export default withRouter(ViewPatientAppointments);