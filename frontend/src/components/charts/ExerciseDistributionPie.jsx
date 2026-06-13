import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CHART_COLORS } from '../../utils/constants';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExerciseDistributionPie({ data }) {
  if (!data || data.length === 0) return <div className="text-center mt-5 text-on-surface-variant">No exercise data available</div>;

  const labels = data.map((d) => d.name);
  const counts = data.map((d) => d.count);

  const backgroundColors = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.tertiary,
    CHART_COLORS.error,
    '#f59e0b',
    '#10b981',
    '#6366f1'
  ];

  const chartData = {
    labels,
    datasets: [
      {
        data: counts,
        backgroundColor: backgroundColors.slice(0, counts.length),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(11, 28, 48, 0.9)',
        titleFont: { family: 'Inter', size: 13 },
        bodyFont: { family: 'Inter', size: 14, weight: 'bold' },
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => ` ${context.label}: ${context.raw} sessions`,
        },
      },
    },
  };

  return (
    <div className="w-100 h-100 position-relative">
      <Doughnut data={chartData} options={options} />
      {/* Center text */}
      <div 
        className="position-absolute top-50 start-50 translate-middle text-center pointer-events-none"
        style={{ width: '100px' }}
      >
        <div className="text-headline-md font-bold m-0 lh-1">
          {counts.reduce((a, b) => a + b, 0)}
        </div>
        <div className="text-label-sm text-on-surface-variant">Total</div>
      </div>
    </div>
  );
}
