export default function Filters({
  countries,
  selectedCountries,
  setSelectedCountries,
  metric,
  setMetric,
}) {
  const handleChange = (e) => {
    const values = Array.from(e.target.selectedOptions).map(
      (o) => o.value
    );
    setSelectedCountries(values);
  };

  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
      <div>
        <label>Pays</label><br />
        <select multiple value={selectedCountries} onChange={handleChange}>
          {countries.map((c) => (
            <option key={c.country} value={c.country}>
              {c.country}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Métrique</label><br />
        <select value={metric} onChange={(e) => setMetric(e.target.value)}>
          <option value="cases">Cas</option>
          <option value="deaths">Décès</option>
          <option value="vaccinations">Vaccination</option>
        </select>
      </div>
    </div>
  );
}
