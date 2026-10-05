import { GITHUB_USER } from "./profile.js";

// Håndplukkede prosjekter. Bare prosjekter med OFFENTLIG repo på GitHub skal ligge her.
// Alle andre offentlige repoer hentes automatisk (se src/lib/github.js), så du trenger
// bare legge til et prosjekt her hvis du vil fremheve det med bilde og egen tekst.
//
// repo     – navnet på det offentlige repoet på GitHub (brukes til lenke og for å unngå duplikater)
// featured – vises på forsiden
// status   – "done" | "in_progress"
// text     – { no, en } kort beskrivelse: problem → hva du gjorde → resultat

export const curatedProjects = [
  {
    id: "portfolio",
    title: "Portefølje – kavinlokeswaran.no",
    repo: "KavinPortfolio",
    live: "https://kavinlokeswaran.no",
    image: "/img/portfolio.webp",
    tech: ["SvelteKit", "JavaScript", "CSS", "GitHub API", "GitHub Actions"],
    featured: true,
    status: "done",
    text: {
      no: "Personlig nettside bygget med SvelteKit. Tospråklig (norsk/engelsk), responsiv, og henter nye offentlige GitHub-repoer automatisk – så porteføljen aldri blir utdatert.",
      en: "Personal website built with SvelteKit. Bilingual (Norwegian/English), responsive, and automatically pulls in new public GitHub repositories so it never goes stale."
    }
  },
  {
    id: "spotify-lyrics",
    title: "Spotify Lyric Player",
    repo: "Spotify_lyric_player",
    tech: ["Python", "Tkinter", "Spotify Web API", "OAuth", "REST"],
    featured: true,
    status: "done",
    text: {
      no: "Desktop-app som viser sangteksten til det som spilles på Spotify, linje for linje i sanntid. Beregner selv hvor langt sangen har kommet, så teksten oppdateres 10 ganger i sekundet selv om Spotify bare spørres hvert 2. sekund.",
      en: "Desktop app that shows the lyrics of whatever is playing on Spotify, line by line in real time. It estimates playback position locally, so lyrics update 10 times per second even though Spotify is only queried every 2 seconds."
    }
  },
  {
    id: "fpl-picker",
    title: "FPL Player Picker",
    repo: "FPL_player_picker",
    tech: ["Python", "Flask", "pandas", "REST API", "HTML/CSS"],
    featured: true,
    status: "done",
    text: {
      no: "Flask-app som henter data fra Fantasy Premier League sitt API og anbefaler spillere ut fra budsjett, posisjon, form og hvor vanskelige de neste kampene er.",
      en: "Flask app that pulls data from the Fantasy Premier League API and recommends players based on budget, position, form and the difficulty of upcoming fixtures."
    }
  }
];

export const githubUrl = (repo) => (repo ? `https://github.com/${GITHUB_USER}/${repo}` : null);
