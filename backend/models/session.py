from datetime import datetime
from sqlalchemy.orm import validates
from database import db

class Session(db.Model):
    __tablename__ = 'sessions'

    id = db.Column(db.String(50), primary_key=True) # UUID string
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), index=True, nullable=False)
    exercise_id = db.Column(db.String(50), db.ForeignKey('exercises.id', ondelete='CASCADE'), index=True, nullable=False)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    ended_at = db.Column(db.DateTime, nullable=True)
    reps = db.Column(db.Integer, default=0)
    accuracy = db.Column(db.Integer, default=0)
    duration = db.Column(db.Integer, nullable=True) # duration in seconds
    status = db.Column(db.String(20), default='active') # 'active' or 'completed'

    @validates('reps')
    def validate_reps(self, key, reps):
        if reps is not None and reps < 0:
            raise ValueError("Reps cannot be negative")
        return reps

    @validates('accuracy')
    def validate_accuracy(self, key, accuracy):
        if accuracy is not None and (accuracy < 0 or accuracy > 100):
            raise ValueError("Accuracy must be between 0 and 100")
        return accuracy

    @validates('duration')
    def validate_duration(self, key, duration):
        if duration is not None and duration < 0:
            raise ValueError("Duration cannot be negative")
        return duration

    def to_dict(self):
        return {
            'sessionId': self.id,
            'userId': self.user_id,
            'exerciseId': self.exercise_id,
            'startedAt': self.started_at.isoformat() if self.started_at else None,
            'endedAt': self.ended_at.isoformat() if self.ended_at else None,
            'reps': self.reps,
            'accuracy': self.accuracy,
            'duration': self.duration,
            'status': self.status,
            'exercise': self.exercise.to_dict() if self.exercise else None
        }
