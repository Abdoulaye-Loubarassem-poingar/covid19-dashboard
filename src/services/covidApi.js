import axios from "axios";

const API_BASE = "https://disease.sh/v3/covid-19";

export const getGlobalData = async () => {
  const res = await axios.get(`${API_BASE}/all`);
  return res.data;
};

export const getCountriesData = async () => {
  const res = await axios.get(`${API_BASE}/countries`);
  return res.data;
};

export const getHistoricalData = async (country) => {
  const res = await axios.get(
    `${API_BASE}/historical/${country}?lastdays=60`
  );
  return res.data;
};
