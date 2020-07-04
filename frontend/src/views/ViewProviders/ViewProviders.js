import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import { GiEnvelope } from 'react-icons/gi';
import { MdPhoneInTalk, MdClose } from 'react-icons/md';
import { IoMdSkipForward, IoMdSkipBackward, IoIosArrowForward, IoIosArrowBack, IoMdClose, IoIosArrowDown, IoMdContact } from 'react-icons/io';
import { FcEmptyFilter } from 'react-icons/fc';
import { TiLocation } from 'react-icons/ti';
import { FaLink } from 'react-icons/fa';
import '../../index.css'


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
      <MaterialTable
        title="MY PROVIDERS"
        options={{
          search: false,
          filtering: true,
          actionsColumnIndex: -1,
        }}
        icons={{
          ResetSearch: IoMdClose,
          FirstPage: IoMdSkipBackward,
          LastPage: IoMdSkipForward,
          NextPage: IoIosArrowForward,
          PreviousPage: IoIosArrowBack,
          Filter: FcEmptyFilter,
          SortArrow: IoIosArrowDown,
        }}
        columns={[
          { title: 'Provider', field: 'provider' },
          { title: 'National Provider ID', field: 'npi' },
          { title: 'Relation Status', field: 'connected' },
        ]}
        data={providers.map((providers) => ({
          ...providers,
          connected: providers.consent ? 'Active' : 'Inactive',
        }))}
        actions={[
          (rowData) => ({
            icon: rowData.consent ? MdClose : FaLink,
            tooltip: rowData.consent ? 'Deactivate Relation' : 'Activate Relation',
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
            icon: IoMdContact,
            tooltip: `About ${rowData.fname}`,
            render: () => {
              return (
                <div class="container-table" style={{ fontSize: 18, fontFamily: 'Lucida Console', color: '#515050' }}>
                  <div class="item"><MdPhoneInTalk color='#3754A4' fontSize='25'/>&nbsp;&nbsp;{rowData.phone}</div>
                  <div class="item"><TiLocation color='#3754A4' fontSize='25'/>&nbsp;{rowData.address}, {rowData.city}, {rowData.state}, {rowData.zipcode}</div>
                  <div class="item"><GiEnvelope color='#3754A4' fontSize='25'/>&nbsp;{rowData.email}</div>
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