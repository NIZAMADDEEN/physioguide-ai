def auto_end_active_sessions():
    from app import create_app
    from models.session import Session
    from models.report import Report
    from models.user import User
    from database import db
    import uuid
    from datetime import datetime, timedelta

    app = create_app()

    with app.app_context():
        now = datetime.utcnow()

        sessions = Session.query.filter(
            Session.status == 'active',
            Session.ended_at == None
        ).all()

        for session in sessions:
            if session.started_at and session.started_at < now - timedelta(hours=2):

                reps = session.reps or 0
                accuracy = session.accuracy or 85
                duration = int((now - session.started_at).total_seconds())

                session.reps = reps
                session.accuracy = accuracy
                session.duration = duration
                session.ended_at = now
                session.status = 'completed'

                user = User.query.get(session.user_id)
                user_name = user.name if user else 'Patient'
                exercise_name = session.exercise.name if session.exercise else 'Exercise'

                report = Report(
                    id=f"rep-{str(uuid.uuid4())[:8]}",
                    user_id=session.user_id,
                    title=f"Assessment Report — {exercise_name}",
                    created_at=now
                )

                report.set_summary({
                    'user_name': user_name,
                    'exercise_name': exercise_name,
                    'reps': reps,
                    'accuracy': accuracy,
                    'duration': duration,
                    'session_id': session.id
                })

                db.session.add(report)

        db.session.commit()