import React, { useEffect, useState } from "react";
import { getCovidDataCSV } from "../services/covidAPI";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// ✅ Enregistre les composants nécessaires de Chart.js
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

function Graph() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const covidData = await getCovidDataCSV("Canada"); // 🇨🇦 pays par défaut

      if (covidData.length > 0) {
        const labels = covidData.map((item) => item.Date);
        const cases = covidData.map((item) =>
          item.Confirmed ? Number(item.Confirmed) : 0
        );

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Cas confirmés - Canada",
              data: cases,
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
              tension: 0.2,
              fill: true,
            },
          ],
        });
      } else {
        console.warn("⚠️ Aucun résultat pour Canada !");
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2>Évolution des cas COVID - Canada</h2>
      {chartData ? (
        <Line key={Math.random()} data={chartData} />
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}

export default Graph;
