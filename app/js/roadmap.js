// The roadmap to the platinum: five stages in the order to earn them, built from
// the official trophy descriptions. Each trophy carries its stage in trophies.json;
// the blurbs below say what each stage is for and what to watch in it.
export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Play the story',
    blurb: 'Chapters 1 to 4 and the final mission, in order. Every story trophy pops as you play — the only thing to do deliberately here is the Chapter 1 balcony meditation for Positive Mental Attitude, and to keep a manual save at the start of every chapter, because there is no mission replay.',
  },
  {
    stage: 2,
    title: 'Side stories and strangers',
    blurb: 'The five side-character finales (Andy, Kenton, Billy, Randy, Tyrone), Bret\'s hunting questline, and 8 stranger strands. They stay open after the story, but do them before the long grinds: the Chapter 3 race against Yago is time-sensitive, and Andy\'s, Billy\'s and Tyrone\'s strands do not count toward Strangers & Freaks.',
  },
  {
    stage: 3,
    title: 'Activities and skills',
    blurb: 'The 9 activity types, 250 stunts, 42 Shooting Range gold medals, 14 drone race locations, 20 race wins, 18 meditation spots and 50 Challenges. Sample every activity early for Master of None, then grind each one in turn — stunts and Challenges feed 100% completion too.',
  },
  {
    stage: 4,
    title: 'Robberies and the open world',
    blurb: 'Jewelry stores, bank vaults, armored trucks, illegal operations for all 9 gangs, 100 vehicles, 52 areas, card sets and WAiNK tags. Vaults open near the end of Chapter 4; the rest is free-roam cleanup that pairs well with exploring Leonida.',
  },
  {
    stage: 5,
    title: 'Money, property and the platinum',
    blurb: 'Launder $250,000 of Marked Bills, spend $100,000, buy all 8 garages, register 10 vehicles, and let the slow counters — 500 Criminal Profile actions and the odd one-off encounters — finish. Then check Progress, Stats, 100% Completion and sweep what is left. The platinum pops with the last trophy.',
  },
];

export function stageTrophies(trophies, stage) {
  return trophies.filter((trophy) => trophy.stage === stage);
}

export function nextUpTrophy(trophies, earned) {
  for (const stage of ROADMAP_STAGES) {
    for (const trophy of stageTrophies(trophies, stage.stage)) {
      if (!earned.has(trophy.name)) return { trophy, stage };
    }
  }
  return null;
}
