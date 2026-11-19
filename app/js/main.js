// Leonida Trophy Guide — boot: load the trophy list, restore saved progress,
// wire the filters, tabs, spoiler setting and export/import, and render.
// Screenshot helpers: ?seed=N earns the first N trophies when nothing is saved
// yet, ?view=roadmap|missable|sources opens a tab, ?select=<id> opens a trophy,
// and ?spoilers=off turns the spoiler setting off. They only set the first view.
import { downloadExport, loadEarned, parseImportFile, saveEarned, seedEarned } from './store.js';
import { renderChecklist, renderDetail, renderMissable, renderRoadmap, renderSources, updateProgress } from './views.js';

const data = await (await fetch('data/trophies.json')).json();
const params = new URLSearchParams(location.search);

const state = {
  earned: loadEarned(),
  view: 'checklist',
  selectedId: null,
  search: '',
  kind: 'all',
  grade: 'all',
  chip: 'all',
  spoilers: true,
};

if (state.earned.size === 0 && params.has('seed')) {
  const count = Number(params.get('seed'));
  if (Number.isInteger(count) && count > 0) {
    state.earned = seedEarned(data.trophies, Math.min(count, data.trophies.length));
    saveEarned(state.earned);
  }
}
if (params.get('spoilers') === 'off') state.spoilers = false;
if (params.get('spoilers') === 'on') state.spoilers = true;
if (['checklist', 'roadmap', 'missable', 'sources'].includes(params.get('view') ?? '')) {
  state.view = params.get('view');
}
const selectId = Number(params.get('select'));
if (Number.isInteger(selectId)) {
  const picked = data.trophies.find((trophy) => trophy.id === selectId);
  if (picked) state.selectedId = picked.name;
}
if (!state.selectedId) state.selectedId = data.trophies[0].name;

function render() {
  updateProgress(data, state.earned);
  document.getElementById('spoilers').checked = state.spoilers;
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('active', tab.dataset.view === state.view);
  }
  for (const view of document.querySelectorAll('.view')) {
    view.hidden = view.id !== `view-${state.view}`;
  }
  if (state.view === 'checklist') {
    renderChecklist(data, state, selectTrophy, toggleEarned);
    renderDetail(data, state, toggleEarned, selectTrophy);
  } else if (state.view === 'roadmap') {
    renderRoadmap(data, state, selectTrophy);
  } else if (state.view === 'missable') {
    renderMissable(data, state, selectTrophy);
  } else if (state.view === 'sources') {
    renderSources(data);
  }
}

function selectTrophy(name) {
  state.selectedId = name;
  state.view = 'checklist';
  render();
  document.getElementById('detailPane').scrollIntoView({ block: 'nearest' });
}

function toggleEarned(name, earned) {
  if (earned) state.earned.add(name);
  else state.earned.delete(name);
  saveEarned(state.earned);
  render();
}

for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => {
    state.view = tab.dataset.view;
    render();
  });
}

document.getElementById('search').addEventListener('input', (event) => {
  state.search = event.target.value.trim();
  render();
});
document.getElementById('kind').addEventListener('change', (event) => {
  state.kind = event.target.value;
  state.chip = 'all';
  syncChips();
  render();
});
document.getElementById('grade').addEventListener('change', (event) => {
  state.grade = event.target.value;
  render();
});

function syncChips() {
  for (const chip of document.querySelectorAll('.chip')) {
    chip.classList.toggle('active', chip.dataset.chip === state.chip);
  }
}

for (const chip of document.querySelectorAll('.chip')) {
  chip.addEventListener('click', () => {
    state.chip = chip.dataset.chip;
    syncChips();
    render();
  });
}

document.getElementById('spoilers').addEventListener('change', (event) => {
  state.spoilers = event.target.checked;
  render();
});

document.getElementById('exportBtn').addEventListener('click', () => {
  downloadExport(state.earned);
});

document.getElementById('importFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    state.earned = parseImportFile(await file.text(), data.trophies.map((trophy) => trophy.name));
    saveEarned(state.earned);
  } catch (error) {
    alert(`Could not import that file: ${error.message}`);
  }
  event.target.value = '';
  render();
});

render();
