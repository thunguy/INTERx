import React from "react";
import { Link as RouterLink, withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';


const Homepage = (props) => {
  const { history } = props;

  return (
    <div align="center">
      <Button variant="outlined" color="primary" href="http://localhost:3000/patients/login">PATIENT</Button>
      <br/>
      <Button variant="outlined" color="primary" href="http://localhost:3000/providers/login">PROVIDER</Button>
    </div>
  )
}

export default withRouter(Homepage);