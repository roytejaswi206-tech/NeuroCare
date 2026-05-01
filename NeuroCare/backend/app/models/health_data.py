from app.extensions import db
from datetime import datetime

class HealthData(db.Model):
    __tablename__ = 'health_data'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    bp = db.Column(db.String(20), nullable=True)  # Blood pressure as string like "120/80"
    sugar = db.Column(db.Integer, nullable=True)  # Blood sugar level
    sleep = db.Column(db.Integer, nullable=True)  # Sleep hours
    heart_rate = db.Column(db.Integer, nullable=True)
    weight = db.Column(db.Float, nullable=True)
    mood = db.Column(db.String(50), nullable=True)  # anxiety, calm, happy, sad, etc.
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'bp': self.bp,
            'sugar': self.sugar,
            'sleep': self.sleep,
            'heart_rate': self.heart_rate,
            'weight': self.weight,
            'mood': self.mood,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
