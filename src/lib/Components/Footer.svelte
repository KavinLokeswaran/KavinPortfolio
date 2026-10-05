<script>
  import { t, locale } from "$lib/i18n";
  import { links, cv } from "$lib/data/profile.js";
  import Icon from "$lib/Components/Icon.svelte";

  const social = [
    { name: "github", label: "GitHub", href: links.github },
    { name: "linkedin", label: "LinkedIn", href: links.linkedin },
    { name: "instagram", label: "Instagram", href: links.instagram },
    { name: "mail", label: "E-post", href: `mailto:${links.email}` }
  ].filter((s) => s.href);

  const year = new Date().getFullYear();
  const cvFile = $derived(cv[$locale] ?? cv.no);
</script>

<footer class="footer">
  <div class="container grid">
    <div class="about">
      <a class="brand" href="/">
        <img src="/assets/Kavin_logo_navn.svg" alt="Kavin Lokeswaran" width="200" height="91" />
      </a>
      <p>{$t("footer_tagline")}</p>
      <a class="mail" href="mailto:{links.email}">{links.email}</a>
    </div>

    <div>
      <h2>{$t("footer_nav")}</h2>
      <ul>
        <li><a href="/">{$t("nav_home")}</a></li>
        <li><a href="/projects">{$t("nav_projects")}</a></li>
        <li><a href="/aboutme">{$t("nav_about")}</a></li>
        <li><a href="/contactme">{$t("nav_contact")}</a></li>
        <li><a href="/privacy">{$t("nav_privacy")}</a></li>
      </ul>
    </div>

    <div>
      <h2>{$t("footer_social")}</h2>
      <ul class="social">
        {#each social as s}
          <li>
            <a href={s.href} target={s.name === "mail" ? undefined : "_blank"} rel="noopener noreferrer">
              <Icon name={s.name} size={16} />
              {s.label}
            </a>
          </li>
        {/each}
        <li>
          <a href={cvFile.href} download={cvFile.file} type="application/pdf">
            <Icon name="download" size={16} />
            {$t("cv_download")}
          </a>
        </li>
      </ul>
    </div>
  </div>

  <div class="container bottom">
    <span>© {year} {$t("footer_copyright")} · {$t("footer_built")}</span>
    <a href="#main" class="top">
      {$t("footer_back_to_top")}
      <Icon name="arrow-up" size={16} />
    </a>
  </div>
</footer>

<style>
  .footer {
    margin-top: 40px;
    border-top: 1px solid var(--border);
    background: linear-gradient(180deg, transparent, var(--footer-glow));
    padding: 64px 0 28px;
    font-size: 0.95rem;
  }
  .grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr;
    gap: 40px;
  }
  .brand img {
    height: 64px;
    width: auto;
    margin-bottom: 14px;
  }
  .about p {
    color: var(--text-muted);
    margin-bottom: 8px;
  }
  .mail {
    color: var(--accent);
    text-decoration: none;
  }
  .mail:hover {
    text-decoration: underline;
  }
  h2 {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--text-faint);
    margin-bottom: 14px;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 10px;
  }
  ul a {
    color: var(--text-muted);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: color 0.2s ease;
  }
  ul a:hover {
    color: var(--text);
  }
  .bottom {
    margin-top: 48px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    color: var(--text-faint);
    font-size: 0.85rem;
  }
  .top {
    color: var(--text-muted);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .top:hover {
    color: var(--text);
  }
  @media (max-width: 760px) {
    .grid {
      grid-template-columns: 1fr 1fr;
    }
    .about {
      grid-column: 1 / -1;
    }
  }
</style>
