import Papa from "papaparse";

export function getCovidDataCSV(country = "Canada") {
  const url = process.env.PUBLIC_URL + "/data/full_grouped.csv";
  console.log("📂 Lecture du fichier :", url);

  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log("✅ CSV chargé :", results.data.length, "lignes");

        // 👉 Le nom de colonne correct dans ton fichier est "Country/Region"
        const filteredData = results.data.filter(
          (row) =>
            row["Country/Region"] &&
            row["Country/Region"].trim().toLowerCase() ===
              country.toLowerCase()
        );

        console.log("📊 Lignes trouvées pour", country, ":", filteredData.length);
        resolve(filteredData);
      },
      error: (error) => {
        console.error("❌ Erreur lors du parsing :", error);
        reject(error);
      },
    });
  });
}
