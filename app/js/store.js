// Saved progress for the Leonida Trophy Guide: localStorage, export and import.
// Progress is a set of official trophy names, stored as JSON under one key.
export const STORAGE_KEY = 'leonida-trophy-guide-v1';
export const EXPORT_APP = 'leonida-trophy-guide';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((name) => typeof name === 'string'));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort()));
}

export function downloadExport(earned) {
  const payload = {
    app: EXPORT_APP,
    game: 'Grand Theft Auto VI',
    platform: 'PlayStation 5',
    earned: [...earned].sort(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'leonida-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(url);
}

export function parseImportFile(text, knownNames) {
  const parsed = JSON.parse(text);
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('That file has no earned list in it.');
  const known = new Set(knownNames);
  const earned = new Set();
  for (const name of names) {
    if (typeof name !== 'string' || !known.has(name)) {
      throw new Error(`Unknown trophy in the file: ${String(name)}`);
    }
    earned.add(name);
  }
  return earned;
}

// Screenshot seeding: earn the first `count` trophies in list order, skipping
// the platinum, the final-mission gold and the 100% gold, which no real player
// earns that early.
export function seedEarned(trophies, count) {
  const earned = new Set();
  for (const trophy of trophies) {
    if (earned.size >= count) break;
    if (trophy.grade === 'platinum') continue;
    if (trophy.name === 'A Long Road') continue;
    if (trophy.name === 'You Gotta Know When to Get Off') continue;
    earned.add(trophy.name);
  }
  return earned;
}
