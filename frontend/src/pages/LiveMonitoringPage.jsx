import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import { getExerciseById } from "../services/exerciseService";
import { useExercise } from "../hooks/useExercise";
import { useSession } from "../hooks/useSession";
import WebcamPanel from "../components/WebcamPanel";
import FeedbackPanel from "../components/FeedbackPanel";
import SessionSummaryModal from "../components/SessionSummaryModal";
import Button from "../components/common/Button";

export default function LiveMonitoringPage() {
  const [searchParams] = useSearchParams();
  const exerciseId = searchParams.get("exerciseId");
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
    clearSessionSummary,
  } = useSession();

  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (!exerciseId) {
      navigate(ROUTES.EXERCISES);
      return;
    }

    if (!selectedExercise || !activeSession) {
      getExerciseById(exerciseId).then((data) => {
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
    <div className="row g-3 h-100 align-items-stretch">
      {/* Main Webcam Area - 70-80% of width */}
      <div className="col-12 col-lg-9 d-flex flex-column gap-3">
        {/* Webcam Feed */}
        <div className="flex-grow-1">
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
        </div>

        {/* Bottom Control Panel */}
        <div
          className="d-flex justify-content-center align-items-center gap-3 p-3 rounded-3 border"
          style={{
            background: "var(--color-surface-container)",
            minHeight: "70px",
          }}
        >
          {!cameraActive ? (
            <Button
              size="lg"
              variant="primary"
              icon="videocam"
              onClick={enableCamera}
              className="px-5"
            >
              Start Camera & Tracking
            </Button>
          ) : (
            <div className="d-flex gap-3 w-100 justify-content-center">
              {isPaused ? (
                <Button
                  size="lg"
                  variant="secondary"
                  icon="play_arrow"
                  onClick={resumeSession}
                  className="px-4 bg-success text-white border-success"
                >
                  Resume
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="secondary"
                  icon="pause"
                  onClick={pauseSession}
                  className="px-4 bg-warning text-dark border-warning"
                >
                  Pause
                </Button>
              )}
              <Button
                size="lg"
                variant="outline-white"
                icon="stop"
                onClick={handleEndSession}
                className="px-4 bg-danger text-white border-danger"
              >
                Stop
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Feedback Sidebar - 20-30% of width */}
      <div
        className="col-12 col-lg-3"
        style={{ minHeight: "100vh", overflowY: "auto" }}
      >
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
