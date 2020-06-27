import React from "react";
import { Link as RouterLink, withRouter } from 'react-router-dom';


const Homepage = (props) => {
    const { history } = props;

    return (
        <div>
            <ul>
                <li><a href="/patients/register">Patient Registration</a>{' → select a provider'}</li>
                <li><a href="/patients/select-provider">Select a Provider</a>{' → sign consent → patient intro → provider schedule → book virtual/in-person appointment'}</li>
                <li><a href="/patients/login">Patient Login</a>{' → '}<a href="/patients/dashboard">Patient Dashboard</a></li>
            </ul>

            <ul>
                <li><a href="http://localhost:3000/providers/register">Provider Registration</a>{' → provider dashboard'}</li>
                <li><a href="http://localhost:3000/providers/login">Provider Login</a>{' → '}<a href="/providers/dashboard">Provider Dashboard</a></li>
            </ul>
        </div>
    )
}

export default withRouter(Homepage);