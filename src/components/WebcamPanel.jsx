import Card from './common/Card';
import Button from './common/Button';

export default function WebcamPanel({ isActive, onStart, reps, statusMsg, accuracy }) {
  return (
    <Card padding="0" className="flex-grow-1 overflow-hidden position-relative bg-inverse-surface d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '600px', border: '1px solid var(--color-inverse-primary)' }}>
      {isActive ? (
        <>
          {/* Simulated Camera Feed */}
          <div className="position-absolute inset-0 w-100 h-100" style={{ background: 'linear-gradient(45deg, #1a2a3a 0%, #0d1b2a 100%)' }}>
            {/* Simulated AI wireframe lines */}
            <svg width="100%" height="100%" className="position-absolute opacity-25">
              <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="var(--color-secondary)" strokeWidth="2" strokeDasharray="5,5" />
              <circle cx="50%" cy="50%" r="8" fill="var(--color-secondary)" />
              <circle cx="20%" cy="20%" r="8" fill="var(--color-secondary)" />
            </svg>
          </div>

          {/* Overlays */}
          <div className="position-absolute top-0 start-0 w-100 p-4 d-flex justify-content-between align-items-start z-1">
            <div className="bg-background bg-opacity-75 backdrop-blur rounded-pill px-4 py-2 d-flex align-items-center gap-2">
              <div className="ai-pulse-dot" />
              <span className="text-label-md font-bold text-primary">Live Analysis Active</span>
            </div>
            
            <div className="bg-background bg-opacity-75 backdrop-blur rounded-4 p-3 text-center min-w-[120px]">
              <div className="text-label-sm text-on-surface-variant text-uppercase mb-1">Reps</div>
              <div className="text-display-lg text-primary">{reps}</div>
            </div>
          </div>

          <div className="position-absolute bottom-0 start-0 w-100 p-4 z-1">
            <div className="bg-background bg-opacity-90 backdrop-blur rounded-4 p-4 shadow-lg border border-outline-variant max-w-md mx-auto text-center">
              <div className="text-headline-md mb-2">{statusMsg}</div>
              <div className="progress mx-auto" style={{ height: '6px', maxWidth: '200px' }}>
                <div 
                  className={`progress-bar ${accuracy > 80 ? 'bg-secondary-color' : 'bg-tertiary-color'}`} 
                  style={{ width: `${accuracy}%`, transition: 'width 0.5s ease' }} 
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center z-1">
          <span className="material-symbols-outlined text-outline-variant mb-4" style={{ fontSize: 80 }}>videocam_off</span>
          <h2 className="text-headline-lg text-white mb-2">Ready to start?</h2>
          <p className="text-body-lg text-outline-variant mb-4 max-w-md mx-auto">
            Ensure your full body is visible in the frame and your device is securely mounted.
          </p>
          <Button size="lg" icon="videocam" onClick={onStart}>
            Enable Camera & Start
          </Button>
        </div>
      )}
    </Card>
  );
}
