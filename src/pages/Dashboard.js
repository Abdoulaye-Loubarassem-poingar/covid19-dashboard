

import React, { useEffect, useState } from "react";
import { getCovidData } from "../services/covidAPI";

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getCovidData("canada").then((res) => setData(res));
  }, []);

  return (
    <div>
      <h2>COVID Dashboard</h2>
      <p>Nombre de données chargées : {data.length}</p>
    </div>
  );
}

export default Dashboard;
