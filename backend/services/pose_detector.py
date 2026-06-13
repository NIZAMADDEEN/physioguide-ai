import base64
import numpy as np
import cv2
import mediapipe as mp
import logging

logger = logging.getLogger(__name__)

class PoseResult:
    def __init__(self, pose_detected: bool, landmarks: dict = None, detection_confidence: float = 0.0):
        self.pose_detected = pose_detected
        self.landmarks = landmarks or {}
        self.detection_confidence = detection_confidence

class Landmark:
    def __init__(self, x, y, z, visibility):
        self.x = x
        self.y = y
        self.z = z
        self.visibility = visibility

    def to_dict(self):
        return {'x': self.x, 'y': self.y, 'z': self.z, 'visibility': self.visibility}

class PoseDetector:
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def process_base64(self, b64_string: str) -> PoseResult:
        if ',' in b64_string:
            b64_string = b64_string.split(',')[1]

        try:
            img_bytes = base64.b64decode(b64_string)
            nparr = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception as e:
            logger.error(f"Failed to decode base64 image: {e}")
            return PoseResult(pose_detected=False)

        if img is None:
            return PoseResult(pose_detected=False)

        # Convert BGR to RGB
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = self.pose.process(img_rgb)

        if not results.pose_landmarks:
            return PoseResult(pose_detected=False)

        landmarks = {}
        for idx, lm in enumerate(results.pose_landmarks.landmark):
            name = self.mp_pose.PoseLandmark(idx).name
            landmarks[name] = Landmark(lm.x, lm.y, lm.z, lm.visibility)

        # Calculate a pseudo detection confidence based on key visibilities
        visibilities = [lm.visibility for lm in landmarks.values()]
        avg_confidence = sum(visibilities) / len(visibilities) if visibilities else 0.0

        return PoseResult(pose_detected=True, landmarks=landmarks, detection_confidence=avg_confidence)
