import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CHART_COLORS } from '../../utils/constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ExerciseBarChart({ data }) {
  if (!data || data.length === 0) return <div>No data available</div>;

  const labels = data.map((d) => d.category);
  const completed = data.map((d) => d.completed);
  const targets = data.map((d) => d.target);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Completed',
        data: completed,
        backgroundColor: CHART_COLORS.primary,
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
      {
        label: 'Target',
        data: targets,
        backgroundColor: CHART_COLORS.outline,
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Horizontal bar chart
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { family: 'Inter', size: 13 }, usePointStyle: true, boxWidth: 8 },
      },
      tooltip: {
        backgroundColor: 'rgba(11, 28, 48, 0.9)',
        titleFont: { family: 'Inter', size: 13 },
        bodyFont: { family: 'Inter', size: 14 },
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(193, 198, 213, 0.3)', drawBorder: false },
        ticks: { font: { family: 'Inter', size: 12 }, color: CHART_COLORS.textDim },
      },
      y: {
        grid: { display: false },
        ticks: { font: { family: 'Inter', size: 13 }, color: CHART_COLORS.text },
      },
    },
  };

  return <Bar options={options} data={chartData} />;
}
