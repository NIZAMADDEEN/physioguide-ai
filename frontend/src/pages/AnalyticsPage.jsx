import { useState } from 'react';
import { useSession } from '../hooks/useSession';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import RecoveryLineChart from '../components/charts/RecoveryLineChart';
import MobilityDoughnut from '../components/charts/MobilityDoughnut';
import ExerciseBarChart from '../components/charts/ExerciseBarChart';
import ExerciseDistributionPie from '../components/charts/ExerciseDistributionPie';
import DataTable from '../components/common/DataTable';
import ChartCard from '../components/ChartCard';

export default function AnalyticsPage() {
  const [range, setRange] = useState(30); // 7, 30, 90
  
  const { 
    progressData, 
    mobilityScores, 
    weeklyExercises, 
    exerciseDistribution,
    statsLoading 
  } = useSession();

  // Slice progressData based on selected range (7, 30, 90)
  const slicedProgressData = progressData ? progressData.slice(-range) : [];

  return (
    <div className="d-flex flex-column gap-4">
      
      {/* Header & Date Range Filter */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h1 className="text-headline-lg m-0">Performance Analytics</h1>
          <p className="text-body-md text-on-surface-variant m-0">Track your recovery progress and mobility metrics.</p>
        </div>
        
        <div className="bg-surface border border-outline-variant rounded-pill p-1 d-inline-flex">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setRange(days)}
              className={`btn rounded-pill px-4 py-1 text-label-sm border-0 ${
                range === days 
                  ? 'bg-primary-color text-on-primary font-bold shadow-sm' 
                  : 'bg-transparent text-on-surface-variant hover-bg-surface-container'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      <div className="row g-4">
        {/* Recovery Line Chart */}
        <div className="col-12 col-xl-8">
          <ChartCard title="Recovery Score Trend" height="360px">
            {statsLoading ? <Loader variant="skeleton" /> : <RecoveryLineChart data={slicedProgressData} />}
          </ChartCard>
        </div>

        {/* Mobility Doughnut Chart */}
        <div className="col-12 col-xl-4">
          <ChartCard title="Mobility Breakdown" height="auto" className="d-flex flex-column">
            <div style={{ height: '300px' }} className="mb-4">
              {statsLoading ? <Loader variant="skeleton" /> : <MobilityDoughnut data={mobilityScores} />}
            </div>
            {/* Legend / Metrics summary */}
            {!statsLoading && mobilityScores && (
              <div className="mt-auto">
                <div className="d-flex justify-content-between text-label-sm text-on-surface-variant mb-2 border-bottom pb-2">
                  <span>Region</span>
                  <span>Change (30d)</span>
                </div>
                {mobilityScores.slice(0, 3).map((item, i) => (
                  <div key={i} className="d-flex justify-content-between text-label-md py-2">
                    <span className="font-bold">{item.region}</span>
                    <span className={item.change >= 0 ? 'text-secondary' : 'text-error'}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </ChartCard>
        </div>
      </div>

      {/* Exercise Adherence Bar Chart & Distribution */}
      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <ChartCard title="Weekly Exercise Adherence" height="300px">
            {statsLoading ? <Loader variant="skeleton" /> : <ExerciseBarChart data={weeklyExercises} />}
          </ChartCard>
        </div>
        <div className="col-12 col-xl-4">
          <ChartCard title="Exercise Distribution" height="auto" className="d-flex flex-column h-100">
            <div style={{ height: '240px' }} className="mb-4 flex-grow-1">
              {statsLoading ? <Loader variant="skeleton" /> : <ExerciseDistributionPie data={exerciseDistribution} />}
            </div>
            {/* Legend */}
            {!statsLoading && exerciseDistribution && (
              <div className="mt-auto row g-2">
                {exerciseDistribution.map((item, i) => (
                  <div key={i} className="col-6 d-flex align-items-center gap-2">
                    <div className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: ['#006B5F', '#B1CC29', '#E6EEED', '#BA1A1A', '#f59e0b', '#10b981', '#6366f1'][i % 7] }}></div>
                    <span className="text-label-sm text-truncate" title={item.name}>{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </ChartCard>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <Card padding="0" className="overflow-hidden">
        <div className="p-4 border-bottom border-outline-variant">
          <h2 className="text-headline-md m-0">Detailed Regional Metrics</h2>
        </div>
        {statsLoading ? (
          <div className="p-4" style={{ height: 200 }}><Loader variant="skeleton" /></div>
        ) : (
          <DataTable 
            columns={[
              { key: 'region', label: 'Body Region' },
              { key: 'score', label: 'Current Score', render: (r) => <span className="font-bold">{r.score}%</span> },
              { key: 'change', label: '30d Change', render: (r) => (
                  <span className={r.change >= 0 ? 'text-secondary font-bold' : 'text-error font-bold'}>
                    {r.change > 0 ? '+' : ''}{r.change}%
                  </span>
              )},
            ]}
            data={mobilityScores} 
          />
        )}
      </Card>

    </div>
  );
}
