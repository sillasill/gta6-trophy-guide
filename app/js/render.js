// Rendering: the checklist, the detail pane, the roadmap, the missable
// page and the sources page. All DOM is built with text nodes and
// createElement — no innerHTML from data — so a trophy name can never
// become markup.

import { GRADE_LABELS, KIND_LABELS, spoilerHides, visibleTrophies } from './filters.js';
import { MISSABLE_NOTES, ROADMAP_STAGES, stageProgress, trophiesForStage } from './roadmap.js';
import { isEarned } from './store.js';

const HIDDEN_NAME = 'Hidden trophy';
const HIDDEN_DESC = 'Hidden on PlayStation until earned — reveal it by earning it, or turn spoilers off.';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function gradeTag(trophy) {
  return el('span', `tag tag-${trophy.grade}`, GRADE_LABELS[trophy.grade]);
}

function formatCount(trophy) {
  if (trophy.count === null || trophy.count === undefined) return null;
  return trophy.count.toLocaleString('en-US');
}

export function renderProgress(trophies, save) {
  const earned = save.earned.length;
  document.getElementById('earnedCount').textContent = String(earned);
  const pct = Math.round((earned / trophies.length) * 100);
  document.getElementById('progressFill').style.width = `${pct}%`;
  const note = document.getElementById('progressNote');
  if (earned === 0) note.textContent = 'Nothing earned yet — start with the story.';
  else if (earned === trophies.length) note.textContent = 'Platinum earned. You are a Leonida Legend.';
  else if (earned < 12) note.textContent = `${earned} down — the story stages are the fastest early wins.`;
  else if (earned < 40) note.textContent = `${earned} down — work the open-world stages between missions.`;
  else note.textContent = `${earned} down — cleanup is in sight. Check the roadmap for what is left.`;
}

export function renderList(trophies, save, selectedId, onSelect) {
  const list = document.getElementById('trophyList');
  list.replaceChildren();
  const visible = visibleTrophies(trophies, save);
  const meta = document.getElementById('listMeta');
  if (save.kind === 'online') {
    meta.textContent = 'No online trophies — all 55 are single-player and offline.';
  } else {
    meta.textContent = `Showing ${visible.length} of ${trophies.length} trophies · ${save.earned.length} earned · ${trophies.filter((t) => t.hidden).length} hidden on PlayStation · ${trophies.filter((t) => t.missable).length} flagged missable.`;
  }
  if (visible.length === 0) {
    const empty = el('div', 'empty-list', 'Nothing matches these filters. Try clearing the search or choosing another kind or grade.');
    list.appendChild(empty);
    return;
  }
  for (const trophy of visible) {
    const earned = isEarned(save, trophy.id);
    const hidden = spoilerHides(trophy, save);
    const row = el('button', 'trophy-row' + (earned ? ' is-earned' : '') + (trophy.id === selectedId ? ' is-selected' : ''));
    row.type = 'button';
    row.setAttribute('role', 'listitem');
    row.addEventListener('click', () => onSelect(trophy.id));

    const check = el('span', 'trophy-check', earned ? '✓' : '');
    check.setAttribute('aria-hidden', 'true');
    row.appendChild(check);

    const body = el('div');
    body.appendChild(el('div', 'trophy-name', hidden ? HIDDEN_NAME : trophy.name));
    body.appendChild(el('div', 'trophy-desc', hidden ? HIDDEN_DESC : trophy.description));
    const tags = el('div', 'trophy-tags');
    tags.appendChild(gradeTag(trophy));
    if (trophy.missable) tags.appendChild(el('span', 'tag tag-missable', 'Missable'));
    if (trophy.hidden) tags.appendChild(el('span', 'tag tag-hidden', 'Hidden on PSN'));
    tags.appendChild(el('span', 'tag tag-kind', KIND_LABELS[trophy.kind] ?? trophy.kind));
    body.appendChild(tags);
    row.appendChild(body);

    const count = formatCount(trophy);
    const side = el('div', 'trophy-count');
    if (count !== null) {
      const b = el('b', null, count);
      side.appendChild(b);
      side.appendChild(document.createTextNode(' target'));
    } else {
      side.textContent = `#${trophy.id}`;
    }
    row.appendChild(side);
    list.appendChild(row);
  }
}

export function renderDetail(trophies, dataSources, save, selectedId, onToggleEarned) {
  const pane = document.getElementById('detailPane');
  pane.replaceChildren();
  const trophy = trophies.find((t) => t.id === selectedId);
  if (!trophy) {
    pane.appendChild(el('p', 'detail-empty', 'Pick a trophy from the list to see its guide and sources.'));
    return;
  }
  const earned = isEarned(save, trophy.id);
  const hidden = spoilerHides(trophy, save);
  const tags = el('div', 'trophy-tags');
  tags.appendChild(gradeTag(trophy));
  if (trophy.missable) tags.appendChild(el('span', 'tag tag-missable', 'Missable'));
  if (trophy.hidden) tags.appendChild(el('span', 'tag tag-hidden', 'Hidden on PSN'));
  tags.appendChild(el('span', 'tag tag-kind', KIND_LABELS[trophy.kind] ?? trophy.kind));
  pane.appendChild(tags);
  pane.appendChild(el('h2', null, hidden ? HIDDEN_NAME : trophy.name));
  pane.appendChild(el('p', 'official', hidden ? HIDDEN_DESC : trophy.description));
  const officialLabel = el('p', 'official-label', 'Official description');
  pane.insertBefore(officialLabel, pane.children[2] ?? null);

  const guide = el('div', 'guide-text');
  for (const paragraph of trophy.guide.split('\n')) {
    guide.appendChild(el('p', null, paragraph));
  }
  pane.appendChild(guide);

  if (/not yet (known|verified)|unconfirmed|single-source|single source|guess/i.test(trophy.guide)) {
    pane.appendChild(el('p', 'unverified', 'Honesty note: part of this guide is not yet verified in the game — the guide says where, and names the source of the guess.'));
  }

  const sources = el('div', 'sources');
  sources.appendChild(el('h4', null, 'Sources'));
  const list = el('ul');
  for (const name of trophy.sources) {
    const item = el('li');
    const match = (dataSources || []).find((s) => name.startsWith(s.label.split(' — ')[0]));
    if (match) {
      const link = el('a', null, match.label);
      link.href = match.url;
      link.target = '_blank';
      link.rel = 'noopener';
      item.appendChild(link);
      if (name.includes('(')) item.appendChild(document.createTextNode(` — ${name.slice(name.indexOf('('))}`));
    } else {
      item.textContent = name;
    }
    list.appendChild(item);
  }
  sources.appendChild(list);
  pane.appendChild(sources);

  const toggle = el('button', 'btn earned-toggle', earned ? '✓ Earned — click to unmark' : 'Mark as earned');
  toggle.type = 'button';
  toggle.addEventListener('click', () => onToggleEarned(trophy.id));
  pane.appendChild(toggle);
}

export function renderRoadmap(trophies, save) {
  const host = document.getElementById('roadmapStages');
  host.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const members = trophiesForStage(trophies, stage.stage);
    const progress = stageProgress(trophies, stage.stage, save.earned);
    const card = el('article', 'stage');
    const head = el('div', 'stage-head');
    head.appendChild(el('h3', null, `Stage ${stage.number} — ${stage.title}`));
    head.appendChild(el('span', 'stage-progress', `${progress.done} of ${progress.total} earned`));
    card.appendChild(head);
    card.appendChild(el('p', null, stage.blurb));
    const list = el('ol');
    for (const trophy of members) {
      const item = el('li', isEarned(save, trophy.id) ? 'is-earned' : '');
      item.appendChild(el('span', 'stage-trophy-name', trophy.name));
      item.appendChild(document.createTextNode(' — '));
      item.appendChild(document.createTextNode(trophy.description));
      item.appendChild(document.createTextNode(' '));
      item.appendChild(el('span', 'stage-trophy-grade', `(${GRADE_LABELS[trophy.grade]})`));
      list.appendChild(item);
    }
    card.appendChild(list);
    host.appendChild(card);
  }
}

export function renderMissable(trophies) {
  const host = document.getElementById('missableList');
  host.replaceChildren();
  for (const note of MISSABLE_NOTES) {
    const trophy = trophies.find((t) => t.id === note.id);
    if (!trophy) continue;
    const card = el('article', 'missable-card' + (trophy.missable ? ' is-flagged' : ''));
    const tags = el('div', 'trophy-tags');
    tags.appendChild(gradeTag(trophy));
    if (trophy.missable) tags.appendChild(el('span', 'tag tag-missable', 'Missable'));
    card.appendChild(tags);
    card.appendChild(el('h3', null, trophy.name));
    card.appendChild(el('p', 'verdict', note.verdict));
    card.appendChild(el('p', null, trophy.description));
    card.appendChild(el('p', null, note.note));
    host.appendChild(card);
  }
  const safe = el('p', 'fine-print', 'Everything else in the list is unmissable as far as the official descriptions and the early guides show: story trophies pop in order, activities and collectibles stay available after the story, and the open world remains open after the credits. If a later guide confirms another missable, this page will say so.');
  host.appendChild(safe);
}

export function renderSources(dataSources) {
  const host = document.getElementById('sourceCards');
  host.replaceChildren();
  const notes = {
    'Exophase': 'The official trophy list — all 55 names, descriptions and grades — as Exophase lists them. Every name and grade in this guide matches this list.',
    'PSNProfiles': 'The same 55, with PSN’s progress counts (0/42, 0/14, 0/18, 0/52 and the rest) and rarity. The two lists agree on every name, description and grade.',
    'EGamers.io': 'The launch-week list that gathers the early guides’ tips — GTABase and PowerPyx — and marks which trophies are hidden, which are possibly missable, and which methods are still unconfirmed.',
    'Output Lag': 'A second launch-week list, used for the manual-save advice and the missable warning: keep a save at the start of every chapter, since there is no mission replay.',
  };
  for (const source of dataSources || []) {
    const card = el('div', 'source-card');
    const link = el('a', null, source.label);
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener';
    const title = el('h4');
    title.appendChild(link);
    card.appendChild(title);
    const key = Object.keys(notes).find((k) => source.label.startsWith(k));
    card.appendChild(el('p', null, key ? notes[key] : 'A source this guide cites.'));
    host.appendChild(card);
  }
}
