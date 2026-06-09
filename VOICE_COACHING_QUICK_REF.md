# Voice Coaching System - Quick Reference

## 📚 File Structure

```
physioguide-ai/
├── src/
│   ├── hooks/
│   │   ├── useVoiceCoach.js ..................... Core voice hook
│   │   └── useAdvancedVoiceCoach.js ............ Advanced voice hook
│   ├── context/
│   │   ├── VoiceCoachContext.jsx .............. Global state & provider
│   ├── components/
│   │   ├── VoiceCoachPanel.jsx ................ UI control panel
│   │   ├── VoiceFeedbackIntegrator.jsx ........ Feedback bridge
│   ├── config/
│   │   └── voiceCoachConfig.js ................ Voice modes & settings
│   ├── styles/
│   │   └── voiceCoach.css ..................... Component styling
│   └── App.jsx ............................... (Updated with provider)
│
├── VOICE_COACHING_SUMMARY.md .................. This file
├── VOICE_COACHING_INTEGRATION.md ............. Full integration guide
├── VOICE_COACHING_TESTING.md ................. Testing procedures
└── LIVE_MONITORING_EXAMPLE.jsx ............... Example implementation
```

## ⚡ 60-Second Setup

```jsx
// 1. Update App.jsx
import { VoiceCoachProvider } from './context/VoiceCoachContext';

function App() {
  return (
    <VoiceCoachProvider>
      {/* Your app */}
    </VoiceCoachProvider>
  );
}

// 2. Add to page
import VoiceCoachPanel from './components/VoiceCoachPanel';
import { VoiceFeedbackIntegrator } from './components/VoiceFeedbackIntegrator';

export default function LiveMonitoringPage() {
  return (
    <>
      <VoiceFeedbackIntegrator />
      <VoiceCoachPanel />
      {/* Rest of page */}
    </>
  );
}
```

## 🎯 Common Tasks

### Enable Voice
```jsx
const voice = useVoiceCoach();
voice.setIsEnabled(true);
```

### Change Voice Mode
```jsx
voice.setVoiceMode('coach');  // 'therapist', 'coach', 'gentleRecovery'
```

### Speak Custom Text
```jsx
voice.speak('This is a test message');
```

### Announce Correction
```jsx
const feedback = {
  type: 'warning',
  message: 'Keep your back straight',
  joint: 'back'
};
voice.announceCorrection(feedback, 0.92);  // confidence
```

### Announce Repetition
```jsx
voice.announceRepetition(5);  // Rep 5
```

### Provide Encouragement
```jsx
voice.announceEncouragement();
```

### Start/End Session
```jsx
// Start
voice.startSession();

// End with summary
voice.endSession({ reps: 15, accuracy: 92, duration: 180 });
```

## 🔌 Hooks Reference

### useVoiceCoach
Basic voice coaching hook

**Returns**:
- `voiceMode`, `isEnabled`, `isSpeaking`, `supportedVoices`
- `setVoiceMode(mode)`, `setIsEnabled(enabled)`
- `speak(text, options)`, `stop()`, `pause()`, `resume()`
- `startSession()`, `endSession(summary)`
- `announceCorrection(feedback, confidence)`
- `announceRepetition(reps, target)`
- `announceEncouragement()`
- `getStats()`

### useAdvancedVoiceCoach
Advanced hook with session management

**Additional Returns**:
- `announceWithConfidence(feedback, confidence, metadata)`
- `trackRepetition(currentReps, targetReps, milestone)`
- `provideContextualEncouragement(context)`
- `startSessionWithSetup(config)`
- `endSessionWithSummary(data)`
- `getSessionStats()`
- `getFeedbackHistory(limit)`
- `resetSession()`

### useVoiceCoachContext
Global context access

**Returns**: All useVoiceCoach + context-specific methods

## 🎤 Voice Modes

| Mode | Rate | Pitch | Use Case |
|------|------|-------|----------|
| Therapist | 0.9 | 0.9 | Clinical guidance |
| Coach | 1.1 | 1.1 | Motivational training |
| GentleRecovery | 0.8 | 0.8 | Post-injury rehab |

## 📊 Confidence Levels

```
< 70%  : INSUFFICIENT  → No feedback
70-85% : MARGINAL      → No feedback
85-95% : GOOD          → Feedback announced ✅
≥ 95%  : EXCELLENT     → Feedback announced ✅
```

**Threshold**: 0.85 (configurable in `voiceCoachConfig.js`)

## ⏱️ Timing

| Action | Interval |
|--------|----------|
| Min gap between same feedback | 8 seconds |
| Min gap before re-announcing | 10 seconds |
| Encouragement interval | 30 seconds |
| Correction debounce | 1.5 seconds |

## 🎨 Components

### VoiceCoachPanel
Interactive UI for voice configuration
- Enable/disable toggle
- Voice mode selection (radio buttons)
- Test message input
- System information
- Advanced settings

### VoiceFeedbackIntegrator
Invisible component that bridges feedback with voice
- Listens to `corrections` from SessionContext
- Listens to `reps` from SessionContext
- Listens to `accuracy` from SessionContext
- Automatically announces when conditions met

## 🔄 Data Flow

```
SessionContext (feedback, reps, accuracy)
        ↓
VoiceFeedbackIntegrator (processes & filters)
        ↓
useVoiceCoach (formats & speaks)
        ↓
Web Speech Synthesis API
        ↓
🔊 User hears voice
```

## 📋 Configuration

Edit `src/config/voiceCoachConfig.js`:

```js
// Adjust confidence threshold
export const confidenceThreshold = 0.85;

// Modify voice mode characteristics
voiceModes.coach.rate = 1.1;
voiceModes.coach.pitch = 1.1;

// Customize feedback messages
voiceModes.coach.encouragements = [
  'Custom message 1',
  'Custom message 2',
];

// Change voice preferences
voiceModes.coach.voicePreferences = [
  { name: 'Your Voice Name', lang: 'en-US' },
];
```

## 🐛 Debugging

### Check Voice Status
```js
const voice = useVoiceCoach();
console.log({
  enabled: voice.isEnabled,
  speaking: voice.isSpeaking,
  mode: voice.voiceMode,
  voices: voice.supportedVoices.length
});
```

### Monitor Announcements
```js
const voice = useAdvancedVoiceCoach();
const stats = voice.getSessionStats();
console.log(stats);
// Shows: startTime, repsAnnounced, correctionsAnnounced, etc.
```

### View Feedback History
```js
const voice = useAdvancedVoiceCoach();
const history = voice.getFeedbackHistory(10);
console.table(history);
```

## ✅ Testing Checklist

- [ ] Voice works in Chrome
- [ ] Voice works in Firefox
- [ ] All three voice modes produce audio
- [ ] Feedback only announces with confidence > 85%
- [ ] Rep announcements work
- [ ] Encouragement provided every 30 seconds
- [ ] Repeated feedback prevented
- [ ] No console errors
- [ ] Works on mobile
- [ ] Keyboard accessible

## 🚀 Performance Tips

1. **Debounce corrections**: Default 1.5s, adjust if needed
2. **Limit feedback history**: Default 100 items
3. **Clear feedback periodically**: `voice.resetSession()`
4. **Monitor memory**: Watch heap snapshots during long sessions
5. **Test on device**: Voices vary across browsers/devices

## 📱 Mobile Considerations

- Limited voice selection on mobile
- Test voice availability before session
- May need fallback to default system voice
- Consider volume levels for patient comfort

## 🔐 Privacy Notes

- ✅ All processing client-side
- ✅ No external API calls
- ✅ No data logging
- ✅ No tracking

## 🎓 Learning Resources

1. Start: `VOICE_COACHING_SUMMARY.md` (overview)
2. Integrate: `VOICE_COACHING_INTEGRATION.md` (setup & API)
3. Test: `VOICE_COACHING_TESTING.md` (validation)
4. Example: `LIVE_MONITORING_EXAMPLE.jsx` (full implementation)
5. Code: Read inline comments in hook/component files

## 💬 Example Outputs

### Therapist Mode
> "Attention to form: Keep your back straighter. Focus on maintaining proper alignment."

### Coach Mode
> "Quick adjustment: Keep your back straighter. You got this!"

### Gentle Recovery Mode
> "Gentle reminder: Keep your back straighter. Take your time and move at a comfortable pace."

## 🎯 Real-World Workflow

1. **Patient starts exercise**
   - VoiceCoachPanel enables voice
   - Selects preferred mode
   - Clicks "Start Session"

2. **During exercise**
   - MediaPipe detects pose
   - Feedback engine generates corrections
   - Voice coach announces corrections (if confidence > 85%)
   - Voice coach announces each rep completion
   - Voice coach provides encouragement every 30 seconds

3. **Exercise completes**
   - Patient clicks "End Session"
   - Voice coach provides summary
   - Session stats displayed

## 🔗 Integration Example

```jsx
function ExerciseSession() {
  const voice = useAdvancedVoiceCoach();
  const { corrections, reps, accuracy } = useSession();

  // Start
  const start = () => voice.startSessionWithSetup({
    exerciseName: 'Squats',
    targetReps: 15,
    mode: 'coach'
  });

  // During exercise
  useEffect(() => {
    voice.announceWithConfidence(corrections[0], accuracy / 100);
  }, [corrections, accuracy]);

  useEffect(() => {
    voice.trackRepetition(reps, 15, 5);
  }, [reps]);

  // End
  const end = () => voice.endSessionWithSummary({
    reps, accuracy, duration: 120
  });

  return <>...</>;
}
```

---

**Quick Ref v1.0** | Updated: June 2026
