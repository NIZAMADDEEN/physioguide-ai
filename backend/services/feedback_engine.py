def compute_frame_accuracy(exercise_id, angles, phase):
    """
    Computes a real-time accuracy score (0-100) based on current joint angles 
    and target ranges for the active phase of the exercise.
    """
    if not angles:
        return 0.0

    score = 100.0

    # Fallback to whichever side is tracking best or available
    knee_angle = angles.get('left_knee', angles.get('right_knee', 180))
    elbow_angle = angles.get('left_elbow', angles.get('right_elbow', 180))

    if exercise_id == 'squats':
        if phase == 'down':
            # Target is ~90-100 degrees
            if knee_angle > 110:
                score -= min(50.0, (knee_angle - 110) * 1.5)
            elif knee_angle < 70:
                score -= min(30.0, (70 - knee_angle) * 1.5)

    elif exercise_id == 'shoulder-press':
        if phase == 'down':
            if elbow_angle > 110:
                score -= min(30.0, (elbow_angle - 110) * 1.5)
        elif phase == 'up':
            if elbow_angle < 140:
                score -= min(30.0, (140 - elbow_angle) * 1.5)

    elif exercise_id == 'bicep-curls':
        if phase == 'flexed':
            if elbow_angle > 70:
                score -= min(30.0, (elbow_angle - 70) * 1.5)
        elif phase == 'extended':
            if elbow_angle < 150:
                score -= min(30.0, (150 - elbow_angle) * 1.5)
    return max(0.0, min(100.0, score))


def generate_feedback(exercise_id, angles, landmarks, tracker_state):
    """
    Analyzes the current frame angles and generates corrective text feedback.
    Returns a list of dictionary: [{ 'type': 'info'|'warning'|'error', 'message': str, 'joint': str }]
    """
    feedback = []

    if not angles or not landmarks:
        return feedback

    phase = tracker_state.get('phase', 'idle')

    if exercise_id == 'squats':
        knee_angle = angles.get('left_knee', angles.get('right_knee', 180))
        hip_angle = angles.get('left_hip', angles.get('right_hip', 180))

        if phase == 'down':
            if knee_angle > 120:
                feedback.append({
                    'type': 'info',
                    'message': 'Go lower, try to reach 90 degrees.',
                    'joint': 'knee'
                })
            elif knee_angle < 70:
                feedback.append({
                    'type': 'warning',
                    'message': 'You are going too deep, raise your hips slightly.',
                    'joint': 'knee'
                })
            
            if hip_angle < 45:
                feedback.append({
                    'type': 'warning',
                    'message': 'Keep your back straighter, do not lean too far forward.',
                    'joint': 'hip'
                })

    elif exercise_id == 'knee-flexion':
        knee_angle = angles.get('left_knee', angles.get('right_knee', 180))
        if phase == 'flexed' and knee_angle > 100:
            feedback.append({
                'type': 'info',
                'message': 'Pull your heel closer to your body.',
                'joint': 'knee'
            })

    elif exercise_id in ['arm-raise', 'shoulder-abduction']:
        elbow_angle = angles.get('left_elbow', angles.get('right_elbow', 180))
        if elbow_angle < 150:
            feedback.append({
                'type': 'warning',
                'message': 'Keep your elbows straight.',
                'joint': 'elbow'
            })
            
    elif exercise_id == 'leg-lift':
        knee_angle = angles.get('left_knee', angles.get('right_knee', 180))
        if phase == 'up' and knee_angle < 160:
            feedback.append({
                'type': 'warning',
                'message': 'Keep your knee straight while lifting your leg.',
                'joint': 'knee'
            })
            
    elif exercise_id == 'shoulder-press':
        elbow_angle = angles.get('left_elbow', angles.get('right_elbow', 180))
        if phase == 'up' and elbow_angle < 140:
            feedback.append({
                'type': 'warning',
                'message': 'Extend your arms fully at the top.',
                'joint': 'elbow'
            })
        elif phase == 'down' and elbow_angle > 110:
            feedback.append({
                'type': 'info',
                'message': 'Lower your hands closer to your shoulders.',
                'joint': 'elbow'
            })
    elif exercise_id == 'bicep-curls':
        elbow_angle = angles.get('left_elbow', angles.get('right_elbow', 180))

        if phase == 'flexed' and elbow_angle > 70:
            feedback.append({
                'type': 'info',
                'message': 'Curl your hands closer to your shoulders.',
                'joint': 'elbow'
            })
        elif phase == 'extended' and elbow_angle < 150:
            feedback.append({
                'type': 'warning',
                'message': 'Fully extend your arms before the next curl.',
                'joint': 'elbow'
            })

    # Default positive reinforcement if doing well
    if not feedback and phase not in ('idle', 'up', 'extended', 'down', 'adducted'):
        feedback.append({
            'type': 'info',
            'message': 'Good form, keep going!',
            'joint': 'body'
        })

    return feedback
