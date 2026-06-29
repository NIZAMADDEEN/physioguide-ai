import Button from "./common/Button";
import Modal from "./common/Modal";

export default function SessionSummaryModal({
  isOpen,
  onClose,
  sessionData,
  onFinish,
}) {
  if (!sessionData) return null;

  const formatTime = (secs) => {
    if (secs === undefined || secs === null) return "--:--";
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Session Complete">
      <div className="text-center mb-4">
        <span
          className="material-symbols-outlined text-success mb-2"
          style={{ fontSize: 64, color: "var(--color-primary)" }}
        >
          workspace_premium
        </span>
        <h3 className="text-headline-md mb-1">Great Work!</h3>
        <p className="text-body-md text-on-surface-variant">
          You've successfully completed this exercise.
        </p>
      </div>

      <div className="row g-2 mb-4">
        <div className="col-4">
          <div className="bg-surface-container-lowest p-2.5 rounded-3 border border-outline-variant text-center h-100 d-flex flex-column justify-content-center">
            <div
              className="text-label-sm text-on-surface-variant text-uppercase mb-1"
              style={{ fontSize: "10px" }}
            >
              Total Reps
            </div>
            <div
              className="text-headline-md font-bold text-primary"
              style={{ fontSize: "20px" }}
            >
              {sessionData.reps}
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="bg-surface-container-lowest p-2.5 rounded-3 border border-outline-variant text-center h-100 d-flex flex-column justify-content-center">
            <div
              className="text-label-sm text-on-surface-variant text-uppercase mb-1"
              style={{ fontSize: "10px" }}
            >
              Avg Accuracy
            </div>
            <div
              className="text-headline-md font-bold"
              style={{
                fontSize: "20px",
                color:
                  sessionData.accuracy >= 88
                    ? "#00e676"
                    : sessionData.accuracy >= 75
                      ? "#ffb300"
                      : "#ff1744",
              }}
            >
              {sessionData.accuracy}%
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="bg-surface-container-lowest p-2.5 rounded-3 border border-outline-variant text-center h-100 d-flex flex-column justify-content-center">
            <div
              className="text-label-sm text-on-surface-variant text-uppercase mb-1"
              style={{ fontSize: "10px" }}
            >
              Duration
            </div>
            <div
              className="text-headline-md font-bold text-on-surface"
              style={{ fontSize: "18px", fontFamily: "Courier New, monospace" }}
            >
              {formatTime(sessionData.duration)}
            </div>
          </div>
        </div>
      </div>

      <Button className="w-100" onClick={onFinish}>
        Return to Dashboard
      </Button>
    </Modal>
  );
}
