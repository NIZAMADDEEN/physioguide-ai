import time

EXERCISE_CONFIGS = {
    'squats': {
        'id': 'squats',
        'targetReps': 12,
        'targetSets': 3,
        'downThreshold': 110,
        'upThreshold': 160
    },
    'knee-flexion': {
        'id': 'knee-flexion',
        'targetReps': 15,
        'targetSets': 3,
        'flexThreshold': 120,
        'extendThreshold': 160
    },
    'arm-raise': {
        'id': 'arm-raise',
        'targetReps': 10,
        'targetSets': 3,
        'raiseThreshold': 110,
        'lowerThreshold': 30
    },
    'shoulder-abduction': {
        'id': 'shoulder-abduction',
        'targetReps': 10,
        'targetSets': 3,
        'raiseThreshold': 90,
        'lowerThreshold': 30
    },
    'leg-lift': {
        'id': 'leg-lift',
        'targetReps': 12,
        'targetSets': 3,
        'raiseThreshold': 120, # Hip angle when leg is lifted
        'lowerThreshold': 160  # Hip angle when leg is down
    },
    'shoulder-press': {
        'id': 'shoulder-press',
        'targetReps': 10,
        'targetSets': 3,
        'extendThreshold': 150,
        'flexThreshold': 90
    },
        'bicep-curls': {
        'id': 'bicep-curls',
        'targetReps': 10,
        'targetSets': 3,
        'flexThreshold': 60,    # Elbow angle at the top of the curl
        'extendThreshold': 160  # Elbow angle when the arm is straight
    }
}

EXERCISE_ID_MAP = {config['id']: config for config in EXERCISE_CONFIGS.values()}

class ExerciseTracker:
    def __init__(self, session_id, exercise_id):
        self.session_id = session_id
        self.exercise_id = exercise_id
        self.config = EXERCISE_ID_MAP.get(exercise_id, EXERCISE_CONFIGS['squats'])
        
        self.reps = 0
        self.sets = 0
        self.phase = 'idle'
        self.start_time = time.time()
        self.accuracies = []
        self.current_rep_corrections = 0
        
    def get_state(self):
        avg_acc = sum(self.accuracies) / len(self.accuracies) if self.accuracies else 0.0
        return {
            'phase': self.phase,
            'reps': self.reps,
            'sets': self.sets,
            'targetReps': self.config['targetReps'],
            'targetSets': self.config['targetSets'],
            'accuracy': round(avg_acc, 2),
            'elapsedSeconds': round(time.time() - self.start_time, 2)
        }
        
    def update(self, angles, correction_msgs):
        if not angles:
            return self.get_state()
            
        self.current_rep_corrections += len(correction_msgs)
        
        if self.exercise_id == 'squats':
            self._track_squats(angles)
        elif self.exercise_id == 'knee-flexion':
            self._track_knee_flexion(angles)
        elif self.exercise_id == 'arm-raise':
            self._track_arm_raise(angles)
        elif self.exercise_id == 'shoulder-abduction':
            self._track_shoulder_abduction(angles)
        elif self.exercise_id == 'leg-lift':
            self._track_leg_lift(angles)
        elif self.exercise_id == 'shoulder-press':
            self._track_shoulder_press(angles)
        elif self.exercise_id == 'bicep-curls':
            self._track_bicep_curls(angles)
            
        return self.get_state()

    def _complete_rep(self):
        self.reps += 1
        # Calculate accuracy for this rep based on corrections
        acc = max(0.0, 100.0 - (self.current_rep_corrections * 15.0))
        self.accuracies.append(acc)
        self.current_rep_corrections = 0
        
        if self.reps >= self.config['targetReps']:
            self.sets += 1
            if self.sets < self.config['targetSets']:
                self.reps = 0

    def _track_squats(self, angles):
        knee_angle = angles.get('left_knee', angles.get('right_knee', 180))
        if knee_angle > self.config['upThreshold']:
            if self.phase == 'down':
                self._complete_rep()
            self.phase = 'up'
        elif knee_angle < self.config['downThreshold']:
            self.phase = 'down'

    def _track_knee_flexion(self, angles):
        knee_angle = angles.get('left_knee', angles.get('right_knee', 180))
        if knee_angle < self.config['flexThreshold']:
            self.phase = 'flexed'
        elif knee_angle > self.config['extendThreshold']:
            if self.phase == 'flexed':
                self._complete_rep()
            self.phase = 'extended'

    def _track_arm_raise(self, angles):
        shoulder_angle = angles.get('left_shoulder', angles.get('right_shoulder', 0))
        if shoulder_angle > self.config['raiseThreshold']:
            self.phase = 'up'
        elif shoulder_angle < self.config['lowerThreshold']:
            if self.phase == 'up':
                self._complete_rep()
            self.phase = 'down'

    def _track_shoulder_abduction(self, angles):
        shoulder_angle = angles.get('left_shoulder', angles.get('right_shoulder', 0))
        if shoulder_angle > self.config['raiseThreshold']:
            self.phase = 'abducted'
        elif shoulder_angle < self.config['lowerThreshold']:
            if self.phase == 'abducted':
                self._complete_rep()
            self.phase = 'adducted'

    def _track_leg_lift(self, angles):
        hip_angle = angles.get('left_hip', angles.get('right_hip', 180))
        if hip_angle < self.config['raiseThreshold']:
            self.phase = 'up'
        elif hip_angle > self.config['lowerThreshold']:
            if self.phase == 'up':
                self._complete_rep()
            self.phase = 'down'

    def _track_shoulder_press(self, angles):
        elbow_angle = angles.get('left_elbow', angles.get('right_elbow', 180))
        if elbow_angle > self.config['extendThreshold']:
            self.phase = 'up'
        elif elbow_angle < self.config['flexThreshold']:
            if self.phase == 'up':
                self._complete_rep()
            self.phase = 'down'
    def _track_bicep_curls(self, angles):
        elbow_angle = angles.get('left_elbow', angles.get('right_elbow', 180))

        if elbow_angle < self.config['flexThreshold']:
            self.phase = 'flexed'
        elif elbow_angle > self.config['extendThreshold']:
            if self.phase == 'flexed':
                self._complete_rep()
            self.phase = 'extended'

_ACTIVE_TRACKERS = {}

def get_or_create_tracker(session_id, exercise_id):
    if session_id not in _ACTIVE_TRACKERS:
        _ACTIVE_TRACKERS[session_id] = ExerciseTracker(session_id, exercise_id)
    return _ACTIVE_TRACKERS[session_id]

def get_tracker(session_id):
    return _ACTIVE_TRACKERS.get(session_id)

def remove_tracker(session_id):
    if session_id in _ACTIVE_TRACKERS:
        del _ACTIVE_TRACKERS[session_id]
        return True
    return False

def list_active_sessions():
    return list(_ACTIVE_TRACKERS.keys())
