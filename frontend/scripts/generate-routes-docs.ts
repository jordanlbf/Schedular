// @ts-ignore
import fs from "node:fs";
// @ts-ignore
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTE_DOCS } from "../src/app/routeDocs";

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rows = ROUTE_DOCS.map(r =>
  `| \`${r.path}\` | ${r.name} | \`${r.component}\` | ${r.status ?? ""} |`
).join("\n");

const table = `| Path | Page | Component | Status |
|------|------|-----------|--------|
${rows}
`;

const SECTION_TITLE = "## Routes";
const START = "<!-- ROUTES_TABLE_START -->";
const END = "<!-- ROUTES_TABLE_END -->";

const block = `${START}
${table}
${END}
`;

const readmePath = path.resolve(__dirname, "../README.md");
let readme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf8") : "";

if (!readme.includes(START) || !readme.includes(END)) {
  // Append a new section if markers not present
  readme += `

${SECTION_TITLE}
${block}
`;
} else {
  // Replace the existing block
  readme = readme.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block);
}

fs.writeFileSync(readmePath, readme);
console.log("Updated frontend/README.md with routes table.");
