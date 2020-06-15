from flask import Flask, request, jsonify
# from flask import session
from flask_cors import CORS
from model import connect_to_db, db, Patient, Provider, Activity, ProviderActivity


app = Flask(__name__)
cors = CORS(app)
# app.secret_key = 'dev'


# @app.errorhandler(Exception)
# def handle_invalid_usage(error):
#     response = jsonify({
#         'status': 500,
#         'error': str(error)
#     })
#     response.status_code = 500
#     return response


# ####################################### PATIENTS ######################################## #


# Add a single patient
@app.route('/patients', methods=['POST'])
def add_patient():

    # fname = request.json['fname']
    # lname = request.json['lname']
    # email = request.json['email']
    # username = request.json['username']
    # password = request.json['password']
    # dob = request.json['dob']
    # sex = request.json['sex']

    # new_patient = Patient(fname=fname,
    #                       lname=lname,
    #                       email=email,
    #                       username=username,
    #                       password=password,
    #                       dob=dob,
    #                       sex=sex)

    if 'policy' in request.json:
        del request.json['policy']

    new_patient = Patient(**request.json)

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

    # patient = Patient.query.get(patientid)

    # patient.fname = request.json['fname']
    # patient.lname = request.json['lname']
    # patient.email = request.json['email']
    # patient.username = request.json['username']
    # patient.password = request.json['password']
    # patient.dob = request.json['dob']
    # patient.sex = request.json['sex']
    # patient.address = request.json['address']
    # patient.city = request.json['city']
    # patient.state = request.json['state']
    # patient.zipcode = request.json['zipcode']
    # patient.phone = request.json['phone']
    # patient.summary = request.json['summary']

    db.session.query(Patient).filter(Patient.patientid == patientid).update(request.json)
    db.session.commit()

    return jsonify(request.json)


# ###################################### PROVIDERS ######################################## #


# Add a single provider
@app.route('/providers', methods=['POST'])
def add_provider():

    if 'activities' in request.json:
        for activity in request.json['activities']:
            db.session.add(ProviderActivity(npi=request.json['npi'], activityid=activity))

        del request.json['activities']

    if 'policy' in request.json:
        del request.json['policy']

    new_provider = Provider(**request.json)
    db.session.add(new_provider)
    db.session.commit()

    return jsonify(new_provider.to_dict())


# Get all providers
@app.route('/providers', methods=['GET'])
def get_providers():

    all_providers = Provider.query.all()

    return jsonify([provider.to_dict() for provider in all_providers])


# Get a single provider
@app.route('/providers/<npi>', methods=['GET'])
def get_provider(npi):

    provider = Provider.query.get(npi)

    return jsonify(provider.to_dict())


# Update a single provider
@app.route('/providers/<npi>', methods=['PUT'])
def update_provider(npi):

    # provider = Provider.query.get(npi)

    # provider.npi = request.json['npi']
    # provider.fname = request.json['fname']
    # provider.lname = request.json['lname']
    # provider.specialty = request.json['specialty']
    # provider.email = request.json['email']
    # provider.username = request.json['username']
    # provider.password = request.json['password']
    # provider.accepting_new_patients = request.json['accepting_new_patients']
    # provider.credential = request.json['credential']
    # provider.sex = request.json['sex']
    # provider.address = request.json['address']
    # provider.city = request.json['city']
    # provider.state = request.json['state']
    # provider.zipcode = request.json['zipcode']
    # provider.phone = request.json['phone']
    # provider.summary = request.json['summary']
    # provider.virtual = request.json['virtual']
    # provider.inperson = request.json['inperson']

    db.session.query(Provider).filter(Provider.npi == npi).update(request.json)
    db.session.commit()

    return jsonify(request.json)


# ####################################### ACTIVITIES ######################################## #


# Add an activity
@app.route('/activities', methods=['POST'])
def add_activity():

    new_activity = Activity(**request.json)

    db.session.add(new_activity)
    db.session.commit()

    return jsonify(new_activity.to_dict())


# Get all activities
@app.route('/activities', methods=['GET'])
def get_activities():

    all_activities = Activity.query.order_by(Activity.activityid).all()

    return jsonify([activity.to_dict() for activity in all_activities])


# Get all providers by activity
@app.route('/providers/activity', methods=['GET'])
def get_providers_by_activity():

    activity = request.args.get('activity')

    providers = Provider.query.join(ProviderActivity).filter(ProviderActivity.activityid == activity).all()

    return jsonify([provider.to_dict() for provider in providers])


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)
