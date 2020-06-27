import React, { Fragment, useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { BookAppointment } from './components';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { Button, IconButton, TextField, Checkbox } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import queryString from 'query-string';


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
    fetch ("http://localhost:3000/session", {
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
    fetch("http://localhost:3000/medical-relations", {
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
        CONSENT TO TREATMENT WITH {provider.fname}
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
          <ArrowBackIcon />
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
            <TextField {...params} variant='outlined' label='Activity' placeholder='Search for activity...' />
          )}
        />
      </div>
      <div>
        <MaterialTable
          title=''
          options={{
            search: false,
            filtering: true
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
            { title: 'First Name', field: 'fname', searchable: false },
            { title: 'Last Name', field: 'lname', searchable: false },
            { title: 'Specialty', field: 'specialty', searchable: false },
            { title: 'Credential', field: 'credential', searchable: false },
            { title: 'Location', field: 'location', searchable: false },
            { title: 'Phone', field: 'phone', searchable: false },
            { title: 'Sex', field: 'sex', searchable: false },
            // { title: 'Activities', field: 'activities', searchable: true },
          ]}
          data={providers.map((provider) => ({
            ...provider,
            location: `${provider.city}, ${provider.state}`
          }))}
          detailPanel={[
            (rowData) => ({
              icon: InfoIcon,
              tooltip: 'About',
              render: () => {
                return (
                  <div
                    style={{
                      fontSize: 100,
                      textAlign: 'center',
                      color: 'white',
                      backgroundColor: '#43A047',
                    }}
                  >
                    ABOUT {rowData.fname}
                  </div>
                )
              },
            }),
            (rowData) => ({
              icon: PersonAddIcon,
              disabled: (() => {
                const relation = relations.filter((relation) => relation.npi === rowData.npi)[0]
                return (relation && relation.consent)
              })(),
              tooltip: 'Connect',
              render: () => {
                return (
                  <div
                    style={{
                      fontSize: 100,
                      textAlign: 'center',
                      color: '#000000',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
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
              icon: CalendarTodayIcon,
              disabled: (() => {
                const relation = relations.filter((relation) => relation.npi === rowData.npi)[0]
                return !(relation && relation.consent)
              })(),
              tooltip: 'Schedule',
              render: () => {
                return (
                  <BookAppointment
                    provider={rowData}
                    relation={relations.filter((relation) => relation.npi === rowData.npi)[0]}
                    patient={patient}
                    activity={activity}
                  />
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

