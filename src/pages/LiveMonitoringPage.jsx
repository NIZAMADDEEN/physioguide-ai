import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { getExerciseById } from '../services/exerciseService';
import { useExercise } from '../hooks/useExercise';
import { useSession } from '../hooks/useSession';
import WebcamPanel from '../components/WebcamPanel';
import FeedbackPanel from '../components/FeedbackPanel';
import SessionSummaryModal from '../components/SessionSummaryModal';
import Button from '../components/common/Button';

export default function LiveMonitoringPage() {
  const [searchParams] = useSearchParams();
  const exerciseId = searchParams.get('exerciseId');
  const navigate = useNavigate();
  
  const { selectedExercise } = useExercise();
  const { 
    activeSession, 
    cameraActive, 
    reps, 
    accuracy, 
    statusMsg, 
    lastSessionSummary, 
    isPaused,
    sessionDuration,
    corrections,
    successNotifications,
    isCalibrated,
    startSession, 
    enableCamera, 
    pauseSession,
    resumeSession,
    endSession, 
    clearSessionSummary 
  } = useSession();

  const [showSummary, setShowSummary] = useState(false);

  // Fallback to fetch exercise & start session on direct refresh
  useEffect(() => {
    if (!exerciseId) {
      navigate(ROUTES.EXERCISES);
      return;
    }
    
    if (!selectedExercise || !activeSession) {
      getExerciseById(exerciseId).then(data => {
        if (!data) {
          navigate(ROUTES.EXERCISES);
        } else {
          startSession(exerciseId, data);
        }
      });
    }
  }, [exerciseId, selectedExercise, activeSession, startSession, navigate]);

  const handleEndSession = () => {
    endSession();
    setShowSummary(true);
  };

  const handleFinish = () => {
    setShowSummary(false);
    clearSessionSummary();
    navigate(ROUTES.DASHBOARD);
  };

  if (!selectedExercise) return null;

  return (
    <div className="row g-4 h-100 align-items-stretch">
      
      {/* Viewport & Bottom Controls Area */}
      <div className="col-12 col-xl-8 d-flex flex-column gap-3">
        <WebcamPanel 
          isActive={cameraActive}
          isPaused={isPaused}
          onStart={enableCamera}
          reps={reps}
          statusMsg={statusMsg}
          accuracy={accuracy}
          exercise={selectedExercise}
          isCalibrated={isCalibrated}
        />

        {/* Bottom Controls Panel */}
        <div 
          className="d-flex justify-content-center align-items-center gap-3 p-3 rounded-4 shadow-sm border" 
          style={{ background: 'var(--color-surface-container)', minHeight: '80px' }}
        >
          {!cameraActive ? (
            <Button 
              size="lg" 
              variant="primary" 
              icon="videocam" 
              onClick={enableCamera} 
              className="px-5 shadow-primary"
            >
              Start Camera & Tracking
            </Button>
          ) : (
            <div className="d-flex gap-3">
              {isPaused ? (
                <Button 
                  size="lg" 
                  variant="secondary" 
                  icon="play_arrow" 
                  onClick={resumeSession} 
                  className="px-4 bg-success text-white border-success hover-bg-success"
                >
                  Resume
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  variant="secondary" 
                  icon="pause" 
                  onClick={pauseSession} 
                  className="px-4 bg-warning text-dark border-warning hover-bg-warning"
                >
                  Pause
                </Button>
              )}
              <Button 
                size="lg" 
                variant="outline-white" 
                icon="stop" 
                onClick={handleEndSession} 
                className="px-4 bg-danger text-white border-danger hover-bg-danger"
              >
                Stop
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Metrics & Logs */}
      <div className="col-12 col-xl-4">
        <FeedbackPanel 
          exercise={selectedExercise}
          reps={reps}
          accuracy={accuracy}
          sessionDuration={sessionDuration}
          isPaused={isPaused}
          corrections={corrections}
          successNotifications={successNotifications}
          cameraActive={cameraActive}
        />
      </div>

      {/* Summary Modal on Session End */}
      <SessionSummaryModal 
        isOpen={showSummary}
        onClose={handleFinish}
        onFinish={handleFinish}
        sessionData={lastSessionSummary}
      />
    </div>
  );
}
