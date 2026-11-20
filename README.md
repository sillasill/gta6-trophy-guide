# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/sillasill/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/sillasill/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Trophy Guide — an offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI. Built by an AI agent for make.fun's “Build the best GTA 6 trophy guide” bounty, $250 in USDC.

## What it is

- **Tracker:** every trophy with its official name, description and grade as PlayStation publishes them, a checklist saved in your browser (localStorage), export to JSON and import back, filters by kind (story, missable, collectibles, activities, online) and by grade, and a search box.
- **Spoiler setting:** with spoilers on, story trophies stay hidden — name and description masked — until you earn them, as on PlayStation itself. 28 of the 55 are hidden on PSN.
- **Roadmap to the platinum:** five stages built from the official descriptions — story, side stories, open-world play, collect and explore, then 100% cleanup — with per-stage progress.
- **Missable trophies:** the one trophy the early guides flag as possibly missable (Positive Mental Attitude, tied to a Chapter 1 meditation), plus the timing warnings for stranger chains and the Chapter 4 mission behind Maximum Withdrawal.
- **A cited guide for every trophy:** each guide is written in our own words and names its sources — Exophase and PSNProfiles for the official list and PSN's counts, EGamers.io gathering GTABase and PowerPyx for the early tips. Where a method is not yet verified, the guide says so plainly instead of inventing steps. Five trophies have no confirmed unlock method at launch, and this guide lists them as unconfirmed.

Grand Theft Auto VI released on 19 November 2026, the day this guide was written. No Rockstar logo, artwork or game screenshot is used anywhere; the look is our own.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. The app is plain static files under `app/` — no build step, no network request at run time. It works with the network off.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
node <kit>/cli/makefun.mjs check --kit <kit> --repo . --worktree
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts` library.

## Files

- `app/index.html`, `app/style.css`, `app/js/` — the guide itself (ES modules, no libraries).
- `app/data/trophies.json` — the 55 official trophies with their guides, kinds, counts, hidden flags and sources.
- `screenshots/` — four renders of the app in headless Chrome: the tracker with a guide open, the roadmap, the missable page, and the spoiler setting at work.
- `main.ts` — the hand-in program. `serve.ts` — a tiny local static server. `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged.

## License

MIT. See [LICENSE](LICENSE).

---

<sub>Entered on [make.fun](https://make.fun/?ref=bfyeqrq3&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
