import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { getExerciseById } from '../services/exerciseService';
import { useExercise } from '../hooks/useExercise';
import { useSession } from '../hooks/useSession';
import WebcamPanel from '../components/WebcamPanel';
import FeedbackPanel from '../components/FeedbackPanel';
import ProgressCard from '../components/ProgressCard';
import SessionSummaryModal from '../components/SessionSummaryModal';

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
    startSession, 
    enableCamera, 
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
    <div className="row g-4 h-100">
      
      {/* Viewport Area */}
      <div className="col-12 col-xl-8 d-flex flex-column">
        <WebcamPanel 
          isActive={cameraActive}
          onStart={enableCamera}
          reps={reps}
          statusMsg={statusMsg}
          accuracy={accuracy}
        />
      </div>

      {/* Sidebar Metrics */}
      <div className="col-12 col-xl-4 d-flex flex-column gap-4">
        <FeedbackPanel 
          exercise={selectedExercise} 
          onEndSession={handleEndSession} 
        />

        <ProgressCard 
          title="Current Form Score"
          score={accuracy}
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
