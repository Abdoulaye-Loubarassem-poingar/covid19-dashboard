import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

export default function LineChart({ indicator }) {
  const [selectedCountries, setSelectedCountries] = useState(["Canada", "France", "États-Unis"]);
  const [data, setData] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [translations, setTranslations] = useState({});
  const [startDate, setStartDate] = useState(new Date("2020-01-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Charger la liste des pays et leurs traductions
  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch("https://disease.sh/v3/covid-19/countries");
        const data = await res.json();
        setAllCountries(data.map((c) => c.country).sort());
        const trans = {};
        data.forEach((c) => {
          trans[c.country] = c.countryTranslations?.fr || c.country;
        });
        setTranslations(trans);
      } catch (error) {
        console.error("Erreur lors du chargement des pays :", error);
      }
    }
    loadCountries();
  }, []);

  // Charger les données historiques pour les pays sélectionnés
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const promises = selectedCountries.map(async (country) => {
          const res = await fetch(
            `https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`
          );
          const data = await res.json();
          return data.timeline ? { country, timeline: data.timeline } : null;
        });
        const results = (await Promise.all(promises)).filter(Boolean);
        setData(results);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedCountries]);

  // Filtrer les données selon la plage de dates
  const filterByDate = (timeline) => {
    if (!timeline || !timeline[indicator]) return {};
    const dates = Object.keys(timeline[indicator]);
    const start = startDate.getTime();
    const end = endDate.getTime();
    const filtered = {};
    dates.forEach((d) => {
      const date = new Date(d);
      if (date >= start && date <= end) filtered[d] = timeline[indicator][d];
    });
    return filtered;
  };

  // Données pour le graphique
  const chartData = {
    labels: data.length > 0 ? Object.keys(filterByDate(data[0].timeline)) : [],
    datasets: data.map((c, i) => {
      const colorList = [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#C9CBCF",
      ];
      return {
        label: translations[c.country] || c.country,
        data: Object.values(filterByDate(c.timeline)),
        borderColor: colorList[i % colorList.length],
        tension: 0.3,
        fill: false,
      };
    }),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Évolution des ${indicator} par pays`,
      },
    },
    scales: {
      x: { ticks: { maxTicksLimit: 10 } },
    },
  };

  return (
    <div className="chart-section">
      <h3>📈 Évolution dans le temps ({indicator})</h3>

      <div className="filters">
        {/* Sélecteur de pays */}
        <div className="country-selector">
          <label>Sélectionner des pays :</label>
          <select
            multiple
            value={selectedCountries}
            onChange={(e) =>
              setSelectedCountries([...e.target.selectedOptions].map((o) => o.value))
            }
          >
            {allCountries.map((c) => (
              <option key={c} value={c}>
                {translations[c] || c}
              </option>
            ))}
          </select>
        </div>

        {/* Sélecteur de plage de dates */}
        <div className="date-filters">
          <label>Plage de dates :</label>
          <div className="date-range">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="yyyy-MM-dd"
            />
            <span style={{ margin: "0 10px" }}>→</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>
      </div>

      {/* Graphique ou message de chargement */}
      {loading ? (
        <p>Chargement des données...</p>
      ) : data.length === 0 ? (
        <p>Aucune donnée disponible pour les pays sélectionnés.</p>
      ) : (
        <div style={{ width: "90%", margin: "auto", marginTop: "20px" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
