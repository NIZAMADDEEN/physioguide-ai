from sqlalchemy.orm import validates
from database import db

class Exercise(db.Model):
    __tablename__ = 'exercises'

    id = db.Column(db.String(50), primary_key=True) # e.g. 'squats', 'bicep-curls'
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), index=True, nullable=False)
    reps = db.Column(db.Integer, default=12)
    duration = db.Column(db.String(50), default='3 sets of 12 reps')
    description = db.Column(db.Text, nullable=True)

    # Relationships
    sessions = db.relationship('Session', backref='exercise', lazy=True)

    @validates('reps')
    def validate_reps(self, key, reps):
        if reps is not None and reps < 0:
            raise ValueError("Reps cannot be negative")
        return reps

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'reps': self.reps,
            'duration': self.duration,
            'description': self.description
        }
