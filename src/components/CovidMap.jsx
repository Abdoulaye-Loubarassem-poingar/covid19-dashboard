import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

const API = "https://disease.sh/v3/covid-19";
const GEOJSON =
  "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";

export default function CovidMap({ metric }) {
  const [countries, setCountries] = useState([]);
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch(`${API}/countries`)
      .then((r) => r.json())
      .then(setCountries);

    fetch(GEOJSON)
      .then((r) => r.json())
      .then(setGeoData);
  }, []);

  const getValue = (country) => {
    if (!country) return 0;
    return country[metric] || 0;
  };

  const getColor = (value) => {
    return value > 5_000_000 ? "#7f1d1d"
      : value > 1_000_000 ? "#b91c1c"
      : value > 200_000 ? "#ef4444"
      : value > 50_000 ? "#fca5a5"
      : "#fee2e2";
  };

  const style = (feature) => {
    const country = countries.find(
      (c) => c.countryInfo.iso3 === feature.id
    );
    const value = getValue(country);

    return {
      fillColor: getColor(value),
      weight: 1,
      color: "#334155",
      fillOpacity: 0.8,
      transition: "all 0.4s ease",
    };
  };

  const onEachCountry = (feature, layer) => {
    const country = countries.find(
      (c) => c.countryInfo.iso3 === feature.id
    );

    if (!country) return;

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          weight: 2,
          fillOpacity: 1,
        });

        layer.bindTooltip(
          `
          <div style="font-size:13px">
            <strong>${country.country}</strong><br/>
            Cas: ${country.cases.toLocaleString()}<br/>
            Décès: ${country.deaths.toLocaleString()}<br/>
            Guéris: ${country.recovered.toLocaleString()}
          </div>
          `,
          { sticky: true }
        );
      },
      mouseout: (e) => {
        e.target.setStyle(style(feature));
        layer.closeTooltip();
      },
    });
  };

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "80vh", borderRadius: 16 }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {geoData && (
        <GeoJSON
          data={geoData}
          style={style}
          onEachFeature={onEachCountry}
        />
      )}
    </MapContainer>
  );
}
