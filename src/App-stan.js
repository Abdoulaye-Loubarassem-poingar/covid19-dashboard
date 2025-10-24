import React, { useState } from "react";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import StatsCards from "./components/StatsCards";

function App() {
  const [country, setCountry] = useState("Canada");

  return (
    <div className="App" style={{ textAlign: "center", padding: "20px" }}>
      <h1>Dashboard COVID-19</h1>

      <StatsCards country={country} />

      {/* 🔝 Comparaison des pays en haut */}
      <BarChart />

      {/* 🔻 Évolution dans le temps en bas */}
      <LineChart />
    </div>
  );
}

export default App;
