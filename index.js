import fs from "fs-extra";
import csv from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";

// __dirname fix for ES Modules
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

        // 2️⃣ Copy template
        await fs.copy(templateDir, siteDir);

        // 3️⃣ Overwrite Contact.jsx
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
    <>
      <p>Phone: ${site.phone}</p>
      <p>Address: ${site.address}</p>
    </>
  );
}
`;
        await fs.writeFile(contactFile, contactContent, "utf-8");

        // 4️⃣ Overwrite Heading.jsx
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
  return <h1>${randomWord} delivery service in Dhaka.</h1>;
}
`;
        await fs.writeFile(headingFile, headingContent, "utf-8");

        console.log(`🚀 Project created for ${site.domain}`);
      }
    })().catch((err) => console.error("❌ Error:", err));
  })
  .on("error", (err) => console.error("❌ CSV Read Error:", err));
