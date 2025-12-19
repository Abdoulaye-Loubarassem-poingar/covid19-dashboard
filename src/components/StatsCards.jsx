export default function StatsCards({ data }) {
  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
      <div>🌍 Cas : {data.cases.toLocaleString()}</div>
      <div>☠️ Décès : {data.deaths.toLocaleString()}</div>
      <div>💉 Vaccinés : {data.vaccinated?.toLocaleString() || "N/A"}</div>
    </div>
  );
}
