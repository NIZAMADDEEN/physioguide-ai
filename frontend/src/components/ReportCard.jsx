import StatusChip from './common/StatusChip';
import Button from './common/Button';
import { formatDate } from '../utils/helpers';

export default function ReportCard({ report, onExport, isExporting, onClose }) {
  if (!report) return null;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start mb-4 pb-4 border-bottom border-outline-variant">
        <div>
          <h2 className="text-headline-lg mb-2">{report.title}</h2>
          <div className="text-label-sm text-on-surface-variant d-flex align-items-center gap-2 mb-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>calendar_today</span>
            {formatDate(report.date)}
          </div>
          <div className="text-label-sm text-on-surface-variant d-flex align-items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>medical_information</span>
            {report.therapist}
          </div>
        </div>
        <StatusChip status={report.status} />
      </div>

      <div className="mb-4">
        <h3 className="text-label-md text-on-surface-variant text-uppercase mb-3">Clinical Notes</h3>
        <div className="bg-surface-container-lowest p-4 rounded-3 border border-outline-variant">
          <p className="text-body-md m-0" style={{ lineHeight: 1.6 }}>{report.notes}</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-label-md text-on-surface-variant text-uppercase mb-3">Metrics Overview</h3>
        <div className="row g-3">
          <div className="col-12 col-sm-6">
            <div className="bg-surface p-3 rounded-3 border border-outline-variant d-flex justify-content-between align-items-center">
              <span className="text-label-md text-on-surface-variant">Exercises Assigned</span>
              <span className="text-headline-md font-bold">{report.exercisesAssigned}</span>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="bg-surface p-3 rounded-3 border border-outline-variant d-flex justify-content-between align-items-center">
              <span className="text-label-md text-on-surface-variant">Overall Progress</span>
              <span className="text-headline-md font-bold text-secondary">Good</span>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-3 mt-5 pt-4 border-top border-outline-variant">
        {onClose && <Button variant="secondary" onClick={onClose}>Close</Button>}
        {onExport && (
          <Button 
            icon="download" 
            loading={isExporting}
            onClick={() => onExport(report.id)}
          >
            Download PDF
          </Button>
        )}
      </div>
    </div>
  );
}
