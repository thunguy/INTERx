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

const ViewAppointments = (props) => {
  const { history } = props;
  const [patient, setPatient] = useState({})
  const [appointments, setAppointments] = useState([])

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
        }}
        columns={[
          { title: 'Provider', field: 'provider' },
          { title: 'Activity', field: 'activityid' },
          { title: 'Start', field: 'start' },
          { title: 'Goal', field: 'goal' },
          { title: 'Status', field: 'status' },
        ]}
        data={appointments}
        actions={[
          { icon: 'save', tooltip: 'Save User', onClick: (event, rowData) => alert("You saved " + rowData.name) },
          rowData => ({
            icon: 'delete',
            tooltip: 'Delete User',
            onClick: (event, rowData) => alert("You have deleted " + rowData.name),
            disabled: rowData.birthYear < 2000
          })
        ]}
        detailPanel={[
          (rowData) => ({
            icon: InfoIcon,
            tooltip: 'About',
            render: () => {
              return (
                <div style={{ fontSize: 20, textAlign: 'center', color: '#000000', backgroundColor: '#FFFFFF' }}>
                  Location: {rowData.location}<br/>
                  Reason: {rowData.reason}<br/>
                  Goal: {rowData.goal}<br/>
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