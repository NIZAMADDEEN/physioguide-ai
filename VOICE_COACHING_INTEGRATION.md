# PhysioGuide AI - Voice Coaching System Integration Guide

## Overview

The Voice Coaching System provides real-time voice feedback during therapy exercises using the Web Speech Synthesis API. It features multiple voice modes, confidence-based filtering, and comprehensive feedback integration.

## Architecture

### Components & Hooks

```
useVoiceCoach.js
├── Core hook for Speech Synthesis API management
└── Methods: speak, announceCorrection, announceRepetition, announceEncouragement

useAdvancedVoiceCoach.js
├── Enhanced hook with session management
└── Methods: announceWithConfidence, trackRepetition, provideContextualEncouragement

VoiceCoachContext.jsx
├── Global state management for voice coaching
└── Feedback queuing and deduplication

VoiceCoachPanel.jsx
├── UI for voice configuration
└── Voice mode selection, testing, advanced settings

VoiceFeedbackIntegrator.jsx
├── Bridges feedback engine with voice coaching
└── Listens to corrections, reps, and accuracy

voiceCoachConfig.js
├── Voice modes (Therapist, Coach, Gentle Recovery)
├── Speech parameters (rate, pitch, volume)
└── Feedback formatting functions
```

## Setup Instructions

### 1. Install VoiceCoachProvider in App.jsx

```jsx
import { VoiceCoachProvider } from './context/VoiceCoachContext';

function App() {
  return (
    <AuthProvider>
      <ExerciseProvider>
        <SessionProvider>
          <VoiceCoachProvider>
            {/* Rest of your app */}
          </VoiceCoachProvider>
        </SessionProvider>
      </ExerciseProvider>
    </AuthProvider>
  );
}
```

### 2. Add Voice Coach Panel to UI

```jsx
import VoiceCoachPanel from './components/VoiceCoachPanel';

function LiveMonitoringPage() {
  return (
    <div className="monitoring-layout">
      <WebcamPanel />
      <div className="controls-sidebar">
        <VoiceCoachPanel />
        {/* Other controls */}
      </div>
    </div>
  );
}
```

### 3. Integrate Feedback Voice Announcements

**Option A: Component-based Integration**

```jsx
import { VoiceFeedbackIntegrator } from './components/VoiceFeedbackIntegrator';

function LiveMonitoringPage() {
  return (
    <>
      <VoiceFeedbackIntegrator />
      {/* Rest of page */}
    </>
  );
}
```

**Option B: Hook-based Integration**

```jsx
import { useVoiceFeedback } from './components/VoiceFeedbackIntegrator';

function ExerciseMonitor() {
  const voiceFeedback = useVoiceFeedback();

  return (
    <div>
      {voiceFeedback.isSpeaking && <div>🎤 Speaking...</div>}
      {/* Rest of component */}
    </div>
  );
}
```

**Option C: Advanced Integration**

```jsx
import { useAdvancedVoiceCoach } from './hooks/useAdvancedVoiceCoach';

function ExerciseSession() {
  const voice = useAdvancedVoiceCoach();
  const { corrections, reps, accuracy } = useSession();

  // Start session
  const handleStartSession = () => {
    voice.startSessionWithSetup({
      exerciseName: 'Squats',
      targetReps: 15,
      mode: 'coach',
    });
  };

  // Announce corrections with confidence
  useEffect(() => {
    if (corrections.length > 0) {
      voice.announceWithConfidence(corrections[0], accuracy / 100, {
        joint: corrections[0].joint,
      });
    }
  }, [corrections, accuracy]);

  // Track repetitions
  useEffect(() => {
    voice.trackRepetition(reps, 15, 5); // Announce every 5 reps
  }, [reps]);

  // Provide encouragement
  useEffect(() => {
    const interval = setInterval(() => {
      voice.provideContextualEncouragement({
        currentReps: reps,
        targetReps: 15,
        accuracy,
        exerciseName: 'Squats',
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [reps, accuracy]);

  // End session
  const handleEndSession = () => {
    voice.endSessionWithSummary({
      reps,
      accuracy,
      duration: sessionDuration,
    });
  };

  return (
    <div>
      <button onClick={handleStartSession}>Start</button>
      <button onClick={handleEndSession}>End</button>
      <pre>{JSON.stringify(voice.getSessionStats(), null, 2)}</pre>
    </div>
  );
}
```

## Voice Modes

### 1. Therapist Mode
- **Purpose**: Clinical rehabilitation guidance
- **Rate**: Slower (0.9), lower pitch
- **Feedback**: Professional, technical corrections
- **Example**: "Attention to form: Go lower, try to reach 90 degrees. Focus on maintaining proper alignment."

### 2. Coach Mode
- **Purpose**: Motivational fitness coaching
- **Rate**: Faster (1.1), higher pitch
- **Feedback**: Energetic, action-oriented
- **Example**: "Quick adjustment: Go lower, try to reach 90 degrees. You got this!"

### 3. Gentle Recovery Mode
- **Purpose**: Post-injury rehabilitation
- **Rate**: Slowest (0.8), soft voice
- **Feedback**: Compassionate, encouraging
- **Example**: "Gentle reminder: Go lower, try to reach 90 degrees. Take your time and move at a comfortable pace."

## Confidence Levels

The system only announces feedback when **confidence exceeds 85%**. Confidence is calculated from:

1. **Accuracy Score**: From MediaPipe pose detection (0-100)
2. **Landmark Visibility**: How clearly the pose is detected
3. **Temporal Consistency**: How stable the pose is across frames

```
Confidence Levels:
- INSUFFICIENT: < 70% (no feedback)
- MARGINAL: 70-85% (no feedback)
- GOOD: 85-95% (feedback announced)
- EXCELLENT: ≥ 95% (feedback announced with emphasis)
```

## Preventing Repeated Announcements

The system uses multiple mechanisms:

### 1. Announcement Tracking
```js
// Same feedback not announced within 10 seconds
announcedFeedbackRef.current.add(feedbackKey);
setTimeout(() => announcedFeedbackRef.current.delete(feedbackKey), 10000);
```

### 2. Debouncing
```js
// Corrections debounced by 1.5 seconds
if (now - lastCorrectionTime < 1500) return;
```

### 3. Feedback Deduplication
```js
// Sort by priority, announce only top feedback
const sorted = corrections.sort((a, b) => 
  priority[b.type] - priority[a.type]
);
voiceCoach.announceCorrection(sorted[0], confidence);
```

## Encouragement System

Encouragement is provided every **30 seconds** during active sessions:

- Varies by voice mode
- Contextual based on performance
- Includes rep progress information
- Motivational and supportive tone

### Customizing Encouragement

```jsx
// In voiceCoachConfig.js
encouragements: [
  'You are doing beautifully. Take your time.',
  'Every movement brings you closer to recovery.',
  // Add more messages...
]
```

## Integration with MediaPipe

The voice coaching system integrates with existing feedback from the MediaPipe pose detection:

```jsx
// Flow:
1. MediaPipe detects pose → calculates angles
2. Feedback engine generates corrections
3. Accuracy score computed
4. Voice coach announces if confidence > 85%
5. Prevents repeated announcements
```

### Backend Integration (Python)

In `backend/services/feedback_engine.py`, the confidence is passed via:

```python
{
  'feedback': [
    {'type': 'warning', 'message': '...', 'joint': 'knee'},
  ],
  'confidence': 0.92,  # Passed to frontend
  'accuracy': 92       # Used for voice decisions
}
```

## API Reference

### useVoiceCoach Hook

```js
const {
  // State
  voiceMode,           // Current voice mode
  isEnabled,           // Voice enabled/disabled
  isSpeaking,          // Currently speaking
  supportedVoices,     // Available voices

  // Setters
  setVoiceMode,        // Change voice mode
  setIsEnabled,        // Toggle voice

  // Core Methods
  speak(text, options),           // Speak custom text
  stop(),                         // Stop speaking
  pause(),                        // Pause
  resume(),                       // Resume
  getStats(),                     // Get stats

  // Voice Coaching Methods
  startSession(summary),          // Start with message
  endSession(summary),            // End with summary
  announceCorrection(feedback, confidence), // Speak correction
  announceRepetition(reps, target),         // Announce rep
  announceEncouragement(),        // Random encouragement
} = useVoiceCoach();
```

### useAdvancedVoiceCoach Hook

```js
const {
  // Enhanced Methods
  announceWithConfidence(feedback, confidence, metadata),
  trackRepetition(currentReps, targetReps, milestone),
  provideContextualEncouragement(context),
  startSessionWithSetup(config),
  endSessionWithSummary(data),

  // Analytics
  getSessionStats(),      // Get session metrics
  getFeedbackHistory(),   // Get recent feedback
  resetSession(),         // Reset tracking

  // ... + all useVoiceCoach methods
} = useAdvancedVoiceCoach();
```

### VoiceCoachContext Methods

```js
const {
  ...voiceCoachMethods,
  queueFeedback(feedback, confidence),        // Queue feedback
  processFeedbackArray(feedbackArray, conf),  // Process multiple
} = useVoiceCoachContext();
```

## Styling

Voice coaching UI uses custom styles in `src/styles/voiceCoach.css`:

- Purple gradient background (#667eea to #764ba2)
- Responsive grid layouts
- Smooth transitions and animations
- Mobile-friendly design

## Performance Considerations

1. **Speech Synthesis Pooling**: Browser synthesizes one utterance at a time
2. **Memory Management**: Announcement history limited to 100 items
3. **Debouncing**: Feedback debounced to prevent overflow
4. **Pause/Resume**: Handlers for pause during UI interactions

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Best support |
| Firefox | ✅ Full | Good support |
| Safari | ✅ Good | Limited voice selection |
| Edge | ✅ Full | Full support |
| Mobile | ⚠️ Limited | Voice selection varies |

## Troubleshooting

### Voice not working

```jsx
// Check if enabled
console.log(voiceCoach.isEnabled);

// Check available voices
console.log(voiceCoach.supportedVoices);

// Test with simple message
voiceCoach.speak('Testing voice');
```

### Repeated announcements

- Verify confidence threshold is > 0.85
- Check debounce interval (default 1500ms)
- Review announcement tracking mechanism

### Poor voice quality

- Try different voice mode
- Check system volume
- Verify browser speech synthesis settings
- Some voices perform better than others

## Examples

### Full Exercise Session with Voice

```jsx
import { useAdvancedVoiceCoach } from './hooks/useAdvancedVoiceCoach';
import { useSession } from './hooks/useSession';

function ExerciseSession() {
  const voice = useAdvancedVoiceCoach();
  const { reps, accuracy, corrections } = useSession();

  const handleStart = () => {
    voice.startSessionWithSetup({
      exerciseName: 'Squats',
      targetReps: 15,
      mode: 'coach',
    });
  };

  useEffect(() => {
    if (corrections.length > 0) {
      voice.announceWithConfidence(
        corrections[0],
        Math.min(accuracy / 100, 1.0)
      );
    }
  }, [corrections, accuracy]);

  useEffect(() => {
    voice.trackRepetition(reps, 15, 5);
  }, [reps]);

  return (
    <div>
      <button onClick={handleStart}>Start Exercise</button>
      <p>Reps: {reps}/15</p>
      <p>Accuracy: {accuracy}%</p>
    </div>
  );
}
```

## Future Enhancements

- [ ] Custom voice model integration
- [ ] Multilingual support
- [ ] Voice quality indicators per browser
- [ ] Session recording and playback
- [ ] ML-based feedback priority ranking
- [ ] Integration with video recordings
- [ ] Real-time speech transcription feedback

---

**Last Updated**: June 2026
**Version**: 1.0
**Status**: Production Ready
