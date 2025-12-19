import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function BarChart({ countries }) {
  const top = countries.slice(0, 5);

  const data = {
    labels: top.map((c) => c.country),
    datasets: [
      {
        label: "Cas",
        data: top.map((c) => c.cases),
      },
    ],
  };

  return <Bar data={data} />;
}
