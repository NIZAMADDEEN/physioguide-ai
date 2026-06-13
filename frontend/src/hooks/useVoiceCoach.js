import { useCallback, useRef, useEffect, useState } from 'react';
import { voiceModes, confidenceThreshold } from '../config/voiceCoachConfig';

/**
 * Custom hook for managing real-time voice coaching using Web Speech Synthesis API.
 * Features:
 * - Multiple voice modes (Therapist, Coach, Gentle Recovery)
 * - Prevents repeated announcements
 * - Tracks confidence levels for feedback
 * - Provides encouragement every 30 seconds
 * - Integrates with posture accuracy feedback
 */
export function useVoiceCoach() {
  const synthesisRef = useRef(null);
  const [voiceMode, setVoiceMode] = useState('coach');
  const [isEnabled, setIsEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supportedVoices, setSupportedVoices] = useState([]);

  // Track announcements to prevent repetition
  const announcedFeedbackRef = useRef(new Set());
  const lastEncouragementRef = useRef(0);
  const encouragementIntervalRef = useRef(30000); // 30 seconds
  const lastRepCountRef = useRef(0);
  const sessionStartTimeRef = useRef(null);

  // Initialize Speech Synthesis API
  useEffect(() => {
    const synth = window.speechSynthesis;
    synthesisRef.current = synth;

    // Load available voices
    const loadVoices = () => {
      const voices = synth.getVoices();
      setSupportedVoices(voices);
    };

    // Some browsers load voices asynchronously
    if (synth.getVoices().length > 0) {
      loadVoices();
    }
    synth.addEventListener('voiceschanged', loadVoices);

    return () => {
      synth.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  // Select appropriate voice based on current mode and available voices
  const selectVoice = useCallback(() => {
    if (supportedVoices.length === 0) return null;

    const currentMode = voiceModes[voiceMode];
    const voicePreferences = currentMode.voicePreferences;

    // Try to find a voice matching preferences
    for (const pref of voicePreferences) {
      const match = supportedVoices.find(
        (voice) =>
          voice.name.toLowerCase().includes(pref.name.toLowerCase()) &&
          voice.lang.startsWith(pref.lang)
      );
      if (match) return match;
    }

    // Fallback to first voice matching language
    const langFallback = supportedVoices.find((voice) =>
      voice.lang.startsWith('en')
    );
    return langFallback || supportedVoices[0];
  }, [voiceMode, supportedVoices]);

  /**
   * Core speak function with rate and pitch customization
   */
  const speak = useCallback(
    (text, options = {}) => {
      if (!isEnabled || !synthesisRef.current) return;

      const synth = synthesisRef.current;
      const voice = selectVoice();

      if (!voice) {
        console.warn('[useVoiceCoach] No suitable voice found');
        return;
      }

      // Cancel any ongoing speech
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;

      // Apply voice mode characteristics
      const currentMode = voiceModes[voiceMode];
      utterance.rate = options.rate ?? currentMode.rate;
      utterance.pitch = options.pitch ?? currentMode.pitch;
      utterance.volume = options.volume ?? currentMode.volume;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('[useVoiceCoach] Speech synthesis error:', event.error);
        setIsSpeaking(false);
      };

      synth.speak(utterance);
    },
    [isEnabled, voiceMode, selectVoice]
  );

  /**
   * Announce a posture correction
   * Only speaks if confidence > threshold and not already announced
   */
  const announceCorrection = useCallback(
    (feedback, confidence) => {
      if (!feedback || confidence < confidenceThreshold) {
        return;
      }

      const feedbackKey = `${feedback.joint}-${feedback.message}`;

      // Prevent repeated announcements of the same feedback
      if (announcedFeedbackRef.current.has(feedbackKey)) {
        return;
      }

      announcedFeedbackRef.current.add(feedbackKey);

      // Clear after 10 seconds to allow re-announcement
      setTimeout(() => {
        announcedFeedbackRef.current.delete(feedbackKey);
      }, 10000);

      const currentMode = voiceModes[voiceMode];
      const announcement = currentMode.formatCorrection(feedback.message);
      speak(announcement, { rate: 0.95, pitch: 1.0 });
    },
    [voiceMode, speak]
  );

  /**
   * Announce completed repetitions
   */
  const announceRepetition = useCallback(
    (currentReps, targetReps = null) => {
      if (currentReps <= lastRepCountRef.current) {
        return;
      }

      lastRepCountRef.current = currentReps;

      const currentMode = voiceModes[voiceMode];
      let announcement = currentMode.formatRepetition(currentReps);

      if (targetReps && currentReps === targetReps) {
        announcement += '. Excellent work, set complete!';
      }

      speak(announcement, { rate: 1.0, pitch: 1.1 });
    },
    [voiceMode, speak]
  );

  /**
   * Provide encouragement every 30 seconds during active session
   */
  const announceEncouragement = useCallback(
    (elapsedSeconds = 0) => {
      const now = Date.now();

      // Only provide encouragement every 30 seconds
      if (
        now - lastEncouragementRef.current <
        encouragementIntervalRef.current
      ) {
        return;
      }

      lastEncouragementRef.current = now;

      const currentMode = voiceModes[voiceMode];
      const encouragements = currentMode.encouragements;
      const randomEncouragement =
        encouragements[Math.floor(Math.random() * encouragements.length)];

      speak(randomEncouragement, { rate: 1.05, pitch: 1.2 });
    },
    [voiceMode, speak]
  );

  /**
   * Start a new session (reset tracking)
   */
  const startSession = useCallback(() => {
    announcedFeedbackRef.current.clear();
    lastRepCountRef.current = 0;
    lastEncouragementRef.current = Date.now();
    sessionStartTimeRef.current = Date.now();

    const currentMode = voiceModes[voiceMode];
    speak(currentMode.sessionStart, { rate: 1.0 });
  }, [voiceMode, speak]);

  /**
   * End session with summary
   */
  const endSession = useCallback(
    (summary = {}) => {
      const currentMode = voiceModes[voiceMode];
      const { reps = 0, accuracy = 0, duration = 0 } = summary;

      let message = currentMode.sessionEnd;
      if (reps > 0) {
        message += ` You completed ${reps} repetitions with ${Math.round(accuracy)}% accuracy.`;
      }

      speak(message, { rate: 0.9, pitch: 0.95 });
      announcedFeedbackRef.current.clear();
    },
    [voiceMode, speak]
  );

  /**
   * Get current statistics for UI display
   */
  const getStats = useCallback(() => {
    return {
      voiceMode,
      isEnabled,
      isSpeaking,
      supportedVoices: supportedVoices.length,
      announcedCount: announcedFeedbackRef.current.size,
    };
  }, [voiceMode, isEnabled, isSpeaking, supportedVoices.length]);

  /**
   * Stop all ongoing speech
   */
  const stop = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  /**
   * Pause/Resume speech
   */
  const pause = useCallback(() => {
    if (synthesisRef.current && isSpeaking) {
      synthesisRef.current.pause();
    }
  }, [isSpeaking]);

  const resume = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.resume();
    }
  }, []);

  return {
    // State
    voiceMode,
    isEnabled,
    isSpeaking,
    supportedVoices,

    // Setters
    setVoiceMode,
    setIsEnabled,

    // Core methods
    speak,
    stop,
    pause,
    resume,
    getStats,

    // Voice coaching methods
    startSession,
    endSession,
    announceCorrection,
    announceRepetition,
    announceEncouragement,
  };
}
