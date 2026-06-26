/**
 * Voice Coach Configuration
 * Defines voice modes, speech characteristics, and feedback formats
 */

// Minimum confidence threshold for announcing feedback
export const confidenceThreshold = 0.85;

/**
 * Voice mode definitions with:
 * - Speech synthesis parameters (rate, pitch, volume)
 * - Voice preferences (name, language)
 * - Feedback formatting functions
 * - Encouragement messages
 * - Session start/end messages
 */
export const voiceModes = {
  therapist: {
    name: "Therapist",
    description:
      "Professional and methodical guidance with focus on proper technique",
    rate: 0.9,
    pitch: 0.9,
    volume: 1.0,
    voicePreferences: [
      { name: "Google UK English Female", lang: "en-GB" },
      { name: "Microsoft Zira Desktop", lang: "en-US" },
      { name: "Samantha", lang: "en-US" },
    ],
    formatCorrection: (message) =>
      `Attention to form: ${message}. Focus on maintaining proper alignment.`,
    formatRepetition: (count) =>
      `Repetition ${count} complete. Excellent form.`,
    encouragements: [
      "Keep maintaining that proper posture. You are doing great.",
      "Your alignment is improving. Continue with this form.",
      "Maintain focus on your technique. Steady and controlled movements.",
      "Good progress. Remember to engage your core throughout the movement.",
      "Excellent adherence to form. Keep up this quality of movement.",
    ],
    sessionStart:
      "Welcome to your therapy session. Let us focus on proper form and controlled movements. Begin when ready.",
    sessionEnd:
      "Session complete. Well done on your dedication to proper technique.",
  },

  coach: {
    name: "Coach",
    description: "Energetic and motivational guidance with performance focus",
    rate: 1.1,
    pitch: 1.1,
    volume: 1.0,
    voicePreferences: [
      { name: "Microsoft Mark Desktop", lang: "en-US" },
      { name: "Google US English Male", lang: "en-US" },
      { name: "Alex", lang: "en-US" },
    ],
    formatCorrection: (message) =>
      `Quick adjustment: ${message}. You got this!`,
    formatRepetition: (count) =>
      `Awesome! Rep ${count} down. Let us keep this momentum!`,
    encouragements: [
      "You are crushing it! Keep pushing!",
      "Fantastic work! This is what I am talking about!",
      "Stay focused! You are on fire!",
      "That is the energy! Keep it up!",
      "Unbelievable effort! Do not slow down now!",
      "You are a machine! Keep going strong!",
      "Pushing through like a champion!",
    ],
    sessionStart:
      "Alright, let us get started! Time to show what you are made of. Let us go!",
    sessionEnd: "Fantastic work today! You gave it your all. Great session!",
  },

  gentleRecovery: {
    name: "Gentle Recovery",
    description: "Calm and supportive guidance focused on ease and comfort",
    rate: 0.8,
    pitch: 0.8,
    volume: 0.9,
    voicePreferences: [
      { name: "Google UK English Female", lang: "en-GB" },
      { name: "Microsoft Zira Desktop", lang: "en-US" },
    ],
    formatCorrection: (message) =>
      `Gentle reminder: ${message}. Take your time and move at a comfortable pace.`,
    formatRepetition: (count) =>
      `Wonderful. You have completed ${count} repetition. Well done.`,
    encouragements: [
      "You are doing beautifully. Take your time.",
      "Every movement brings you closer to recovery. Keep going gently.",
      "Breathe deeply and move at your own pace. You are doing great.",
      "Listen to your body. You are progressing wonderfully.",
      "Be kind to yourself. You are doing an excellent job.",
      "Steady and gentle. You are healing beautifully.",
    ],
    sessionStart:
      "Welcome to your gentle recovery session. Move at your own pace and listen to your body. Begin whenever you are ready.",
    sessionEnd:
      "Thank you for your dedication to your recovery. You did a wonderful job today.",
  },
};

/**
 * Get voice mode configuration
 */
export function getVoiceMode(modeName) {
  return voiceModes[modeName] || voiceModes.coach;
}

/**
 * Get all available voice modes
 */
export function getAvailableVoiceModes() {
  return Object.entries(voiceModes).map(([key, config]) => ({
    id: key,
    name: config.name,
    description: config.description,
  }));
}

/**
 * Confidence level classifications for feedback
 */
export const confidenceLevels = {
  INSUFFICIENT: {
    threshold: 0,
    message: "Low confidence - waiting for clearer pose",
  },
  MARGINAL: {
    threshold: 0.7,
    message: "Moderate confidence - feedback quality may vary",
  },
  GOOD: { threshold: 0.85, message: "Good confidence - reliable feedback" },
  EXCELLENT: {
    threshold: 0.95,
    message: "Excellent confidence - very reliable feedback",
  },
};

/**
 * Get confidence level classification
 */
export function getConfidenceLevel(confidence) {
  if (confidence >= confidenceLevels.EXCELLENT.threshold) return "EXCELLENT";
  if (confidence >= confidenceLevels.GOOD.threshold) return "GOOD";
  if (confidence >= confidenceLevels.MARGINAL.threshold) return "MARGINAL";
  return "INSUFFICIENT";
}
