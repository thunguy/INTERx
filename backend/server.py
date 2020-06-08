from flask import Flask, request, session, redirect, jsonify
from flask_cors import CORS
from model import connect_to_db, db, Patient


app = Flask(__name__)
cors = CORS(app)
# app.secret_key = 'dev'


# Add a single patient
@app.route('/patients', methods=['POST'])
def add_patient():

    # fname = request.form.get('fname')
    # lname = request.form.get('lname')
    # email = request.form.get('email')
    # username = request.form.get('username')
    # password = request.form.get('password')
    # dob = request.form.get('dob')
    # sex = request.form.get('sex')

    fname = request.json['fname']
    lname = request.json['lname']
    email = request.json['email']
    username = request.json['username']
    password = request.json['password']
    dob = request.json['dob']
    sex = request.json['sex']

    new_patient = Patient(fname=fname,
                          lname=lname,
                          email=email,
                          username=username,
                          password=password,
                          dob=dob,
                          sex=sex)
    db.session.add(new_patient)
    db.session.commit()

    return jsonify(new_patient.to_dict())


# Get all patients
@app.route('/patients', methods=['GET'])
def get_patients():
    all_patients = Patient.query.all()
    return jsonify([patient.to_dict() for patient in all_patients])


# Get a single patient
@app.route('/patients/<patientid>', methods=['GET'])
def get_patient(patientid):
    patient = Patient.query.get(patientid)
    return jsonify(patient.to_dict())


# Update a single patient
@app.route('/patients/<patientid>', methods=['PUT'])
def update_patient(patientid):
    patient = Patient.query.get(patientid)

    # patient.fname = request.form.get('fname')
    # patient.lname = request.form.get('lname')
    # patient.email = request.form.get('email')
    # patient.username = request.form.get('username')
    # patient.password = request.form.get('password')
    # patient.dob = request.form.get('dob')
    # patient.sex = request.form.get('sex')

    # print(request.json)

    try:
        patient.fname = request.json['fname']
        patient.lname = request.json['lname']
        patient.email = request.json['email']
        patient.username = request.json['username']
        patient.password = request.json['password']
        patient.dob = request.json['dob']
        patient.sex = request.json['sex']

        db.session.commit()

        return jsonify(patient.to_dict())

    except Exception as error:
        return jsonify({
            'error': str(error)
        })


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)
