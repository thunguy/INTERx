import React, { Fragment, useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { BookAppointment } from './components';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Grid, Button, IconButton, TextField, Checkbox } from '@material-ui/core';
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
    fetch ("/session")
    .then((response) => response.json())
    .then((result) => {console.log(result); return result})
    .then((result) => fetch(`/patients/${result.patientid}`))
    .then((response) => response.json())
    .then((result) => {console.log(result); return result})
    .then((result) => setPatient(result))
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
        fullWidth
      >
        I, {patient.fname} {patient.lname}, CONSENT TO TREATMENT WITH {provider.fname} {provider.lname}, {provider.credential}
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
      <div>
        <MaterialTable
          title='Schedule Appointment'
          options={{
            search: false,
            filtering: true,
            pageSize: 10,
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
                  <div style={{ width: 'auto', marginTop: '1rem', marginBottom: '1rem', alignContent:'center', alignItems:'center', justifyContent:'center' }}>
                    <Grid container direction="row" alignItems='center'>
                      <Grid item xs={3}>
                        <Grid container direction="column" alignItems='center'>
                          <Grid item xs>
                            {rowData.sex === 'Female' ? <img src="/profile_female.jpg"/> : <img src="/profile_male.jpg"/>}
                          </Grid>
                          <Grid item xs>
                            <strong>{rowData.fname} {rowData.lname}, {rowData.credential}</strong>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={8}>
                        <div className="about-provider" style={{ textAlign: 'justify' }}>{rowData.summary}</div>
                      </Grid>
                    </Grid>
                  </div>
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
                  <div class="provider-consent" style={{ fontSize: 15, textAlign: 'justify' }}>
                    <p><strong>Treatment by {rowData.fname} {rowData.lname}, {rowData.credential}:</strong> The purpose of treatment by {rowData.fname}{' '}
                      {rowData.lname}, {rowData.credential} is to treat disease, injury and disability by examination, evaluation and intervention by{' '}
                      use of rehabilitative procedures, mobilization, manual techniques, exercises, and physical agents to aid the patient in achieving their{' '}
                      maximum potential within their capabilities and to accelerate convalescence and reduce the length of functional recovery. All procedures{' '}
                      will be thoroughly explained to me before they are performed.</p>
                    <p><strong>Informed Consent for Treatment:</strong> The term “informed consent” means that the potential risks, benefits, and alternatives{' '}
                      of treatment have been explained to me. I understand that {rowData.fname} {rowData.lname}, {rowData.credential} provides{' '}
                      a wide range of services and I will receive information at the initial visit concerning the treatment and options available{' '}
                      for my condition. I will notify my practitioner if I am pregnant, become pregnant, or am trying to get pregnant. I understand{' '}
                      I am encouraged to communicate with a physician the potential benefits and risks of treatment relevant to my pregnancy.</p>
                    <p><strong>Potential Benefits:</strong> Benefits may include an improvement in my symptoms and an increase in my ability to perform my{' '}
                      daily activities. I may experience increased strength, awareness, flexibility and endurance in my movements. I may{' '}
                      experience decreased pain and discomfort. I should gain a greater knowledge about managing my condition and the{' '}
                      recourses available to me.</p>
                    <p><strong>Potential Risks:</strong> I may experience an increase in my current level of pain or discomfort, or aggravation of my existing{' '}
                      injury during treatment. This discomfort is usually temporary; if it does not subside in 24 hours, I agree to contact{' '}
                      {rowData.fname} {rowData.lname}, {rowData.credential}.</p>
                    <p><strong>No Warranty:</strong> I understand that {rowData.fname} {rowData.lname}, {rowData.credential} cannot make any promises or guarantees{' '}
                      regarding a cure for or improvements in my condition. I understand that {rowData.fname} {rowData.lname}, {rowData.credential}{' '}
                      will share with me his/her opinions regarding potential results of physical therapy treatment for my condition and will discuss{' '}
                      treatment options with me before I consent to treatment.</p>
                    <br/>
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

