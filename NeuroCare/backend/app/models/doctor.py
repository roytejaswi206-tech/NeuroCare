from app.extensions import db

class Doctor(db.Model):
    __tablename__ = 'doctors'
    
    id = db.Column(db.Integer, primary_key=True)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospitals.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    specialization = db.Column(db.String(200), nullable=False)
    qualification = db.Column(db.String(200), nullable=True)
    experience = db.Column(db.Integer, default=0)  # years
    timing = db.Column(db.String(100), nullable=True)  # e.g., "9 AM - 5 PM"
    fees = db.Column(db.Float, default=0.0)
    available = db.Column(db.Boolean, default=True)
    approved = db.Column(db.Boolean, default=False)
    phone = db.Column(db.String(50), nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'hospital_id': self.hospital_id,
            'name': self.name,
            'specialization': self.specialization,
            'qualification': self.qualification,
            'experience': self.experience,
            'timing': self.timing,
            'fees': self.fees,
            'available': self.available,
            'approved': self.approved,
            'phone': self.phone,
        }
