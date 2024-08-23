import Papa from "papaparse";
import { readFile, writeFile } from "node:fs/promises";

const loadSpeciesLabelsFromCsv = async () => {
  try {
    const fileData = await readFile(inputFilePath, "utf-8");
    return new Promise((resolve, reject) => {
      Papa.parse(fileData, {
        header: true,
        complete: ({ data }) => {
          const labels = data.map((row) => row.species);

          const labelsJson = JSON.stringify(labels);

          writeFile(outputFilePath, labelsJson, "utf-8");
          console.log("labels written to", outputFilePath);
        },
      });
    });
  } catch (error) {
    console.error(error);
  }
};
const inputFilePath =
  "/home/zaid/northcoders/group-project/bird-spotter/assets/bird_species_sorted.csv";
const outputFilePath =
  "/home/zaid/northcoders/group-project/bird-spotter/assets/bird_species_only.json";
loadSpeciesLabelsFromCsv();
