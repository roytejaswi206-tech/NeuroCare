from app.extensions import db
from datetime import datetime

class Appointment(db.Model):
    __tablename__ = 'appointments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospitals.id'), nullable=False)
    scheduled_for = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    doctor = db.relationship('Doctor', backref='appointments', lazy=True)
    hospital = db.relationship('Hospital', backref='appointments', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'doctor_id': self.doctor_id,
            'hospital_id': self.hospital_id,
            'scheduled_for': self.scheduled_for.isoformat() if self.scheduled_for else None,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'doctor': self.doctor.to_dict() if self.doctor else None,
            'hospital': self.hospital.to_dict() if self.hospital else None,
        }
