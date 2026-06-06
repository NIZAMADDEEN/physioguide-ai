import Card from './common/Card';

export default function StatCard({ title, value, icon, trend, isPositive }) {
  return (
    <Card className="h-100 position-relative overflow-hidden" padding="md">
      {/* Decorative gradient blob */}
      <div className="position-absolute rounded-circle opacity-25" style={{
        width: '120px', height: '120px', right: '-30px', top: '-30px', filter: 'blur(30px)',
        backgroundColor: isPositive ? 'var(--color-secondary)' : 'var(--color-primary)'
      }} />
      <div className="d-flex align-items-start justify-content-between mb-3 position-relative z-1">
        <h3 className="text-label-sm text-on-surface-variant text-uppercase m-0">{title}</h3>
        <span className="material-symbols-outlined text-outline" style={{ fontSize: 24 }}>{icon}</span>
      </div>
      <div className="position-relative z-1">
        <div className="text-headline-lg font-bold mb-1">{value}</div>
        {trend && (
          <div className="d-flex align-items-center gap-1 text-label-sm">
            <span className={`material-symbols-outlined ${isPositive ? 'text-secondary' : 'text-primary'}`} style={{ fontSize: 16 }}>
              {isPositive ? 'trending_up' : 'trending_flat'}
            </span>
            <span className={isPositive ? 'text-secondary font-bold' : 'text-on-surface-variant'}>
              {trend}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
