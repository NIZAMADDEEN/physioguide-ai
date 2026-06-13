from flask import Blueprint, request, jsonify
from models.exercise import Exercise

exercises_bp = Blueprint('exercises', __name__)

@exercises_bp.route('', methods=['GET'])
def get_all_exercises():
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    
    query = Exercise.query
    if search:
        query = query.filter(Exercise.name.ilike(f'%{search}%'))
    if category:
        query = query.filter(Exercise.category.ilike(f'%{category}%'))
        
    exercises = query.all()
    return jsonify([ex.to_dict() for ex in exercises]), 200

@exercises_bp.route('/<string:id>', methods=['GET'])
def get_exercise_by_id(id):
    exercise = Exercise.query.get(id)
    if not exercise:
        return jsonify({'error': 'Exercise not found'}), 404
    return jsonify(exercise.to_dict()), 200
