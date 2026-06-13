import { createContext, useContext, useCallback, useRef, useEffect } from 'react';
import { useVoiceCoach } from '../hooks/useVoiceCoach';

export const VoiceCoachContext = createContext(null);

/**
 * Provider component for Voice Coaching functionality
 * Wraps the application and makes voice coaching available via context
 */
export function VoiceCoachProvider({ children }) {
  const voiceCoach = useVoiceCoach();
  const feedbackQueueRef = useRef([]);
  const processingRef = useRef(false);

  /**
   * Queue and process feedback with deduplication
   * Prevents overwhelming the user with too many announcements
   */
  const queueFeedback = useCallback(
    (feedback, confidence) => {
      if (
        !feedback ||
        confidence < 0.85 ||
        !voiceCoach.isEnabled
      ) {
        return;
      }

      feedbackQueueRef.current.push({
        feedback,
        confidence,
        timestamp: Date.now(),
      });

      // Process queue if not already processing
      if (!processingRef.current) {
        processingRef.current = true;
        requestAnimationFrame(() => {
          if (feedbackQueueRef.current.length > 0) {
            const { feedback: fb, confidence: conf } =
              feedbackQueueRef.current.shift();
            voiceCoach.announceCorrection(fb, conf);
          }
          processingRef.current = false;
        });
      }
    },
    [voiceCoach]
  );

  /**
   * Handle feedback array from backend
   */
  const processFeedbackArray = useCallback(
    (feedbackArray, confidence) => {
      if (!Array.isArray(feedbackArray)) return;

      // Prioritize warnings and errors over info
      const sorted = [...feedbackArray].sort((a, b) => {
        const priority = { error: 3, warning: 2, info: 1 };
        return (priority[b.type] || 0) - (priority[a.type] || 0);
      });

      // Announce only the highest priority feedback
      if (sorted.length > 0) {
        queueFeedback(sorted[0], confidence);
      }
    },
    [queueFeedback]
  );

  const value = {
    ...voiceCoach,
    queueFeedback,
    processFeedbackArray,
  };

  return (
    <VoiceCoachContext.Provider value={value}>
      {children}
    </VoiceCoachContext.Provider>
  );
}

/**
 * Hook to use VoiceCoach context
 * Throws error if used outside VoiceCoachProvider
 */
export function useVoiceCoachContext() {
  const context = useContext(VoiceCoachContext);
  if (!context) {
    throw new Error(
      'useVoiceCoachContext must be used within VoiceCoachProvider'
    );
  }
  return context;
}
