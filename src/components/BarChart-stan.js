import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Select from "react-select";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default function BarChart() {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [chartData, setChartData] = useState(null);

  // Charger la liste des pays touchés
  useEffect(() => {
    async function loadCountries() {
      const res = await fetch("https://disease.sh/v3/covid-19/countries");
      const data = await res.json();

      // Filtrer les pays réellement touchés
      const affected = data
        .filter((c) => c.cases > 0)
        .map((c) => ({ value: c.country, label: c.country }));

      setCountries(affected);
      setSelectedCountries(affected.slice(0, 5)); // top 5 par défaut
    }
    loadCountries();
  }, []);

  // Mettre à jour le graphique selon les sélections
  useEffect(() => {
    async function loadData() {
      if (selectedCountries.length === 0) return;

      const requests = selectedCountries.map((c) =>
        fetch(`https://disease.sh/v3/covid-19/countries/${c.value}`).then((res) => res.json())
      );
      const results = await Promise.all(requests);

      const labels = results.map((r) => r.country);
      const cases = results.map((r) => r.cases);
      const deaths = results.map((r) => r.deaths);

      setChartData({
        labels,
        datasets: [
          {
            label: "Cas confirmés",
            data: cases,
            backgroundColor: "rgba(75,192,192,0.6)",
          },
          {
            label: "Décès",
            data: deaths,
            backgroundColor: "rgba(255,99,132,0.6)",
          },
        ],
      });
    }

    loadData();
  }, [selectedCountries]);

  return (
    <div style={{ width: "80%", margin: "auto" }}>
      <h3>Comparaison des pays (Cas / Décès)</h3>

      <Select
        isMulti
        options={countries}
        value={selectedCountries}
        onChange={(values) => setSelectedCountries(values)}
        placeholder="Choisissez les pays à comparer..."
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
          <Bar key={JSON.stringify(selectedCountries)} data={chartData} />
        ) : (
          <p>Chargement...</p>
        )}
      </div>
    </div>
  );
}
