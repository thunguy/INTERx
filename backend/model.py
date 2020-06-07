"""Models for INTERx app."""

from flask_sqlalchemy import SQLAlchemy
# from datetime import datetime

db = SQLAlchemy()


class Patient(db.Model):
    __tablename__ = 'patients'

    patientid = db.Column(db.Integer, autoincrement=True, primary_key=True)
    fname = db.Column(db.String)
    lname = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    dob = db.Column(db.Date)
    sex = db.Column(db.String)
    activityid = db.Column(db.String, db.ForeignKey('activities.activityid'), nullable=True)

    activity = db.relationship('Activity', backref='patients')

    def __repr__(self):
        return f'<Patient patientid={self.patientid} fname={self.fname} lname={self.lname} birthdate={self.dob}>'

    def to_dict(self):
        return {
            'patientid': self.patientid,
            'fname': self.fname,
            'lname': self.lname,
            'email': self.email,
            'username': self.username,
            'password': self.password,
            'dob': str(self.dob),
            'sex': self.sex
        }


class Provider(db.Model):
    __tablename__ = 'providers'

    npi = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String)
    lname = db.Column(db.String)
    specialty = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    accepting_new_patients = db.Column(db.Boolean, default=True)
    suffix = db.Column(db.String, nullable=True)
    sex = db.Column(db.String)

    def __repr__(self):
        if self.suffix:
            return f'<Provider NPI={self.npi} name={self.fname} {self.lname}, {self.suffix}>'
        else:
            return f'<Provider NPI={self.npi} name={self.fname} {self.lname}>'


class Activity(db.Model):
    __tablename__ = 'activities'

    activityid = db.Column(db.String, primary_key=True)

    def __repr__(self):
        return f'<Activity activity={self.activityid}>'


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


class MedicalRecord(db.Model):
    __tablename__ = 'records'

    recordid = db.Column(db.Integer, autoincrement=True, primary_key=True)
    createdat = db.Column(db.DateTime)
    documentation = db.Column(db.Text)
    rx = db.Column(db.Text)
    goal = db.Column(db.Text)
    relationid = db.Column(db.Integer, db.ForeignKey('relations.relationid'))
    apptid = db.Column(db.Integer, db.ForeignKey('appts.apptid'), nullable=True)

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
    status = db.Column(db.String)
    relationid = db.Column(db.Integer, db.ForeignKey('relations.relationid'))

    relation = db.relationship('MedicalRelation', backref='appts')

    def __repr__(self):
        return (f'<Appointment apptid={self.apptid} relationid={self.relationid} '
                f'when={self.start} status={self.status}>')


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
