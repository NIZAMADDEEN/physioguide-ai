import { STATUS } from '../../utils/constants';

/**
 * Pill-shaped status indicator.
 */
export default function StatusChip({ status, label, className = '' }) {
  let bgColor = 'var(--color-surface-container)';
  let textColor = 'var(--color-on-surface-variant)';
  let defaultLabel = status;

  switch (status) {
    case STATUS.COMPLETED:
      bgColor = 'rgba(0, 107, 95, 0.12)'; // secondary-light
      textColor = 'var(--color-secondary)';
      defaultLabel = 'Completed';
      break;
    case STATUS.IN_PROGRESS:
      bgColor = 'rgba(0, 78, 159, 0.12)'; // primary-light
      textColor = 'var(--color-primary)';
      defaultLabel = 'In Progress';
      break;
    case STATUS.HIGH_PRIORITY:
      bgColor = 'rgba(186, 26, 26, 0.12)'; // error-light
      textColor = 'var(--color-error)';
      defaultLabel = 'High Priority';
      break;
    case STATUS.SCHEDULED:
      bgColor = 'rgba(136, 55, 0, 0.12)'; // tertiary-light
      textColor = 'var(--color-tertiary)';
      defaultLabel = 'Scheduled';
      break;
    case STATUS.CANCELLED:
      bgColor = 'var(--color-outline-variant)';
      textColor = 'var(--color-on-surface)';
      defaultLabel = 'Cancelled';
      break;
  }

  return (
    <span
      className={`d-inline-flex align-items-center rounded-pill px-3 py-1 text-label-sm ${className}`}
      style={{ backgroundColor: bgColor, color: textColor, fontWeight: 600 }}
    >
      {label || defaultLabel}
    </span>
  );
}
