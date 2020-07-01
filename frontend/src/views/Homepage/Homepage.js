import React from "react";
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import '../../index.css';


const Homepage = (props) => {
  const { history } = props;

  return (
    <div className="container">
        <center><Button variant="outlined" color="primary" href="/patients/login" size="large">PATIENT LOGIN</Button></center>
        <br/>
        <center><Button variant="outlined" color="primary" href="/providers/login" size="large">PROVIDER LOGIN</Button></center>
    </div>
  )
}

export default withRouter(Homepage);