"""
routes/cv.py — Computer Vision API endpoints for PhysioGuide AI.

Blueprint: cv_bp  →  registered at  /api/cv

Endpoints:
  POST   /api/cv/process-frame    Process a base64 webcam frame
  POST   /api/cv/start-tracker    Initialize tracker for a session
  DELETE /api/cv/tracker/<id>     Clean up tracker state
  GET    /api/cv/exercises        List supported CV exercises
  GET    /api/cv/health           CV system health check
"""

import logging
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

logger = logging.getLogger(__name__)

# Graceful import — mediapipe may not be installed yet
try:
    from services.pose_detector import PoseDetector
    from services.angle_calculator import calculate_joint_angles
    from services.exercise_tracker import (
        get_or_create_tracker,
        get_tracker,
        remove_tracker,
        list_active_sessions,
        EXERCISE_CONFIGS,
        EXERCISE_ID_MAP,
    )
    from services.feedback_engine import generate_feedback, compute_frame_accuracy
    CV_AVAILABLE = True
except ImportError as _cv_import_err:
    logger.warning(
        '[CV] MediaPipe/OpenCV not installed yet — CV endpoints will return 503. '
        'Run: pip install mediapipe opencv-python-headless numpy'
    )
    CV_AVAILABLE = False

    # Stub functions so route handlers can always call them
    def _cv_unavailable(*args, **kwargs):
        return None
    PoseDetector = _cv_unavailable
    calculate_joint_angles = _cv_unavailable
    get_or_create_tracker = _cv_unavailable
    get_tracker = _cv_unavailable
    remove_tracker = _cv_unavailable
    list_active_sessions = lambda: []
    generate_feedback = _cv_unavailable
    compute_frame_accuracy = _cv_unavailable

cv_bp = Blueprint('cv', __name__)


# ── Supported exercise catalogue ───────────────────────────────────────────────
CV_EXERCISES = [
    {
        'id':          'squats',
        'name':        'Squats',
        'category':    'Knee Rehab',
        'targetReps':  12,
        'targetSets':  3,
        'primaryJoint':'knee',
        'description': 'Lower your hips by bending both knees to ~90°, keeping your back straight and heels flat. Rise back to standing.',
        'tips': [
            'Keep knees aligned over toes',
            'Back straight, chest up',
            'Go to parallel (90°) for best results',
        ],
    },
    {
        'id':          'knee-flexion',
        'name':        'Knee Flexion',
        'category':    'Knee Rehab',
        'targetReps':  15,
        'targetSets':  3,
        'primaryJoint':'knee',
        'description': 'Slowly bend and extend one knee through its full range of motion in a controlled manner.',
        'tips': [
            'Keep thigh still — only the lower leg moves',
            'Flex until you feel light resistance',
            'Extend fully at the top',
        ],
    },
    {
        'id':          'arm-raise',
        'name':        'Arm Raise',
        'category':    'Upper Body Mobility',
        'targetReps':  10,
        'targetSets':  3,
        'primaryJoint':'shoulder',
        'description': 'Raise both arms laterally or forward from your sides up to shoulder height or above.',
        'tips': [
            'Keep elbows straight throughout',
            'Raise to at least shoulder level',
            'Lower slowly — control the eccentric phase',
        ],
    },
    {
        'id':          'shoulder-abduction',
        'name':        'Shoulder Abduction',
        'category':    'Upper Body Mobility',
        'targetReps':  10,
        'targetSets':  3,
        'primaryJoint':'shoulder',
        'description': 'Abduct both arms out to the side up to shoulder or overhead level.',
        'tips': [
            'Keep shoulders level — do not shrug',
            'Both arms should move symmetrically',
            'Pause briefly at the top',
        ],
    },
    {
        'id':          'leg-lift',
        'name':        'Leg Lift',
        'category':    'Core & Hip Stability',
        'targetReps':  12,
        'targetSets':  3,
        'primaryJoint':'hip',
        'description': 'Lying or standing, raise one leg while keeping the knee fully straight.',
        'tips': [
            'Keep the lifted knee perfectly straight',
            'Engage your core throughout',
            'Do not rotate the pelvis',
        ],
    },
    {
        'id':          'shoulder-press',
        'name':        'Shoulder Press',
        'category':    'Upper Body Mobility',
        'targetReps':  10,
        'targetSets':  3,
        'primaryJoint':'elbow',
        'description': 'Press hands vertically upwards from shoulder level until your arms are fully extended overhead. Return slowly to shoulder height.',
        'tips': [
            'Extend arms fully at the top',
            'Lower weights to shoulder level',
            'Keep your back straight'
        ],
    },
    {
        'id':          'bicep-curls',
        'name':        'Bicep Curls',
        'category':    'Upper Body Mobility',
        'targetReps':  10,
        'targetSets':  3,
        'primaryJoint':'elbow',
        'description': 'Stand straight with your arms at your sides. Bend at the elbows to bring your hands to your shoulders, focusing on contracting the biceps. Lower your arms slowly back to the starting position.',
        'tips': [
            'Keep your elbows tucked close to your sides',
            'Avoid swinging your body for momentum',
            'Lower your arms slowly and with control',
        ],
    },
]


# ═══════════════════════════════════════════════════════════════════════════════
# GET /api/cv/exercises
# ═══════════════════════════════════════════════════════════════════════════════

@cv_bp.route('/exercises', methods=['GET'])
def get_cv_exercises():
    """Return all CV-supported exercises with their configuration."""
    return jsonify(CV_EXERCISES), 200


# ═══════════════════════════════════════════════════════════════════════════════
# GET /api/cv/health
# ═══════════════════════════════════════════════════════════════════════════════

@cv_bp.route('/health', methods=['GET'])
def cv_health():
    """Check that MediaPipe can be imported and the detector is available."""
    if not CV_AVAILABLE:
        return jsonify({'status': 'unavailable', 'mediapipe': 'not installed',
                        'message': 'Run: pip install mediapipe opencv-python-headless numpy'}), 503
    try:
        detector = PoseDetector.get_instance()
        active   = list_active_sessions()
        return jsonify({
            'status':         'healthy',
            'mediapipe':      'loaded',
            'activeSessions': len(active),
        }), 200
    except Exception as exc:
        logger.error('[CV Health] %s', exc)
        return jsonify({'status': 'unhealthy', 'error': str(exc)}), 503


# ═══════════════════════════════════════════════════════════════════════════════
# POST /api/cv/start-tracker
# ═══════════════════════════════════════════════════════════════════════════════

@cv_bp.route('/start-tracker', methods=['POST'])
@jwt_required()
def start_tracker():
    if not CV_AVAILABLE:
        return jsonify({'error': 'CV not available — mediapipe not installed'}), 503

    data        = request.get_json() or {}
    session_id  = data.get('sessionId')
    exercise_id = data.get('exerciseId', 'squats')

    if not session_id:
        return jsonify({'error': 'sessionId is required'}), 400

    remove_tracker(session_id)
    tracker = get_or_create_tracker(session_id, exercise_id)

    return jsonify({
        'message':    'Tracker initialized',
        'sessionId':  session_id,
        'exerciseId': exercise_id,
        **tracker.get_state(),
    }), 201


# ═══════════════════════════════════════════════════════════════════════════════
# POST /api/cv/process-frame
# ═══════════════════════════════════════════════════════════════════════════════

@cv_bp.route('/process-frame', methods=['POST'])
@jwt_required()
def process_frame():
    """
    Main computer vision endpoint.

    Accepts a base64 webcam frame, runs pose detection, computes joint
    angles, advances the rep tracker, and returns structured results.

    Request body:
    {
        "frame":      "<base64-encoded JPEG>",    # required
        "exerciseId": "squats",                   # required
        "sessionId":  "uuid"                      # required
    }

    Response:
    {
        "poseDetected":  true,
        "landmarks":     { "LEFT_KNEE": { x, y, z, visibility }, ... },
        "angles":        { "left_knee": 92.3, "right_knee": 88.1, ... },
        "phase":         "down",
        "reps":          3,
        "sets":          0,
        "accuracy":      87.5,
        "frameAccuracy": 91.0,
        "feedback":      [ { type, message, joint }, ... ],
        "milestone":     "Rep 3 complete! Form score: 88%",
        "elapsedSeconds":12.4
    }
    """
    data        = request.get_json() or {}
    frame_b64   = data.get('frame')
    exercise_id = data.get('exerciseId', 'squats')
    session_id  = data.get('sessionId')

    if not CV_AVAILABLE:
        return jsonify({'error': 'CV not available — mediapipe not installed'}), 503
    if not frame_b64:
        return jsonify({'error': 'frame (base64) is required'}), 400
    if not session_id:
        return jsonify({'error': 'sessionId is required'}), 400

    # ── Pose detection ─────────────────────────────────────────────────────────
    try:
        detector  = PoseDetector.get_instance()
        pose_result = detector.process_base64(frame_b64)
    except Exception as exc:
        logger.error('[CV process-frame] Pose detection error: %s', exc)
        return jsonify({'error': 'Pose detection failed', 'detail': str(exc)}), 500


    if not pose_result.pose_detected:
        logger.error('Posse detection failed: %s', exc)
        return jsonify({
            'poseDetected':   False,
            'landmarks':      {},
            'angles':         {},
            'phase':          'idle',
            'reps':           0,
            'sets':           0,
            'accuracy':       0.0,
            'frameAccuracy':  0.0,
            'feedback': [{
                'type':    'info',
                'message': 'No pose detected. Step back so your full body is visible.',
                'joint':   'body',
            }],
            'milestone':      None,
            'elapsedSeconds': 0.0,
        }), 200

    # ── Angle calculation ──────────────────────────────────────────────────────
    landmarks = pose_result.landmarks
    try:
        angles = calculate_joint_angles(landmarks, exercise_id)
    except Exception as exc:
        logger.error('[CV process-frame] Angle calculation error: %s', exc)
        angles = {}

    # ── Rep tracking ───────────────────────────────────────────────────────────
    tracker = get_or_create_tracker(session_id, exercise_id)

    # Generate feedback first so corrections are available to tracker
    feedback = generate_feedback(
        exercise_id=exercise_id,
        angles=angles,
        landmarks=landmarks,
        tracker_state=tracker.get_state(),
    )
    correction_msgs = [f['message'] for f in feedback if f['type'] in ('warning', 'error')]

    tracker_result = tracker.update(angles, correction_msgs)
    milestone      = tracker_result.get('milestone')

    # ── Frame accuracy ─────────────────────────────────────────────────────────
    frame_accuracy = compute_frame_accuracy(
        exercise_id=exercise_id,
        angles=angles,
        phase=tracker_result.get('phase', 'idle'),
    )

    # ── Serialize landmarks (only key joints to reduce payload size) ───────────
    key_joints = {
        'LEFT_SHOULDER', 'RIGHT_SHOULDER',
        'LEFT_ELBOW',    'RIGHT_ELBOW',
        'LEFT_WRIST',    'RIGHT_WRIST',
        'LEFT_HIP',      'RIGHT_HIP',
        'LEFT_KNEE',     'RIGHT_KNEE',
        'LEFT_ANKLE',    'RIGHT_ANKLE',
        'NOSE',
    }
    landmarks_dict = {
        name: lm.to_dict()
        for name, lm in landmarks.items()
        if name in key_joints
    }

    return jsonify({
        'poseDetected':       True,
        'detectionConfidence': round(pose_result.detection_confidence, 3),
        'landmarks':          landmarks_dict,
        'angles':             angles,
        'phase':              tracker_result.get('phase', 'idle'),
        'reps':               tracker_result.get('reps', 0),
        'sets':               tracker_result.get('sets', 0),
        'targetReps':         tracker_result.get('targetReps', 12),
        'targetSets':         tracker_result.get('targetSets', 3),
        'accuracy':           tracker_result.get('accuracy', 0.0),
        'frameAccuracy':      frame_accuracy,
        'feedback':           feedback,
        'milestone':          milestone,
        'elapsedSeconds':     tracker_result.get('elapsedSeconds', 0.0),
    }), 200


# ═══════════════════════════════════════════════════════════════════════════════
# DELETE /api/cv/tracker/<session_id>
# ═══════════════════════════════════════════════════════════════════════════════

@cv_bp.route('/tracker/<string:session_id>', methods=['DELETE'])
@jwt_required()
def cleanup_tracker(session_id: str):
    """Remove the in-memory tracker for a completed session."""
    removed = remove_tracker(session_id)
    if removed:
        return jsonify({'message': f'Tracker for session {session_id} removed.'}), 200
    return jsonify({'error': 'Tracker not found'}), 404


# ═══════════════════════════════════════════════════════════════════════════════
# GET /api/cv/tracker/<session_id>/state
# ═══════════════════════════════════════════════════════════════════════════════

@cv_bp.route('/tracker/<string:session_id>/state', methods=['GET'])
@jwt_required()
def get_tracker_state(session_id: str):
    """Return current tracker state without processing a new frame."""
    tracker = get_tracker(session_id)
    if not tracker:
        return jsonify({'error': 'No active tracker for this session'}), 404
    return jsonify(tracker.get_state()), 200
