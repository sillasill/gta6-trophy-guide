// Rendering for the Leonida Trophy Guide: the checklist, the guide pane, the
// roadmap, the missable page and the sources page. Everything is built with
// textContent, so trophy text can never inject markup.
import { KIND_LABELS, applyFilters, gradeCounts, isSpoilerHidden } from './filters.js';
import { ROADMAP_STAGES, nextUpTrophy, stageTrophies } from './roadmap.js';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function gradePill(grade) {
  return el('span', `pill ${grade}`, grade);
}

function kindTag(kind) {
  return el('span', 'tag', KIND_LABELS[kind] ?? kind);
}

function countTag(trophy) {
  if (trophy.target === null || trophy.target === undefined) return null;
  const label = trophy.target >= 1000 ? `$${trophy.target.toLocaleString('en-US')}` : `${trophy.target}`;
  return el('span', 'tag count', `PSN counts to ${label}`);
}

export function updateProgress(data, earned) {
  document.getElementById('earnedCount').textContent = String(earned.size);
  document.getElementById('progressFill').style.width = `${(earned.size / data.trophies.length) * 100}%`;
  const counts = gradeCounts(data.trophies, earned);
  document.getElementById('gradeCounts').textContent =
    `Platinum ${counts.platinum[0]}/${counts.platinum[1]} · Gold ${counts.gold[0]}/${counts.gold[1]} · Silver ${counts.silver[0]}/${counts.silver[1]} · Bronze ${counts.bronze[0]}/${counts.bronze[1]}`;
  document.getElementById('missableBadge').textContent = String(
    data.trophies.filter((trophy) => trophy.missable && !earned.has(trophy.name)).length,
  );
}

export function renderChecklist(data, state, onSelect, onToggle) {
  const list = document.getElementById('trophyList');
  const filtered = applyFilters(data.trophies, state, state.earned);
  list.replaceChildren();
  document.getElementById('listMeta').textContent =
    `Showing ${filtered.length} of ${data.trophies.length} trophies · ${state.earned.size} earned`;
  if (filtered.length === 0) {
    list.append(el('li', 'empty-note', 'No trophies match these filters. Clear the search or pick another kind.'));
    return;
  }
  for (const trophy of filtered) {
    const hidden = isSpoilerHidden(trophy, state.spoilers, state.earned);
    const item = el('li', 'trophy-row');
    if (state.earned.has(trophy.name)) item.classList.add('earned');
    if (trophy.name === state.selectedId) item.classList.add('selected');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = state.earned.has(trophy.name);
    box.setAttribute('aria-label', `Mark ${hidden ? 'hidden trophy' : trophy.name} earned`);
    box.addEventListener('change', () => onToggle(trophy.name, box.checked));
    box.addEventListener('click', (event) => event.stopPropagation());
    item.append(box);
    item.append(el('span', `medal ${trophy.grade}`));
    const main = el('div', 'trophy-main');
    main.append(el('div', 'trophy-name', hidden ? 'Hidden trophy' : trophy.name));
    main.append(el('div', 'trophy-desc', hidden ? 'Hidden on PlayStation until earned.' : trophy.description));
    const tags = el('div', 'trophy-tags');
    tags.append(gradePill(trophy.grade));
    tags.append(kindTag(trophy.kind));
    if (trophy.hidden) tags.append(el('span', 'tag hidden-tag', 'Hidden on PSN'));
    if (trophy.missable) tags.append(el('span', 'tag missable', 'Missable'));
    const count = countTag(trophy);
    if (count) tags.append(count);
    main.append(tags);
    item.append(main);
    item.addEventListener('click', () => onSelect(trophy.name));
    list.append(item);
  }
}

export function renderDetail(data, state, onToggle, onSelect) {
  const pane = document.getElementById('detailPane');
  const trophy = data.trophies.find((entry) => entry.name === state.selectedId) ?? data.trophies[0];
  const hidden = isSpoilerHidden(trophy, state.spoilers, state.earned);
  pane.replaceChildren();
  pane.append(el('h2', undefined, hidden ? 'Hidden trophy' : trophy.name));
  pane.append(el('p', 'detail-official', hidden ? 'Hidden on PlayStation until earned.' : trophy.description));
  const meta = el('div', 'detail-meta');
  meta.append(gradePill(trophy.grade));
  meta.append(kindTag(trophy.kind));
  if (trophy.hidden) meta.append(el('span', 'tag hidden-tag', 'Hidden on PSN'));
  if (trophy.missable) meta.append(el('span', 'tag missable', 'Missable'));
  const count = countTag(trophy);
  if (count) meta.append(count);
  pane.append(meta);
  if (hidden) {
    pane.append(el('p', 'detail-guide', 'Earn this trophy to reveal its guide. The spoiler setting hides hidden story trophies until they are earned — turn it off above to peek.'));
  } else {
    if (trophy.guide.includes('No verified method')) {
      pane.append(el('p', 'unconfirmed', 'No verified method published yet (19 Nov 2026, launch day). What follows is the official description plus a first-day lead — treat the lead as unconfirmed, not as fact.'));
    }
    pane.append(el('p', 'detail-guide', trophy.guide));
    if (trophy.missable && trophy.missable_note) {
      const note = el('p', 'missable-note');
      note.append(el('strong', undefined, 'Missable: '));
      note.append(document.createTextNode(trophy.missable_note));
      pane.append(note);
    }
    if (trophy.story_locked) {
      pane.append(el('p', 'cite', 'Story-locked: the game has no mission replay, so keep a manual save at the start of every chapter.'));
    }
    const sources = el('div', 'sources');
    sources.append(el('h3', undefined, 'Sources'));
    const list = document.createElement('ul');
    for (const key of trophy.sources) {
      const source = data.sources[key];
      if (!source) continue;
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = source.label;
      item.append(link);
      list.append(item);
    }
    sources.append(list);
    pane.append(sources);
  }
  const actions = el('div', 'detail-actions');
  const earned = state.earned.has(trophy.name);
  const toggle = el('button', undefined, earned ? 'Mark as not earned' : 'Mark as earned');
  toggle.addEventListener('click', () => onToggle(trophy.name, !earned));
  actions.append(toggle);
  const index = data.trophies.indexOf(trophy);
  const prev = el('button', 'ghost', '← Previous');
  prev.addEventListener('click', () => onSelect(data.trophies[(index + data.trophies.length - 1) % data.trophies.length].name));
  const next = el('button', 'ghost', 'Next →');
  next.addEventListener('click', () => onSelect(data.trophies[(index + 1) % data.trophies.length].name));
  actions.append(prev, next);
  pane.append(actions);
}

export function renderRoadmap(data, state, onSelect) {
  const container = document.getElementById('roadmapStages');
  container.replaceChildren();
  const next = nextUpTrophy(data.trophies, state.earned);
  if (next) {
    const note = el('p', 'section-intro');
    note.append(document.createTextNode('Next up: '));
    const strong = el('strong', undefined, next.trophy.name);
    note.append(strong, document.createTextNode(` — stage ${next.stage.stage}, ${next.stage.title}: ${next.trophy.description}`));
    container.append(note);
  }
  for (const stage of ROADMAP_STAGES) {
    const trophies = stageTrophies(data.trophies, stage.stage);
    const done = trophies.filter((trophy) => state.earned.has(trophy.name)).length;
    const card = el('div', 'stage');
    const heading = el('h3');
    heading.append(el('span', 'stage-num', String(stage.stage)));
    heading.append(document.createTextNode(stage.title));
    card.append(heading);
    card.append(el('p', undefined, stage.blurb));
    const chips = el('div', 'stage-trophies');
    for (const trophy of trophies) {
      const chip = el('button', 'stage-trophy' + (state.earned.has(trophy.name) ? ' earned' : ''), '');
      chip.type = 'button';
      chip.append(gradePill(trophy.grade));
      chip.append(document.createTextNode(isSpoilerHidden(trophy, state.spoilers, state.earned) ? 'Hidden trophy' : trophy.name));
      chip.addEventListener('click', () => onSelect(trophy.name));
      chips.append(chip);
    }
    card.append(chips);
    card.append(el('p', 'stage-progress', `${done} of ${trophies.length} earned in this stage`));
    container.append(card);
  }
}

export function renderMissable(data, state, onSelect) {
  const missable = data.trophies.filter((trophy) => trophy.missable);
  const list = document.getElementById('missableList');
  list.replaceChildren();
  for (const trophy of missable) {
    const card = el('div', 'missable-card');
    const heading = el('h3');
    heading.append(document.createTextNode(isSpoilerHidden(trophy, state.spoilers, state.earned) ? 'Hidden trophy' : trophy.name + ' '));
    heading.append(gradePill(trophy.grade));
    card.append(heading);
    card.append(el('p', undefined, trophy.description));
    card.append(el('p', undefined, trophy.guide));
    const note = el('p', 'missable-note');
    note.append(el('strong', undefined, 'Why it can be missed: '));
    note.append(document.createTextNode(trophy.missable_note ?? ''));
    card.append(note);
    card.append(el('p', 'cite', 'Sources: Exophase and PSNProfiles for the official list; Output Lag and eGamers for the missable flag.'));
    list.append(card);
  }
  const timeSensitive = document.getElementById('timeSensitiveList');
  timeSensitive.replaceChildren();
  const stranger = data.trophies.find((trophy) => trophy.name === 'Strangers & Freaks');
  if (stranger) {
    const card = el('div', 'missable-card');
    card.append(el('h3', undefined, 'Strangers & Freaks — the Yago race'));
    card.append(el('p', undefined, 'The Chapter 3 race against Yago, in Yago\'s street racing strand, is time-sensitive: it carries an hourglass icon. Save first, then race it the moment it appears. The strand counts toward the 8 stranger strands, so a missed race can cost the silver.'));
    card.append(el('p', 'cite', 'Source: Output Lag — GTA 6 Trophy List (first-day guide).'));
    timeSensitive.append(card);
  }
  const locked = document.getElementById('storyLockedList');
  locked.replaceChildren();
  const chips = el('div', 'stage-trophies');
  for (const trophy of data.trophies.filter((entry) => entry.story_locked)) {
    const chip = el('button', 'stage-trophy' + (state.earned.has(trophy.name) ? ' earned' : ''), '');
    chip.type = 'button';
    chip.append(gradePill(trophy.grade));
    chip.append(document.createTextNode(isSpoilerHidden(trophy, state.spoilers, state.earned) ? 'Hidden trophy' : trophy.name));
    chip.addEventListener('click', () => onSelect(trophy.name));
    chips.append(chip);
  }
  locked.append(chips);
}

export function renderSources(data) {
  const list = document.getElementById('sourceList');
  list.replaceChildren();
  for (const source of Object.values(data.sources)) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = source.label;
    item.append(link);
    list.append(item);
  }
}
