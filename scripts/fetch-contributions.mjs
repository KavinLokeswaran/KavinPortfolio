// Kjøres automatisk før `npm run build` (prebuild).
// Lagrer GitHub-aktiviteten (bidragskalenderen for siste år) i src/lib/data/contributions.json.
// Hentes ved build i stedet for i nettleseren, så besøkende ikke sender IP-adressen sin til GitHub
// for denne grafen. Nattlig build i GitHub Actions holder den oppdatert.
// Feiler aldri builden: uten nett beholdes forrige fil.

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { GITHUB_USER } from "../src/lib/data/profile.js";

const USER = GITHUB_USER;
const OUT = new URL("../src/lib/data/contributions.json", import.meta.url);
const url = `https://github.com/users/${USER}/contributions`;

try {
  const res = await fetch(url, { headers: { "User-Agent": "kavin-portfolio-build" } });
  if (!res.ok) throw new Error(`GitHub svarte ${res.status}`);
  const html = await res.text();

  // Hver dag er en <td> med id, dato og nivå (0–4) ...
  const days = new Map();
  for (const [td] of html.matchAll(/<td[^>]*class="ContributionCalendar-day"[^>]*>/g)) {
    const id = td.match(/id="([^"]+)"/)?.[1];
    const date = td.match(/data-date="([^"]+)"/)?.[1];
    const level = Number(td.match(/data-level="(\d)"/)?.[1] ?? 0);
    if (id && date) days.set(id, { date, level, count: 0 });
  }
  // ... og antallet står i et tilhørende <tool-tip for="id">
  for (const [, id, text] of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const day = days.get(id);
    const n = text.match(/^([\d,]+) contribution/);
    if (day && n) day.count = Number(n[1].replace(/,/g, ""));
  }

  const list = [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
  if (list.length < 300) throw new Error(`fant bare ${list.length} dager – har GitHub endret siden?`);

  const total = list.reduce((sum, d) => sum + d.count, 0);
  await mkdir(new URL("../src/lib/data/", import.meta.url), { recursive: true });
  await writeFile(OUT, JSON.stringify({ user: USER, fetchedAt: new Date().toISOString(), total, days: list }) + "\n");
  console.log(`✓ Lagret GitHub-aktivitet (${total} bidrag siste år) til src/lib/data/contributions.json`);
} catch (err) {
  try {
    await readFile(OUT, "utf8");
  } catch {
    await mkdir(new URL("../src/lib/data/", import.meta.url), { recursive: true });
    await writeFile(OUT, JSON.stringify({ user: USER, fetchedAt: null, total: 0, days: [] }) + "\n");
  }
  console.warn(`⚠ Kunne ikke hente GitHub-aktivitet (${err.message}). Beholder eksisterende fil.`);
}
