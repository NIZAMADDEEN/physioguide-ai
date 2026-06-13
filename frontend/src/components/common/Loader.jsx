/**
 * Loading indicator (spinner or skeleton)
 */
export default function Loader({ variant = 'spinner', text = 'Loading...' }) {
  if (variant === 'skeleton') {
    return (
      <div className="placeholder-glow w-100 h-100">
        <div className="placeholder bg-surface-variant rounded-4 w-100 h-100" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-5 w-100 h-100">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <div className="mt-3 text-on-surface-variant text-label-md">{text}</div>}
    </div>
  );
}
