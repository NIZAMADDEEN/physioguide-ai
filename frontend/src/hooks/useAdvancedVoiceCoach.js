import { useCallback, useRef, useEffect } from "react";
import { useVoiceCoachContext } from "../context/VoiceCoachContext";

/**
 * Advanced Voice Coaching Hook
 * Provides sophisticated feedback integration with confidence levels,
 * temporal spacing, and comprehensive session management
 */
export function useAdvancedVoiceCoach() {
  const voiceCoach = useVoiceCoachContext();

  // Tracking references
  const feedbackHistoryRef = useRef([]);
  const confidenceMapRef = useRef({});
  const lastAnnouncementTimeRef = useRef({});
  const sessionStatsRef = useRef({
    startTime: null,
    repsAnnounced: 0,
    correctionsAnnounced: 0,
    encouragementsAnnounced: 0,
  });

  /**
   * Enhanced correction announcement with confidence tracking
   */
  const announceWithConfidence = useCallback(
    (feedback, confidence, metadata = {}) => {
      if (!feedback || !voiceCoach.isEnabled) return;

      const feedbackId = `${feedback.joint}-${feedback.type}`;
      const now = Date.now();

      // Get last announcement time for this feedback
      const lastTime = lastAnnouncementTimeRef.current[feedbackId] || 0;

      // Don't announce the same feedback more than once per 8 seconds
      if (now - lastTime < 8000) {
        return;
      }

      // Only announce if confidence meets threshold
      if (confidence >= 0.85) {
        lastAnnouncementTimeRef.current[feedbackId] = now;
        confidenceMapRef.current[feedbackId] = confidence;

        // Record announcement
        feedbackHistoryRef.current.push({
          feedback,
          confidence,
          timestamp: now,
          metadata,
        });

        // Keep history to last 100 announcements
        if (feedbackHistoryRef.current.length > 100) {
          feedbackHistoryRef.current.shift();
        }

        voiceCoach.announceCorrection(feedback, confidence);
        sessionStatsRef.current.correctionsAnnounced++;
      }
    },
    [voiceCoach],
  );

  /**
   * Smart repetition tracking with milestone announcements
   */
  const trackRepetition = useCallback(
    (currentReps, targetReps = null, milestone = null) => {
      if (!voiceCoach.isEnabled) return;

      const lastReps = sessionStatsRef.current.repsAnnounced;

      if (currentReps > lastReps) {
        sessionStatsRef.current.repsAnnounced = currentReps;

        let shouldAnnounce = false;
        let announceReps = currentReps;

        // Always announce when reaching target
        if (targetReps && currentReps === targetReps) {
          shouldAnnounce = true;
        }
        // Announce every rep if under 5 reps per set
        else if (targetReps && targetReps <= 5) {
          shouldAnnounce = true;
        }
        // Announce milestones (5, 10, 15, 20...)
        else if (milestone && currentReps % milestone === 0) {
          shouldAnnounce = true;
        }
        // Default: announce every rep
        else {
          shouldAnnounce = true;
        }

        if (shouldAnnounce) {
          voiceCoach.announceRepetition(currentReps, targetReps);
        }
      }
    },
    [voiceCoach],
  );

  /**
   * Context-aware encouragement with session awareness
   */
  const provideContextualEncouragement = useCallback(
    (context = {}) => {
      if (!voiceCoach.isEnabled) return;

      const {
        currentReps = 0,
        targetReps = 0,
        accuracy = 0,
        duration = 0,
        exerciseName = "exercise",
      } = context;

      let message = "";
      const repsRemaining = targetReps - currentReps;

      // Customize message based on progress
      if (accuracy >= 90) {
        message = "Excellent form! Keep that perfect technique!";
      } else if (accuracy >= 75) {
        message = "Nice work! Your form is improving well!";
      } else {
        message = "Keep focused! You are doing great!";
      }

      // Add reps remaining info if applicable
      if (targetReps > 0 && repsRemaining > 0) {
        message += ` You have ${repsRemaining} repetitions left.`;
      }

      voiceCoach.speak(message);
      sessionStatsRef.current.encouragementsAnnounced++;
    },
    [voiceCoach],
  );

  /**
   * Start session with initialization
   */
  const startSessionWithSetup = useCallback(
    (sessionConfig = {}) => {
      const {
        exerciseName = "exercise",
        targetReps = null,
        mode = null,
      } = sessionConfig;

      if (mode) {
        voiceCoach.setVoiceMode(mode);
      }

      sessionStatsRef.current = {
        startTime: Date.now(),
        repsAnnounced: 0,
        correctionsAnnounced: 0,
        encouragementsAnnounced: 0,
      };

      feedbackHistoryRef.current = [];
      lastAnnouncementTimeRef.current = {};

      voiceCoach.startSession();

      // Announce exercise details
      const message = targetReps
        ? `Starting ${exerciseName}. Target ${targetReps} repetitions. Begin when ready.`
        : `Starting ${exerciseName}. Begin when ready.`;

      voiceCoach.speak(message);
    },
    [voiceCoach],
  );

  /**
   * End session with detailed summary
   */
  const endSessionWithSummary = useCallback(
    (sessionData = {}) => {
      const { reps = 0, accuracy = 0, duration = 0 } = sessionData;
      const stats = sessionStatsRef.current;
      const elapsedTime = Math.floor((Date.now() - stats.startTime) / 1000);

      let summary = "";

      if (reps > 0) {
        summary += `You completed ${reps} repetitions. `;
      }

      if (accuracy > 0) {
        summary += `Average accuracy was ${Math.round(accuracy)}%. `;
      }

      if (elapsedTime > 0) {
        const minutes = Math.floor(elapsedTime / 60);
        if (minutes > 0) {
          summary += `Session duration was ${minutes} minutes. `;
        }
      }

      // Provide motivation based on performance
      if (accuracy >= 85) {
        summary +=
          "Excellent work! Your dedication to proper form is impressive!";
      } else if (accuracy >= 70) {
        summary +=
          "Great effort! Keep practicing and your form will continue improving!";
      } else {
        summary +=
          "Well done on completing your session! Every rep brings you closer to your goals!";
      }

      voiceCoach.speak(summary);
      voiceCoach.endSession(sessionData);
    },
    [voiceCoach],
  );

  /**
   * Get session statistics
   */
  const getSessionStats = useCallback(() => {
    const stats = sessionStatsRef.current;
    const elapsedTime = stats.startTime
      ? Math.floor((Date.now() - stats.startTime) / 1000)
      : 0;

    return {
      ...stats,
      elapsedTime,
      feedbackHistoryLength: feedbackHistoryRef.current.length,
      averageConfidence:
        feedbackHistoryRef.current.length > 0
          ? (
              feedbackHistoryRef.current.reduce(
                (sum, item) => sum + item.confidence,
                0,
              ) / feedbackHistoryRef.current.length
            ).toFixed(2)
          : 0,
    };
  }, []);

  /**
   * Get feedback history for analysis
   */
  const getFeedbackHistory = useCallback((limit = 10) => {
    return feedbackHistoryRef.current.slice(-limit);
  }, []);

  /**
   * Reset session (for testing or mid-session adjustments)
   */
  const resetSession = useCallback(() => {
    feedbackHistoryRef.current = [];
    confidenceMapRef.current = {};
    lastAnnouncementTimeRef.current = {};
    sessionStatsRef.current = {
      startTime: null,
      repsAnnounced: 0,
      correctionsAnnounced: 0,
      encouragementsAnnounced: 0,
    };
  }, []);

  return {
    // Core voice coach methods
    speak: voiceCoach.speak,
    stop: voiceCoach.stop,
    pause: voiceCoach.pause,
    resume: voiceCoach.resume,

    // Enhanced methods
    announceWithConfidence,
    trackRepetition,
    provideContextualEncouragement,
    startSessionWithSetup,
    endSessionWithSummary,

    // Utilities
    getSessionStats,
    getFeedbackHistory,
    resetSession,

    // State
    voiceMode: voiceCoach.voiceMode,
    setVoiceMode: voiceCoach.setVoiceMode,
    isEnabled: voiceCoach.isEnabled,
    setIsEnabled: voiceCoach.setIsEnabled,
    isSpeaking: voiceCoach.isSpeaking,
  };
}
