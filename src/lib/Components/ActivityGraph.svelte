<script>
  // GitHub-aktivitet siste år som en kalender (samme idé som på GitHub-profilen).
  // Dataene hentes ved build (scripts/fetch-contributions.mjs), så grafen er med i den
  // ferdige HTML-en og besøkende kontakter ikke GitHub for å se den.
  import { onMount } from "svelte";
  import { t, locale } from "$lib/i18n";
  import data from "$lib/data/contributions.json";
  import { githubStats } from "$lib/data/profile.js";

  const STEP = 14; // cellestørrelse + mellomrom
  const CELL = 11;
  const LEFT = 30; // plass til ukedager
  const TOP = 18; // plass til måneder

  const days = data.days.map((d) => ({ ...d, time: Date.parse(d.date + "T00:00:00Z") }));

  // Uker starter på mandag (norsk kalender)
  const weekday = (d) => (new Date(d.time).getUTCDay() + 6) % 7;
  const firstMonday = days.length ? days[0].time - weekday(days[0]) * 86400000 : 0;
  const cells = days.map((d) => ({
    ...d,
    col: Math.floor((d.time - firstMonday) / (7 * 86400000)),
    row: weekday(d)
  }));
  const weeks = cells.length ? cells[cells.length - 1].col + 1 : 0;
  const width = LEFT + weeks * STEP;
  const height = TOP + 7 * STEP;

  // Nøkkeltall
  const activeDays = days.filter((d) => d.count > 0).length;
  const best = days.reduce((a, d) => (d.count > (a?.count ?? 0) ? d : a), null);
  const longest = days.reduce(
    (acc, d) => {
      const run = d.count > 0 ? acc.run + 1 : 0;
      return { run, max: Math.max(acc.max, run) };
    },
    { run: 0, max: 0 }
  ).max;

  const lang = $derived($locale === "no" ? "nb-NO" : "en-GB");
  const fmtMonth = $derived(new Intl.DateTimeFormat(lang, { month: "short", timeZone: "UTC" }));
  const fmtDay = $derived(new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }));
  const fmtMonthLong = $derived(new Intl.DateTimeFormat(lang, { month: "long", year: "numeric", timeZone: "UTC" }));

  // Månedsetiketter der en ny måned starter (hopper over hvis for tett på forrige)
  const monthLabels = $derived.by(() => {
    const out = [];
    let lastMonth = -1;
    for (const c of cells) {
      const m = new Date(c.time).getUTCMonth();
      if (m !== lastMonth && c.row === 0 && new Date(c.time).getUTCDate() <= 7) {
        if (!out.length || c.col - out[out.length - 1].col >= 3) out.push({ col: c.col, label: fmtMonth.format(c.time).replace(".", "") });
        lastMonth = m;
      }
    }
    return out;
  });

  // Summer per måned – til tabellvisningen for skjermlesere
  const perMonth = $derived.by(() => {
    const map = new Map();
    for (const d of days) {
      const key = d.date.slice(0, 7);
      map.set(key, (map.get(key) ?? 0) + d.count);
    }
    return [...map].map(([key, count]) => ({ label: fmtMonthLong.format(Date.parse(key + "-01T00:00:00Z")), count }));
  });

  const weekdayLabels = $derived($locale === "no" ? ["Man", "", "Ons", "", "Fre", "", ""] : ["Mon", "", "Wed", "", "Fri", "", ""]);

  const countText = (n) => (n === 0 ? $t("activity_none") : `${n} ${n === 1 ? $t("activity_one") : $t("activity_many")}`);

  /** @type {{ x: number, y: number, text: string, date: string } | null} */
  let tip = $state(null);
  /** @type {HTMLDivElement | undefined} */
  let scroller = $state();
  /** @type {HTMLElement | undefined} */
  let figure = $state();

  function show(event, c) {
    const box = figure.getBoundingClientRect();
    const r = event.currentTarget.getBoundingClientRect();
    tip = {
      x: Math.min(Math.max(r.left - box.left + r.width / 2, 70), box.width - 70),
      y: r.top - box.top,
      text: countText(c.count),
      date: fmtDay.format(c.time)
    };
  }

  // På smale skjermer: start med den nyeste aktiviteten synlig
  onMount(() => {
    if (scroller) scroller.scrollLeft = scroller.scrollWidth;
  });
</script>

{#if days.length && data.total >= githubStats.minContributions}
  <figure class="card activity" bind:this={figure}>
    <figcaption class="head">
      <div>
        <h3>{$t("activity_title")}</h3>
        <p>{$t("activity_lead")}</p>
      </div>
      <dl class="stats">
        <div><dt>{data.total}</dt><dd>{$t("activity_total")}</dd></div>
        <div><dt>{activeDays}</dt><dd>{$t("activity_active_days")}</dd></div>
        <div><dt>{longest}</dt><dd>{$t("activity_streak")}</dd></div>
      </dl>
    </figcaption>

    <div class="scroller" bind:this={scroller} onscroll={() => (tip = null)}>
      <svg
        viewBox="0 0 {width} {height}"
        style:min-width="{width}px"
        role="img"
        aria-label="{$t('activity_title')}: {data.total} {$t('activity_total')}, {activeDays} {$t('activity_active_days')}"
      >
        {#each monthLabels as m}
          <text x={LEFT + m.col * STEP} y="10" class="lbl">{m.label}</text>
        {/each}
        {#each weekdayLabels as w, i}
          {#if w}<text x="0" y={TOP + i * STEP + 9} class="lbl">{w}</text>{/if}
        {/each}
        {#each cells as c (c.date)}
          <rect
            x={LEFT + c.col * STEP}
            y={TOP + c.row * STEP}
            width={CELL}
            height={CELL}
            rx="2.5"
            class="cell l{c.level}"
            role="presentation"
            onmouseenter={(e) => show(e, c)}
            onmouseleave={() => (tip = null)}
          />
        {/each}
      </svg>
    </div>

    {#if tip}
      <div class="tip" style:left="{tip.x}px" style:top="{tip.y}px" aria-hidden="true">
        <strong>{tip.text}</strong>
        <span>{tip.date}</span>
      </div>
    {/if}

    <div class="foot">
      <span class="muted">
        {#if best && best.count > 0}
          {$t("activity_best")}: {countText(best.count)} · {fmtDay.format(Date.parse(best.date + "T00:00:00Z"))}
        {/if}
      </span>
      <span class="legend" aria-hidden="true">
        {$t("activity_less")}
        {#each [0, 1, 2, 3, 4] as l}<span class="swatch l{l}"></span>{/each}
        {$t("activity_more")}
      </span>
    </div>

    <table class="sr-only">
      <caption>{$t("activity_table")}</caption>
      <thead><tr><th scope="col">{$t("activity_month")}</th><th scope="col">{$t("activity_total")}</th></tr></thead>
      <tbody>
        {#each perMonth as m}
          <tr><th scope="row">{m.label}</th><td>{m.count}</td></tr>
        {/each}
      </tbody>
    </table>
  </figure>
{/if}

<style>
  .activity {
    position: relative;
    margin: 0 0 22px;
    padding: 24px;
  }
  .head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 16px 32px;
    flex-wrap: wrap;
    margin-bottom: 18px;
  }
  h3 {
    font-size: 1.15rem;
    margin-bottom: 4px;
  }
  .head p {
    color: var(--text-muted);
    font-size: 0.92rem;
  }
  .stats {
    display: flex;
    gap: 28px;
    margin: 0;
  }
  .stats dt {
    font-family: var(--font-head);
    font-size: 1.4rem;
    font-weight: 600;
    line-height: 1.1;
    color: var(--text);
  }
  .stats dd {
    margin: 0;
    font-size: 0.8rem;
    color: var(--text-faint);
  }
  .scroller {
    overflow-x: auto;
    padding-bottom: 4px;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
  .lbl {
    fill: var(--text-faint);
    font-family: var(--font-body);
    font-size: 10px;
  }
  .cell {
    transition: opacity 0.15s ease;
  }
  .cell:hover {
    stroke: var(--text);
    stroke-width: 1.5;
  }
  .l0 {
    fill: var(--heat-0);
    background: var(--heat-0);
  }
  .l1 {
    fill: var(--heat-1);
    background: var(--heat-1);
  }
  .l2 {
    fill: var(--heat-2);
    background: var(--heat-2);
  }
  .l3 {
    fill: var(--heat-3);
    background: var(--heat-3);
  }
  .l4 {
    fill: var(--heat-4);
    background: var(--heat-4);
  }
  .tip {
    position: absolute;
    transform: translate(-50%, calc(-100% - 8px));
    pointer-events: none;
    background: var(--text);
    color: var(--bg);
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 0.8rem;
    line-height: 1.35;
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow);
    z-index: 2;
  }
  .tip span {
    opacity: 0.75;
  }
  .foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px 20px;
    flex-wrap: wrap;
    margin-top: 12px;
    font-size: 0.8rem;
    color: var(--text-faint);
  }
  .legend {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .swatch {
    width: 11px;
    height: 11px;
    border-radius: 2.5px;
  }
  .legend .swatch:first-of-type {
    margin-left: 4px;
  }
  .legend .swatch:last-of-type {
    margin-right: 4px;
  }
  @media (max-width: 600px) {
    .activity {
      padding: 18px;
    }
    .stats {
      gap: 20px;
    }
  }
</style>
