import numpy as np
import math

def calculate_angle(a, b, c):
    """
    Calculate the angle between three points a, b, c.
    Each point is an object with x and y coordinates.
    Angle is calculated at point b.
    Returns the angle in degrees between 0 and 180.
    """
    a = np.array([a.x, a.y])
    b = np.array([b.x, b.y])
    c = np.array([c.x, c.y])

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle

def calculate_joint_angles(landmarks, exercise_id):
    """
    Given the landmarks dictionary and the exercise type,
    calculates the relevant joint angles.
    """
    angles = {}
    
    try:
        # Default angles calculated for most exercises
        if 'LEFT_HIP' in landmarks and 'LEFT_KNEE' in landmarks and 'LEFT_ANKLE' in landmarks:
            angles['left_knee'] = calculate_angle(landmarks['LEFT_HIP'], landmarks['LEFT_KNEE'], landmarks['LEFT_ANKLE'])
        
        if 'RIGHT_HIP' in landmarks and 'RIGHT_KNEE' in landmarks and 'RIGHT_ANKLE' in landmarks:
            angles['right_knee'] = calculate_angle(landmarks['RIGHT_HIP'], landmarks['RIGHT_KNEE'], landmarks['RIGHT_ANKLE'])
            
        if 'LEFT_SHOULDER' in landmarks and 'LEFT_ELBOW' in landmarks and 'LEFT_WRIST' in landmarks:
            angles['left_elbow'] = calculate_angle(landmarks['LEFT_SHOULDER'], landmarks['LEFT_ELBOW'], landmarks['LEFT_WRIST'])
            
        if 'RIGHT_SHOULDER' in landmarks and 'RIGHT_ELBOW' in landmarks and 'RIGHT_WRIST' in landmarks:
            angles['right_elbow'] = calculate_angle(landmarks['RIGHT_SHOULDER'], landmarks['RIGHT_ELBOW'], landmarks['RIGHT_WRIST'])

        if 'LEFT_HIP' in landmarks and 'LEFT_SHOULDER' in landmarks and 'LEFT_ELBOW' in landmarks:
            angles['left_shoulder'] = calculate_angle(landmarks['LEFT_HIP'], landmarks['LEFT_SHOULDER'], landmarks['LEFT_ELBOW'])

        if 'RIGHT_HIP' in landmarks and 'RIGHT_SHOULDER' in landmarks and 'RIGHT_ELBOW' in landmarks:
            angles['right_shoulder'] = calculate_angle(landmarks['RIGHT_HIP'], landmarks['RIGHT_SHOULDER'], landmarks['RIGHT_ELBOW'])

        # Hip angle (Shoulder -> Hip -> Knee)
        if 'LEFT_SHOULDER' in landmarks and 'LEFT_HIP' in landmarks and 'LEFT_KNEE' in landmarks:
            angles['left_hip'] = calculate_angle(landmarks['LEFT_SHOULDER'], landmarks['LEFT_HIP'], landmarks['LEFT_KNEE'])

        if 'RIGHT_SHOULDER' in landmarks and 'RIGHT_HIP' in landmarks and 'RIGHT_KNEE' in landmarks:
            angles['right_hip'] = calculate_angle(landmarks['RIGHT_SHOULDER'], landmarks['RIGHT_HIP'], landmarks['RIGHT_KNEE'])

    except Exception as e:
        # Gracefully handle missing points if visibility is too low
        pass

    return angles
