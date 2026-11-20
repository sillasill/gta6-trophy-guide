// Save store: progress and settings live in localStorage only, on this
// browser, under one key. Nothing is sent anywhere. Export writes a JSON
// file the reader can keep; import reads one back.

export const SAVE_KEY = 'leonida-trophy-guide-v1';

export function blankSave() {
  return { version: 1, earned: [], spoilers: true, kind: 'all', grade: 'all', query: '', earnedOnly: false };
}

export function loadSave() {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return blankSave();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return blankSave();
    const save = blankSave();
    if (Array.isArray(parsed.earned)) save.earned = parsed.earned.filter((id) => Number.isInteger(id));
    if (typeof parsed.spoilers === 'boolean') save.spoilers = parsed.spoilers;
    if (typeof parsed.kind === 'string') save.kind = parsed.kind;
    if (typeof parsed.grade === 'string') save.grade = parsed.grade;
    if (typeof parsed.query === 'string') save.query = parsed.query;
    if (typeof parsed.earnedOnly === 'boolean') save.earnedOnly = parsed.earnedOnly;
    return save;
  } catch {
    return blankSave();
  }
}

export function writeSave(save) {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    // Private mode or a full store: the checklist still works for the visit.
  }
}

export function isEarned(save, id) {
  return save.earned.includes(id);
}

export function toggleEarned(save, id) {
  const next = { ...save, earned: [...save.earned] };
  const at = next.earned.indexOf(id);
  if (at === -1) next.earned.push(id);
  else next.earned.splice(at, 1);
  writeSave(next);
  return next;
}

export function exportSave(save) {
  const blob = new Blob([JSON.stringify({ app: 'leonida-trophy-guide', version: 1, earned: save.earned }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'leonida-trophy-progress.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function parseImportedFile(text) {
  const parsed = JSON.parse(text);
  const ids = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(ids)) throw new Error('No earned list found in that file.');
  const earned = [...new Set(ids.filter((id) => Number.isInteger(id)))];
  return earned;
}
