from flask import Blueprint, request, jsonify
from database import db
from models.testimonial import Testimonial

testimonials_bp = Blueprint('testimonials', __name__)

@testimonials_bp.route('/', methods=['GET'])
def get_testimonials():
    testimonials = Testimonial.query.order_by(Testimonial.created_at.desc()).all()
    return jsonify([t.to_dict() for t in testimonials]), 200

@testimonials_bp.route('/', methods=['POST'])
def add_testimonial():
    data = request.get_json()
    
    name = data.get('name')
    role = data.get('role')
    content = data.get('content')
    avatar_url = data.get('avatar_url')
    
    if not name or not role or not content:
        return jsonify({'error': 'Name, role, and content are required'}), 400
        
    testimonial = Testimonial(
        name=name,
        role=role,
        content=content,
        avatar_url=avatar_url
    )
    
    db.session.add(testimonial)
    db.session.commit()
    
    return jsonify({
        'message': 'Testimonial successfully added',
        'testimonial': testimonial.to_dict()
    }), 201
