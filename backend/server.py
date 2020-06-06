from flask import Flask, render_template, request, flash, session, redirect, jsonify
from model import connect_to_db

app = Flask(__name__)
app.secret_key = 'dev'


@app.route('/')
def homepage():

    return render_template("homepage.html")


@app.route('/patients/register', method=['POST'])
def register_patient():
    fname = 
    lname =
    email = request.form.get('email')
    password = request.form.get('password')


@app.route('/providers/register', method=['POST'])
def register_provider():
    npi =
    fname =
    lname =
    email = request.form.get('email')
    password = request.form.get('password')


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)
