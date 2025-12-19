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

const COLORS = ["#90caf9","#f48fb1","#81c784","#ffb74d","#ce93d8","#4dd0e1","#e57373","#aed581"];

export default function Evolution() {
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/countries")
      .then(res => res.json())
      .then(data => setCountries(data));
  }, []);

  useEffect(() => {
    if (selectedCountries.length === 0) return setChartData([]);

    Promise.all(
      selectedCountries.map(country =>
        fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=all`)
          .then(res => res.json())
          .catch(() => null)
      )
    ).then(results => {
      const valid = results.filter(r => r?.timeline?.cases);

      const allDates = new Set();
      valid.forEach(r => Object.keys(r.timeline.cases).forEach(d => allDates.add(d)));

      const merged = Array.from(allDates).map(date => {
        const entry = { date };
        valid.forEach((r,i) => { entry[selectedCountries[i]] = r.timeline.cases[date] ?? null; });
        return entry;
      }).sort((a,b) => new Date(a.date)-new Date(b.date));

      setChartData(merged);
    });
  }, [selectedCountries]);

  const exportPNG = async () => {
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = "evolution.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const exportPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape");
    pdf.addImage(imgData, "PNG", 10, 10, 270, 150);
    pdf.save("evolution.pdf");
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Évolution du COVID-19</Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Pays</InputLabel>
        <Select
          multiple
          value={selectedCountries}
          label="Pays"
          onChange={e => setSelectedCountries(e.target.value)}
          renderValue={selected => (
            <Box sx={{ display:"flex", flexWrap:"wrap", gap:0.5 }}>
              {selected.map(value => <Chip key={value} label={value} />)}
            </Box>
          )}
        >
          {countries.map(c => (
            <MenuItem key={c.country} value={c.country}>{c.country}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display:"flex", gap:2, mb:2 }}>
        <Button variant="contained" onClick={exportPNG}>Export PNG</Button>
        <Button variant="contained" onClick={exportPDF}>Export PDF</Button>
      </Box>

      <Box ref={chartRef} sx={{ height:420 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="date" hide />
            <YAxis />
            <Tooltip />
            {selectedCountries.map((country,index)=>(
              <Line key={country} type="monotone" dataKey={country} stroke={COLORS[index%COLORS.length]} dot={false} connectNulls />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
