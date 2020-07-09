# INTERx

INTERx is a platform that connects patients to their next provider based on a mutually shared passion of a sport or fitness regimen. 

## Tech Stack
__Backend:__ Python 3, Flask, SQLAlchemy, bycrypt\
__Frontend:__ ReactJS (Hooks), JavaScript, HTML 5, CSS 3, Material UI\
__Database:__ PostgreSQL\
__API:__ NPPES NPI Registry API\
__Deployment:__ Coming soon!

## Features

## Future Features

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
$ createdb interx
```
Create database tables:
```
$ python3 -i model.py
>>> db.create_all()
```
Start backend Flask server:
```
(env) $ python3 server.py
```
In the terminal, navigate to frontend folder to run frontend node server:
```
$ cd frontend
$ npm start
```
