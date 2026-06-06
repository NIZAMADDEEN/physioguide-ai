import Card from './common/Card';
import ProgressRing from './common/ProgressRing';

export default function ProgressCard({ title, score, subtitle, statusMessage }) {
  const isGood = score > 80;
  const isZero = score === 0;
  const color = isGood ? 'var(--color-secondary)' : 'var(--color-tertiary)';

  return (
    <Card padding="lg" className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-center">
      <h3 className="text-label-md text-on-surface-variant text-uppercase mb-4 w-100 text-start">{title}</h3>
      <ProgressRing value={score} size={180} strokeWidth={16} color={color}>
        <span className="text-display-lg" style={{ color }}>
          {score}%
        </span>
      </ProgressRing>
      {subtitle && (
        <p className="text-body-md text-on-surface-variant mt-4 max-w-xs mb-0">
          {subtitle}
        </p>
      )}
      {statusMessage && (
        <p className="text-body-md text-on-surface-variant mt-2 max-w-xs mb-0">
          {isZero ? "Awaiting data..." : 
           isGood ? "Your form is excellent." : 
           statusMessage}
        </p>
      )}
    </Card>
  );
}
