import numpy as np
from scipy.signal import butter, filtfilt

class RehabilitationScoreAnalyzer:
    """
    Analyzes kinematic data to produce a 0-100 AI Rehabilitation Score.
    Suitable for integration into physical therapy applications.
    """
    def __init__(self, weights=None):
        # Default weights based on clinical importance
        self.weights = weights or {
            'joint_angle': 0.30,
            'range_of_motion': 0.25,
            'completion': 0.20,
            'smoothness': 0.15,
            'symmetry': 0.10
        }
        
        # Ensure weights sum to 1.0 to maintain the 0-100 scale
        assert np.isclose(sum(self.weights.values()), 1.0), "Weights must sum to 1.0"

    def filter_kinematics(self, data, fps=30, cutoff=6.0):
        """
        Applies a low-pass Butterworth filter to smooth raw tracking data.
        """
        nyquist = 0.5 * fps
        normal_cutoff = cutoff / nyquist
        b, a = butter(4, normal_cutoff, btype='low', analog=False)
        return filtfilt(b, a, data)

    def calculate_joint_angle_score(self, actual_angles, target_angles, threshold=30.0):
        """
        Calculates Form & Accuracy score based on RMSE.
        `threshold`: max acceptable deviation in degrees.
        """
        actual = np.array(actual_angles)
        target = np.array(target_angles)
        
        # Ensure equal length (in practice, use DTW - Dynamic Time Warping to align)
        min_len = min(len(actual), len(target))
        rmse = np.sqrt(np.mean((actual[:min_len] - target[:min_len]) ** 2))
        
        # Map RMSE to a 0-1 score
        score = max(0.0, 1.0 - (rmse / threshold))
        return score

    def calculate_smoothness_score(self, kinematics, dt=0.033):
        """
        Calculates movement smoothness using normalized mean squared jerk.
        dt: time step between frames (default ~30 FPS).
        """
        # Calculate derivatives
        velocity = np.gradient(kinematics, dt)
        acceleration = np.gradient(velocity, dt)
        jerk = np.gradient(acceleration, dt)
        
        mean_squared_jerk = np.mean(jerk ** 2)
        
        # Exponential decay mapping (lambda_k is a scaling factor dependent on movement type)
        lambda_k = 0.001 
        score = np.exp(-lambda_k * mean_squared_jerk)
        return score

    def calculate_rom_score(self, actual_rom, target_rom):
        """
        Calculates Range of Motion score.
        """
        if target_rom <= 0:
            return 0.0
        score = min(1.0, actual_rom / target_rom)
        return score

    def calculate_completion_score(self, completed_reps, target_reps):
        """
        Calculates exercise volume completion ratio.
        """
        if target_reps <= 0:
            return 0.0
        score = min(1.0, completed_reps / target_reps)
        return score

    def calculate_symmetry_score(self, left_kinematics, right_kinematics):
        """
        Calculates symmetry index between left and right limb trajectories using Pearson Correlation.
        """
        if len(left_kinematics) < 2 or len(right_kinematics) < 2:
            return 0.0
            
        min_len = min(len(left_kinematics), len(right_kinematics))
        correlation = np.corrcoef(left_kinematics[:min_len], right_kinematics[:min_len])[0, 1]
        
        # Handle edge cases where correlation is NaN (e.g., zero variance)
        if np.isnan(correlation):
            return 0.0
            
        # Map correlation [-1, 1] to [0, 1]
        score = max(0.0, (correlation + 1.0) / 2.0)
        return score

    def compute_total_score(self, metrics):
        """
        Aggregates individual sub-scores into the final 0-100 rehabilitation score.
        `metrics`: dict containing the pre-calculated 0-1 scores for each component.
        """
        total_score = 0.0
        for key, weight in self.weights.items():
            if key in metrics:
                total_score += weight * metrics[key]
            else:
                # If a metric is missing, distribute its weight proportionally 
                # (Optional advanced handling - here we assume all metrics are provided)
                pass
                
        return round(total_score * 100, 2)

# --- Example Usage ---
if __name__ == "__main__":
    analyzer = RehabilitationScoreAnalyzer()
    
    # Simulated data for a patient's repetition
    simulated_metrics = {
        'joint_angle': analyzer.calculate_joint_angle_score([90, 85, 80], [90, 90, 90]), # Slight deviation
        'range_of_motion': analyzer.calculate_rom_score(actual_rom=110, target_rom=120),
        'completion': analyzer.calculate_completion_score(completed_reps=8, target_reps=10),
        'smoothness': 0.85, # Assuming pre-calculated via kinematics array
        'symmetry': analyzer.calculate_symmetry_score([1, 2, 3, 4], [1, 2.2, 2.9, 4.1])
    }
    
    final_score = analyzer.compute_total_score(simulated_metrics)
    print(f"Final AI Rehabilitation Score: {final_score}/100")
