// Henter offentlige repoer fra GitHub automatisk.
//
// 1. I nettleseren: live-kall mot GitHub API (nye repoer vises med en gang).
// 2. Fallback: /data/repos.json – et øyeblikksbilde som lages ved hver build
//    (scripts/fetch-repos.mjs) og oppdateres daglig av GitHub Actions.
//    Brukes hvis API-et er utilgjengelig eller rate-limit er nådd.

import { writable } from "svelte/store";
import { GITHUB_USER } from "$lib/data/profile.js";

const API = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed&type=owner`;
const SNAPSHOT = "/data/repos.json";
const CACHE_KEY = "gh-repos-v1";
const CACHE_TTL = 30 * 60 * 1000; // 30 min

/** @typedef {{ name: string, title: string, url: string, description: string | null, language: string | null, topics: string[], homepage: string | null, stars: number, pushedAt: string, createdAt: string }} Repo */

/** @type {import('svelte/store').Writable<{ status: 'idle' | 'loading' | 'ready' | 'error', repos: Repo[], source: 'live' | 'snapshot' | null }>} */
export const github = writable({ status: "idle", repos: [], source: null });

let started = false;

/** Gjør "my_cool-repo" om til "My cool repo" */
export function prettifyName(name) {
  const s = name.replace(/[-_]+/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** @returns {Repo[]} */
export function normalize(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((r) => r && !r.fork && !r.archived && !r.private)
    .filter((r) => r.name.toLowerCase() !== GITHUB_USER.toLowerCase()) // profil-README
    .map((r) => ({
      name: r.name,
      title: prettifyName(r.name),
      url: r.html_url,
      description: r.description || null,
      language: r.language || null,
      topics: Array.isArray(r.topics) ? r.topics : [],
      homepage: r.homepage || null,
      stars: r.stargazers_count || 0,
      pushedAt: r.pushed_at,
      createdAt: r.created_at
    }))
    .sort((a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt));
}

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { t, data } = JSON.parse(raw);
    if (Date.now() - t > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data }));
  } catch {
    /* ignorer */
  }
}

async function getJson(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

/** Starter henting én gang per sidevisning (trygt å kalle fra flere komponenter). */
export async function loadRepos() {
  if (started || typeof window === "undefined") return;
  started = true;

  const cached = readCache();
  if (cached) {
    github.set({ status: "ready", repos: cached, source: "live" });
    return;
  }

  github.update((s) => ({ ...s, status: "loading" }));

  try {
    const data = normalize(
      await getJson(API, { headers: { Accept: "application/vnd.github+json" } })
    );
    writeCache(data);
    github.set({ status: "ready", repos: data, source: "live" });
  } catch {
    try {
      const data = normalize(await getJson(SNAPSHOT));
      github.set({ status: "ready", repos: data, source: "snapshot" });
    } catch {
      github.set({ status: "error", repos: [], source: null });
    }
  }
}

/** Bare repoer med beskrivelse på GitHub – uten den ser kortene uferdige ut */
export const describedRepos = (repos) => repos.filter((r) => r.description);

/** Er repoet opprettet de siste 30 dagene? */
export function isNew(repo) {
  return Date.now() - Date.parse(repo.createdAt) < 30 * 24 * 60 * 60 * 1000;
}

/** Relativ dato, f.eks. "3 dager siden" / "3 days ago" */
export function timeAgo(iso, lang = "no") {
  const rtf = new Intl.RelativeTimeFormat(lang === "no" ? "nb" : "en", { numeric: "auto" });
  const diff = (Date.parse(iso) - Date.now()) / 1000;
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60]
  ];
  for (const [unit, sec] of units) {
    if (Math.abs(diff) >= sec) return rtf.format(Math.round(diff / sec), unit);
  }
  return rtf.format(0, "minute");
}

/** Farger på språk-prikken, som på GitHub */
export const languageColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#663399",
  Svelte: "#ff3e00",
  GDScript: "#355570",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  Shell: "#89e051",
  Vue: "#41b883"
};
