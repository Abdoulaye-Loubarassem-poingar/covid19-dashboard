import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMap({
  countriesData,
  onCountrySelect,
  onCountryHover
}) {
  return (
    <ComposableMap
      projection="geoMercator"
      width={980}
      height={520}
      projectionConfig={{
        scale: 150,
        center: [0, 20]
      }}
    >
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map(geo => {
            const country = countriesData.find(
              c =>
                c.country.toLowerCase() ===
                geo.properties.name.toLowerCase()
            );

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={() => {
                  if (country) onCountryHover(country);
                }}
                onMouseLeave={() => onCountryHover(null)}
                onClick={() => {
                  if (country) onCountrySelect(country);
                }}
                style={{
                  default: { fill: "#7bc67b", outline: "none" },
                  hover: { fill: "#4caf50", outline: "none" },
                  pressed: { fill: "#388e3c", outline: "none" }
                }}
              />
            );
          })
        }
      </Geographies>
    </ComposableMap>
  );
}
