import { useEffect, useRef, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Button,
  Chip
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const COLORS = [
  "#90caf9",
  "#f48fb1",
  "#81c784",
  "#ffb74d",
  "#ce93d8",
  "#4dd0e1",
  "#e57373",
  "#aed581"
];

export default function Comparaison() {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);

  // 🔹 Charger tous les pays
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/countries")
      .then(res => res.json())
      .then(data => setCountries(data));
  }, []);

  // 🔹 Charger et NORMALISER les données
  useEffect(() => {
    if (selectedCountries.length === 0) {
      setChartData([]);
      return;
    }

    Promise.all(
      selectedCountries.map(country =>
        fetch(
          `https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`
        )
          .then(res => res.json())
          .catch(() => null)
      )
    ).then(results => {
      const timelines = results.filter(
        r => r && r.timeline && r.timeline.cases
      );

      if (timelines.length === 0) {
        setChartData([]);
        return;
      }

      // 🔹 Construire une timeline commune
      const allDates = new Set();
      timelines.forEach(r =>
        Object.keys(r.timeline.cases).forEach(d => allDates.add(d))
      );

      const merged = Array.from(allDates).map(date => {
        const entry = { date };

        timelines.forEach((r, i) => {
          const country = selectedCountries[i];
          entry[country] = r.timeline.cases[date] ?? null;
        });

        return entry;
      });

      // 🔹 Trier par date
      merged.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      setChartData(merged);
    });
  }, [selectedCountries]);

  // 📸 Export PNG
  const exportPNG = async () => {
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = "comparaison.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  // 📄 Export PDF
  const exportPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape");
    pdf.addImage(imgData, "PNG", 10, 10, 270, 150);
    pdf.save("comparaison.pdf");
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Comparaison des pays
      </Typography>

      {/* Sélecteur multi-pays */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Pays</InputLabel>
        <Select
          multiple
          value={selectedCountries}
          label="Pays"
          onChange={e => setSelectedCountries(e.target.value)}
          renderValue={selected => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map(value => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {countries.map(country => (
            <MenuItem key={country.country} value={country.country}>
              {country.country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Boutons export */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="contained" onClick={exportPNG}>
          Export PNG
        </Button>
        <Button variant="contained" onClick={exportPDF}>
          Export PDF
        </Button>
      </Box>

      {/* Graphique */}
      <Box ref={chartRef} sx={{ height: 420 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" hide />
            <YAxis />
            <Tooltip />

            {selectedCountries.map((country, index) => (
              <Line
                key={country}
                type="monotone"
                dataKey={country}
                stroke={COLORS[index % COLORS.length]}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
