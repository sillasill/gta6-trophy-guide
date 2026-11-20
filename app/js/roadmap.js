// Roadmap and missables, built from the official descriptions alone:
// which story chapters and missions, which collectibles and counts, in
// what order. Stages are the guide's own structure; the trophy membership
// of each stage follows the descriptions in data/trophies.json.

export const ROADMAP_STAGES = [
  {
    number: 1,
    title: 'Play the story — Chapters 1 to 4 and the finale',
    blurb: 'Twelve trophies, all unmissable story progress: the opening mission, four chapter trophies, the final mission, and six named story missions. Just play the main missions in order. Do the Chapter 1 balcony meditation while you are there (see Missable trophies), and do not rush past the optional Chapter 4 mission behind Maximum Withdrawal.',
    stage: 1,
  },
  {
    number: 2,
    title: 'Side stories — strangers across Leonida',
    blurb: 'Seven trophies: five final missions for Andy, Kenton, Billy, Randy and Tyrone, the unique-animal hunt for Bret, and the silver for finishing 8 stranger strands. Stranger chains unlock as the story advances; one source warns their windows may be tied to story progress, so start each chain when it appears and finish it before moving far past its chapter.',
    stage: 2,
  },
  {
    number: 3,
    title: 'Open-world play — races, robberies and skills',
    blurb: 'Nineteen trophies: 250 stunts, the 9 activity types, 42 Shooting Range golds, drone races at 14 locations, 20 race wins, fishing, arcade, 50 challenges, the partner robberies, Combat Focus, the VCIA departure, the Rhino tank, the stealth jewelry robbery, 5 bank vaults, the armored truck, one illegal operation per gang, and the melee drive-by. Spread these through the story — most of them are easier with the map open and later story gear unlocked.',
    stage: 3,
  },
  {
    number: 4,
    title: 'Collect and explore — the slow burn',
    blurb: 'Fifteen trophies: 18 meditation spots (the one possibly missable set — do Chapter 1’s first), 3 card sets, WAiNK at 100 locations, 100 vehicles discovered, all 52 areas explored, 8 garages, 10 Scooter Bros registrations, $250,000 of Marked Bills laundered, $100,000 spent, and the five cryptic trophies whose methods are not yet verified. These climb while you do everything else; check the counters as you go.',
    stage: 4,
  },
  {
    number: 5,
    title: 'Cleanup — 100% and the platinum',
    blurb: 'Two trophies: A Long Road, the gold for 100% completion, then the platinum itself. The checklist wants more than the trophies do — 300 stunts, 30 race wins, 70 challenges, 15 card sets, 8 bank vaults — so finish the story first, then work the gaps the tracker shows. When A Long Road pops, Vice Got a Price! follows at once.',
    stage: 5,
  },
];

export function trophiesForStage(trophies, stageNumber) {
  return trophies.filter((trophy) => trophy.stage === stageNumber);
}

export function stageProgress(trophies, stageNumber, earnedIds) {
  const members = trophiesForStage(trophies, stageNumber);
  const done = members.filter((trophy) => earnedIds.includes(trophy.id)).length;
  return { done, total: members.length };
}

// The missable page: the one flagged trophy, plus the timing warnings the
// early guides attach to other trophies. Each warning names its source and
// says whether it is confirmed.
export const MISSABLE_NOTES = [
  {
    id: 28,
    verdict: 'Possibly missable — the only one the early guides flag.',
    note: 'GTABase and PowerPyx both report that the first meditation, Lucia’s on the balcony at Jason’s house in Chapter 1, disappears once that chapter ends — and both say it is unconfirmed whether that spot is required for the trophy. Do it in Chapter 1 to be safe, and keep a manual save at the start of every chapter. The two sources also disagree on the total: 18 spots (GTABase) against 15 on the 100% checklist (Press-Start).',
  },
  {
    id: 25,
    verdict: 'Timing warning — unconfirmed, single source.',
    note: 'TechWiser reports that the stranger mission chains behind the side-character finals have windows linked to story progress. Only one source gives that warning, so this guide treats it as a caution: begin each stranger chain as soon as it unlocks and finish it promptly.',
  },
  {
    id: 40,
    verdict: 'Chapter-gated, not missable — do it in Chapter 4.',
    note: 'Maximum Withdrawal needs the optional Chapter 4 mission “That’s Where The Money Is…”. It is optional, so it is easy to walk past — play it before you finish Chapter 4.',
  },
  {
    id: 7,
    verdict: 'Point of no return — keep a save.',
    note: 'There is no mission replay, so keep a manual save before the final mission. After the credits the open world stays available, but a chapter-start save is cheap insurance for anything the guides have not yet confirmed.',
  },
];
