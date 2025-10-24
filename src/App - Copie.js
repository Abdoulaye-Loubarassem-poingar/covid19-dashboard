import React, { useState } from "react";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import StatsCards from "./components/StatsCards";

function App() {
  const [country, setCountry] = useState("Canada");

  return (
    <div className="App">
      <h1>Dashboard COVID-19</h1>

      <select onChange={(e) => setCountry(e.target.value)} value={country}>
        <option>Canada</option>
        <option>France</option>
        <option>USA</option>
        <option>Brazil</option>
        <option>India</option>
      </select>

      <StatsCards country={country} />
      <LineChart country={country} />
      <BarChart />
    </div>
  );
}

export default App;
