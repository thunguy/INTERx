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
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const ViewProviders = (props) => {
  const { history } = props;
  const [patient, setPatient] = useState({})
  const [appointments, setAppointments] = useState([])
  const [providers, setProviders] = useState([])
  const [relations, setRelations] = useState()

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
    .then((result) => {
      setPatient(result);
      return result
    })
    .then((result) => fetch(`/patient/${result.patientid}/providers`))
    .then((response) => response.json())
    .then((result) => setProviders(result))
    .catch(console.error)
  }, [])

  // fetch all user in session appointments
  useEffect(() => {
    fetch('/appointments')
    .then((response) => response.json())
    .then((result) => setAppointments(result))
    .catch(console.error)
  }, [])

  // fetch all user in session medical relationships
  useEffect(() => {
    fetch('/medical-relations')
    .then((response) => response.json())
    .then((result) => setRelations(result))
    .catch(console.error)
  }, [])

  return (
    <div>
      {console.log(providers, 'line 65')}
      {console.log(appointments, 'line 66')}
      <MaterialTable
        title="My Providers"
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
          { title: 'NPI', field: 'npi' },
          { title: 'Relation Status', field: 'connected' },
        ]}
        data={providers.map((providers) => ({
          ...providers,
          connected: providers.consent ? 'Active' : 'Inactive',
        }))}
        actions={[
          (rowData) => ({
            icon: rowData.consent ? RemoveCircleIcon : PersonAddIcon,
            tooltip: rowData.consent ? `TERMINATE RELATION WITH ${rowData.fname}` : `CONSENT TO TREATMENT WITH ${rowData.fname}`,
            onClick: (event, rowData) => {
              const values = {}
              values.patientid = rowData.patientid
              values.consent = !(rowData.consent)
              values.npi = rowData.npi
              fetch('http://localhost:3000/medical-relations', {
                method: 'PUT',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                mode: 'cors',
                body: JSON.stringify(values)
              })
              .then((response) => response.json())
              .then((result) => setRelations(relations.filter((relation) => relation.npi !== result.npi).concat([result])))
              .catch(console.error)
              history.go(0)
            },
            disabled: appointments.filter((appointment) => (appointment.npi === rowData.npi) && (appointment.status === 'Scheduled') && (new Date(appointment.start) > new Date())).length > 0
          })
        ]}
        detailPanel={[
          (rowData) => ({
            icon: InfoIcon,
            tooltip: 'ABOUT',
            render: () => {
              return (
                <div style={{ fontSize: 20, textAlign: 'left', color: '#000000', backgroundColor: '#FFFFFF' }}>
                  <ul><b>Location: </b>{rowData.address}, {rowData.city}, {rowData.state}, {rowData.zipcode}</ul>
                  <ul><b>Email: </b>{rowData.email}</ul>
                  <ul><b>Phone: </b>{rowData.phone}</ul>
                </div>
              )
            },
          })
        ]}
      />
    </div>
  )
}

ViewProviders.propTypes = {
  history: PropTypes.object
};

export default withRouter(ViewProviders);