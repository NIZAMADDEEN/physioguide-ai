from flask import Blueprint, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.report import Report
from models.session import Session
from services.pdf_service import generate_report_pdf

reports_bp = Blueprint('reports', __name__)

@reports_bp.route('', methods=['GET'])
@jwt_required()
def get_reports():
    user_id = int(get_jwt_identity())
    reports = Report.query.filter_by(user_id=user_id).order_by(Report.created_at.desc()).all()
    return jsonify([rep.to_dict() for rep in reports]), 200

@reports_bp.route('/<string:id>', methods=['GET'])
@jwt_required()
def get_report_by_id(id):
    report = Report.query.get(id)
    if not report:
        return jsonify({'error': 'Report not found'}), 404
    return jsonify(report.to_dict()), 200

@reports_bp.route('/<string:id>/export', methods=['GET'])
@jwt_required()
def export_report_pdf(id):
    user_id = int(get_jwt_identity())
    report = Report.query.get(id)
    if not report:
        return jsonify({'error': 'Report not found'}), 404

    if report.user_id != user_id:
        return jsonify({'error': 'Unauthorized access to report'}), 403

    # Fetch user's completed session history for the PDF table
    session_history = Session.query.filter_by(
        user_id=user_id,
        status='completed'
    ).order_by(Session.started_at.desc()).limit(5).all()

    # Generate PDF
    pdf_buffer = generate_report_pdf(report, session_history)

    return send_file(
        pdf_buffer,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f"PhysioGuide_Report_{id}.pdf"
    )
