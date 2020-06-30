import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import InfoIcon from '@material-ui/icons/Info';
import CancelIcon from '@material-ui/icons/Cancel'
import ArrowDownward from '@material-ui/icons/ArrowDownward';


const ViewAppointments = (props) => {
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
        title="My Appointments"
        options={{
          search: false,
          filtering: true,
          actionsColumnIndex: -1,
        }}
        icons={{
          Search: SearchIcon,
          ResetSearch: ClearIcon,
          FirstPage: FirstPageIcon,
          LastPage: LastPageIcon,
          NextPage: ArrowForwardIosIcon,
          PreviousPage: ArrowBackIosIcon,
          Filter: SearchIcon,
          SortArrow: ArrowDownward,
        }}
        columns={[
          { title: 'Provider', field: 'provider' },
          { title: 'Date', field: 'date' },
          { title: 'Time', field: 'time' },
          { title: 'Duration', field: 'duration', filtering: false },
          { title: 'Activity', field: 'activityid' },
          { title: 'Status', field: 'status' },
        ]}
        data={appointments.map((appointment) => ({
          ...appointment,
          date: `${new Date(appointment.start).toDateString()}`,
          time: `${new Date(appointment.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(appointment.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
          duration: `${getDuration(new Date(appointment.start), new Date(appointment.end))} minutes`
        }))}
        actions={[
          (rowData) => ({
            icon: CancelIcon,
            tooltip: 'Cancel Appointment',
            onClick: (event, rowData) => alert("You have cancelled your appointment with  " + rowData.provider + " on " + rowData.date + " at " + rowData.time),
            disabled: rowData.birthYear < 2000
          })
        ]}
        detailPanel={[
          (rowData) => ({
            icon: InfoIcon,
            tooltip: 'About',
            render: () => {
              return (
                <div style={{ fontSize: 20, textAlign: 'left', color: '#000000', backgroundColor: '#FFFFFF' }}>
                  <ul><b>Location:</b> {rowData.location}</ul>
                  <ul><b>Appointment Reason:</b> {rowData.reason}</ul>
                  <ul><b>Appointment Goal: </b> {rowData.goal}</ul>
                </div>
              )
            },
          })
        ]}
      />
    </div>
  )
}

ViewAppointments.propTypes = {
  history: PropTypes.object
};

export default withRouter(ViewAppointments);