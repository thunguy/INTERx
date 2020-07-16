# INTERx

INTERx is a platform that connects patients to their next provider based on a mutually shared passion of a sport or fitness regimen. 


**CONTENTS**
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Future Features](#future-features)
- [Installation](#installation)
- [About the Developer](#about-the-developer)


## Tech Stack
__Backend:__ Python 3, Flask, SQLAlchemy, bycrypt\
__Frontend:__ ReactJS (Hooks), JavaScript, HTML 5, CSS 3, Material UI\
__Database:__ PostgreSQL\
__API:__ NPPES NPI Registry API\
__Deployment:__ Coming soon!


## Features

**REGISTRATION & LOGIN**

> <p align="justify"> Users of INTERx are either registered as a patient or a provider, where anyone is able to sign up as a patient, but a provider is required to register with a National Provider ID (NPI). When the form receives an 'NPI' input by the user, that input is verified using an HTTPS fetch request to NPPES NPI Registry's API, and if valid, I implement the data returned to auto-fill provider registration text fields including first name, last name, specialty, credential, address, city, state, zip code, and phone number. Lastly, providers are prompted to select for their activities by using the text-autocomplete lookup feature, or by scrolling through the database's entire activity list. Activities that providers select for and add to their provider activity list will initialize their searchability by patients who search and select for the same activities. </p>

PROVIDER | PATIENT
------------ | -------------
<img src="https://user-images.githubusercontent.com/39027613/87715737-a52af600-c762-11ea-945e-9da6901b15a5.gif"/> | <img src="https://user-images.githubusercontent.com/39027613/87722268-9fd2a900-c76c-11ea-8dfa-5196088093cd.gif"/>




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
$ npm start
```
