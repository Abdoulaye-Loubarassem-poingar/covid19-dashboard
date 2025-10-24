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

export default function BarChart({ indicator }) {
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
      setSelectedCountries(affected.slice(0, 5)); // 5 pays par défaut
    }
    loadCountries();
  }, []);

  useEffect(() => {
    async function loadData() {
      if (selectedCountries.length === 0) return;

      const requests = selectedCountries.map((c) =>
        fetch(`https://disease.sh/v3/covid-19/countries/${c.value}`).then((res) => res.json())
      );
      const results = await Promise.all(requests);

      const labels = results.map((r) => r.country);
      const values = results.map((r) => {
        if (indicator === "cases") return r.cases;
        if (indicator === "deaths") return r.deaths;
        if (indicator === "vaccinated") return r.tests || 0; // fallback si pas de données vaccins
        return 0;
      });

      const labelMap = {
        cases: "Cas confirmés",
        deaths: "Décès",
        vaccinated: "Vaccinations (approx.)",
      };

      setChartData({
        labels,
        datasets: [
          {
            label: labelMap[indicator],
            data: values,
            backgroundColor:
              indicator === "deaths"
                ? "rgba(255,99,132,0.7)"
                : indicator === "vaccinated"
                ? "rgba(153,102,255,0.7)"
                : "rgba(75,192,192,0.7)",
            borderWidth: 1,
          },
        ],
      });
    }

    loadData();
  }, [selectedCountries, indicator]);

  return (
    <div style={{ width: "85%", margin: "auto", marginBottom: "40px" }}>
      <h3>Comparaison des pays ({indicator})</h3>

      <Select
        isMulti
        options={countries}
        value={selectedCountries}
        onChange={(values) => setSelectedCountries(values)}
        placeholder="Choisissez les pays à comparer..."
      />

      <div style={{ marginTop: "20px" }}>
        {chartData ? (
          <Bar key={JSON.stringify(selectedCountries) + indicator} data={chartData} />
        ) : (
          <p>Chargement...</p>
        )}
      </div>
    </div>
  );
}
