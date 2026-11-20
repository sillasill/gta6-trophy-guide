// Boot: load the trophy data, restore the save, wire the toolbar and the
// tabs, and render. The app fetches only its own data/trophies.json and
// makes no other request, so it works with the network off.

import { loadSave, writeSave, toggleEarned, exportSave, parseImportedFile } from './store.js';
import { renderProgress, renderList, renderDetail, renderRoadmap, renderMissable, renderSources } from './render.js';

const VIEWS = ['tracker', 'roadmap', 'missable', 'sources'];

let trophies = [];
let dataSources = [];
let save = loadSave();
let selectedId = null;

function renderAll() {
  renderProgress(trophies, save);
  renderList(trophies, save, selectedId, selectTrophy);
  renderDetail(trophies, dataSources, save, selectedId, onToggleEarned);
  renderRoadmap(trophies, save);
  renderMissable(trophies);
}

function selectTrophy(id) {
  selectedId = id;
  renderList(trophies, save, selectedId, selectTrophy);
  renderDetail(trophies, dataSources, save, selectedId, onToggleEarned);
  document.getElementById('detailPane').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function onToggleEarned(id) {
  save = toggleEarned(save, id);
  renderAll();
}

function showView(name) {
  for (const view of VIEWS) {
    document.getElementById(`view-${view}`).classList.toggle('is-visible', view === name);
  }
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('is-active', tab.dataset.view === name);
  }
  window.location.hash = `/${name}`;
}

function readViewFromHash() {
  const name = window.location.hash.replace(/^#\/?/, '');
  return VIEWS.includes(name) ? name : 'tracker';
}

function syncToolbarFromSave() {
  document.getElementById('searchBox').value = save.query;
  document.getElementById('kindFilter').value = save.kind;
  document.getElementById('gradeFilter').value = save.grade;
  document.getElementById('spoilerToggle').checked = save.spoilers;
  document.getElementById('earnedOnlyToggle').checked = save.earnedOnly;
}

async function boot() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error(`Could not load data/trophies.json (${response.status}).`);
  const data = await response.json();
  trophies = data.trophies;
  dataSources = data.sources || [];
  if (!Array.isArray(trophies) || trophies.length === 0) throw new Error('No trophies in data/trophies.json.');
  selectedId = trophies[0].id;

  syncToolbarFromSave();
  renderSources(dataSources);
  renderAll();
  showView(readViewFromHash());

  document.getElementById('searchBox').addEventListener('input', (event) => {
    save = { ...save, query: event.target.value };
    writeSave(save);
    renderList(trophies, save, selectedId, selectTrophy);
  });
  document.getElementById('kindFilter').addEventListener('change', (event) => {
    save = { ...save, kind: event.target.value };
    writeSave(save);
    renderList(trophies, save, selectedId, selectTrophy);
  });
  document.getElementById('gradeFilter').addEventListener('change', (event) => {
    save = { ...save, grade: event.target.value };
    writeSave(save);
    renderList(trophies, save, selectedId, selectTrophy);
  });
  document.getElementById('spoilerToggle').addEventListener('change', (event) => {
    save = { ...save, spoilers: event.target.checked };
    writeSave(save);
    renderList(trophies, save, selectedId, selectTrophy);
    renderDetail(trophies, dataSources, save, selectedId, onToggleEarned);
  });
  document.getElementById('earnedOnlyToggle').addEventListener('change', (event) => {
    save = { ...save, earnedOnly: event.target.checked };
    writeSave(save);
    renderList(trophies, save, selectedId, selectTrophy);
  });
  document.getElementById('exportBtn').addEventListener('click', () => exportSave(save));
  document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
  document.getElementById('importFile').addEventListener('change', async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      const earned = parseImportedFile(await file.text());
      const kept = earned.filter((id) => trophies.some((t) => t.id === id));
      save = { ...save, earned: kept };
      writeSave(save);
      renderAll();
    } catch (error) {
      window.alert(`Could not import that file: ${error.message}`);
    }
    event.target.value = '';
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!window.confirm('Clear all earned trophies and reset the filters?')) return;
    save = { ...save, earned: [] };
    writeSave(save);
    renderAll();
  });
  for (const tab of document.querySelectorAll('.tab')) {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  }
  window.addEventListener('hashchange', () => showView(readViewFromHash()));
}

boot().catch((error) => {
  const pane = document.getElementById('detailPane');
  if (pane) pane.textContent = `This guide could not load its trophy data: ${error.message}`;
});
