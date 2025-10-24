import React, { useState } from "react";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import "./App.css"; // 👉 Import du style animé

function App() {
  const [indicator, setIndicator] = useState("cases"); // cas, décès, vaccinés

  return (
    <div className="App">
      <h1>Dashboard COVID-19</h1>

      {/* 🔽 Sélecteur d’indicateur */}
      <div className="indicator-select">
        <label>Indicateur :</label>
        <select value={indicator} onChange={(e) => setIndicator(e.target.value)}>
          <option value="cases">Cas confirmés</option>
          <option value="deaths">Décès</option>
          <option value="vaccinated">Vaccinations</option>
        </select>
      </div>

      {/* 🔝 Comparaison entre pays */}
      <BarChart indicator={indicator} />

      {/* 🔻 Évolution dans le temps */}
      <LineChart indicator={indicator} />

      <footer>
        <p>© 2025 - COVID Dashboard - Données : disease.sh API</p>
      </footer>
    </div>
  );
}

export default App;
