from app.extensions import db

class Favorite(db.Model):
    __tablename__ = 'favorites'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lon = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(100), nullable=True)
    address = db.Column(db.String(300), nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'lat': self.lat,
            'lon': self.lon,
            'type': self.type,
            'address': self.address,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
