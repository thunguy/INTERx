import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Drawer, Divider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import { Button } from '@material-ui/core';

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const PatientNavigationBar = (props) => {
  const { history } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [patient, setPatient] = useState({})

  // fetch session object and appointments of user in session
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

  // BUTTON COMPONENT: view user's appointments
  const ViewAppointments = () => {
    return (<div><Button color="primary" href='/patients/view-appointments'>VIEW MY APPOINTMENTS</Button></div>)
  }

  // BUTTON COMPONENT: view user's providers
  const ViewProviders = () => {
    return (<div><Button color="primary" href='/patients/view-providers'>VIEW MY PROVIDERS</Button></div>)
  }

  // BUTTON COMPONENT: select a provider by activity to schedule an appointment
  const ScheduleAppointment = () => {
    return (<div><Button color="primary" href='/patients/select-provider'>SCHEDULE APPOINTMENT</Button></div>)
  }

  // BUTTON COMPONENT: manage user's account details
  const AccountDetails = () => {
    return (<div><Button color="primary" href='/patients/account-details'>ACCOUNT DETAILS</Button></div>)
  }

  // BUTTON COMPONENT: manage user's account security
  const ManageSecurity = () => {
    return (<div><Button color="primary" href='/patients/manage-security'>MANAGE SECURITY</Button></div>)
  }

  // BUTTON COMPONENT: log out user
  const Logout = () => {
    const handleLogout = (event) => {
      fetch('http://localhost:3000/logout', {
        method: 'DELETE',
        mode: 'cors',
      })
      .then((response) => response.json())
      .then((data) => console.log('Success', data))
      .catch((error) => console.error('Error', error))
      event.preventDefault();
      history.push('/');
    };
    return (<div><Button color="primary" onClick={handleLogout}>LOGOUT</Button></div>)
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {patient.fname}{' '}{patient.lname}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider/>
        <List>
          <ListItem> <ScheduleAppointment/> </ListItem>
        </List>
        <Divider/>
        <List>
          <ListItem> <AccountDetails/> </ListItem>
          <ListItem> <ManageSecurity/> </ListItem>
          <ListItem> <Logout/> </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader}/>
        {props.children}
      </main>
    </div>
  );
}

PatientNavigationBar.propTypes = {
  history: PropTypes.object
};

export default withRouter(PatientNavigationBar);
