import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function WorldMap({ indicator }) {
  const [countries, setCountries] = useState([]);
  const [translations, setTranslations] = useState({});

  // Chargement des pays + dictionnaire de traduction
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://disease.sh/v3/covid-19/countries");
        const data = await res.json();

        // Dictionnaire simple pour traduire les pays
        const translator = {};
        data.forEach((c) => {
          translator[c.country] = c.countryTranslations?.fr || c.country;
        });

        setTranslations(translator);
        setCountries(data);
      } catch (error) {
        console.error("Erreur chargement carte :", error);
      }
    }
    fetchData();
  }, []);

  const getColor = () =>
    indicator === "deaths"
      ? "red"
      : indicator === "vaccinated"
      ? "green"
      : "orange";

  return (
    <div className="map-container">
      <h3>🌍 Carte mondiale ({indicator})</h3>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {countries.map((c, i) => (
          <CircleMarker
            key={i}
            center={[c.countryInfo.lat, c.countryInfo.long]}
            radius={Math.sqrt(
              indicator === "deaths"
                ? c.deaths
                : indicator === "vaccinated"
                ? c.tests
                : c.cases
            ) / 800}
            fillOpacity={0.5}
            color={getColor()}
          >
            <Popup>
              <strong>{translations[c.country] || c.country}</strong>
              <br />
              Cas : {c.cases.toLocaleString()}
              <br />
              Décès : {c.deaths.toLocaleString()}
              <br />
              Population : {c.population.toLocaleString()}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
