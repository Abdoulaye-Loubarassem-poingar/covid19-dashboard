import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Select from "react-select";
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

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default function LineChart({ indicator }) {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function loadCountries() {
      const res = await fetch("https://disease.sh/v3/covid-19/countries");
      const data = await res.json();

      const affected = data
        .filter((c) => c.cases > 0)
        .map((c) => ({ value: c.country, label: c.country }));

      setCountries(affected);
      setSelectedCountries(affected.slice(0, 3)); // top 3 par défaut
    }
    loadCountries();
  }, []);

  useEffect(() => {
    async function loadData() {
      if (selectedCountries.length === 0) return;

      const requests = selectedCountries.map((c) =>
        fetch(`https://disease.sh/v3/covid-19/historical/${c.value}?lastdays=90`).then((res) =>
          res.json()
        )
      );

      const results = await Promise.all(requests);

      const labelMap = {
        cases: "Cas confirmés",
        deaths: "Décès",
        vaccinated: "Vaccinations (non disponibles dans cet historique)",
      };

      const datasets = results
        .map((r, index) => {
          const timeline = r.timeline || {};
          const series = timeline[indicator] || timeline.cases || {};
          const labels = Object.keys(series);
          const values = Object.values(series);

          const colors = [
            "rgba(255,99,132,0.8)",
            "rgba(54,162,235,0.8)",
            "rgba(255,206,86,0.8)",
            "rgba(75,192,192,0.8)",
            "rgba(153,102,255,0.8)",
            "rgba(255,159,64,0.8)",
          ];

          return {
            label: `${r.country} - ${labelMap[indicator]}`,
            data: values,
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length].replace("0.8", "0.2"),
            tension: 0.3,
            fill: false,
          };
        })
        .filter(Boolean);

      const labels = Object.keys(results[0]?.timeline?.cases || {});

      setChartData({
        labels,
        datasets,
      });
    }
    loadData();
  }, [selectedCountries, indicator]);

  return (
    <div style={{ width: "85%", margin: "auto", marginTop: "40px" }}>
      <h3>Évolution ({indicator}) sur 90 jours</h3>

      <Select
        isMulti
        options={countries}
        value={selectedCountries}
        onChange={(values) => setSelectedCountries(values)}
        placeholder="Sélectionnez les pays à afficher..."
      />

      <div style={{ marginTop: "20px" }}>
        {chartData ? (
          <Line key={JSON.stringify(selectedCountries) + indicator} data={chartData} />
        ) : (
          <p>Chargement...</p>
        )}
      </div>
    </div>
  );
}
