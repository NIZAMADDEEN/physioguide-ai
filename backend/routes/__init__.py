from routes.auth import auth_bp
from routes.exercises import exercises_bp
from routes.sessions import sessions_bp
from routes.analytics import analytics_bp
from routes.reports import reports_bp
from routes.cv import cv_bp

__all__ = ['auth_bp', 'exercises_bp', 'sessions_bp', 'analytics_bp', 'reports_bp', 'cv_bp']
