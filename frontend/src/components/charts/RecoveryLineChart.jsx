import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { CHART_COLORS } from '../../utils/constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function RecoveryLineChart({ data }) {
  if (!data || data.length === 0) return <div>No data available</div>;

  // Assume data is sorted chronological
  const labels = data.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  
  const scores = data.map((d) => d.score);

  const chartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Recovery Score',
        data: scores,
        borderColor: CHART_COLORS.secondary,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, CHART_COLORS.secondaryLight);
          gradient.addColorStop(1, 'rgba(0, 107, 95, 0)');
          return gradient;
        },
        tension: 0.4,
        pointBackgroundColor: CHART_COLORS.secondary,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: CHART_COLORS.secondary,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(11, 28, 48, 0.9)',
        titleFont: { family: 'Inter', size: 13 },
        bodyFont: { family: 'Inter', size: 14, weight: 'bold' },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `Score: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 12 }, color: CHART_COLORS.textDim, maxTicksLimit: 7 },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(193, 198, 213, 0.3)', drawBorder: false },
        ticks: { font: { family: 'Inter', size: 12 }, color: CHART_COLORS.textDim, stepSize: 25 },
      },
    },
  };

  return <Line options={options} data={chartData} />;
}
