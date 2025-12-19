import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function LineChart({ timeline, metric }) {
  const labels = Object.keys(timeline[metric] || {});
  const values = Object.values(timeline[metric] || {});

  const data = {
    labels,
    datasets: [
      {
        label: metric.toUpperCase(),
        data: values,
        borderColor: "blue",
      },
    ],
  };

  return <Line data={data} />;
}
