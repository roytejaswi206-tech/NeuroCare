from app.extensions import db

class Hospital(db.Model):
    __tablename__ = 'hospitals'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    address = db.Column(db.String(500), nullable=True)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    contact = db.Column(db.String(50), nullable=True)
    rating = db.Column(db.Float, default=0.0)
    available_24x7 = db.Column(db.Boolean, default=False)
    mental_health_services = db.Column(db.Boolean, default=True)
    
    doctors = db.relationship('Doctor', backref='hospital', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'address': self.address,
            'lat': self.lat,
            'lng': self.lng,
            'contact': self.contact,
            'rating': self.rating,
            'available_24x7': self.available_24x7,
            'mental_health_services': self.mental_health_services
        }
