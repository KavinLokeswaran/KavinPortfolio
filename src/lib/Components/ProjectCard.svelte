<script>
  import { t, locale } from "$lib/i18n";
  import { githubUrl } from "$lib/data/projects.js";
  import Icon from "$lib/Components/Icon.svelte";

  let { project, large = false, horizontal = false } = $props();

  const code = $derived(githubUrl(project.repo));
</script>

<article class="card project" class:large class:horizontal>
  <div class="media" class:logo={project.image?.endsWith(".svg")} class:noimg={!project.image}>
    {#if project.image}
      <img
        src={project.image}
        alt="{$locale === 'no' ? 'Skjermbilde av' : 'Screenshot of'} {project.title}"
        loading="lazy"
        decoding="async"
      />
    {:else}
      <div class="placeholder" aria-hidden="true">
        <Icon name="code" size={40} />
        <span>{project.tech[0] ?? ""}</span>
      </div>
    {/if}
    {#if project.status === "in_progress"}
      <span class="tag tag-accent badge">{$t("project_in_progress")}</span>
    {/if}
  </div>

  <div class="body">
    <h3>{project.title}</h3>
    <p>{project.text[$locale] ?? project.text.no}</p>

    {#if project.tech.length}
      <ul class="tags" aria-label="Teknologi">
        {#each project.tech as tech}
          <li class="tag">{tech}</li>
        {/each}
      </ul>
    {/if}

    {#if code || project.live}
      <div class="links">
        {#if project.live}
          <a class="btn btn-primary sm" href={project.live} target="_blank" rel="noopener noreferrer">
            <Icon name="external" size={15} />
            {$t("project_live")}
          </a>
        {/if}
        {#if code}
          <a class="btn btn-ghost sm" href={code} target="_blank" rel="noopener noreferrer">
            <Icon name="github" size={15} />
            {$t("project_code")}
          </a>
        {/if}
      </div>
    {/if}
  </div>
</article>

<style>
  .project {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
  }
  .project:hover {
    transform: translateY(-4px);
    border-color: var(--border-strong);
    box-shadow: var(--shadow);
  }
  .media {
    position: relative;
    aspect-ratio: 16 / 9;
    background: var(--media-bg);
    overflow: hidden;
    border-bottom: 1px solid var(--border);
  }
  /* Uten skjermbilde: lavere felt, så kortet ikke får en stor tom flate */
  .media.noimg {
    aspect-ratio: 3 / 1;
  }
  .media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    transition: transform 0.5s ease;
  }
  .project:hover .media img {
    transform: scale(1.03);
  }
  .media.logo {
    display: grid;
    place-items: center;
    background: radial-gradient(circle at 50% 40%, rgba(48, 102, 190, 0.35), var(--media-bg) 70%);
  }
  .media.logo img {
    width: 60%;
    height: 60%;
    object-fit: contain;
    object-position: center;
  }
  .placeholder {
    height: 100%;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 10px;
    color: var(--accent);
    font-family: var(--font-head);
    font-weight: 600;
    background:
      linear-gradient(135deg, rgba(48, 102, 190, 0.25), rgba(2, 77, 152, 0.05)),
      repeating-linear-gradient(45deg, rgba(111, 163, 255, 0.05) 0 2px, transparent 2px 14px);
    padding: 16px;
    text-align: center;
  }
  .badge {
    position: absolute;
    top: 12px;
    left: 12px;
    backdrop-filter: blur(6px);
  }
  .body {
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
  }
  h3 {
    font-size: 1.25rem;
  }
  .large h3 {
    font-size: 1.45rem;
  }
  p {
    color: var(--text-muted);
    font-size: 0.97rem;
  }
  .tags {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .links {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: auto;
    padding-top: 6px;
  }
  @media (min-width: 861px) {
    .horizontal {
      display: grid;
      grid-template-columns: 1.25fr 1fr;
    }
    .horizontal .media {
      aspect-ratio: auto;
      min-height: 320px;
      border-bottom: 0;
      border-right: 1px solid var(--border);
    }
    .horizontal .body {
      padding: 36px;
      justify-content: center;
    }
    .horizontal .links {
      margin-top: 12px;
    }
  }
  .sm {
    padding: 0.55em 1em;
    font-size: 0.88rem;
  }
</style>
