import React, { useEffect, useState } from "react";

export default function StatsCards({ country }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      const res = await fetch(`https://disease.sh/v3/covid-19/countries/${country}`);
      const info = await res.json();
      setData(info);
    }
    loadData();
  }, [country]);

  if (!data) return <p>Chargement...</p>;

  return (
    <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
      <div style={{ background: "#f3f3f3", padding: "1rem", borderRadius: "10px" }}>
        <h4>Cas</h4>
        <p>{data.cases.toLocaleString()}</p>
      </div>
      <div style={{ background: "#ffeaea", padding: "1rem", borderRadius: "10px" }}>
        <h4>Décès</h4>
        <p>{data.deaths.toLocaleString()}</p>
      </div>
      <div style={{ background: "#eaffea", padding: "1rem", borderRadius: "10px" }}>
        <h4>Vaccinés (%)</h4>
        <p>{((data.vaccinated / data.population) * 100 || 0).toFixed(2)}%</p>
      </div>
    </div>
  );
}
