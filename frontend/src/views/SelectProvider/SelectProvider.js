import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import MaterialTable from 'material-table'
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { Grid, Button, IconButton, TextField, Link, FormHelperText, Checkbox, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const SelectProvider = (props) => {
  const {history} = props;

  const [isValid, setIsValid] = useState(false)
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [activities, setActivities] = useState([])
  const [providers, setProviders] = useState([])
  const [activity, setActivity] = useState(null)


  useEffect(() => {
    fetch("http://localhost:5000/activities")
    .then((response) => response.json())
    .then((result) => setActivities(result))
    .catch((error) => console.error('error', error));
  }, [])


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
            setActivity((value || {}).activityid)
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
            searchFieldAlignment: 'left',
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
              render: rowData => {
                return (
                  <div
                    style={{
                      fontSize: 70,
                      textAlign: 'center',
                      color: 'white',
                      backgroundColor: '#E53935',
                    }}
                  >
                    VIEW {rowData.fname}'S AVAILABILITY
                  </div>
                )
              },
            },
            {
              icon: PersonAddIcon,
              // openIcon:
              tooltip: 'Connect',
              render: rowData => {
                return (
                  <div
                    style={{
                      fontSize: 70,
                      textAlign: 'center',
                      color: 'white',
                      backgroundColor: '#FDD835',
                    }}
                  >
                    CONNECT WITH {rowData.fname}
                  </div>
                )
              },
            },
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