// Filters: kind, grade, search text, earned-only, and the spoiler rule.
// With spoilers on, a trophy that is hidden on PlayStation and not yet
// earned shows masked: its name and description stay hidden until it is
// earned, as on PlayStation itself. The platinum and the visible trophies
// are never masked.

export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
};

export const GRADE_LABELS = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

export function spoilerHides(trophy, save) {
  return save.spoilers && trophy.hidden && !save.earned.includes(trophy.id);
}

export function matchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  if (kind === 'online') return false; // No online trophies: all 55 are single-player.
  return trophy.kind === kind;
}

export function matchesGrade(trophy, grade) {
  return grade === 'all' || trophy.grade === grade;
}

export function matchesQuery(trophy, query) {
  if (!query) return true;
  const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word));
}

export function visibleTrophies(trophies, save) {
  return trophies.filter(
    (trophy) =>
      matchesKind(trophy, save.kind) &&
      matchesGrade(trophy, save.grade) &&
      matchesQuery(trophy, save.query) &&
      (!save.earnedOnly || save.earned.includes(trophy.id)),
  );
}

export function countByKind(trophies, kind) {
  if (kind === 'missable') return trophies.filter((t) => t.missable).length;
  if (kind === 'online') return 0;
  return trophies.filter((t) => t.kind === kind).length;
}
