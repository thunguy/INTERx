import React, { Fragment, useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import MaterialTable from 'material-table'
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { Grid, Button, IconButton, TextField, Link, FormHelperText, Checkbox, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes, getDay }from 'date-fns'
import { BookAppointment } from './components';


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


const SelectProvider = (props) => {
  const {history} = props;

  // const [isValid, setIsValid] = useState(false)
  // const [errors, setErrors] = useState({})
  const [values, setValues] = useState({})
  const [activities, setActivities] = useState([])
  const [providers, setProviders] = useState([])
  const [activity, setActivity] = useState(null)
  const [relations, setRelations] = useState([])
  const [consent, setConsent] = useState();
  const [appointment, setAppointment] = useState();
  // const [reason, setReason] = useState();
  // const [goal, setGoal] = useState();

  // fetch list of activities on first page load
  useEffect(() => {
    fetch("http://localhost:5000/activities")
    .then((response) => response.json())
    .then((result) => setActivities(result))
    .catch((error) => console.error('error', error));
  }, [])

  // upon selection of an ectivity, fetch all providers associated to the selected activity
  useEffect(() => {
    fetch(`http://localhost:5000/providers/activity?activity=${activity}`)
    .then((response) => response.json())
    .then((result) => result.map((provider) => ({
      ...provider,
      activities: JSON.stringify(provider.activities)
    })))
    .then((result) => setProviders(result))
    .catch((error) => console.error('error', error));
  }, [activity])

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

  const handleChange = (event) => {
    event.persist();
    const {name, value, type, checked} = event.target

    // type === 'checkbox' ? setValues({ [name]: checked }) : setValues({ [name]: value })

    if (type === 'checkbox')
    return setValues({ [name]: checked })
    return setValues({ [name]: value })
  }

  // Create appointment oject between patient in session and provider
  const handleBookAppointment = (event) => {
    event.preventDefault();

    fetch('http://localhost:3000/appointments', {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      mode: 'cors',
      body: JSON.stringify(appointment.values)
    })
    .then((response) => response.json())
    .then(console.log)
    .catch(console.error)
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
            search: false
          }}
          icons={{
            Search: SearchIcon,
            ResetSearch: ClearIcon,
            FirstPage: FirstPageIcon,
            LastPage: LastPageIcon,
            NextPage: ArrowForwardIosIcon,
            PreviousPage: ArrowBackIosIcon,
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
            {
              icon: InfoIcon,
              tooltip: 'About',
              render: rowData => {
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
            },
            {
              icon: CalendarTodayIcon,
              tooltip: 'Schedule',
              render: (rowData) => {
                return (
                  <BookAppointment
                    provider={rowData}
                  />
                )
              },
            }
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