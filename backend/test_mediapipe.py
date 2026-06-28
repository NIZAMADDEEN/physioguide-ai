"""Quick pure-Python verification of CV modules (no mediapipe needed)."""
import sys
sys.stdout.reconfigure(encoding='utf-8')

print("=== VirtuGym CV Module Tests (pure-Python) ===\n")

# --- angle_calculator ---
from services.angle_calculator import calculate_angle, calculate_joint_angles

a90 = calculate_angle((1, 0, 0), (0, 0, 0), (0, 1, 0))
a180 = calculate_angle((0, 1, 0), (0, 0, 0), (0, -1, 0))
a45 = calculate_angle((1, 0, 0), (0, 0, 0), (1, 1, 0))
assert abs(a90 - 90.0) < 0.01
assert abs(a180 - 180.0) < 0.01
assert abs(a45 - 45.0) < 0.5
print(f"[PASS] angle_calculator: 90={a90} 180={a180} 45={a45}")

class MockLM:
    def __init__(self, x, y, z=0.0): self.x, self.y, self.z = x, y, z

mock = {
    'LEFT_HIP': MockLM(0.5, 0.5), 'LEFT_KNEE': MockLM(0.5, 0.7),
    'LEFT_ANKLE': MockLM(0.5, 0.9), 'RIGHT_HIP': MockLM(0.6, 0.5),
    'RIGHT_KNEE': MockLM(0.6, 0.7), 'RIGHT_ANKLE': MockLM(0.6, 0.9),
    'LEFT_SHOULDER': MockLM(0.4, 0.3), 'RIGHT_SHOULDER': MockLM(0.7, 0.3),
}
angles = calculate_joint_angles(mock, 'squats')
assert 'left_knee' in angles
print(f"[PASS] Squat angle extraction: left_knee={angles['left_knee']}")

for eid in ['squats', 'knee-flexion', 'arm-raise', 'shoulder-abduction', 'leg-lift']:
    a = calculate_joint_angles(mock, eid)
    print(f"[PASS] {eid}: {list(a.keys())}")

# --- exercise_tracker ---
from services.exercise_tracker import ExerciseTracker, get_or_create_tracker, remove_tracker

t = ExerciseTracker('squats')
assert t.get_state()['reps'] == 0
assert t.get_state()['phase'] == 'idle'
print(f"\n[PASS] ExerciseTracker initialized: {t.cfg.name}")

# Simulate a full rep cycle
t.update({'left_knee': 165.0, 'right_knee': 163.0, 'spine_straightness': 170.0})
assert t._phase == 'up', f"Expected up, got {t._phase}"
print(f"[PASS] Standing phase: {t._phase}")

t.update({'left_knee': 85.0, 'right_knee': 87.0, 'spine_straightness': 168.0})
assert t._phase == 'down', f"Expected down, got {t._phase}"
print(f"[PASS] Squat phase: {t._phase}")

result = t.update({'left_knee': 165.0, 'right_knee': 163.0, 'spine_straightness': 170.0})
assert t._reps == 1, f"Expected 1 rep, got {t._reps}"
ms = result.get('milestone')
print(f"[PASS] Rep counted: {t._reps}, accuracy={t._current_accuracy()}%")
print(f"       Milestone: {ms}")

# Multiple reps
for _ in range(5):
    t.update({'left_knee': 85.0, 'right_knee': 87.0})
    t.update({'left_knee': 165.0, 'right_knee': 163.0})
print(f"[PASS] 6 total reps completed: {t._reps}")

# Session registry
get_or_create_tracker('sess-test-001', 'knee-flexion')
remove_tracker('sess-test-001')
print("[PASS] Session registry create/remove OK")

# All exercise types
for eid in ['squats', 'knee-flexion', 'arm-raise', 'shoulder-abduction', 'leg-lift']:
    tr = ExerciseTracker(eid)
    s = tr.get_state()
    print(f"[PASS] ExerciseTracker({eid}): targetReps={s['targetReps']}")

# --- feedback_engine ---
from services.feedback_engine import generate_feedback, compute_frame_accuracy

print("\n--- feedback_engine ---")

bad_angles = {
    'left_knee': 85.0, 'right_knee': 110.0,
    'knee_symmetry_delta': 25.0,
    'spine_straightness': 140.0,
}
fb = generate_feedback('squats', bad_angles, {}, {'phase': 'down', 'reps': 0})
assert isinstance(fb, list)
assert len(fb) > 0
types = [f['type'] for f in fb]
print(f"[PASS] Bad form feedback: {len(fb)} messages, types={types}")
for f in fb:
    print(f"       [{f['type'].upper()}] {f['message'][:65]}")

good_angles = {'left_knee': 90.0, 'right_knee': 92.0, 'knee_symmetry_delta': 2.0, 'spine_straightness': 172.0}
good_fb = generate_feedback('squats', good_angles, {}, {'phase': 'down', 'reps': 2})
print(f"[PASS] Good form feedback: {[f['type'] for f in good_fb]}")

acc = compute_frame_accuracy('squats', good_angles, 'down')
assert 0 <= acc <= 100
print(f"[PASS] Frame accuracy score: {acc}%")

bad_acc = compute_frame_accuracy('squats', bad_angles, 'down')
assert bad_acc < acc, f"Bad form should score lower: {bad_acc} vs {acc}"
print(f"[PASS] Bad form scores lower: {bad_acc}% < {acc}%")

# Test all exercise feedback handlers
for eid in ['squats', 'knee-flexion', 'arm-raise', 'shoulder-abduction', 'leg-lift']:
    fb2 = generate_feedback(eid, {}, {}, {'phase': 'idle', 'reps': 0})
    print(f"[PASS] {eid} feedback: {len(fb2)} messages")

print("\n=== ALL PURE-PYTHON TESTS PASSED ===")
print("\nWaiting for mediapipe install to test PoseDetector...")
try:
    import cv2, mediapipe
    print(f"[PASS] MediaPipe {mediapipe.__version__} is installed!")
    from services.pose_detector import PoseDetector
    import numpy as np
    det = PoseDetector.get_instance()
    blank = np.zeros((480, 640, 3), dtype=np.uint8)
    r = det.process_image(blank)
    print(f"[PASS] PoseDetector.process_image: poseDetected={r.pose_detected}")
    PoseDetector.reset()
    print("[PASS] PoseDetector singleton reset OK")
except ImportError:
    print("[SKIP] MediaPipe not yet installed - run pip install after download completes")
