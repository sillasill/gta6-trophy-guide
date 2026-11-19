# Leonida Trophy Guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/sillasill/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/sillasill/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Trophy Guide is an offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: every trophy with its official name, description and grade, a guide in our own words that cites its sources, a checklist saved in the browser with export and import, filters by kind and grade, a spoiler setting that hides story trophies until they are earned, a roadmap to the platinum, and the missable trophies flagged. It runs from its own static files with the network off — no Rockstar logo, artwork or game screenshots, and no network request at run time.

The game released on 19 November 2026, the day this guide was written, so the guide is honest about what it knows: official names, descriptions, grades and PSN counts come from the trophy lists, specific places and steps come from first-day guides cited beside each trophy, and where no source has confirmed a method the guide says so instead of inventing one.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — tick trophies off as you earn them, export your progress, and follow the roadmap in order. Do the Chapter 1 balcony meditation for Positive Mental Attitude before Chapter 1 ends: it is the one trophy first-day guides flag as missable, and the game has no mission replay.

## What's inside

- `app/` — the guide: `index.html`, `style.css`, `js/` (boot, saved progress, filters, roadmap, views) and `app/data/trophies.json` with all 55 trophies, their official details, guides and sources.
- `screenshots/` — 4 renders of the guide running in a browser.
- `main.ts` — the entry program: copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json`.
- `serve.ts` — a tiny static server for trying the guide locally.

## Sources

- Exophase — GTA VI trophies: https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/
- PSNProfiles — GTA VI trophies: https://psnprofiles.com/trophies/43531-grand-theft-auto-vi
- Output Lag — GTA 6 Trophy List: https://outputlag.com/guides/gta-6-trophy-list/
- eGamers — GTA 6 Trophy List: https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/

---

<sub>Entered on [make.fun](https://make.fun/?ref=bfyeqrq3&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
