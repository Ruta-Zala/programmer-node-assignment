import fs from "fs";
import csvParser from "csv-parser";
import { applyTransformations } from "../utils/dataTransformHelper.js";

// Function to transform data from CSV file based on user-defined mapping
export const transformData = ({ filename, mapping, page, limit }, callback) => {
  const filePath = `src/uploads/${filename}`;

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return callback({ error: "File not found" });
  }

  let results = [];
  let startIndex = (page - 1) * limit;
  let endIndex = startIndex + limit;
  let count = 0;

  // Read CSV file and process rows
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (row) => {
      count++;

      // Apply transformation only for records within the requested page
      if (count > startIndex && count <= endIndex) {
        results.push(applyTransformations(row, mapping));
      }
    })
    .on("end", () => {
      callback(null, {
        page,
        limit,
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        data: results,
      });
    })
    .on("error", (err) => {
      callback({ error: err.message });
    });
};
