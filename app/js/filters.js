// Filters and the spoiler rule for the Leonida Trophy Guide.
// The spoiler rule: while it is on, a hidden trophy that is not earned yet shows
// neither its name nor its description — only its grade and that it is hidden.
export const KIND_LABELS = {
  story: 'Story',
  side: 'Side story',
  collectible: 'Collectible',
  activity: 'Activity',
  combat: 'Combat',
  exploration: 'Exploration',
  robbery: 'Robbery',
  economy: 'Money & property',
  misc: 'Other',
};

export function isSpoilerHidden(trophy, spoilersOn, earned) {
  return spoilersOn && trophy.hidden && !earned.has(trophy.name);
}

export function trophyMatches(trophy, filters, earned) {
  if (filters.chip === 'earned' && !earned.has(trophy.name)) return false;
  if (filters.chip === 'unearned' && earned.has(trophy.name)) return false;
  if (filters.chip === 'missable' && !trophy.missable) return false;
  if (filters.chip === 'story' && trophy.kind !== 'story') return false;
  if (filters.chip === 'collectible' && trophy.kind !== 'collectible') return false;
  if (filters.chip === 'activity' && trophy.kind !== 'activity') return false;
  if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.search) {
    const needle = filters.search.toLowerCase();
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export function applyFilters(trophies, filters, earned) {
  return trophies.filter((trophy) => trophyMatches(trophy, filters, earned));
}

export function gradeCounts(trophies, earned) {
  const counts = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const trophy of trophies) {
    counts[trophy.grade][1] += 1;
    if (earned.has(trophy.name)) counts[trophy.grade][0] += 1;
  }
  return counts;
}
