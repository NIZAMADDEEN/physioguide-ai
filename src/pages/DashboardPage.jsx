import { useSession } from '../hooks/useSession';
import { formatRelativeDate } from '../utils/helpers';
import Card from '../components/common/Card';
import StatusChip from '../components/common/StatusChip';
import RecoveryLineChart from '../components/charts/RecoveryLineChart';
import Loader from '../components/common/Loader';
import DataTable from '../components/common/DataTable';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

export default function DashboardPage() {
  const { 
    dashboardStats, 
    progressData, 
    timelineData, 
    statsLoading 
  } = useSession();

  const recentSessions = timelineData?.filter(t => t.type === 'session').slice(0, 5) || [];

  const tableColumns = [
    { key: 'date', label: 'Date', render: (row) => formatRelativeDate(row.date) },
    { key: 'title', label: 'Activity' },
    { key: 'detail', label: 'Performance' },
    { key: 'status', label: 'Status', render: () => <StatusChip status="completed" /> },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      
      {/* Stats Row */}
      <div className="row g-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Overall Recovery" value={dashboardStats.overallRecovery} icon="health_and_safety" trend="+4.2% this week" isPositive={true} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Active Streak" value={dashboardStats.activeStreak} icon="local_fire_department" trend="Keep it up!" isPositive={true} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Completed Sessions" value={dashboardStats.completedSessions} icon="task_alt" trend="3 pending" isPositive={false} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Next Appointment" value={dashboardStats.nextAppointment} icon="calendar_today" trend="Dr. Chen — Virtual" isPositive={false} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="row g-4">
        {/* Chart Column */}
        <div className="col-12 col-xl-8">
          <ChartCard 
            title="Recovery Trend (30 Days)" 
            action={<Link to={ROUTES.ANALYTICS} className="btn-pg-secondary py-1 px-3 text-label-sm text-decoration-none">View Full Analytics</Link>}
          >
            {statsLoading ? <Loader variant="skeleton" /> : <RecoveryLineChart data={progressData} />}
          </ChartCard>
        </div>

        {/* Next Up Column */}
        <div className="col-12 col-xl-4">
          <Card className="h-100 bg-primary-color text-on-primary d-flex flex-column" padding="lg">
            <h2 className="text-headline-md mb-4 text-on-primary">Up Next Today</h2>
            
            <div className="bg-white bg-opacity-10 rounded-3 p-3 mb-3 d-flex align-items-center gap-3">
              <div className="bg-secondary-color rounded d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, flexShrink: 0 }}>
                <span className="material-symbols-outlined text-on-secondary">fitness_center</span>
              </div>
              <div>
                <div className="text-label-md font-bold">Knee Extension</div>
                <div className="text-label-sm opacity-75">3 sets × 12 reps</div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 rounded-3 p-3 mb-4 d-flex align-items-center gap-3">
              <div className="bg-white bg-opacity-25 rounded d-flex align-items-center justify-content-center" style={{ width: 48, height: 48, flexShrink: 0 }}>
                <span className="material-symbols-outlined text-white">self_improvement</span>
              </div>
              <div>
                <div className="text-label-md font-bold">Wall Squat Hold</div>
                <div className="text-label-sm opacity-75">4 sets × 30 sec</div>
              </div>
            </div>

            <Link to={ROUTES.EXERCISES} className="btn-pg-white w-100 justify-content-center mt-auto text-decoration-none">
              Start Session
            </Link>
          </Card>
        </div>
      </div>

      {/* Recent Activity Table */}
      <Card padding="0" className="overflow-hidden">
        <div className="p-4 border-bottom border-outline-variant d-flex align-items-center justify-content-between">
          <h2 className="text-headline-md m-0">Recent Activity</h2>
          <button className="btn btn-link text-primary text-decoration-none text-label-sm p-0">View All</button>
        </div>
        {statsLoading ? (
          <div className="p-4" style={{ height: 200 }}><Loader variant="skeleton" /></div>
        ) : (
          <DataTable columns={tableColumns} data={recentSessions} />
        )}
      </Card>

    </div>
  );
}
