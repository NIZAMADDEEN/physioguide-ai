/**
 * Linear progress bar.
 */
export default function ProgressBar({
  value = 0,
  label,
  animated = false,
  color = 'var(--color-secondary)',
  height = '8px',
  className = '',
}) {
  return (
    <div className={className}>
      {label && (
        <div className="d-flex justify-content-between mb-1">
          <span className="text-label-sm text-on-surface-variant">{label}</span>
          <span className="text-label-sm font-bold text-on-surface">{Math.round(value)}%</span>
        </div>
      )}
      <div
        className="progress"
        style={{ height, backgroundColor: 'var(--color-surface-container)' }}
      >
        <div
          className={`progress-bar ${animated ? 'progress-bar-striped progress-bar-animated' : ''}`}
          role="progressbar"
          style={{ width: `${value}%`, backgroundColor: color, transition: 'width 0.5s ease-in-out' }}
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
}
