import React from "react";
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import '../../index.css';


const Homepage = (props) => {
  const { history } = props;

  return (
    <div>
      <div className="container">
        <video id="background-video" loop autoPlay muted>
          <source src="/video.mp4" type="video/mp4"/>
        </video>
        <center><Button variant="contained" color="primary" href="/patients/login" size="large">PATIENT</Button></center>
        <br/>
        <center><Button variant="contained" color="primary" href="/providers/login" size="large">PROVIDER</Button></center>
      </div>
    </div>
  )
}

export default withRouter(Homepage);