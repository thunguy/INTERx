import React, { Fragment, useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { BookAppointment } from './components';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Button, IconButton, TextField, Checkbox } from '@material-ui/core';
import queryString from 'query-string';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { IoMdSkipForward, IoMdSkipBackward, IoIosArrowForward, IoIosArrowBack, IoMdClose, IoIosArrowDown } from 'react-icons/io';
import { FcEmptyFilter, FcLeft, FcCalendar, FcApproval } from 'react-icons/fc';
import { MdEventBusy } from 'react-icons/md';
import { BsPersonLinesFill } from 'react-icons/bs'
import { FaLink } from 'react-icons/fa';
import '../../index.css';


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


const SelectProvider = (props) => {
  const {history} = props;

  const [values, setValues] = useState({})
  const [activities, setActivities] = useState([])
  const [providers, setProviders] = useState([])
  const [activity, setActivity] = useState(null)
  const [relations, setRelations] = useState([])
  const [patient, setPatient] = useState()


  // fetch list of activities on first page load
  useEffect(() => {
    fetch("http://localhost:5000/activities")
    .then((response) => response.json())
    .then((result) => setActivities(result))
    .catch((error) => console.error('error', error));
  }, [])


  // upon selection of an ectivity, fetch all providers associated to the selected activity
  useEffect(() => {
    fetch(`http://localhost:5000/providers/activity?${queryString.stringify({activity:activity})}`)
    .then((response) => response.json())
    .then((result) => result.map((provider) => ({
      ...provider,
      activities: JSON.stringify(provider.activities)
    })))
    .then((result) => setProviders(result))
    .catch((error) => console.error('error', error));
  }, [activity])


  // fetch patientid of patient in sesion
  useEffect(() => {
    fetch ("/session", {
      method: 'GET',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
    })
    .then((response) => response.json())
    .then((result) => {console.log(result); setPatient(result)})
    .catch((error) => console.error('error', error));
  }, [])


  // fetch existing medical relations for patient in session
  useEffect(() => {
    fetch("/medical-relations", {
      method: 'GET',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
    })
    .then((response) => response.json())
    .then((result) => {console.log(result); setRelations(result)})
    .catch((error) => console.error('error', error));
  }, [])


  // COMPONENT: establish a relation with provider, or update an existing relation
  const ConsentAgreement = ({provider, relation, patient}) => {
    const [patientid, setPatientid] = useState(patient.patientid)
    const [consent, setConsent] = useState(true)
    const [npi, setNPI] = useState(provider.npi)

    const handleAgree = () => {
      const values = {}
      values.patientid = patientid
      values.consent = consent
      values.npi = npi

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
    };

    return (
      <Button
        disabled={(relation && relation.consent) ? true : false}
        type="submit"
        variant="outlined"
        color="primary"
        onClick={handleAgree}
      >
        I CONSENT TO TREATMENT WITH {provider.fname} {provider.lname}, {provider.credential}
      </Button>
    )
  }

  const handleChange = (event) => {
    event.persist();
    const {name, value, type, checked} = event.target

    // type === 'checkbox' ? setValues({ [name]: checked }) : setValues({ [name]: value })

    if (type === 'checkbox')
    return setValues({ [name]: checked })
    return setValues({ [name]: value })
  }

  const handleBack = () => {
    history.goBack();
  }

  const handleSelectProvider = (event) => {
    event.preventDefault();
    history.push('/patients/select-provider')
  }

  return (
    <div>
      <div>
        <IconButton onClick={handleBack}>
          <FcLeft/>
        </IconButton>
      </div>
      <div>
        <Autocomplete
          options={activities || []}
          onChange={(event, value) => {
            setActivity(value?.activityid)
          }}
          getOptionLabel={(option) => option.activityid}
          renderOption={(option, { selected }) => (
            <React.Fragment>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
                {option.activityid}
            </React.Fragment>
          )}
          style={{ width: 'auto' }}
          renderInput={(params) => (
            <TextField {...params} variant='outlined' label='Activity' placeholder='Search for activity...'/>
          )}
        />
      </div>
      <div class="table-text">
        <MaterialTable
          title='Schedule Appointment'
          options={{
            search: false,
            filtering: true
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
            { title: 'First Name', field: 'fname' },
            { title: 'Last Name', field: 'lname' },
            { title: 'Specialty', field: 'specialty' },
            { title: 'Credential', field: 'credential' },
            { title: 'Location', field: 'location' },
            { title: 'Phone', field: 'phone' },
            { title: 'Sex', field: 'sex' },
            // { title: 'Activities', field: 'activities', searchable: true },
          ]}
          data={providers.map((provider) => ({
            ...provider,
            location: `${provider.city}, ${provider.state}`
          }))}
          detailPanel={[
            (rowData) => ({
              icon: BsPersonLinesFill,
              tooltip: `About ${rowData.fname}`,
              render: () => {
                return (
                  <div style={{ fontSize: 100, textAlign: 'center', color: 'white', backgroundColor: '#43A047' }}> About {rowData.fname} </div>
                )
              },
            }),
            (rowData) => ({
              icon: (() => {
                const relation = relations.filter((relation) => relation.npi === rowData.npi)[0]
                return !(relation && relation.consent) ? FaLink : FcApproval
              })(),
              disabled: (() => {
                const relation = relations.filter((relation) => relation.npi === rowData.npi)[0]
                return (relation && relation.consent)
              })(),
              tooltip: 'Consent Required',
              render: () => {
                return (
                  <div style={{ fontSize: 100, textAlign: 'center', color: '#000000', backgroundColor: '#FFFFFF' }}>
                    <ConsentAgreement
                      provider={rowData}
                      relation={relations.filter((relation) => relation.npi === rowData.npi)[0]}
                      patient={patient}
                    />
                  </div>
                )
              },
            }),
            (rowData) => ({
              icon: (() => {
                const relation = relations.filter((relation) => relation.npi === rowData.npi)[0]
                return (relation && relation.consent) ? FcCalendar : MdEventBusy
              })(),
              disabled: (() => {
                const relation = relations.filter((relation) => relation.npi === rowData.npi)[0]
                return !(relation && relation.consent)
              })(),
              tooltip: 'View Availability',
              render: () => {
                return (
                  <div style={{ display: 'flex', justifyContent:'center', textAlign: 'center' }}>
                    <BookAppointment
                      provider={rowData}
                      relation={relations.filter((relation) => relation.npi === rowData.npi)[0]}
                      patient={patient}
                      activity={activity}
                    />
                  </div>
                )
              },
            })
          ]}
        />
      </div>
    </div>
  )
};

SelectProvider.propTypes = {
  history: PropTypes.object
};

export default withRouter(SelectProvider);

