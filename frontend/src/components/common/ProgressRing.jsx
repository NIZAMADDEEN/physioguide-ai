/**
 * Circular progress indicator (SVG).
 */
export default function ProgressRing({
  value = 0,
  size = 120,
  strokeWidth = 12,
  color = "var(--color-secondary)",
  trackColor = "var(--color-outline-variant)",
  children,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className="position-relative d-inline-flex align-items-center justify-content-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
        />
      </svg>
      <div className="position-absolute d-flex flex-column align-items-center justify-content-center">
        {children || (
          <span className="text-headline-md">{Math.round(value)}%</span>
        )}
      </div>
    </div>
  );
}
