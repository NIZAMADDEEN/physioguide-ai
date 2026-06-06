import Modal from './common/Modal';
import Button from './common/Button';

export default function SessionSummaryModal({ isOpen, onClose, sessionData, onFinish }) {
  if (!sessionData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Session Complete">
      <div className="text-center mb-4">
        <span className="material-symbols-outlined text-secondary mb-2" style={{ fontSize: 64 }}>workspace_premium</span>
        <h3 className="text-headline-md mb-1">Great Work!</h3>
        <p className="text-body-md text-on-surface-variant">You've successfully completed this exercise.</p>
      </div>
      
      <div className="row g-3 mb-4">
        <div className="col-6">
          <div className="bg-surface-container-lowest p-3 rounded-3 border border-outline-variant text-center">
            <div className="text-label-sm text-on-surface-variant text-uppercase mb-1">Total Reps</div>
            <div className="text-headline-md font-bold text-primary">{sessionData.reps}</div>
          </div>
        </div>
        <div className="col-6">
          <div className="bg-surface-container-lowest p-3 rounded-3 border border-outline-variant text-center">
            <div className="text-label-sm text-on-surface-variant text-uppercase mb-1">Avg Accuracy</div>
            <div className={`text-headline-md font-bold ${sessionData.accuracy > 80 ? 'text-secondary' : 'text-tertiary'}`}>
              {sessionData.accuracy}%
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
