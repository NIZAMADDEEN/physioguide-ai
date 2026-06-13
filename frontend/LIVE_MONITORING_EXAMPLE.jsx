/**
 * LiveMonitoringPage - Example Integration with Voice Coaching
 * 
 * This example shows how to fully integrate the voice coaching system
 * with the existing live monitoring functionality.
 * 
 * To use this:
 * 1. Replace or update your existing LiveMonitoringPage with this code
 * 2. Adjust imports to match your actual component structure
 * 3. Customize voice modes and feedback as needed
 */

import { useState, useEffect, useRef } from 'react';
import { useSession } from '../hooks/useSession';
import { useAdvancedVoiceCoach } from '../hooks/useAdvancedVoiceCoach';
import WebcamPanel from '../components/WebcamPanel';
import FeedbackPanel from '../components/FeedbackPanel';
import VoiceCoachPanel from '../components/VoiceCoachPanel';
import { VoiceFeedbackIntegrator } from '../components/VoiceFeedbackIntegrator';
import '../styles/liveMonitoring.css';

export default function LiveMonitoringPage() {
  const { cameraActive, reps, accuracy, corrections, statusMsg, isPaused } =
    useSession();

  // Use advanced voice coach for full control
  const voice = useAdvancedVoiceCoach();

  // Local state
  const [sessionActive, setSessionActive] = useState(false);
  const [targetReps, setTargetReps] = useState(15);
  const [exerciseName, setExerciseName] = useState('Squats');
  const [voiceMode, setVoiceMode] = useState('coach');
  const [sessionStats, setSessionStats] = useState(null);

  const sessionStartedRef = useRef(false);

  // ─── Voice Coaching Integration ────────────────────────────────────────

  /**
   * Start exercise session with voice announcement
   */
  const handleStartSession = () => {
    setSessionActive(true);
    sessionStartedRef.current = true;

    // Initialize voice coach with exercise details
    voice.startSessionWithSetup({
      exerciseName,
      targetReps,
      mode: voiceMode,
    });
  };

  /**
   * End exercise session with summary
   */
  const handleEndSession = () => {
    setSessionActive(false);
    sessionStartedRef.current = false;

    // Provide detailed session summary
    voice.endSessionWithSummary({
      reps,
      accuracy,
      duration: sessionStats?.elapsedTime || 0,
    });

    // Save stats for display
    setSessionStats(voice.getSessionStats());
  };

  /**
   * Announce posture corrections with confidence tracking
   */
  useEffect(() => {
    if (!sessionActive || !voice.isEnabled || !corrections?.length) {
      return;
    }

    // Calculate confidence from accuracy
    const confidence = Math.min(accuracy / 100, 1.0);

    // Announce only if confidence exceeds threshold
    corrections.forEach((correction, index) => {
      voice.announceWithConfidence(correction, confidence, {
        index,
        timestamp: Date.now(),
      });
    });
  }, [corrections, accuracy, sessionActive, voice]);

  /**
   * Track repetitions with milestone announcements
   */
  useEffect(() => {
    if (!sessionActive || !voice.isEnabled) {
      return;
    }

    // Announce milestones (every 5 reps)
    voice.trackRepetition(reps, targetReps, 5);
  }, [reps, sessionActive, voice, targetReps]);

  /**
   * Provide contextual encouragement every 30 seconds
   */
  useEffect(() => {
    if (!sessionActive || !voice.isEnabled) {
      return;
    }

    const encouragementInterval = setInterval(() => {
      voice.provideContextualEncouragement({
        currentReps: reps,
        targetReps,
        accuracy,
        duration: sessionStats?.elapsedTime || 0,
        exerciseName,
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(encouragementInterval);
  }, [
    sessionActive,
    reps,
    accuracy,
    voice,
    targetReps,
    exerciseName,
    sessionStats,
  ]);

  /**
   * Update session stats periodically
   */
  useEffect(() => {
    if (sessionActive) {
      const statsInterval = setInterval(() => {
        setSessionStats(voice.getSessionStats());
      }, 1000);

      return () => clearInterval(statsInterval);
    }
  }, [sessionActive, voice]);

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div className="live-monitoring-container">
      {/* Voice Feedback Integrator - invisible component */}
      <VoiceFeedbackIntegrator />

      {/* Main Monitoring Layout */}
      <div className="monitoring-grid">
        {/* Left: Video Feed */}
        <div className="monitoring-main">
          <WebcamPanel
            isActive={cameraActive}
            isPaused={isPaused}
            reps={reps}
            statusMsg={statusMsg}
            accuracy={accuracy}
          />

          {/* Feedback Display */}
          <FeedbackPanel corrections={corrections} accuracy={accuracy} />
        </div>

        {/* Right: Controls Sidebar */}
        <aside className="monitoring-sidebar">
          {/* Session Controls */}
          <div className="session-controls">
            <h3>Exercise Control</h3>

            {/* Exercise Selection */}
            <div className="control-group">
              <label>Exercise</label>
              <input
                type="text"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
                disabled={sessionActive}
                placeholder="e.g., Squats"
              />
            </div>

            {/* Target Reps */}
            <div className="control-group">
              <label>Target Reps</label>
              <input
                type="number"
                value={targetReps}
                onChange={(e) => setTargetReps(parseInt(e.target.value))}
                disabled={sessionActive}
                min="1"
                max="100"
              />
            </div>

            {/* Voice Mode Selection */}
            <div className="control-group">
              <label>Voice Mode</label>
              <select
                value={voiceMode}
                onChange={(e) => {
                  setVoiceMode(e.target.value);
                  voice.setVoiceMode(e.target.value);
                }}
                disabled={sessionActive}
              >
                <option value="therapist">Therapist</option>
                <option value="coach">Coach</option>
                <option value="gentleRecovery">Gentle Recovery</option>
              </select>
            </div>

            {/* Start/End Buttons */}
            <div className="button-group">
              <button
                onClick={handleStartSession}
                disabled={sessionActive}
                className="btn btn-primary"
              >
                🎬 Start Session
              </button>
              <button
                onClick={handleEndSession}
                disabled={!sessionActive}
                className="btn btn-secondary"
              >
                ⏹️ End Session
              </button>
            </div>
          </div>

          {/* Voice Coach Panel */}
          <VoiceCoachPanel />

          {/* Session Statistics */}
          {sessionActive && sessionStats && (
            <div className="session-stats">
              <h3>Session Stats</h3>
              <div className="stat-row">
                <span>Reps:</span>
                <strong>
                  {reps}/{targetReps}
                </strong>
              </div>
              <div className="stat-row">
                <span>Accuracy:</span>
                <strong>{Math.round(accuracy)}%</strong>
              </div>
              <div className="stat-row">
                <span>Duration:</span>
                <strong>{Math.floor(sessionStats.elapsedTime / 60)}m</strong>
              </div>
              <div className="stat-row">
                <span>Corrections Announced:</span>
                <strong>{sessionStats.correctionsAnnounced}</strong>
              </div>
              <div className="stat-row">
                <span>Avg Confidence:</span>
                <strong>{(sessionStats.averageConfidence * 100).toFixed(0)}%</strong>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
