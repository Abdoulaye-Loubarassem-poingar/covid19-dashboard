import React, { useState, useEffect } from "react";
import "./App.css";
import WorldMap from "./components/WorldMap";
import BarChart from "./components/BarChart";
import LineChart from "./components/LineChart";
import AuthForm from "./components/AuthForm";
import ReactSwitch from "react-switch";

function App() {
  const [indicator, setIndicator] = useState("cases");
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(localStorage.getItem("user") || null);

  // 💾 Charger préférences sauvegardées
  useEffect(() => {
    const prefs = localStorage.getItem("preferences");
    if (prefs) {
      const { indicator: savedIndicator, theme } = JSON.parse(prefs);
      if (savedIndicator) setIndicator(savedIndicator);
      if (theme !== undefined) setDarkMode(theme === "dark");
    }
  }, []);

  // 💾 Sauvegarder les préférences
  useEffect(() => {
    localStorage.setItem(
      "preferences",
      JSON.stringify({ indicator, theme: darkMode ? "dark" : "light" })
    );
  }, [indicator, darkMode]);

  const handleLogin = (username) => {
    localStorage.setItem("user", username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) return <AuthForm onLogin={handleLogin} />;

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <header>
        <h1>COVID-19 Dashboard 🌍</h1>
        <div className="header-controls">
          <div className="indicator-select">
            <label>Indicateur :</label>
            <select value={indicator} onChange={(e) => setIndicator(e.target.value)}>
              <option value="cases">Cas confirmés</option>
              <option value="deaths">Décès</option>
              <option value="vaccinated">Vaccinations</option>
            </select>
          </div>

          <div className="theme-switch">
            <label>{darkMode ? "🌙" : "☀️"}</label>
            <ReactSwitch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      <WorldMap indicator={indicator} />
      <BarChart indicator={indicator} />
      <LineChart indicator={indicator} />

      <footer>
        <p>© 2025 – Dashboard COVID-19 – Données : disease.sh API</p>
      </footer>
    </div>
  );
}

export default App;
