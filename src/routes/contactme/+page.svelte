<script>
  import { t } from "$lib/i18n";
  import { links, WEB3FORMS_KEY, GITHUB_USER } from "$lib/data/profile.js";
  import ScrollReveal from "$lib/Components/ScrollReveal.svelte";
  import Icon from "$lib/Components/Icon.svelte";
  import CvButton from "$lib/Components/CvButton.svelte";
  import Seo from "$lib/Components/Seo.svelte";

  let copied = $state(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(links.email);
      copied = true;
      setTimeout(() => (copied = false), 1800);
    } catch {
      window.location.href = `mailto:${links.email}`;
    }
  }

  // Kontaktskjema via Web3Forms. Sendes i bakgrunnen (fetch) så besøkende blir på siden.
  // Uten JavaScript sendes skjemaet vanlig til Web3Forms, som viser sin egen takkeside.
  /** @type {"idle" | "sending" | "success" | "error"} */
  let status = $state("idle");

  // Emnet på e-posten du mottar – alltid på norsk, uansett språk besøkende har valgt
  const MAIL_SUBJECT = "Ny melding fra porteføljen";

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data.botcheck) return; // spam-bot fylte ut det skjulte feltet

    const name = [data.Fornavn, data.Etternavn].filter(Boolean).join(" ");
    data.from_name = name ? `${name} (kavinlokeswaran.no)` : "kavinlokeswaran.no";
    if (data.Emne) data.subject = `${MAIL_SUBJECT}: ${data.Emne}`;

    status = "sending";
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      status = "success";
      form.reset();
    } catch {
      status = "error";
    }
  }

  const social = [
    { name: "github", label: "GitHub", handle: GITHUB_USER, href: links.github },
    { name: "linkedin", label: "LinkedIn", handle: "Kavin Lokeswaran", href: links.linkedin },
    { name: "instagram", label: "Instagram", handle: "@kavinlokeswaran", href: links.instagram }
  ].filter((s) => s.href);
</script>

<Seo title={$t("nav_contact")} description={$t("seo_contact_desc")} path="/contactme" />

<section class="page">
  <div class="container grid">
    <ScrollReveal>
      <div class="intro">
        <p class="eyebrow">{$t("contact_eyebrow")}</p>
        <h1>{$t("contact_heading")}</h1>
        <p class="section-lead">{$t("contact_intro")}</p>

        <div class="card email">
          <span class="e-icon"><Icon name="mail" size={22} /></span>
          <div class="e-text">
            <span class="label">{$t("contact_direct")}</span>
            <a href="mailto:{links.email}">{links.email}</a>
            <span class="hint"><Icon name="clock" size={13} /> {$t("contact_response")}</span>
          </div>
          <button type="button" class="copy" onclick={copyEmail} aria-live="polite">
            <Icon name={copied ? "check" : "copy"} size={16} />
            {copied ? $t("contact_copied") : $t("contact_copy")}
          </button>
        </div>

        <ul class="social">
          {#each social as s}
            <li>
              <a class="card" href={s.href} target="_blank" rel="noopener noreferrer">
                <Icon name={s.name} size={20} />
                <span>
                  <strong>{s.label}</strong>
                  <small>{s.handle}</small>
                </span>
                <Icon name="external" size={16} />
              </a>
            </li>
          {/each}
          <li>
            <span class="card static">
              <Icon name="pin" size={20} />
              <span>
                <strong>Oslo</strong>
                <small>{$t("stat_location")}</small>
              </span>
            </span>
          </li>
        </ul>

        <CvButton class="cv" />
      </div>
    </ScrollReveal>

    <ScrollReveal delay={120}>
      <form class="card form" method="POST" action="https://api.web3forms.com/submit" onsubmit={handleSubmit}>
        <h2>{$t("contact_form_title")}</h2>
        <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
        <input type="hidden" name="subject" value={MAIL_SUBJECT} />
        <input type="hidden" name="from_name" value="kavinlokeswaran.no" />
        <!-- Honeypot mot spam: skjult for mennesker -->
        <input type="checkbox" name="botcheck" class="honey" tabindex="-1" autocomplete="off" aria-hidden="true" />

        <div class="two">
          <label>
            <span>{$t("contact_firstname")}</span>
            <input name="Fornavn" type="text" autocomplete="given-name" required />
          </label>
          <label>
            <span>{$t("contact_lastname")}</span>
            <input name="Etternavn" type="text" autocomplete="family-name" />
          </label>
        </div>
        <label>
          <span>{$t("contact_email")}</span>
          <input name="email" type="email" autocomplete="email" placeholder={$t("contact_email_placeholder")} required />
        </label>
        <label>
          <span>{$t("contact_topic")}</span>
          <input name="Emne" type="text" placeholder={$t("contact_topic_placeholder")} />
        </label>
        <label>
          <span>{$t("contact_message")}</span>
          <textarea name="Melding" rows="6" placeholder={$t("contact_message_placeholder")} required></textarea>
        </label>
        <button class="btn btn-primary submit" type="submit" disabled={status === "sending"}>
          {status === "sending" ? $t("contact_sending") : $t("contact_submit")}
          {#if status !== "sending"}<Icon name="arrow" />{/if}
        </button>

        <p class="privacy">
          <Icon name="check" size={14} />
          <span>{$t("contact_privacy")} <a href="/privacy">{$t("contact_privacy_link")}</a></span>
        </p>

        <div aria-live="polite">
          {#if status === "success"}
            <p class="notice ok"><Icon name="check" size={18} /> <span>{$t("contact_success")}</span></p>
          {:else if status === "error"}
            <p class="notice err">
              {$t("contact_error")}
              <a href="mailto:{links.email}">{links.email}</a>
            </p>
          {/if}
        </div>
      </form>
    </ScrollReveal>
  </div>
</section>

<style>
  .page {
    padding: calc(var(--nav-h) + clamp(40px, 8vw, 90px)) 0 80px;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1.05fr;
    gap: clamp(32px, 6vw, 72px);
    align-items: start;
  }
  h1 {
    font-size: clamp(2.4rem, 6vw, 4rem);
    margin: 10px 0 14px;
  }
  .email {
    margin-top: 32px;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 20px;
    flex-wrap: wrap;
  }
  .e-icon {
    width: 46px;
    height: 46px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, var(--brand), var(--brand-2));
    color: #fff;
  }
  .e-text {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  .label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-faint);
  }
  .e-text a {
    color: var(--text);
    font-family: var(--font-head);
    font-weight: 600;
    font-size: 1rem;
    text-decoration: none;
    overflow-wrap: anywhere;
  }
  .e-text a:hover {
    color: var(--accent);
  }
  .hint {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--text-faint);
    font-size: 0.8rem;
    margin-top: 2px;
  }
  .copy {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-muted);
    border-radius: 999px;
    padding: 8px 14px;
    font: 500 0.85rem var(--font-body);
    cursor: pointer;
  }
  .copy:hover {
    color: var(--text);
    border-color: var(--border-strong);
  }
  .social {
    list-style: none;
    padding: 0;
    margin: 16px 0 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .social .card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    color: var(--text);
    text-decoration: none;
    border-radius: 14px;
  }
  .social a.card:hover {
    border-color: var(--border-strong);
    transform: translateY(-2px);
  }
  .social .card > :global(svg:first-child) {
    color: var(--accent);
  }
  .social .card > span {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    line-height: 1.3;
  }
  .social small {
    color: var(--text-faint);
    font-size: 0.8rem;
  }
  .social .card > :global(svg:last-child) {
    color: var(--text-faint);
  }

  .intro :global(.cv) {
    margin-top: 16px;
  }
  .form {
    padding: clamp(22px, 4vw, 36px);
    display: grid;
    gap: 16px;
  }
  .form h2 {
    font-size: 1.4rem;
    margin-bottom: 4px;
  }
  .two {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  label {
    display: grid;
    gap: 6px;
  }
  label span {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-muted);
  }
  input,
  textarea {
    font: inherit;
    font-size: 0.97rem;
    color: var(--text);
    background: var(--input-bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
    width: 100%;
  }
  input::placeholder,
  textarea::placeholder {
    color: var(--text-faint);
  }
  input:focus,
  textarea:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(111, 163, 255, 0.2);
  }
  textarea {
    resize: vertical;
    min-height: 140px;
  }
  .honey {
    display: none;
  }
  .submit {
    justify-self: start;
    margin-top: 4px;
  }
  .privacy {
    display: flex;
    gap: 8px;
    align-items: baseline;
    color: var(--text-faint);
    font-size: 0.84rem;
  }
  .privacy a {
    color: var(--accent);
  }
  .submit:disabled {
    opacity: 0.7;
    cursor: progress;
    transform: none;
  }
  .notice {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding: 12px 14px;
    border-radius: var(--radius-sm);
    font-size: 0.93rem;
  }
  .notice.ok {
    flex-wrap: nowrap;
    color: var(--on-success);
    background: var(--success-bg);
    border: 1px solid var(--success-border);
  }
  .notice.err {
    color: var(--danger);
    background: var(--danger-bg);
    border: 1px solid var(--danger-border);
  }
  .notice a {
    color: inherit;
    font-weight: 600;
  }
  @media (max-width: 900px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 520px) {
    .two,
    .social {
      grid-template-columns: 1fr;
    }
    .submit {
      justify-self: stretch;
    }
  }
</style>
