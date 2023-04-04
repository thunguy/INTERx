from flask import Flask, request, jsonify, session
from flask_cors import CORS
from model import connect_to_db, db, Patient, Provider, Activity, ProviderActivity, Appointment, MedicalRelation
from os import environ
import bcrypt
import dateutil.parser
import requests

app = Flask(__name__)
app.url_map.strict_slashes = False
cors = CORS(app)
app.secret_key = environ.get('SECRET_KEY')


# Generate hash for user passwords
def get_hash(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(15))


# ####################################### PATIENTS ######################################## #


# Register a patient
@app.route('/patients', methods=['POST'])
def add_patient():

    if 'policy' in request.json:
        del request.json['policy']

    username = request.json['username']
    email = request.json['email']
    password = request.json['password']

    patient = db.session.query(Patient).filter((Patient.username == username) | (Patient.email == email)).all()
    provider = db.session.query(Provider).filter((Provider.username == username) | (Provider.email == email)).all()

    if not patient and not provider:
        request.json['password_hash'] = get_hash(password)
        del request.json['password']
        new_patient = Patient(**request.json)
        db.session.add(new_patient)
        db.session.commit()
        return jsonify(new_patient.to_dict())

    else:
        if Patient.query.filter_by(email=email).all() or Provider.query.filter_by(email=email).all():
            return jsonify({'message': 'email address already registered with an existing account -- registration or login required'}), 409
        else:
            return jsonify({'message': 'username unavailable'}), 409


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

    if 'patientid' in session:
        patientid = session.get('patientid')

        if patientid == request.json['patientid']:
            db.session.query(Patient).filter(Patient.patientid == patientid).update(request.json)
            db.session.commit()
            return jsonify(request.json)
        else:
            return jsonify({'message': 'unauthorized access -- invalid session'}), 403
    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# Update patient password
@app.route('/patients/<patientid>/update-password', methods=['PUT'])
def update_patient_password(patientid):

    if 'patientid' in session:
        patientid = session.get('patientid')

        if patientid == request.json['patientid']:
            old_password = request.json['old_password']
            new_password = request.json['new_password']

            if old_password != new_password:
                patient = Patient.query.get(patientid)

                if patient and patient.check_password(old_password):
                    request.json['password_hash'] = get_hash(new_password)
                    del request.json['old_password']
                    del request.json['new_password']
                    db.session.query(Patient).filter(Patient.patientid == patientid).update(request.json)
                    db.session.commit()
                    return jsonify(patient.to_dict())

                else:
                    return jsonify({'message': 'access denied -- incorrect password'}), 403
            else:
                return jsonify({'message': 'request cannot be completed -- new password must be different from current password'}), 409
        else:
            return jsonify({'message': 'unauthorized access -- invalid session'}), 403
    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# Update patient email
@app.route('/patients/<patientid>/update-email', methods=['PUT'])
def update_patient_email(patientid):

    if 'patientid' in session:
        patientid = session.get('patientid')

        if patientid == request.json['patientid']:
            old_email = request.json['old_email']
            new_email = request.json['new_email']
            password = request.json['password']
            patient = Patient.query.get(patientid)

            if (patient) and (patient.email == old_email) and (patient.check_password(password)):
                patient_email = db.session.query(Patient).filter(Patient.email == new_email).all()
                provider_email = db.session.query(Provider).filter(Provider.email == new_email).all()

                if not patient_email and not provider_email:
                    request.json['email'] = new_email
                    del request.json['old_email']
                    del request.json['new_email']
                    del request.json['password']
                    db.session.query(Patient).filter(Patient.patientid == patientid).update(request.json)
                    db.session.commit()
                    return jsonify(patient.to_dict())

                else:
                    return jsonify({'message': 'access denied -- email address already registered with an existing account'}), 409
            else:
                return jsonify({'message': 'access denied -- incorrect credentials'}), 403
        else:
            return jsonify({'message': 'unauthorized access -- invalid session'}), 403
    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# ###################################### PROVIDERS ######################################## #


# Search a provider by NPI
@app.route('/api/', methods=['GET'])
def search_provider():

    number = request.args.get('number')
    response = requests.get(f'https://npiregistry.cms.hhs.gov/api/?number={number}&version=2.1')

    return jsonify(response.json())


# Register a provider
@app.route('/providers', methods=['POST'])
def add_provider():

    if 'activities' in request.json:
        for activity in request.json['activities']:
            db.session.add(ProviderActivity(npi=request.json['npi'], activityid=activity))
        del request.json['activities']

    if 'policy' in request.json:
        del request.json['policy']

    username = request.json['username']
    email = request.json['email']
    password = request.json['password']

    provider = db.session.query(Provider).filter((Provider.username == username) | (Provider.email == email)).all()
    patient = db.session.query(Patient).filter((Patient.username == username) | (Patient.email == email)).all()

    if not provider and not patient:
        request.json['password_hash'] = get_hash(password)
        del request.json['password']
        new_provider = Provider(**request.json)
        db.session.add(new_provider)
        db.session.commit()
        return jsonify(new_provider.to_dict())

    else:
        if Provider.query.filter_by(email=email).all() or Patient.query.filter_by(email=email).all():
            return jsonify({'message': 'email is already registered -- registration/login required'}), 409
        else:
            return jsonify({'message': 'username unavailable'}), 409


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

    if 'activities' in request.json:
        for activity in request.json['activities']:
            provider_activity = db.session.query(ProviderActivity).filter_by(npi=request.json['npi'], activityid=activity).first()
            provider_activities = db.session.query(ProviderActivity).all()

            if provider_activity not in provider_activities:
                db.session.add(ProviderActivity(npi=request.json['npi'], activityid=activity))
            else:
                continue

        del request.json['activities']

    if 'npi' in session:
        npi = session.get('npi')

        if npi == request.json['npi']:
            db.session.query(Provider).filter(Provider.npi == npi).update(request.json)
            db.session.commit()
            return jsonify(request.json)
        else:
            return jsonify({'message': 'unauthorized access -- invalid session'}), 403
    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# Remove activities from a provider's list of activities
@app.route('/providers/<npi>/delete-activities', methods=['PUT'])
def remove_provider_activities(npi):

    if 'npi' in session:
        npi = session.get('npi')

        if npi == request.json['npi']:

            for activity in request.json['activities']:
                db.session.query(ProviderActivity).filter_by(npi=npi, activityid=activity).delete()
            db.session.commit()
            provider = db.session.query(Provider).filter_by(npi=npi).one()
            return jsonify(provider.to_dict())
        else:
            return jsonify({'message': 'unauthorized access -- invalid session'}), 403
    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# Update provider password
@app.route('/providers/<npi>/update-password', methods=['PUT'])
def update_provider_password(npi):

    if 'npi' in session:
        npi = session.get('npi')

        if npi == request.json['npi']:
            old_password = request.json['old_password']
            new_password = request.json['new_password']

            if old_password != new_password:
                provider = Provider.query.get(npi)

                if provider and provider.check_password(old_password):
                    request.json['password_hash'] = get_hash(new_password)
                    del request.json['old_password']
                    del request.json['new_password']
                    db.session.query(Provider).filter(Provider.npi == npi).update(request.json)
                    db.session.commit()
                    return jsonify(provider.to_dict())

                else:
                    return jsonify({'message': 'access denied -- incorrect password'}), 403
            else:
                return jsonify({'message': 'request cannot be completed -- new password must be different from current password'}), 409
        else:
            return jsonify({'message': 'unauthorized access -- invalid session'}), 403
    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# Update provider email
@app.route('/providers/<npi>/update-email', methods=['PUT'])
def update_provider_email(npi):

    if 'npi' in session:
        npi = session.get('npi')

        if npi == request.json['npi']:
            old_email = request.json['old_email']
            new_email = request.json['new_email']
            password = request.json['password']
            provider = Provider.query.get(npi)

            if (provider) and (provider.email == old_email) and (provider.check_password(password)):
                provider_email = db.session.query(Provider).filter(Provider.email == new_email).first()
                patient_email = db.session.query(Patient).filter(Patient.email == new_email).first()

                if not provider_email and not patient_email:
                    request.json['email'] = new_email
                    del request.json['old_email']
                    del request.json['new_email']
                    del request.json['password']
                    db.session.query(Provider).filter(Provider.npi == npi).update(request.json)
                    db.session.commit()
                    return jsonify(provider.to_dict())

                else:
                    return jsonify({'message': 'access denied -- email address already registered with an existing account'}), 409
            else:
                return jsonify({'message': 'access denied -- incorrect credentials'}), 403
        else:
            return jsonify({'message': 'unauthorized access -- invalid session'}), 403
    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


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


# Get all activities of a provider
@app.route('/providers/activities', methods=['GET'])
def get_provider_activities():

    if 'npi' in session:
        npi = session.get('npi')
        provider_activities = db.session.query(ProviderActivity).filter_by(npi=npi).all()
        return jsonify([provider_activity.to_dict() for provider_activity in provider_activities])
    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# ####################################### LOGIN / LOGOUT ######################################## #


# Create patient session upon successful login
@app.route('/patients/login', methods=['POST'])
def patient_login():

    username = request.json['username']
    password = request.json['password']

    patient = db.session.query(Patient).filter(Patient.username == username).first()

    if patient and patient.check_password(password):
        session['username'] = patient.username
        session['patientid'] = patient.patientid
        print(session)
        return jsonify(patient.to_dict())
    else:
        return jsonify({'message': 'login failed'}), 401


# Create provider session upon successful login
@app.route('/providers/login', methods=['POST'])
def provider_login():

    username = request.json['username']
    password = request.json['password']

    provider = db.session.query(Provider).filter(Provider.username == username).first()

    if provider and provider.check_password(password):
        session['username'] = provider.username
        session['npi'] = provider.npi
        print(session)
        return jsonify(provider.to_dict())
    else:
        return jsonify({'message': 'login failed'}), 401


# Delete user session on logout
@app.route('/logout', methods=['DELETE'])
def logout():

    if 'patientid' in session and 'username' in session:
        del session['patientid']
        del session['username']
        return jsonify({'message': 'logged out'}), 200

    if 'npi' in session and 'username' in session:
        del session['npi']
        del session['username']
        return jsonify({'message': 'logged out'}), 200


# ####################################### RELATIONS ######################################## #


# Either update an existing relation between patient and provider, or create relation if none exists
@app.route('/medical-relations', methods=['POST', 'PUT'])
def add_or_update_relation():

    if 'patientid' in session:
        patientid = session.get('patientid')

        if patientid == request.json['patientid']:
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


# If patient or provider in session, get all user's existing relations
@app.route('/medical-relations', methods=['GET'])
def get_relations():

    if 'patientid' in session:
        patientid = session.get('patientid')
        relations = db.session.query(MedicalRelation).filter(MedicalRelation.patientid == patientid).all()
        return jsonify([relation.to_dict() for relation in relations])

    elif 'npi' in session:
        npi = session.get('npi')
        relations = db.session.query(MedicalRelation).filter(MedicalRelation.npi == npi).all()
        return jsonify([relation.to_dict() for relation in relations])

    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# Get all providers for a patient in session joined
@app.route('/patient/<patientid>/providers', methods=['GET'])
def get_my_providers(patientid):

    provider_relation_objs = []

    if 'patientid' in session:
        patientid = session.get('patientid')
        providers = db.session.query(Provider).join(MedicalRelation).filter(MedicalRelation.patientid == patientid).all()

        for provider in providers:
            npi = provider.npi
            relation = db.session.query(MedicalRelation).filter(MedicalRelation.npi == npi, MedicalRelation.patientid == patientid).first()
            relation_obj = relation.to_dict()
            provider_obj = provider.to_dict()
            provider_relation_obj = {**provider_obj, **relation_obj}
            provider_relation_objs.append(provider_relation_obj)

        return jsonify(provider_relation_objs)

    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


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

    appointments = db.session.query(Appointment).all()
    appointment = db.session.query(Appointment).filter_by(start=dateutil.parser.parse(request.json['start']),
                                                          npi=request.json['npi'],
                                                          status='Scheduled').first()

    if appointment in appointments:
        return jsonify({'message': 'appointment time/day conflict -- provider unavailable'}), 409

    else:
        if 'patientid' in session:
            patientid = session.get('patientid')

            if patientid == request.json['patientid']:
                relation = db.session.query(MedicalRelation).filter(MedicalRelation.patientid == patientid,
                                                                    MedicalRelation.npi == request.json['npi']).one()

                if relation.consent:
                    new_appt = Appointment(**request.json, relationid=relation.relationid)
                    db.session.add(new_appt)
                    db.session.commit()
                    return jsonify(new_appt.to_dict())
                else:
                    return jsonify({'message': 'unauthorized access -- consent required'}), 403
            else:
                return jsonify({'message': 'unauthorized access'}), 403
        else:
            return jsonify({'message': 'invalid session -- login required'}), 401


# Update the status of an appointment
@app.route('/appointments/<apptid>/update-status', methods=['PUT'])
def update_appt(apptid):

    if 'patientid' in session:
        patientid = session.get('patientid')

        if patientid == request.json['patientid']:
            npi = request.json['npi']
            start = request.json['start']
            apptid = request.json['apptid']
            db.session.query(Appointment).filter_by(patientid=patientid, npi=npi, start=start, apptid=apptid).update(request.json)
            db.session.commit()
            return jsonify(request.json)
        else:
            return jsonify({'message': 'unauthorized access -- invalid session'}), 403

    elif 'npi' in session:
        npi = session.get('npi')

        if npi == request.json['npi']:
            patientid = request.json['patientid']
            start = request.json['start']
            apptid = request.json['apptid']
            db.session.query(Appointment).filter_by(patientid=patientid, npi=npi, start=start, apptid=apptid).update(request.json)
            db.session.commit()
            return jsonify(request.json)
        else:
            return jsonify({'message': 'unauthorized access -- invalid session'}), 403

    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# If user in session, get all user's appointments
@app.route('/appointments', methods=['GET'])
def get_appts():

    if 'patientid' in session:
        patientid = session.get('patientid')
        appointments = db.session.query(Appointment).filter(Appointment.patientid == patientid).order_by(Appointment.start.desc()).all()
        return jsonify([appointment.to_dict() for appointment in appointments])

    elif 'npi' in session:
        npi = session.get('npi')
        appointments = db.session.query(Appointment).filter(Appointment.npi == npi).order_by(Appointment.start.desc()).all()
        return jsonify([appointment.to_dict() for appointment in appointments])

    else:
        return jsonify({'message': 'invalid session -- login required'}), 401


# Get all scheduled appointment times for a provider
@app.route('/providers/<npi>/appointments', methods=['GET'])
def get_provider_appt_times(npi):

    keepers = set(['start', 'end', 'status'])

    all_appts = db.session.query(Appointment).filter_by(npi=npi, status='Scheduled').all()
    appt_obj_list = [appt.to_dict() for appt in all_appts]
    scheduled_times = [{k: appt[k] for k in keepers} for appt in appt_obj_list]

    return jsonify(scheduled_times)


# ####################################### TESTING ######################################## #


# Test if user session is successful
@app.route('/session', methods=['GET'])
def get_session_data():

    if 'patientid' in session and 'username' in session:
        return jsonify({'patientid': session['patientid'], 'username': session['username']})

    elif 'npi' in session and 'username' in session:
        return jsonify({'npi': session['npi'], 'username': session['username']})

    else:
        return jsonify({'message': 'invalid session'}), 401


# Get all medical relations between patients and providers
@app.route('/medical-relations/all', methods=['GET'])
def get_all_relations():

    all_relations = MedicalRelation.query.all()

    return jsonify([relation.to_dict() for relation in all_relations])


# Get all appointments
@app.route('/appointments/all', methods=['GET'])
def get_all_appts():

    all_appts = Appointment.query.all()

    return jsonify([appt.to_dict() for appt in all_appts])


if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)
