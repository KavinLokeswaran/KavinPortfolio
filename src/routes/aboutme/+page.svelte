<script>
  import { t } from "$lib/i18n";
  import { education, skills, links } from "$lib/data/profile.js";
  import ScrollReveal from "$lib/Components/ScrollReveal.svelte";
  import Icon from "$lib/Components/Icon.svelte";
  import CvButton from "$lib/Components/CvButton.svelte";
  import Seo from "$lib/Components/Seo.svelte";

  const interests = ["interest_1", "interest_2", "interest_3", "interest_4", "interest_5"];
  const allSkills = skills.flatMap((g) => g.items.map((i) => i.name));
</script>

<Seo title={$t("nav_about")} description={$t("seo_about_desc")} path="/aboutme" />

<section class="page-hero">
  <div class="container grid">
    <ScrollReveal>
      <div class="photo">
        <img src="/img/kavin-about.webp" alt={$t("about_img_alt")} width="825" height="1100" />
      </div>
    </ScrollReveal>

    <ScrollReveal delay={100}>
      <div>
        <p class="eyebrow">{$t("about_eyebrow")}</p>
        <h1>{$t("about_title")}</h1>
        <div class="text">
          <p>{$t("about_p1")}</p>
          <p>{$t("about_p2")}</p>
          <p>{$t("about_p3")}</p>
        </div>
        <div class="cta">
          <a class="btn btn-primary" href="/contactme">{$t("hero_cta_contact")} <Icon name="arrow" /></a>
          <CvButton />
          <a class="btn btn-ghost" href={links.github} target="_blank" rel="noopener noreferrer"><Icon name="github" /> GitHub</a>
          {#if links.linkedin}
            <a class="btn btn-ghost" href={links.linkedin} target="_blank" rel="noopener noreferrer"><Icon name="linkedin" /> LinkedIn</a>
          {/if}
        </div>
      </div>
    </ScrollReveal>
  </div>
</section>

<section class="section">
  <div class="container cols">
    <ScrollReveal>
      <div class="card block">
        <h2><Icon name="school" size={22} /> {$t("edu_title")}</h2>
        <ol class="timeline">
          {#each education as e}
            <li class:current={e.current}>
              <span class="dot"></span>
              <div>
                <div class="row">
                  <h3>{$t(`edu_${e.key}`)}</h3>
                  {#if e.current}<span class="tag tag-accent">{$t("edu_now")}</span>{/if}
                </div>
                <p class="sub">{$t(`edu_${e.key}_sub`)}</p>
                <p class="years">{$t(`edu_${e.key}_years`)}</p>
              </div>
            </li>
          {/each}
        </ol>
      </div>
    </ScrollReveal>

    <div class="stack">
      <ScrollReveal delay={100}>
        <div class="card block">
          <h2><Icon name="code" size={22} /> {$t("skills_title")}</h2>
          <ul class="tags">
            {#each allSkills as s}
              <li class="tag">{s}</li>
            {/each}
          </ul>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={180}>
        <div class="card block">
          <h2><Icon name="star" size={22} /> {$t("interests_title")}</h2>
          <ul class="tags">
            {#each interests as i}
              <li class="tag tag-accent">{$t(i)}</li>
            {/each}
          </ul>
        </div>
      </ScrollReveal>
    </div>
  </div>
</section>

<style>
  .page-hero {
    padding-top: calc(var(--nav-h) + clamp(40px, 8vw, 90px));
  }
  .grid {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    gap: clamp(32px, 6vw, 72px);
    align-items: center;
  }
  .photo {
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    aspect-ratio: 4 / 5;
  }
  .photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  h1 {
    font-size: clamp(2.4rem, 6vw, 4rem);
    margin: 10px 0 20px;
  }
  .text {
    display: grid;
    gap: 14px;
    color: var(--text-muted);
    font-size: 1.05rem;
    max-width: 62ch;
  }
  .cta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;
  }
  .cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
  }
  .stack {
    display: grid;
    gap: 20px;
  }
  .block {
    padding: 28px;
  }
  .block h2 {
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 22px;
  }
  .block h2 :global(svg) {
    color: var(--accent);
  }
  .tags {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .tags .tag {
    font-size: 0.88rem;
    padding: 0.4em 0.85em;
  }
  .timeline {
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
  }
  .timeline::before {
    content: "";
    position: absolute;
    left: 7px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: linear-gradient(var(--accent), rgba(111, 163, 255, 0.1));
  }
  .timeline li {
    position: relative;
    display: flex;
    gap: 18px;
    padding-bottom: 24px;
  }
  .timeline li:last-child {
    padding-bottom: 0;
  }
  .dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--bg);
    border: 2px solid var(--accent);
    flex-shrink: 0;
    margin-top: 4px;
    position: relative;
    z-index: 1;
  }
  .current .dot {
    background: var(--accent);
    box-shadow: 0 0 0 5px rgba(111, 163, 255, 0.2);
  }
  .row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .timeline h3 {
    font-size: 1.08rem;
  }
  .sub {
    color: var(--text-muted);
    font-size: 0.95rem;
  }
  .years {
    color: var(--text-faint);
    font-size: 0.85rem;
  }
  @media (max-width: 860px) {
    .grid,
    .cols {
      grid-template-columns: 1fr;
    }
    .photo {
      max-width: 380px;
    }
  }
</style>
