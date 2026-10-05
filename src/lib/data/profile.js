// Alt personlig innhold samlet på ett sted – endre her, så oppdateres hele siden.

export const GITHUB_USER = "KavinLokeswaran";

export const links = {
  email: "contact@kavinlokeswaran.no",
  github: `https://github.com/${GITHUB_USER}`,
  // Tom = skjult overalt. Instagram er tatt bort for å holde siden profesjonell.
  instagram: "",
  linkedin: "https://www.linkedin.com/in/kavin-lokeswaran/",
  site: "https://kavinlokeswaran.no"
};

// CV som PDF per språk (filene ligger i static/cv/). Knappene viser den som passer valgt språk.
// Ny versjon: eksporter Word-filen til PDF og erstatt filen med samme navn.
export const cv = {
  no: { href: "/cv/CV_Kavin_Lokeswaran_NO.pdf", file: "CV_Kavin_Lokeswaran.pdf" },
  en: { href: "/cv/CV_Kavin_Lokeswaran_EN.pdf", file: "CV_Kavin_Lokeswaran_EN.pdf" }
};

// Web3Forms tilgangsnøkkel for kontaktskjemaet (https://web3forms.com).
// Nøkkelen er laget for å ligge offentlig i nettsiden – den kan bare brukes til å
// sende skjemaer til din e-post. Du kan lage en ny i Web3Forms-dashbordet ved behov.
export const WEB3FORMS_KEY = "f12fe63f-5ca8-48e0-b345-65bf4353e21a";

/** Ferdigheter gruppert slik rekrutterere skanner dem. level: 1–3 (lærer / komfortabel / sterk) */
export const skills = [
  {
    key: "frontend",
    items: [
      { name: "HTML", level: 3 },
      { name: "CSS", level: 3 },
      { name: "JavaScript", level: 3 },
      { name: "Svelte / SvelteKit", level: 2 },
      { name: "Responsivt design", level: 2 }
    ]
  },
  {
    key: "backend",
    items: [
      { name: "Node.js", level: 2 },
      { name: "Express", level: 2 },
      { name: "REST-API-er", level: 2 },
      { name: "Innlogging / sessions", level: 1 }
    ]
  },
  {
    key: "programming",
    items: [
      { name: "Python", level: 3 },
      { name: "Pygame", level: 2 },
      { name: "OOP", level: 2 }
    ]
  },
  {
    key: "tools",
    items: [
      { name: "Git & GitHub", level: 2 },
      { name: "GitHub Actions", level: 1 },
      { name: "VS Code", level: 3 }
    ]
  }
];

export const education = [
  { key: "bachelor", current: true },
  { key: "elvebakken" }
];

// GitHub-tall (aktivitetsgraf) vises først når de er høye nok til å gjøre et godt inntrykk.
// Senk eller fjern grensen når du vil vise dem.
export const githubStats = { minContributions: 150 };
