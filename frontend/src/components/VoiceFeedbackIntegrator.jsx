import { useEffect, useRef, useCallback } from 'react';
import { useVoiceCoachContext } from '../context/VoiceCoachContext';
import { useSession } from '../hooks/useSession';
import { getConfidenceLevel } from '../config/voiceCoachConfig';

/**
 * Voice Feedback Integrator
 * Bridges the feedback engine with voice coaching
 * 
 * This component:
 * - Listens for posture corrections from the feedback system
 * - Tracks repetition counts and announces them
 * - Provides timed encouragement
 * - Ensures proper confidence levels before announcing
 * 
 * Should be placed in the LiveMonitoringPage or similar exercise component
 */
export function VoiceFeedbackIntegrator() {
  const voiceCoach = useVoiceCoachContext();
  const { corrections, reps, accuracy } = useSession();

  const lastCorrectionTimeRef = useRef(0);
  const lastRepRef = useRef(0);
  const lastEncouragementRef = useRef(0);
  const encouragementIntervalRef = useRef(30000); // 30 seconds
  const correctionDebounceRef = useRef(1500); // 1.5 seconds between corrections

  /**
   * Process new corrections from feedback engine
   */
  useEffect(() => {
    if (!voiceCoach.isEnabled || !corrections || corrections.length === 0) {
      return;
    }

    const now = Date.now();

    // Debounce corrections to avoid overwhelming the user
    if (now - lastCorrectionTimeRef.current < correctionDebounceRef.current) {
      return;
    }

    lastCorrectionTimeRef.current = now;

    // Calculate confidence based on accuracy
    // Accuracy is a 0-100 scale, convert to 0-1 confidence
    const confidence = Math.min(accuracy / 100, 1.0);

    // Process only if confidence is sufficient
    if (confidence < 0.85) {
      return;
    }

    // Announce the most critical correction
    const sortedCorrections = [...corrections].sort((a, b) => {
      const priority = { error: 3, warning: 2, info: 1 };
      return (priority[b.type] || 0) - (priority[a.type] || 0);
    });

    if (sortedCorrections.length > 0) {
      const topCorrection = sortedCorrections[0];
      voiceCoach.announceCorrection(topCorrection, confidence);
    }
  }, [corrections, accuracy, voiceCoach]);

  /**
   * Announce completed repetitions
   */
  useEffect(() => {
    if (!voiceCoach.isEnabled || reps === lastRepRef.current) {
      return;
    }

    lastRepRef.current = reps;
    voiceCoach.announceRepetition(reps);
  }, [reps, voiceCoach]);

  /**
   * Provide timed encouragement
   */
  useEffect(() => {
    if (!voiceCoach.isEnabled) {
      return;
    }

    const checkEncouragement = () => {
      const now = Date.now();

      if (now - lastEncouragementRef.current >= encouragementIntervalRef.current) {
        lastEncouragementRef.current = now;
        voiceCoach.announceEncouragement();
      }
    };

    // Check for encouragement every 5 seconds
    const interval = setInterval(checkEncouragement, 5000);

    return () => clearInterval(interval);
  }, [voiceCoach]);

  // This component has no visual output
  return null;
}

/**
 * Hook version for more granular control
 */
export function useVoiceFeedback() {
  const voiceCoach = useVoiceCoachContext();
  const { corrections, reps, accuracy } = useSession();

  const lastCorrectionTimeRef = useRef(0);
  const lastRepRef = useRef(0);
  const lastEncouragementRef = useRef(0);

  // Process corrections
  useEffect(() => {
    if (!voiceCoach.isEnabled || !corrections?.length) return;

    const now = Date.now();
    if (now - lastCorrectionTimeRef.current < 1500) return;

    lastCorrectionTimeRef.current = now;
    const confidence = Math.min((accuracy || 0) / 100, 1.0);

    if (confidence >= 0.85) {
      const sorted = [...corrections].sort((a, b) => {
        const priority = { error: 3, warning: 2, info: 1 };
        return (priority[b.type] || 0) - (priority[a.type] || 0);
      });

      if (sorted[0]) {
        voiceCoach.announceCorrection(sorted[0], confidence);
      }
    }
  }, [corrections, accuracy, voiceCoach]);

  // Announce reps
  useEffect(() => {
    if (!voiceCoach.isEnabled || reps === lastRepRef.current) return;

    lastRepRef.current = reps;
    voiceCoach.announceRepetition(reps);
  }, [reps, voiceCoach]);

  // Provide encouragement
  useEffect(() => {
    if (!voiceCoach.isEnabled) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastEncouragementRef.current >= 30000) {
        lastEncouragementRef.current = now;
        voiceCoach.announceEncouragement();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [voiceCoach]);

  return {
    isEnabled: voiceCoach.isEnabled,
    isSpeaking: voiceCoach.isSpeaking,
    voiceMode: voiceCoach.voiceMode,
  };
}
