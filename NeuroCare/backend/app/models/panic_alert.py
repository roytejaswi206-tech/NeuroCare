from app.extensions import db
from datetime import datetime

class PanicAlert(db.Model):
    __tablename__ = 'panic_alerts'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    lat = db.Column(db.Float, nullable=True)
    lng = db.Column(db.Float, nullable=True)
    location_description = db.Column(db.String(500), nullable=True)
    severity = db.Column(db.String(50), nullable=False, default='medium')
    notes = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'lat': self.lat,
            'lng': self.lng,
            'location_description': self.location_description,
            'severity': self.severity,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
