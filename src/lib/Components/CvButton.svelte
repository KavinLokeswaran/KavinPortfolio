<script>
  // Last ned CV på språket som er valgt på siden (norsk → norsk CV, engelsk → engelsk CV)
  import { t, locale } from "$lib/i18n";
  import { cv } from "$lib/data/profile.js";
  import Icon from "$lib/Components/Icon.svelte";

  let { variant = "ghost", class: className = "" } = $props();

  const file = $derived(cv[$locale] ?? cv.no);
</script>

<a
  class="btn btn-{variant} {className}"
  href={file.href}
  download={file.file}
  type="application/pdf"
  hreflang={$locale === "en" ? "en" : "nb"}
  title={$t("cv_meta")}
>
  <Icon name="download" />
  {$t("cv_download")}
</a>
