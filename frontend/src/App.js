import React from 'react';
import Routes from './Routes';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
// import './App.css';

const browserHistory = createBrowserHistory();

function App() {
  return (
    <Router history={browserHistory}>
      <Routes/>
    </Router>
  );
}

export default App;
