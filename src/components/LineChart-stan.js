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

export default function LineChart() {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [chartData, setChartData] = useState(null);

  // Charger la liste de pays touchés
  useEffect(() => {
    async function loadCountries() {
      const res = await fetch("https://disease.sh/v3/covid-19/countries");
      const data = await res.json();

      const affected = data
        .filter((c) => c.cases > 0)
        .map((c) => ({ value: c.country, label: c.country }));

      setCountries(affected);
      setSelectedCountries(affected.slice(0, 3)); // Top 3 par défaut
    }
    loadCountries();
  }, []);

  // Charger les données d’évolution pour les pays sélectionnés
  useEffect(() => {
    async function loadData() {
      if (selectedCountries.length === 0) return;

      const requests = selectedCountries.map((c) =>
        fetch(`https://disease.sh/v3/covid-19/historical/${c.value}?lastdays=90`).then((res) =>
          res.json()
        )
      );

      const results = await Promise.all(requests);

      const datasets = results.map((r, index) => {
        if (!r.timeline || !r.timeline.cases) return null;
        const dates = Object.keys(r.timeline.cases);
        const cases = Object.values(r.timeline.cases);

        const colors = [
          "rgba(255,99,132,0.8)",
          "rgba(54,162,235,0.8)",
          "rgba(255,206,86,0.8)",
          "rgba(75,192,192,0.8)",
          "rgba(153,102,255,0.8)",
          "rgba(255,159,64,0.8)",
        ];

        return {
          label: r.country,
          data: cases,
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length].replace("0.8", "0.2"),
          tension: 0.3,
          fill: false,
        };
      }).filter(Boolean);

      const labels = Object.keys(results[0]?.timeline?.cases || {});

      setChartData({
        labels,
        datasets,
      });
    }
    loadData();
  }, [selectedCountries]);

  return (
    <div style={{ width: "85%", margin: "auto", marginTop: "40px" }}>
      <h3>Évolution des cas COVID-19 (90 derniers jours)</h3>

      <Select
        isMulti
        options={countries}
        value={selectedCountries}
        onChange={(values) => setSelectedCountries(values)}
        placeholder="Sélectionnez les pays à afficher..."
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#888",
            boxShadow: "none",
          }),
        }}
      />

      <div style={{ marginTop: "20px" }}>
        {chartData ? (
          <Line key={JSON.stringify(selectedCountries)} data={chartData} />
        ) : (
          <p>Chargement...</p>
        )}
      </div>
    </div>
  );
}
