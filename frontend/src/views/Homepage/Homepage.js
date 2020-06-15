import React from "react";
import { Link as RouterLink, withRouter } from 'react-router-dom';


const Homepage = (props) => {
    const { history } = props;

    return (
        <div>
            <ul>
                <li><a href="http://localhost:3000/patients/register">Patient Registration</a>{' → select a provider'}</li>
                <li><a href="http://localhost:3000/patients/select-provider">Select a Provider</a>{' → sign consent → patient intro → provider schedule → book virtual/in-person appointment'}</li>
                <li><a href="http://localhost:3000/patients/login">Patient Login</a>{' → patient dashboard'}</li>
            </ul>

            <ul>
                <li><a href="http://localhost:3000/providers/register">Provider Registration</a>{' → provider dashboard'}</li>
                <li><a href="http://localhost:3000/providers/login">Provider Login</a>{' → provider daily schedule'}</li>
            </ul>
        </div>
    )
}

export default withRouter(Homepage);