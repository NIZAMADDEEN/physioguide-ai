import Card from "./common/Card";

export default function ChartCard({
  title,
  action,
  children,
  height = "320px",
  className = "",
}) {
  return (
    <Card className={`h-100 ${className}`} padding="lg">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="text-headline-md m-0">{title}</h2>
        {action && <div>{action}</div>}
      </div>
      <div style={{ height }}>{children}</div>
    </Card>
  );
}
