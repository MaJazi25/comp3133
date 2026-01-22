const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const csvFile = path.join(__dirname, "input_countries.csv");
const canadaFile = path.join(__dirname, "canada.txt");
const usaFile = path.join(__dirname, "usa.txt");

for (const file of [canadaFile, usaFile]) {
  try {
    fs.unlinkSync(file);
  } catch (e) {}
}

const canadaStream = fs.createWriteStream(canadaFile, { flags: "w" });
const usaStream = fs.createWriteStream(usaFile, { flags: "w" });

canadaStream.write("country,year,population\n");
usaStream.write("country,year,population\n");

fs.createReadStream(csvFile)
  .pipe(csv())
  .on("data", (row) => {
    const country = String(row.country || "").trim().toLowerCase();
    const year = String(row.year ?? "").trim();
    const population = String(row.population ?? "").trim();

    if (!country || !year || !population) return;

    if (country === "canada") {
      canadaStream.write(`${country},${year},${population}\n`);
    } else if (country === "united states") {
      usaStream.write(`${country},${year},${population}\n`);
    }
  })
  .on("end", () => {
    canadaStream.end();
    usaStream.end();
    console.log("Done. Created canada.txt and usa.txt");
  })
  .on("error", (err) => {
    canadaStream.end();
    usaStream.end();
    console.error("Error:", err.message);
  });

