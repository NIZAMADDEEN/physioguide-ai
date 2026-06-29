import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { CHART_COLORS } from "../../utils/constants";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MobilityDoughnut({ data }) {
  if (!data || data.length === 0) return <div>No data available</div>;

  const labels = data.map((d) => d.joint);
  const scores = data.map((d) => d.score);

  // Map our design tokens to a palette for the doughnut chart
  const backgroundColors = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.accent,
    CHART_COLORS.tertiary,
    CHART_COLORS.outline,
  ];

  const chartData = {
    labels,
    datasets: [
      {
        data: scores,
        backgroundColor: backgroundColors.slice(0, data.length),
        borderWidth: 2,
        borderColor: "#fff",
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: { family: "Inter", size: 13 },
          usePointStyle: true,
          boxWidth: 8,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(11, 28, 48, 0.9)",
        titleFont: { family: "Inter", size: 13 },
        bodyFont: { family: "Inter", size: 14, weight: "bold" },
        padding: 12,
        callbacks: {
          label: (context) => ` ${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  return (
    <div className="position-relative w-100 h-100">
      <Doughnut options={options} data={chartData} />
      {/* Center Text */}
      <div
        className="position-absolute top-50 start-50 translate-middle text-center"
        style={{ pointerEvents: "none", marginLeft: "-50px" }} // adjust for right legend
      >
        <span className="d-block text-headline-md m-0">
          {Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}%
        </span>
        <span className="d-block text-label-sm text-on-surface-variant text-uppercase">
          Avg
        </span>
      </div>
    </div>
  );
}
