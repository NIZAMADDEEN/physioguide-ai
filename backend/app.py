import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

# Load env variables before config
load_dotenv()

from config import Config
from database import db
from models.exercise import Exercise
from routes import auth_bp, exercises_bp, sessions_bp, analytics_bp, reports_bp, cv_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize Database & JWT
    db.init_app(app)
    from flask_migrate import Migrate
    migrate = Migrate(app, db)
    jwt = JWTManager(app)

    # Register Route Blueprints
    app.register_blueprint(auth_bp,      url_prefix='/api/auth')
    app.register_blueprint(exercises_bp,  url_prefix='/api/exercises')
    app.register_blueprint(sessions_bp,   url_prefix='/api/sessions')
    app.register_blueprint(analytics_bp,  url_prefix='/api/analytics')
    app.register_blueprint(reports_bp,    url_prefix='/api/reports')
    app.register_blueprint(cv_bp,         url_prefix='/api/cv')

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'message': 'PhysioGuide AI Backend is running'}), 200

    # Database creation & Seeding
    with app.app_context():
        # Using db.create_all() as a fallback for missing tables in local dev, though migrations handle this now.
        db.create_all()
        seed_exercises()

    return app

def seed_exercises():
    """
    Seeds standard therapy exercises on startup if the database table is empty.
    """
    if Exercise.query.first() is not None:
        return # Seeded already
        
    default_exercises = [
        Exercise(
            id='squats',
            name='Squats',
            category='Knee Rehab',
            reps=12,
            duration='3 sets of 12 reps',
            description='Slowly lower your hips by flexing your knees, keeping your back straight and heels flat on the floor. Raise back up to start.'
        ),
        Exercise(
            id='bicep-curls',
            name='Bicep Curls',
            category='Upper Body Mobility',
            reps=10,
            duration='3 sets of 10 reps',
            description='Stand straight with arms at your side. Bend at the elbows to bring your hands to your shoulders, focusing on contracting the biceps.'
        ),
        Exercise(
            id='shoulder-press',
            name='Shoulder Press',
            category='Upper Body Mobility',
            reps=10,
            duration='3 sets of 10 reps',
            description='Press hands vertically upwards from shoulder level until your arms are fully extended overhead. Return slowly to shoulder height.'
        )
    ]

    for ex in default_exercises:
        db.session.add(ex)
    db.session.commit()
    print("[Seeding] Database successfully seeded with default therapy exercises.")

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
