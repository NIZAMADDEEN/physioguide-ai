# Voice Coaching System - Testing & Validation Guide

## Quick Start Testing

### 1. Test Voice Synthesis

```jsx
import { useVoiceCoach } from './hooks/useVoiceCoach';

function TestVoice() {
  const voice = useVoiceCoach();

  return (
    <div>
      <button onClick={() => voice.speak('Testing voice synthesis')}>
        Test Voice
      </button>
      <p>Speaking: {voice.isSpeaking ? 'Yes' : 'No'}</p>
      <p>Available Voices: {voice.supportedVoices.length}</p>
    </div>
  );
}
```

### 2. Test Voice Modes

```jsx
function TestModes() {
  const voice = useVoiceCoach();

  return (
    <div>
      {['therapist', 'coach', 'gentleRecovery'].map((mode) => (
        <button
          key={mode}
          onClick={() => {
            voice.setVoiceMode(mode);
            voice.speak(`Switched to ${mode} mode`);
          }}
        >
          Test {mode}
        </button>
      ))}
    </div>
  );
}
```

### 3. Test Feedback Announcements

```jsx
function TestFeedback() {
  const voice = useAdvancedVoiceCoach();

  const mockFeedback = {
    type: 'warning',
    message: 'Keep your back straighter',
    joint: 'back',
  };

  return (
    <button
      onClick={() => voice.announceWithConfidence(mockFeedback, 0.95)}
    >
      Announce Correction
    </button>
  );
}
```

## Integration Tests

### Test 1: Voice Enabled/Disabled Toggle

**Objective**: Verify voice can be enabled/disabled without errors

**Steps**:
1. Open VoiceCoachPanel
2. Click "Enable Voice" button
3. Verify isEnabled state changes
4. Click "Disable Voice" button
5. Try to speak - should not produce sound

**Expected**: Voice toggles cleanly, no console errors

---

### Test 2: Voice Mode Switching

**Objective**: Verify all three voice modes work

**Steps**:
1. Select "Therapist" mode
2. Click "Test" with default message
3. Listen for professional, slower voice
4. Select "Coach" mode
5. Click "Test" - should be energetic, faster
6. Select "Gentle Recovery" mode
7. Click "Test" - should be calm, slower

**Expected**: All three modes produce distinct voice characteristics

---

### Test 3: Confidence Threshold

**Objective**: Verify feedback only announced above 85% confidence

**Steps**:
```jsx
// In your test component
const voice = useAdvancedVoiceCoach();
const feedback = { type: 'info', message: 'Test', joint: 'knee' };

// Should NOT announce (< 85%)
voice.announceWithConfidence(feedback, 0.75);

// Should announce (>= 85%)
voice.announceWithConfidence(feedback, 0.90);
```

**Expected**: Only ≥85% confidence produces audio

---

### Test 4: Repetition Prevention

**Objective**: Verify same feedback not announced repeatedly

**Steps**:
```jsx
const voice = useAdvancedVoiceCoach();
const feedback = { type: 'warning', message: 'Keep back straight', joint: 'back' };

// First announcement
voice.announceWithConfidence(feedback, 0.90);

// Immediate second attempt - should be blocked
voice.announceWithCorrection(feedback, 0.90);

// Wait 10 seconds
// Second announcement - should be allowed
setTimeout(() => {
  voice.announceWithCorrection(feedback, 0.90);
}, 10000);
```

**Expected**: First announces, second blocked, third announces after 10s

---

### Test 5: Rep Count Announcements

**Objective**: Verify rep announcements work correctly

**Steps**:
```jsx
const voice = useAdvancedVoiceCoach();

voice.trackRepetition(1, 15, 5);  // Should announce "Rep 1"
voice.trackRepetition(5, 15, 5);  // Should announce "Rep 5"
voice.trackRepetition(10, 15, 5); // Should announce "Rep 10"
voice.trackRepetition(15, 15, 5); // Should announce "Rep 15 - Set complete!"
```

**Expected**: Announcements at each milestone (every 5 reps)

---

### Test 6: Encouragement System

**Objective**: Verify encouragement every 30 seconds

**Steps**:
1. Start session with `voice.startSessionWithSetup(...)`
2. Verify initial welcome message
3. Wait 30 seconds
4. Verify encouragement announcement
5. Wait another 30 seconds
6. Verify new encouragement (different from first)

**Expected**: Encouragement every 30 seconds, varying messages

---

### Test 7: Session Lifecycle

**Objective**: Verify complete session flow

**Steps**:
```jsx
const voice = useAdvancedVoiceCoach();

// Start
voice.startSessionWithSetup({
  exerciseName: 'Squats',
  targetReps: 10,
  mode: 'coach',
});

// Announce reps
voice.trackRepetition(5, 10);
voice.trackRepetition(10, 10); // Target reached

// End
voice.endSessionWithSummary({
  reps: 10,
  accuracy: 92,
  duration: 120,
});

// Check stats
const stats = voice.getSessionStats();
console.log(stats);
```

**Expected**: Session starts, reps tracked, ends with summary

---

## Performance Tests

### Test 1: Multiple Feedback Announcements

**Objective**: Verify system handles rapid feedback

**Setup**:
```jsx
const voice = useAdvancedVoiceCoach();
const feedbacks = [
  { type: 'warning', message: 'Keep back straight', joint: 'back' },
  { type: 'info', message: 'Good form', joint: 'knee' },
  { type: 'warning', message: 'Raise your arms', joint: 'arm' },
];

// Simulate rapid feedback
feedbacks.forEach((fb, idx) => {
  setTimeout(() => {
    voice.announceWithConfidence(fb, 0.90);
  }, idx * 500); // 500ms apart
});
```

**Expected**: System handles queue without hanging, announcements in order

---

### Test 2: Memory Usage

**Objective**: Verify no memory leaks

**Steps**:
1. Open DevTools → Memory tab
2. Take initial heap snapshot
3. Run session for 5 minutes with constant feedback
4. Take another heap snapshot
5. Compare sizes

**Expected**: Memory growth < 10MB over 5 minutes

---

## Browser Compatibility Tests

### Test Across Browsers

| Browser | Version | Test Steps | Expected |
|---------|---------|-----------|----------|
| Chrome | Latest | Run all tests | ✅ All pass |
| Firefox | Latest | Run all tests | ✅ All pass |
| Safari | Latest | Run all tests | ⚠️ Limited voice selection |
| Edge | Latest | Run all tests | ✅ All pass |

---

## Accessibility Tests

### Test 1: Voice Toggle Accessibility

```jsx
// Verify aria labels
<button
  onClick={handleToggleVoice}
  aria-label="Toggle voice coaching"
  aria-pressed={voiceCoach.isEnabled}
>
  {voiceCoach.isEnabled ? 'Disable Voice' : 'Enable Voice'}
</button>
```

**Expected**: Screen reader announces voice state changes

---

### Test 2: Keyboard Navigation

**Steps**:
1. Tab through VoiceCoachPanel
2. Use Enter/Space to toggle buttons
3. Use arrow keys to select radio buttons

**Expected**: All controls accessible via keyboard

---

## Automated Test Suite

```javascript
// voice.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { useVoiceCoach } from './useVoiceCoach';
import { useAdvancedVoiceCoach } from './useAdvancedVoiceCoach';

describe('useVoiceCoach', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useVoiceCoach());

    expect(result.current.isEnabled).toBe(true);
    expect(result.current.voiceMode).toBe('coach');
    expect(result.current.isSpeaking).toBe(false);
  });

  it('should toggle voice enabled', () => {
    const { result } = renderHook(() => useVoiceCoach());

    act(() => {
      result.current.setIsEnabled(false);
    });

    expect(result.current.isEnabled).toBe(false);
  });

  it('should change voice mode', () => {
    const { result } = renderHook(() => useVoiceCoach());

    act(() => {
      result.current.setVoiceMode('therapist');
    });

    expect(result.current.voiceMode).toBe('therapist');
  });
});

describe('useAdvancedVoiceCoach', () => {
  it('should track repetitions', () => {
    const { result } = renderHook(() => useAdvancedVoiceCoach());

    act(() => {
      result.current.trackRepetition(1, 10);
    });

    const stats = result.current.getSessionStats();
    expect(stats.repsAnnounced).toBe(1);
  });

  it('should announce with confidence threshold', () => {
    const { result } = renderHook(() => useAdvancedVoiceCoach());
    const feedback = { type: 'info', message: 'Test', joint: 'knee' };

    // Mock speak function
    const speakMock = jest.fn();
    result.current.speak = speakMock;

    // Should not announce (< 85%)
    act(() => {
      result.current.announceWithConfidence(feedback, 0.75);
    });
    expect(speakMock).not.toHaveBeenCalled();

    // Should announce (>= 85%)
    act(() => {
      result.current.announceWithConfidence(feedback, 0.90);
    });
    expect(speakMock).toHaveBeenCalled();
  });
});
```

## Debugging Tips

### Check Voice Support

```js
// Check available voices
const synth = window.speechSynthesis;
console.log('Available voices:', synth.getVoices());

// Check current voice
const hook = useVoiceCoach();
console.log('Selected voice:', hook.supportedVoices);
```

### Monitor Speech Queue

```js
// Add to useVoiceCoach for debugging
const speak = useCallback((text, options = {}) => {
  console.log('[useVoiceCoach] Speaking:', text);
  console.log('[useVoiceCoach] Mode:', voiceMode);
  console.log('[useVoiceCoach] Enabled:', isEnabled);
  // ... rest of speak function
}, [isEnabled, voiceMode]);
```

### Test Confidence Calculations

```jsx
// Verify confidence calculation
function DebugConfidence() {
  const { corrections, accuracy } = useSession();
  const confidence = Math.min(accuracy / 100, 1.0);

  return (
    <div>
      <p>Accuracy: {accuracy}%</p>
      <p>Confidence: {confidence.toFixed(2)}</p>
      <p>Will announce: {confidence >= 0.85 ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

---

## Validation Checklist

- [ ] Voice synthesis works across browsers
- [ ] All voice modes produce distinct output
- [ ] Confidence threshold blocks low-confidence feedback
- [ ] Repeated announcements prevented
- [ ] Rep announcements work correctly
- [ ] Encouragement provided every 30 seconds
- [ ] Session lifecycle complete
- [ ] No memory leaks
- [ ] Accessible via keyboard
- [ ] Screen reader friendly
- [ ] Mobile compatible
- [ ] Console error-free

---

**Status**: Complete for Production
**Last Updated**: June 2026
**Version**: 1.0
