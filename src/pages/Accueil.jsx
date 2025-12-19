import { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import WorldMap from "../components/WorldMap";

export default function Accueil() {
  const [countriesData, setCountriesData] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/countries")
      .then(res => res.json())
      .then(data => setCountriesData(data));
  }, []);

  return (
    <Box sx={{ position: "relative" }}>
      <Typography variant="h4" gutterBottom>
        Carte mondiale du COVID-19
      </Typography>

      {/* Tooltip au survol */}
      {hoveredCountry && (
        <Paper sx={{ position: "absolute", top: 80, left: 20, p: 2, zIndex: 10 }}>
          <Typography variant="subtitle1">{hoveredCountry.country}</Typography>
          <Typography>Cas : {hoveredCountry.cases.toLocaleString()}</Typography>
          <Typography>Décès : {hoveredCountry.deaths.toLocaleString()}</Typography>
          <Typography>Guéris : {hoveredCountry.recovered.toLocaleString()}</Typography>
        </Paper>
      )}

      <WorldMap
        countriesData={countriesData}
        onCountryHover={setHoveredCountry}
        onCountrySelect={setSelectedCountry}
      />

      {/* Statistiques après clic */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {selectedCountry ? (
          <>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Cas confirmés</Typography>
                <Typography variant="h4">{selectedCountry.cases.toLocaleString()}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Décès</Typography>
                <Typography variant="h4">{selectedCountry.deaths.toLocaleString()}</Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Guéris</Typography>
                <Typography variant="h4">{selectedCountry.recovered.toLocaleString()}</Typography>
              </Paper>
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Typography color="text.secondary">Sélectionnez un pays sur la carte</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
