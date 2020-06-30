"""Models for INTERx app."""

from flask_sqlalchemy import SQLAlchemy
import bcrypt
# from datetime import datetime

db = SQLAlchemy()


class Patient(db.Model):
    __tablename__ = 'patients'

    patientid = db.Column(db.Integer, autoincrement=True, primary_key=True, nullable=False)
    fname = db.Column(db.String, nullable=False)
    lname = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.Binary(128), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    sex = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    city = db.Column(db.String, nullable=False)
    state = db.Column(db.String(2), nullable=False)
    zipcode = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, nullable=False)
    virtualid = db.Column(db.String)
    summary = db.Column(db.Text)

    activityid = db.Column(db.String, db.ForeignKey('activities.activityid'))

    activity = db.relationship('Activity', backref='patients')

    def __repr__(self):
        return f'<Patient patientid={self.patientid} fname={self.fname} lname={self.lname} username={self.username} birthdate={self.dob}>'

    # Check if password matches with hashed password
    def check_password(self, password):
        password = password.encode('utf-8')
        return bcrypt.checkpw(password, self.password_hash)

    def to_dict(self):
        return {
            'patientid': self.patientid,
            'fname': self.fname,
            'lname': self.lname,
            'email': self.email,
            'username': self.username,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zipcode': self.zipcode,
            'phone': self.phone,
            'dob': str(self.dob),
            'sex': self.sex,
            'virtualid': self.virtualid,
            'summary': self.summary,
            'user': 'patient'
        }


class Provider(db.Model):
    __tablename__ = 'providers'

    npi = db.Column(db.Integer, primary_key=True, nullable=False)
    fname = db.Column(db.String, nullable=False)
    lname = db.Column(db.String, nullable=False)
    specialty = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.Binary(128), nullable=False)
    sex = db.Column(db.String, nullable=False)
    address = db.Column(db.String, nullable=False)
    city = db.Column(db.String, nullable=False)
    state = db.Column(db.String(2), nullable=False)
    zipcode = db.Column(db.String, nullable=False)
    phone = db.Column(db.String, nullable=False)
    accepting_new_patients = db.Column(db.Boolean, default=True)
    inperson = db.Column(db.Boolean, default=True)
    virtual = db.Column(db.Boolean, default=True)
    virtualid = db.Column(db.String)
    credential = db.Column(db.String)
    summary = db.Column(db.Text)

    activities = db.relationship('ProviderActivity', backref='providers')

    def __repr__(self):
        if self.credential:
            return f'<Provider NPI={self.npi} username={self.username} name={self.fname} {self.lname}, {self.credential}>'
        else:
            return f'<Provider NPI={self.npi} username={self.username} name={self.fname} {self.lname}>'

    # Check if password matches with hashed password
    def check_password(self, password):
        password = password.encode("utf-8")
        return bcrypt.checkpw(password, self.password_hash)

    def to_dict(self):
        return {
            'npi': self.npi,
            'fname': self.fname,
            'lname': self.lname,
            'specialty': self.specialty,
            'email': self.email,
            'username': self.username,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zipcode': self.zipcode,
            'phone': self.phone,
            'accepting_new_patients': self.accepting_new_patients,
            'credential': self.credential,
            'sex': self.sex,
            'activities': [activity.activityid for activity in self.activities],
            'summary': self.summary,
            'inperson': self.inperson,
            'virtual': self.virtual,
            'virtualid': self.virtualid,
            'user': 'provider'
        }


class Activity(db.Model):
    __tablename__ = 'activities'

    activityid = db.Column(db.String, primary_key=True, nullable=False)

    def __repr__(self):
        return f'<Activity activity={self.activityid}>'

    def to_dict(self):
        return {
            'activityid': self.activityid
        }


class ProviderActivity(db.Model):
    __tablename__ = 'links'

    linkid = db.Column(db.Integer, autoincrement=True, primary_key=True)
    npi = db.Column(db.Integer, db.ForeignKey('providers.npi'))
    activityid = db.Column(db.String, db.ForeignKey('activities.activityid'))

    provider = db.relationship('Provider', backref='links')
    activity = db.relationship('Activity', backref='links')

    def __repr__(self):
        return f'ProviderActivity provider={self.npi} activity={self.activityid}'


class MedicalRelation(db.Model):
    __tablename__ = 'relations'

    relationid = db.Column(db.Integer, autoincrement=True, primary_key=True)
    consent = db.Column(db.Boolean, default=False)
    patientid = db.Column(db.Integer, db.ForeignKey('patients.patientid'))
    npi = db.Column(db.Integer, db.ForeignKey('providers.npi'))

    patient = db.relationship('Patient', backref='relations')
    provider = db.relationship('Provider', backref='relations')

    def __repr__(self):
        return (f'<Relation relationid={self.relationid} npi={self.npi} '
                f'patientid={self.patientid} consent={self.consent}>')

    def to_dict(self):
        return {
            'relationid': self.relationid,
            'consent': self.consent,
            'patientid': self.patientid,
            'npi': self.npi,
            'patient': f'{self.patient.fname} {self.patient.lname}',
            'provider': f'{self.provider.fname} {self.provider.lname}, {self.provider.credential}'
        }


class MedicalRecord(db.Model):
    __tablename__ = 'records'

    recordid = db.Column(db.Integer, autoincrement=True, primary_key=True)
    createdat = db.Column(db.DateTime)
    documentation = db.Column(db.Text)
    rx = db.Column(db.Text)
    relationid = db.Column(db.Integer, db.ForeignKey('relations.relationid'))
    apptid = db.Column(db.Integer, db.ForeignKey('appts.apptid'))
    patientid = db.Column(db.Integer, db.ForeignKey('patients.patientid'))
    npi = db.Column(db.Integer, db.ForeignKey('providers.npi'))

    patient = db.relationship('Patient', backref='records')
    provider = db.relationship('Provider', backref='records')
    relation = db.relationship('MedicalRelation', backref='records')
    appt = db.relationship('Appointment', backref='records')

    def __repr__(self):
        return (f'<Record recordid={self.recordid} createdat={self.npi} '
                f'patientid={self.patientid} consent={self.consent}>')


class Appointment(db.Model):
    __tablename__ = 'appts'

    apptid = db.Column(db.Integer, autoincrement=True, primary_key=True)
    start = db.Column(db.DateTime(timezone=True))
    end = db.Column(db.DateTime(timezone=True))
    location = db.Column(db.String)
    reason = db.Column(db.Text)
    goal = db.Column(db.Text)
    status = db.Column(db.String)
    patientid = db.Column(db.Integer, db.ForeignKey('patients.patientid'))
    npi = db.Column(db.Integer, db.ForeignKey('providers.npi'))
    relationid = db.Column(db.Integer, db.ForeignKey('relations.relationid'))
    activityid = db.Column(db.String, db.ForeignKey('activities.activityid'))

    patient = db.relationship('Patient', backref='appts')
    provider = db.relationship('Provider', backref='appts')
    relation = db.relationship('MedicalRelation', backref='appts')
    activity = db.relationship('Activity', backref='appts')

    def __repr__(self):
        return (f'<Appointment apptid={self.apptid} patient={self.patientid} provider={self.npi} '
                f'relationid={self.relationid} start={self.start} status={self.status}>')

    def to_dict(self):
        return {
            'apptid': self.apptid,
            'start': self.start,
            'end': self.end,
            'location': self.location,
            'reason': self.reason,
            'goal': self.goal,
            'status': self.status,
            'patientid': self.patientid,
            'npi': self.npi,
            'relationid': self.relationid,
            'activityid': self.activityid,
            'provider': f'{self.provider.fname} {self.provider.lname}, {self.provider.credential}'
        }


def connect_to_db(app):
    """Connect the database to our Flask app."""

    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///interx"
    app.config["SQLALCHEMY_ECHO"] = False
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)


if __name__ == "__main__":
    # As a convenience, if we run this module interactively, it will leave
    # you in a state of being able to work with the database directly.

    from server import app
    connect_to_db(app)
