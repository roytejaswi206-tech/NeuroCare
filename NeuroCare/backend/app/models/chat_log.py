from app.extensions import db
from datetime import datetime

class ChatLog(db.Model):
    __tablename__ = 'chat_logs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String(1000), nullable=False)
    response_type = db.Column(db.String(100), nullable=True)
    flagged = db.Column(db.Boolean, nullable=False, default=False)
    keywords = db.Column(db.String(250), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'message': self.message,
            'response_type': self.response_type,
            'flagged': self.flagged,
            'keywords': self.keywords,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
