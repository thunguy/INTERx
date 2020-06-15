import React, { useState, useEffect } from "react";
import { Link as RouterLink, withRouter } from 'react-router-dom';


const TestPatientSession = (props) => {

  const { history } = props;

  const [session, setSession] = useState({})

  useEffect(() => {
    fetch('/test-session')
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        return result;
      })
      .then(setSession)
      .catch(console.error)
    }, [])

  return (
    <div>
      {JSON.stringify(session)}
    </div>
    )
}

export default withRouter(TestPatientSession);