import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.session import Session
from models.exercise import Exercise
from models.report import Report
from models.user import User
from database import db

sessions_bp = Blueprint('sessions', __name__)

@sessions_bp.route('', methods=['POST'])
@jwt_required()
def start_session():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    exercise_id = data.get('exerciseId')

    if not exercise_id:
        return jsonify({'error': 'Exercise ID is required'}), 400

    exercise = Exercise.query.get(exercise_id)
    if not exercise:
        return jsonify({'error': 'Exercise not found'}), 404

    session_id = str(uuid.uuid4())
    new_session = Session(
        id=session_id,
        user_id=user_id,
        exercise_id=exercise_id,
        started_at=datetime.utcnow(),
        status='active',
        reps=0,
        accuracy=0
    )

    db.session.add(new_session)
    db.session.commit()

    return jsonify(new_session.to_dict()), 201

@sessions_bp.route('/<string:id>', methods=['PUT'])
@jwt_required()
def update_session(id):
    data = request.get_json() or {}
    reps = data.get('reps')
    accuracy = data.get('accuracy')

    session = Session.query.get(id)
    if not session:
        return jsonify({'error': 'Session not found'}), 404

    # Allow updates to reps and accuracy
    if reps is not None:
        session.reps = reps
    if accuracy is not None:
        session.accuracy = accuracy

    db.session.commit()
    return jsonify(session.to_dict()), 200

@sessions_bp.route('/<string:id>/end', methods=['POST'])
@jwt_required()
def end_session(id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    reps = data.get('reps', 0)
    accuracy = data.get('accuracy', 85)
    duration = data.get('duration') # in seconds

    session = Session.query.get(id)
    if not session:
        return jsonify({'error': 'Session not found'}), 404

    session.reps = reps
    session.accuracy = accuracy
    session.duration = duration
    session.ended_at = datetime.utcnow()
    session.status = 'completed'

    # Auto-generate a clinical report record for completed session
    user = User.query.get(user_id)
    user_name = user.name if user else 'Patient'
    exercise_name = session.exercise.name if session.exercise else 'Exercise'
    
    report_id = f"rep-{str(uuid.uuid4())[:8]}"
    new_report = Report(
        id=report_id,
        user_id=user_id,
        title=f"Assessment Report — {exercise_name}",
        created_at=datetime.utcnow()
    )
    new_report.set_summary({
        'user_name': user_name,
        'exercise_name': exercise_name,
        'reps': reps,
        'accuracy': accuracy,
        'duration': duration,
        'session_id': id
    })

    db.session.add(new_report)
    db.session.commit()

    return jsonify({
        'session': session.to_dict(),
        'report': new_report.to_dict()
    }), 200
