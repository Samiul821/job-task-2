import fs from "fs-extra";
import csv from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";

// __dirname fix for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateDir = path.join(__dirname, "template"); // React template folder
const buildDir = path.join(__dirname, "build"); // Output folder
const sites = [];

// 1️⃣ Read CSV
fs.createReadStream(path.join(__dirname, "websites.csv"))
  .pipe(csv())
  .on("data", (row) => sites.push(row))
  .on("end", () => {
    console.log("✅ CSV Read Done:", sites);

    (async () => {
      await fs.ensureDir(buildDir);

      for (const site of sites) {
        const siteDir = path.join(buildDir, site.domain);

        // 2️⃣ Copy template folder to build
        await fs.copy(templateDir, siteDir);

        // 3️⃣ Overwrite Contact.jsx with CSV data
        const contactFile = path.join(
          siteDir,
          "src",
          "Components",
          "Contact.jsx"
        );
        const contactContent = `
import React from "react";

export default function Contact() {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-8 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2">Contact Info</h2>
      <p className="text-gray-700 mb-1">Phone: ${site.phone}</p>
      <p className="text-gray-700">Address: ${site.address}</p>
    </div>
  );
}
`;
        await fs.writeFile(contactFile, contactContent, "utf-8");

        // 4️⃣ Overwrite Heading.jsx with CSV title & description + random word
        const headingFile = path.join(
          siteDir,
          "src",
          "Components",
          "Heading.jsx"
        );
        const deliveryWords = ["Quick", "Fast", "Speedy"];
        const randomWord =
          deliveryWords[Math.floor(Math.random() * deliveryWords.length)];

        const headingContent = `
import React from "react";

export default function Heading() {
  return (
    <div className="bg-blue-500 text-white py-16 text-center rounded-lg shadow-lg">
      <h1 className="text-3xl md:text-5xl font-bold">${randomWord} ${site.title}</h1>
      <p className="mt-4 text-lg md:text-xl">${site.description}</p>
    </div>
  );
}
`;
        await fs.writeFile(headingFile, headingContent, "utf-8");

        console.log(`🚀 Project created for ${site.domain}`);
      }
    })().catch((err) => console.error("❌ Error:", err));
  })
  .on("error", (err) => console.error("❌ CSV Read Error:", err));
