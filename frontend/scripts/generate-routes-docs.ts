// frontend/scripts/generate-routes-docs.ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTE_DOCS } from "../src/app/routeDocs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emoji = {
  "Ready": "🟢 Ready",
  "In progress": "🟡 In progress",
  "Planned": "⚪ Planned",
} as const;

const areaOf = (p: string) => (p.startsWith("/pos") ? "POS" : "App");
const count = ROUTE_DOCS.length;

const rows = ROUTE_DOCS.map(r =>
  `| \`${r.path}\` | **${r.name}** | ${areaOf(r.path)} | \`${r.component}\` | ${r.status ? emoji[r.status] : ""} |`
).join("\n");

const table = `| Path | Page | Area | Component | Status |
|:-----|:-----|:-----|:----------|:-------|
${rows}
`;

const START = "<!-- ROUTES_TABLE_START -->";
const END = "<!-- ROUTES_TABLE_END -->";
const block = `${START}
<details>
<summary><strong>Routes (${count})</strong></summary>

${table}
</details>
${END}`;

const readmePath = path.resolve(__dirname, "../README.md");
let readme = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, "utf8") : "";

// Ensure section exists, then replace/insert the block between markers
if (!readme.includes(START) || !readme.includes(END)) {
  readme += `

## Routes
${block}
`;
} else {
  readme = readme.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block);
}

fs.writeFileSync(readmePath, readme);
console.log("Updated frontend/README.md with a polished routes section.");
