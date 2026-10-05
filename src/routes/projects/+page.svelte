<script>
  import { onMount } from "svelte";
  import { t } from "$lib/i18n";
  import { links } from "$lib/data/profile.js";
  import { curatedProjects } from "$lib/data/projects.js";
  import { github, loadRepos, describedRepos } from "$lib/github.js";
  import ScrollReveal from "$lib/Components/ScrollReveal.svelte";
  import ProjectCard from "$lib/Components/ProjectCard.svelte";
  import RepoCard from "$lib/Components/RepoCard.svelte";
  import Icon from "$lib/Components/Icon.svelte";
  import Seo from "$lib/Components/Seo.svelte";

  onMount(loadRepos);

  // Repoer som allerede vises som utvalgte prosjekter hoppes over nedenfor
  const curatedRepos = new Set(
    curatedProjects.filter((p) => p.repo).map((p) => p.repo.toLowerCase())
  );

  let query = $state("");
  let lang = $state("all");

  // Bare repoer med beskrivelse, og ikke de som allerede er utvalgte prosjekter
  const others = $derived(describedRepos($github.repos).filter((r) => !curatedRepos.has(r.name.toLowerCase())));

  const languages = $derived([
    ...new Set(others.map((r) => r.language).filter(Boolean))
  ].sort());

  const filtered = $derived(
    others.filter((r) => {
      if (lang !== "all" && r.language !== lang) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q) ||
        r.topics.some((tp) => tp.toLowerCase().includes(q))
      );
    })
  );
</script>

<Seo title={$t("projects_title")} description={$t("seo_projects_desc")} path="/projects" />

<section class="page-hero">
  <div class="container">
    <ScrollReveal>
      <p class="eyebrow">{$t("nav_projects")}</p>
      <h1>{$t("projects_title")}</h1>
      <p class="section-lead">{$t("projects_lead")}</p>
    </ScrollReveal>
  </div>
</section>

<section class="section tight">
  <div class="container">
    <h2 class="sub">{$t("projects_curated")}</h2>
    <div class="grid" class:single={curatedProjects.length === 1}>
      {#each curatedProjects as project, i}
        <ScrollReveal delay={(i % 3) * 80}>
          <ProjectCard {project} horizontal={curatedProjects.length === 1} />
        </ScrollReveal>
      {/each}
    </div>
  </div>
</section>

<!-- Vises bare når det finnes flere repoer med beskrivelse enn de utvalgte -->
{#if $github.status === "ready" && others.length}
<section class="section tight" id="github">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow"><span class="live-dot"></span>{$t("gh_eyebrow")}</p>
        <h2 class="sub">{$t("projects_more")}</h2>
        <p class="section-lead">{$t("projects_more_lead")}</p>
      </div>
      <a class="btn btn-ghost" href={links.github} target="_blank" rel="noopener noreferrer">
        <Icon name="github" />
        {$t("gh_profile")}
      </a>
    </div>

      <div class="toolbar">
        <label class="search">
          <Icon name="search" size={16} />
          <span class="sr-only">{$t("projects_search")}</span>
          <input type="search" placeholder={$t("projects_search")} bind:value={query} />
        </label>
        <div class="chips" role="group" aria-label="Språk">
          <button type="button" class="chip" class:active={lang === "all"} onclick={() => (lang = "all")}>
            {$t("projects_filter_all")}
          </button>
          {#each languages as l}
            <button type="button" class="chip" class:active={lang === l} onclick={() => (lang = l)}>{l}</button>
          {/each}
        </div>
        <span class="count">{filtered.length} {$t("projects_count")}</span>
      </div>

      <div class="grid">
        {#each filtered as repo (repo.name)}
          <RepoCard {repo} />
        {/each}
      </div>
  </div>
</section>
{/if}

<style>
  .page-hero {
    padding-top: calc(var(--nav-h) + clamp(40px, 8vw, 90px));
  }
  h1 {
    font-size: clamp(2.4rem, 6vw, 4rem);
    margin: 10px 0 14px;
  }
  .tight {
    padding: 48px 0;
  }
  .sub {
    font-size: clamp(1.4rem, 3vw, 1.9rem);
    margin: 6px 0 24px;
  }
  .section-head .sub {
    margin-bottom: 8px;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .grid.single {
    grid-template-columns: 1fr;
  }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 16px;
    align-items: center;
    margin-bottom: 24px;
  }
  .search {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-faint);
    min-width: min(100%, 260px);
  }
  .search input {
    border: 0;
    background: transparent;
    color: var(--text);
    font: inherit;
    font-size: 0.95rem;
    padding: 10px 0;
    width: 100%;
    outline: none;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .chip {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-muted);
    border-radius: 999px;
    padding: 7px 14px;
    font: 500 0.85rem var(--font-body);
    cursor: pointer;
  }
  .chip:hover {
    border-color: var(--border-strong);
  }
  .chip.active {
    background: var(--brand);
    border-color: var(--brand);
    color: #fff;
  }
  .count {
    margin-left: auto;
    color: var(--text-faint);
    font-size: 0.85rem;
  }
  .live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success);
    display: inline-block;
  }
  @media (max-width: 1000px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 640px) {
    .grid {
      grid-template-columns: 1fr;
    }
    .count {
      margin-left: 0;
    }
  }
</style>
