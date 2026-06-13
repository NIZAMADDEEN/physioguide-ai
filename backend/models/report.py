from datetime import datetime
import json
from sqlalchemy.orm import validates
from database import db

class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.String(50), primary_key=True) # UUID string or slug
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), index=True, nullable=False)
    title = db.Column(db.String(150), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    summary_data = db.Column(db.Text, nullable=True) # JSON serialized string containing metrics, targets, progress

    @validates('title')
    def validate_title(self, key, title):
        if not title or len(title.strip()) == 0:
            raise ValueError("Report title cannot be empty")
        return title

    def set_summary(self, data_dict):
        self.summary_data = json.dumps(data_dict)

    def get_summary(self):
        if not self.summary_data:
            return {}
        try:
            return json.loads(self.summary_data)
        except Exception:
            return {}

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'title': self.title,
            'date': self.created_at.isoformat() if self.created_at else None,
            'status': 'available',
            'summary': self.get_summary()
        }
