from flask import Flask, request, jsonify
from flask import session
import requests
from flask_cors import CORS
from model import connect_to_db, db, Patient, Provider, Activity, ProviderActivity, Appointment, MedicalRelation


app = Flask(__name__)
cors = CORS(app)
app.secret_key = 'dev'


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


# Search a provider by NPI
@app.route('/api/', methods=['GET'])
def search_provider():

    number = request.args.get('number')
    response = requests.get(f'https://npiregistry.cms.hhs.gov/api/?number={number}&version=2.1')

    return jsonify(response.json())


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


# ####################################### LOGIN ######################################## #


# Create patient session upon successful login
@app.route('/patients/login', methods=['POST'])
def patient_login():

    patient = db.session.query(Patient).filter(Patient.username == request.json['username']).first()

    if not patient or patient.password != request.json['password']:
        return jsonify({'message': 'login failed'}), 401
    else:
        session['username'] = patient.username
        session['patientid'] = patient.patientid
        print(session)
        return jsonify(patient.to_dict())


# Create provider session upon successful login
@app.route('/providers/login', methods=['POST'])
def provider_login():

    provider = db.session.query(Provider).filter(Provider.username == request.json['username']).first()

    if not provider or provider.password != request.json['password']:
        return jsonify({'message': 'login failed'}), 401
    else:
        session['username'] = provider.username
        session['npi'] = provider.npi
        print(session)
        return jsonify(provider.to_dict())


# ####################################### RELATIONS ######################################## #


# Either update an existing relation between patient and provider, or create relation if none exists
@app.route('/medical-relations', methods=['POST', 'PUT'])
def add_relation():

    if 'patientid' in session:
        patientid = session.get('patientid')

        if (patientid == request.json['patientid']):
            relation = db.session.query(MedicalRelation).filter(MedicalRelation.npi == request.json['npi'], MedicalRelation.patientid == patientid).first()
            relations = db.session.query(MedicalRelation).all()

            if relation in relations:
                db.session.query(MedicalRelation).filter(MedicalRelation.relationid == relation.relationid).update(request.json)
                db.session.commit()
                return jsonify(request.json)
            else:
                new_relation = MedicalRelation(**request.json)
                db.session.add(new_relation)
                db.session.commit()
                return jsonify(new_relation.to_dict())
        else:
            return jsonify({'message': 'unauthorized access -- invalid session'}), 403
    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# If provider in session, get all provider's patients by existing relations
@app.route('/providers/medical-relations/<npi>', methods=['GET'])
def get_provider_relations(npi):

    if 'npi' in session:
        npi = session.get('npi')

        if npi == request.json['npi']:
            relations = db.session.query(MedicalRelation).filter(MedicalRelation.npi == npi).all()
            return jsonify([relation.to_dict() for relation in relations])
        else:
            return jsonify({'message': 'unauthorized access'}), 403
    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# If patient in session, get all patient's providers by existing relations
@app.route('/patients/medical-relations/<patientid>', methods=['GET'])
def get_patient_relations(patientid):

    if 'patientid' in session:
        patientid = session.get('patientid')

        if patientid == request.json['patientid']:
            relations = db.session.query(MedicalRelation).filter(MedicalRelation.patientid == patientid).all()
            return jsonify([relation.to_dict() for relation in relations])
        else:
            return jsonify({'message': 'unauthorized access'}), 403
    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# Get all medical relations between patients and providers
@app.route('/medical-relations', methods=['GET'])
def get_all_relations():

    all_relations = MedicalRelation.query.all()

    return jsonify([relation.to_dict() for relation in all_relations])


# # Update the state of an exisiting relationship between patient and provider
# @app.route('/medical-relation/<relationid>', methods=['PUT'])
# def update_relation(relationid):

#     if 'patientid' in session:
#         patientid = session.get('patientid')

#         if patientid == request.json['patientid']:
#             relation = db.session.query(MedicalRelation).filter(MedicalRelation.relationid == relationid).one()

#             if (relation.patientid == patientid) and (relation.npi == request.json['npi']):
#                 db.session.query(MedicalRelation).filter(MedicalRelation.relationid == relationid).update(request.json)
#                 db.session.commit()
#                 return jsonify(request.json)
#             else:
#                 return jsonify({'message': 'unauthorized access -- no relation on record'}), 403
#         else:
#             return jsonify({'message': 'unauthorized access'}), 403
#     else:
#         return jsonify({'message': 'invalid session -- login required'}), 401


# ####################################### APPOINTMENTS ######################################## #


# Book an appointment with a provider
@app.route('/appointments', methods=['POST'])
def book_appt():

    if 'patientid' in session:
        patientid = session.get('patientid')

        if patientid == request.json['patientid']:
            relation = db.session.query(MedicalRelation).filter(MedicalRelation.patientid == patientid,
                                                                MedicalRelation.npi == request.json['npi']).one()

            if relation.consent:
                new_appt = Appointment(**request.json)  # todo: check if relationid is recorded in request.json for each appt booked
                db.session.add(new_appt)
                db.session.commit()
                return jsonify(new_appt.to_dict())
            else:
                return jsonify({'message': 'unauthorized access -- consent required'}), 403
        else:
            return jsonify({'message': 'unauthorized access'}), 403
    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# If provider in session, get all provider's appointments
@app.route('/providers/appointments/<npi>', methods=['GET'])
def get_provider_appts(npi):

    if 'npi' in session:
        npi = session.get('npi')

        if npi == request.json['npi']:
            appointments = db.session.query(Appointment).filter(Appointment.npi == npi).order_by(Appointment.start.desc()).all()
            return jsonify([appointment.to_dict() for appointment in appointments])
        else:
            return jsonify({'message': 'unauthorized access'}), 403
    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# If patient in session, get all patient's appointments
@app.route('/patients/appointments/<patientid>', methods=['GET'])
def get_patient_appts(patientid):

    if 'patientid' in session:
        patientid = session.get('patientid')

        if patientid == request.json['patientid']:
            appointments = db.session.query(Appointment).filter(Appointment.patientid == patientid).order_by(Appointment.start.desc()).all()
            return jsonify([appointment.to_dict() for appointment in appointments])
        else:
            return jsonify({'message': 'unauthorized access'}), 403
    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# If patient in session, get all provider's past apppointments
# If provider in session, get all provider's future appointments
# If provider in session, get all provider's appointments for today

# If patient in session, get all patient's past apppointments
# If patient in session, get all patient's future appointments
# If patient in session, get all patient's appointments for today


# # Get available appointments for a provider
# @app.route('/providers/<npi>/open-availability', methods=['GET'])
# def get_provider_availability(npi):

#     start = request.args.get()
#     end = request.args.get()

# # Cancel an appointment with a provider
# @app.route('/appointments', methods=['PUT'])
# def book_appt():


# ####################################### TESTING ######################################## #


# Test if user session is successful
@app.route('/test-session', methods=['GET'])
def test():

    if 'patientid' and 'username' in session:
        return jsonify({'patientid': session['patientid'], 'username': session['username']})
    else:
        return jsonify({'message': 'invalid session'}), 401

    if 'npi' and 'username' in session:
        return jsonify({'npi': session['npi'], 'username': session['username']})
    else:
        return jsonify({'message': 'invalid session'}), 401


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)
