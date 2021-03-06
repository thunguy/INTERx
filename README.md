# INTERx

INTERx is a platform to search and schedule appointments with registered providers who focus treatment around patients' specialized health requisites and fitness objectives for niched activities. Providers are verified at registration by providing their unique National Provider ID which INTERx sends to the NPI Registry API to await authentication. Registered providers are authorized to update their activities to be recommended for, accept/refuse new patients, modify their schedule, and document appointment notes. Registered patients are permitted to book customizable appointments with any provider listed for a queried activity using the in-app scheduling feature with an autocomplete search tool, review and manage their appointments, and will soon be able to securely communicate with their providers using the in-app messaging feature that is currently in development.

https://bit.ly/about-INTERx

**CONTENTS**
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)


## Tech Stack
__Backend:__ Flask, Python3, RESTful API, SQLAlchemy, bycrypt\
__Frontend:__ React, React Hooks, JavaScript, HTML5, CSS3, Material-UI\
__Database:__ PostgreSQL\
__API:__ NPPES NPI Registry API


## Features

### REGISTRATION & LOGIN

> <p align="justify"> Users either register as a patient or a provider, where anyone can register as a patient, but a provider is required to register with a National Provider ID (NPI). When the form receives an 'NPI' input by the user, that input is verified using an HTTPS fetch request to NPPES NPI Registry's API, which I've also implemented to auto-fill provider registration text fields based on the data returned. Lastly, providers are prompted to select for their activities by using the text-autocomplete lookup feature, or by scrolling through the database's activity list. </p>

| <img src="https://user-images.githubusercontent.com/39027613/87715737-a52af600-c762-11ea-945e-9da6901b15a5.gif"/> | <img src="https://user-images.githubusercontent.com/39027613/87722268-9fd2a900-c76c-11ea-8dfa-5196088093cd.gif"/> |
| ------------ | ------------- |

### SEARCH PROVIDERS

> <p align="justify"> Activities that providers select for and add to their provider activity list will allow them to be searchable by patients who search and select for those same activities. </p>

| Search Provider by Activity | Edit Provider Activities |
| --------------------------- | ------------------------ |
| <img src="https://user-images.githubusercontent.com/39027613/88588571-9d920980-d00c-11ea-87c9-2ef739c8ef78.gif"/> | <img src="https://user-images.githubusercontent.com/39027613/88584737-f9599400-d006-11ea-95c4-ba3ce0d72b98.gif"/> |

### PATIENT APPOINTMENTS

> **SCHEDULE & CANCEL APPOINTMENTS WITH A PROVIDER**
<img src="https://user-images.githubusercontent.com/39027613/92293019-33a33480-eed5-11ea-8524-433735d68a68.gif"/>

### PROVIDER SCHEDULE

> **TIME-DEPENDENT DISABLED/ENABLED ACTIONS**

| <img src="https://user-images.githubusercontent.com/39027613/87869202-ab7fc480-c952-11ea-80d6-16007b2ce185.gif"/> | <img width="1200" src="https://user-images.githubusercontent.com/39027613/87866341-613c1a80-c935-11ea-8451-6836c6cdb634.png"/> |
| ------------- | ------------- |

> **VIEW APPOINTMENT DETAILS | UPDATE APPOINTMENT STATUSES | FILTER APPOINTMENTS**

| View Appointment Details | Update Appointment Status & Filter |
| -------------------------| ---------------------------------- |
| <img src="https://user-images.githubusercontent.com/39027613/87867615-c139bd80-c943-11ea-8156-8051cd62072e.gif"/> | <img src="https://user-images.githubusercontent.com/39027613/87868468-b7678880-c94a-11ea-907f-4bb49bc2459d.gif"/> |

<!--- <img src="https://user-images.githubusercontent.com/39027613/87868845-3068df00-c94f-11ea-9e48-22b80035f0bc.gif"/> --->

### EDIT USER DETAILS

| Edit Provider Details | Edit Patient Details |
| --------------------- | -------------------- |
| <img src="https://user-images.githubusercontent.com/39027613/88583708-7552dc80-d005-11ea-8ec1-0eecbadc89a3.gif"/> | <img src="https://user-images.githubusercontent.com/39027613/88584149-1346a700-d006-11ea-85b3-5fb55e72634e.gif"/> |





## Installation

#### Requirements:
- PostgreSQL
- Python 3.7.3

To have this app running on your local computer, please follow the below steps:

Clone repository:
```
$ git clone https://github.com/thunguy/INTERx.git
```
Create and activate a virtual environment:
```
$ pip3 install virtualenv
$ virtualenv env
$ source env/bin/activate
```
Install dependencies:
```
(env) $ pip3 install -r requirements.txt
```
Create database `interx`:
```
(env) $ createdb interx
```
Create database tables:
```
(env) $ python3 -i model.py
>>> db.create_all()
```
Start backend server:
```
(env) $ python3 server.py
```
In the terminal, navigate to frontend folder to run frontend node server:
```
$ cd frontend
$ npm install
$ npm start
```
