import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FeedbackPanel from "../components/FeedbackPanel";
import SessionSummaryModal from "../components/SessionSummaryModal";
import WebcamPanel from "../components/WebcamPanel";
import Button from "../components/common/Button";
import { useExercise } from "../hooks/useExercise";
import { useSession } from "../hooks/useSession";
import { getExerciseById } from "../services/exerciseService";
import { ROUTES } from "../utils/constants";

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
  const [isEnding, setIsEnding] = useState(false);
  const [cameraMode, setCameraMode] = useState(null); // "video" | "webcam"

  useEffect(() => {
    if (!exerciseId) {
      navigate(ROUTES.EXERCISES);
      return;
    }

    // If we are intentionally wrapping up the session, don't trigger a restart
    if (isEnding) return;

    if (!selectedExercise || !activeSession) {
      getExerciseById(exerciseId).then((data) => {
        if (!data) {
          navigate(ROUTES.EXERCISES);
        } else {
          startSession(exerciseId, data);
        }
      });
    }
  }, [
    exerciseId,
    selectedExercise,
    activeSession,
    startSession,
    navigate,
    isEnding,
  ]);

  const handleEndSession = async () => {
    setIsEnding(true); // Flag that we are purposefully leaving the live tracking state loop
    await endSession(); // Wait for data computation & state resetting to conclude in context
    setShowSummary(true); // Safely open the summary modal
  };

  const handleFinish = () => {
    setShowSummary(false);
    clearSessionSummary();
    setIsEnding(false); // Reset the loop flag
    navigate(ROUTES.DASHBOARD);
  };

  if (!selectedExercise) return null;

  const handleClose = () => {
    setShowSummary(false);
    clearSessionSummary();
    setIsEnding(false);
  };

  const startDemo = () => {
    setCameraMode("video");
    enableCamera();
  };

  const startLive = () => {
    setCameraMode("webcam");
    enableCamera();
  };

  return (
    <>
      <div className="row g-3 h-100 align-items-stretch ">
        {/* Main Webcam Area - 70-80% of width */}
        <div className="col-12 col-lg-9 d-flex flex-column gap-3">
          {/* Webcam Feed */}
          <div className="">
            <WebcamPanel
              isActive={cameraActive}
              isPaused={isPaused}
              reps={reps}
              statusMsg={statusMsg}
              accuracy={accuracy}
              exercise={selectedExercise}
              isCalibrated={isCalibrated}
              handleEndSession={handleEndSession}
              cameraMode={cameraMode}
              startDemo={startDemo}
              startLive={startLive}
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
              <div className="d-flex gap-3">
                <Button
                  size="lg"
                  variant="primary"
                  icon="movie"
                  onClick={startDemo}
                  className="px-4"
                >
                  Demo Video
                </Button>

                <Button
                  size="lg"
                  variant="primary"
                  icon="videocam"
                  onClick={startLive}
                  className="px-4"
                >
                  Live Webcam
                </Button>
              </div>
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
      </div>
      {/* Summary Modal on Session End */}
      <SessionSummaryModal
        isOpen={showSummary}
        onClose={handleClose}
        onFinish={handleFinish}
        sessionData={lastSessionSummary}
      />
    </>
  );
}
