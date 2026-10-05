// Kjøres automatisk før `npm run build` (prebuild).
// Lagrer et øyeblikksbilde av offentlige GitHub-repoer i static/data/repos.json,
// som nettsiden bruker hvis live-kallet mot GitHub API feiler.
// Feiler aldri builden: uten nett beholdes forrige fil.

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { GITHUB_USER } from "../src/lib/data/profile.js";

const USER = GITHUB_USER;
const OUT = new URL("../static/data/repos.json", import.meta.url);
const url = `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed&type=owner`;

const headers = { Accept: "application/vnd.github+json", "User-Agent": "kavin-portfolio-build" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const keep = ({ name, html_url, description, language, topics, homepage, stargazers_count, pushed_at, created_at, fork, archived, private: priv }) => ({
  name, html_url, description, language, topics, homepage, stargazers_count, pushed_at, created_at, fork, archived, private: priv
});

try {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub svarte ${res.status}`);
  const repos = (await res.json()).filter((r) => !r.private).map(keep);
  await mkdir(new URL("../static/data/", import.meta.url), { recursive: true });
  await writeFile(OUT, JSON.stringify(repos, null, 2) + "\n");
  console.log(`✓ Lagret ${repos.length} offentlige repoer til static/data/repos.json`);
} catch (err) {
  let existing = "ingen";
  try {
    existing = `${JSON.parse(await readFile(OUT, "utf8")).length} repoer`;
  } catch {
    await mkdir(new URL("../static/data/", import.meta.url), { recursive: true });
    await writeFile(OUT, "[]\n");
  }
  console.warn(`⚠ Kunne ikke hente repoer (${err.message}). Beholder eksisterende øyeblikksbilde (${existing}).`);
}
