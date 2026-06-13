import Card from './common/Card';

export default function FeedbackPanel({
  exercise,
  reps,
  accuracy,
  sessionDuration,
  isPaused,
  corrections,
  successNotifications,
  cameraActive,
}) {
  if (!exercise) return null;

  // Formats seconds into MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Determine accuracy colors and feedback message
  let accuracyColor = 'var(--color-outline-variant)';
  let accuracyBg = 'rgba(255, 255, 255, 0.05)';
  let accuracyText = 'Idle';

  if (cameraActive && !isPaused) {
    if (accuracy >= 88) {
      accuracyColor = '#00e676';
      accuracyBg = 'rgba(0, 230, 118, 0.1)';
      accuracyText = 'Excellent';
    } else if (accuracy >= 75) {
      accuracyColor = '#ffb300';
      accuracyBg = 'rgba(255, 179, 0, 0.1)';
      accuracyText = 'Good';
    } else if (accuracy > 0) {
      accuracyColor = '#ff1744';
      accuracyBg = 'rgba(255, 23, 68, 0.1)';
      accuracyText = 'Needs Adjustment';
    }
  }

  return (
    <div className="d-flex flex-column gap-3 h-100">
      
      {/* ─── Exercise Info Card ───────────────────────────────────────────────── */}
      <Card padding="md" className="border-0 shadow-sm" style={{ background: 'var(--color-surface-container)' }}>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <span className="badge bg-primary-container text-primary text-label-sm rounded-pill mb-1">
              {exercise.category || 'Therapy'}
            </span>
            <h2 className="text-headline-md font-bold mb-0 text-on-surface" style={{ fontSize: '18px' }}>
              {exercise.name}
            </h2>
          </div>
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>
            fitness_center
          </span>
        </div>
        <p className="text-body-md text-on-surface-variant mb-0" style={{ fontSize: '13px', lineHeight: '1.4' }}>
          {exercise.description}
        </p>
      </Card>

      {/* ─── Live Session Metrics Grid ────────────────────────────────────────── */}
      <div className="row g-3">
        {/* Reps Tracker */}
        <div className="col-6">
          <Card padding="md" className="border-0 shadow-sm text-center h-100 d-flex flex-column justify-content-center" style={{ minHeight: '110px' }}>
            <div className="text-label-sm text-on-surface-variant text-uppercase mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
              Reps Target
            </div>
            <div className="d-flex align-items-baseline justify-content-center gap-1">
              <span className="text-display-lg font-bold text-primary" style={{ fontSize: '32px' }}>
                {reps}
              </span>
              <span className="text-label-md text-outline" style={{ fontSize: '14px' }}>
                / {exercise.reps || 12}
              </span>
            </div>
            <div className="progress mt-2" style={{ height: '4px' }}>
              <div 
                className="progress-bar bg-primary" 
                style={{ 
                  width: `${Math.min(100, (reps / (exercise.reps || 12)) * 100)}%`, 
                  transition: 'width 0.3s ease' 
                }} 
              />
            </div>
          </Card>
        </div>

        {/* Stopwatch Timer */}
        <div className="col-6">
          <Card padding="md" className="border-0 shadow-sm text-center h-100 d-flex flex-column justify-content-center" style={{ minHeight: '110px' }}>
            <div className="text-label-sm text-on-surface-variant text-uppercase mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
              Active Duration
            </div>
            <div className="d-flex align-items-center justify-content-center gap-2">
              <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>
                schedule
              </span>
              <span className="text-headline-md font-bold text-on-surface" style={{ fontSize: '24px', fontFamily: 'Courier New, monospace' }}>
                {formatTime(sessionDuration)}
              </span>
            </div>
            <div className="text-label-sm text-outline mt-2" style={{ fontSize: '10px' }}>
              {isPaused ? 'Timer Paused' : cameraActive ? 'Timer Active' : 'Waiting...'}
            </div>
          </Card>
        </div>

        {/* Form Accuracy Score Card */}
        <div className="col-12">
          <Card padding="md" className="border-0 shadow-sm" style={{ background: 'var(--color-surface-container-low)' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="text-label-sm text-on-surface-variant text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                Form Accuracy
              </div>
              <span 
                className="badge font-bold text-label-sm rounded-pill px-2 py-0.5"
                style={{ backgroundColor: accuracyBg, color: accuracyColor, border: `1px solid ${accuracyColor}` }}
              >
                {accuracyText.toUpperCase()}
              </span>
            </div>

            <div className="d-flex align-items-center gap-3">
              {/* Circular Gauge Replica */}
              <div className="position-relative d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                <svg width="60" height="60" className="transform -rotate-90">
                  <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="4" />
                  <circle 
                    cx="30" 
                    cy="30" 
                    r="25" 
                    fill="none" 
                    stroke={accuracyColor} 
                    strokeWidth="4" 
                    strokeDasharray={2 * Math.PI * 25}
                    strokeDashoffset={2 * Math.PI * 25 * (1 - (cameraActive ? accuracy : 0) / 100)}
                    style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.4s ease' }}
                  />
                </svg>
                <div className="position-absolute text-headline-sm font-bold text-on-surface" style={{ fontSize: '13px' }}>
                  {cameraActive ? `${accuracy}%` : '—'}
                </div>
              </div>

              {/* Linear Details */}
              <div className="flex-grow-1">
                <div className="text-body-sm text-on-surface-variant mb-1" style={{ fontSize: '11px' }}>
                  Maintain angles within target tolerance.
                </div>
                <div className="d-flex justify-content-between text-outline" style={{ fontSize: '9px' }}>
                  <span>0%</span>
                  <span>Target Range (85-100%)</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── Real-time Posture Corrections Panel ───────────────────────────────── */}
      <Card padding="md" className="flex-grow-1 border-0 shadow-sm d-flex flex-column" style={{ minHeight: '180px' }}>
        <div className="d-flex align-items-center gap-2 border-bottom pb-2 mb-2">
          <span className="material-symbols-outlined text-warning" style={{ fontSize: '18px' }}>
            error
          </span>
          <span className="text-label-md font-bold text-on-surface" style={{ fontSize: '12px', letterSpacing: '0.5px' }}>
            LIVE CORRECTIONS
          </span>
        </div>

        <div className="flex-grow-1 overflow-y-auto pe-1" style={{ maxHeight: '120px' }}>
          {!cameraActive ? (
            <div className="text-center text-outline-variant py-4">
              <span className="material-symbols-outlined mb-2" style={{ fontSize: '24px' }}>videocam_off</span>
              <p className="text-body-md mb-0" style={{ fontSize: '12px' }}>Camera offline.</p>
            </div>
          ) : corrections.length === 0 ? (
            <div className="d-flex align-items-center justify-content-center flex-column text-center py-4 text-secondary-color">
              <span className="material-symbols-outlined mb-2" style={{ fontSize: '28px', color: '#00e676' }}>task_alt</span>
              <p className="text-body-md mb-0 font-bold" style={{ fontSize: '12px', color: '#00e676' }}>Form is aligned!</p>
              <span className="text-outline" style={{ fontSize: '10px' }}>No corrective action needed.</span>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {corrections.map((corr) => (
                <div 
                  key={corr.id} 
                  className="rounded-3 p-2 border d-flex align-items-start gap-2 animate-fade-in"
                  style={{ 
                    background: 'rgba(255, 179, 0, 0.04)', 
                    borderColor: 'rgba(255, 179, 0, 0.2)' 
                  }}
                >
                  <span className="material-symbols-outlined text-warning mt-0.5" style={{ fontSize: '14px' }}>
                    warning
                  </span>
                  <div className="flex-grow-1">
                    <div className="text-body-md font-bold text-on-surface" style={{ fontSize: '11px', lineHeight: '1.3' }}>
                      {corr.text}
                    </div>
                    <div className="text-outline text-end" style={{ fontSize: '8px' }}>
                      {corr.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* ─── Success Notifications Panel ──────────────────────────────────────── */}
      <Card padding="md" className="flex-grow-1 border-0 shadow-sm d-flex flex-column" style={{ minHeight: '180px' }}>
        <div className="d-flex align-items-center gap-2 border-bottom pb-2 mb-2">
          <span className="material-symbols-outlined text-success" style={{ fontSize: '18px' }}>
            stars
          </span>
          <span className="text-label-md font-bold text-on-surface" style={{ fontSize: '12px', letterSpacing: '0.5px' }}>
            SESSION MILESTONES
          </span>
        </div>

        <div className="flex-grow-1 overflow-y-auto pe-1" style={{ maxHeight: '120px' }}>
          {!cameraActive ? (
            <div className="text-center text-outline-variant py-4">
              <span className="material-symbols-outlined mb-2" style={{ fontSize: '24px' }}>pending_actions</span>
              <p className="text-body-md mb-0" style={{ fontSize: '12px' }}>Awaiting session start...</p>
            </div>
          ) : successNotifications.length === 0 ? (
            <div className="text-center text-outline py-4">
              <p className="text-body-md mb-0 animate-pulse" style={{ fontSize: '12px' }}>Calibrating & preparing rep count...</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {successNotifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className="rounded-3 p-2 border d-flex align-items-start gap-2"
                  style={{ 
                    background: notif.type === 'system' ? 'rgba(0, 243, 255, 0.05)' : 'rgba(0, 230, 118, 0.05)', 
                    borderColor: notif.type === 'system' ? 'rgba(0, 243, 255, 0.2)' : 'rgba(0, 230, 118, 0.2)' 
                  }}
                >
                  <span 
                    className="material-symbols-outlined mt-0.5" 
                    style={{ 
                      fontSize: '14px', 
                      color: notif.type === 'system' ? '#00f3ff' : '#00e676' 
                    }}
                  >
                    {notif.type === 'system' ? 'settings_suggest' : 'check_circle'}
                  </span>
                  <div className="flex-grow-1">
                    <div className="text-body-md text-on-surface" style={{ fontSize: '11px', lineHeight: '1.3' }}>
                      {notif.text}
                    </div>
                    <div className="text-outline text-end" style={{ fontSize: '8px' }}>
                      {notif.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
      
    </div>
  );
}
