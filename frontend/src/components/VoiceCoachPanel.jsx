import { useState, useEffect } from "react";
import { useVoiceCoachContext } from "../context/VoiceCoachContext";
import {
  getAvailableVoiceModes,
  getConfidenceLevel,
} from "../config/voiceCoachConfig";
import Card from "./common/Card";
import Button from "./common/Button";
import "../styles/voiceCoach.css";

/**
 * Voice Coach Control Panel
 * Provides UI for:
 * - Enabling/Disabling voice coaching
 * - Selecting voice mode (Therapist, Coach, Gentle Recovery)
 * - Viewing current voice status
 * - Testing voice output
 */
export default function VoiceCoachPanel() {
  const voiceCoach = useVoiceCoachContext();
  const [availableModes, setAvailableModes] = useState([]);
  const [testMessage, setTestMessage] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setAvailableModes(getAvailableVoiceModes());
  }, []);

  const handleModeChange = (modeId) => {
    voiceCoach.setVoiceMode(modeId);
  };

  const handleToggleVoice = () => {
    voiceCoach.setIsEnabled(!voiceCoach.isEnabled);
  };

  const handleTestVoice = () => {
    const message =
      testMessage ||
      `Hello! I am your ${voiceCoach.voiceMode} voice coach. Ready to help you with your exercise!`;
    voiceCoach.speak(message);
  };

  const handleStopVoice = () => {
    voiceCoach.stop();
  };

  const stats = voiceCoach.getStats();

  return (
    <Card className="voice-coach-panel">
      <div className="voice-coach-header">
        <h3>🎤 Voice Coach</h3>
        <button
          className="toggle-advanced"
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-label="Toggle advanced settings"
        >
          {showAdvanced ? "−" : "+"}
        </button>
      </div>

      {/* Voice Status */}
      <div className="voice-status">
        <div className="status-item">
          <span className="status-label">Status:</span>
          <span
            className={`status-value ${voiceCoach.isEnabled ? "enabled" : "disabled"}`}
          >
            {voiceCoach.isEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">Speaking:</span>
          <span
            className={`status-value ${voiceCoach.isSpeaking ? "active" : ""}`}
          >
            {voiceCoach.isSpeaking ? "🔊 Speaking..." : "🔇 Silent"}
          </span>
        </div>
      </div>

      {/* Enable/Disable Button */}
      <div className="voice-control-button">
        <Button
          onClick={handleToggleVoice}
          variant={voiceCoach.isEnabled ? "primary" : "secondary"}
          className="full-width"
        >
          {voiceCoach.isEnabled ? "🔇 Disable Voice" : "🔊 Enable Voice"}
        </Button>
      </div>

      {/* Voice Mode Selection */}
      <div className="voice-modes">
        <label className="section-label">Voice Mode</label>
        <div className="mode-grid">
          {availableModes.map((mode) => (
            <div key={mode.id} className="mode-option">
              <input
                type="radio"
                id={`mode-${mode.id}`}
                name="voiceMode"
                value={mode.id}
                checked={voiceCoach.voiceMode === mode.id}
                onChange={() => handleModeChange(mode.id)}
                disabled={!voiceCoach.isEnabled}
              />
              <label htmlFor={`mode-${mode.id}`}>
                <div className="mode-name">{mode.name}</div>
                <div className="mode-description">{mode.description}</div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="advanced-settings">
          <div className="section-divider" />

          <label className="section-label">Test Voice</label>
          <div className="test-section">
            <input
              type="text"
              placeholder="Enter test message (or use default)..."
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="test-input"
              disabled={!voiceCoach.isEnabled}
            />
            <div className="test-buttons">
              <Button
                onClick={handleTestVoice}
                variant="primary"
                disabled={!voiceCoach.isEnabled}
                size="small"
              >
                Test
              </Button>
              <Button
                onClick={handleStopVoice}
                variant="secondary"
                disabled={!voiceCoach.isSpeaking}
                size="small"
              >
                Stop
              </Button>
            </div>
          </div>

          {/* System Info */}
          <div className="system-info">
            <div className="info-row">
              <span className="info-label">Available Voices:</span>
              <span className="info-value">{stats.supportedVoices}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Current Mode:</span>
              <span className="info-value">{voiceCoach.voiceMode}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
