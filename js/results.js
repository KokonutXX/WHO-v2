/* =====================================================
   PAGE 2: RESULTS (search summary, sort, "also show" checklist, map, numbered cards)
   ===================================================== */

const yesNo = s => t(s === 'yes' ? 'yes' : s === 'no' ? 'no' : 'some');
const stateNum = { no:0, some:1, yes:2 };
const fmtNum = n => (Math.round(n * 10) / 10).toLocaleString(LANG === 'fr' ? 'fr-CA' : 'en-CA');

/* Sortable / showable fields.
   key: { sort(x) -> number|null (null = no data, sorted last), dir: 1 ascending / -1 descending, show(x) -> text }
   x = { u (university), f (fit result), a (admission details or null), km (distance or null) } */
const FIELDS = {
  // "Best chance": how far above / below the cutoff the user is
  fit:      { dir:-1, sort:x => x.f.d,
              show:x => x.f.k == null ? t('enterScore') : (x.f.d >= 0 ? '+' : '−') + fmtNum(Math.abs(x.f.d)) + (x.f.k === 'g' ? ' %' : '') },
  rscore:   { dir: 1, sort:x => reqFor(x.u, x.f.cat)[0] || null,
              show:x => { const r = reqFor(x.u, x.f.cat)[0]; return r ? '≥ ' + r : t('gradeOnly'); } },
  grade:    { dir: 1, sort:x => reqFor(x.u, x.f.cat)[1] || null,
              show:x => { const g = reqFor(x.u, x.f.cat)[1]; return g ? '≥ ' + g + ' %' : t('na'); } },
  distance: { dir: 1, sort:x => x.km, show:x => x.km == null ? t('setLoc') : Math.round(x.km) + ' km' },
  deadline: { dir: 1, sort:x => x.a ? x.a.deadline.n : null,
              show:x => !x.a || !x.a.deadline.text ? t('na') : x.a.deadline.varies ? t('from', { v:x.a.deadline.text }) : x.a.deadline.text },
  docs:     { dir: 1, sort:x => x.a ? stateNum[x.a.docs.state] : null,
              show:x => { if (!x.a) return t('na'); const ty = x.a.docs.types;
                return yesNo(x.a.docs.state) + (ty.length ? ': ' + ty.slice(0, 2).join('; ') + (ty.length > 2 ? ' ' + t('more', { n:ty.length - 2 }) : '') : ''); } },
  interview:{ dir: 1, sort:x => x.a ? stateNum[x.a.iv.state] : null, show:x => x.a ? yesNo(x.a.iv.state) : t('na') },
  tuition:  { dir: 1, sort:x => x.u.tuition, show:x => money(x.u.tuition) + t('perYear') },
  clubs:    { dir:-1, sort:x => x.u.life.clubs, show:x => String(x.u.life.clubs) },
  schol:    { dir:-1, sort:x => x.a ? x.a.scholMax : null, show:x => x.a && x.a.scholMax ? t('upTo', { v:money(x.a.scholMax) }) : t('na') },
  living:   { dir: 1, sort:x => x.u.living.rent + (x.u.living.groceries || 0), show:x => money(x.u.living.rent + (x.u.living.groceries || 0)) + t('perMonth') },
  success:  { dir:-1, sort:x => x.u.life.success, show:x => x.u.life.success + ' %' }
};

// Sort direction: each field has a default (FIELDS[key].dir); the button under "Sort by" reverses it
let sortRev = false;
const sortDir = key => FIELDS[key].dir * (sortRev ? -1 : 1);
function dirLabel(key, dir){
  const pair = key === 'fit' ? ['d_worst', 'd_best'] : key === 'deadline' ? ['d_early', 'd_late'] : key === 'distance' ? ['d_near', 'd_far']
             : (key === 'docs' || key === 'interview') ? ['d_noFirst', 'd_yesFirst'] : ['d_asc', 'd_desc'];
  return (dir > 0 ? '↑ ' : '↓ ') + t(dir > 0 ? pair[0] : pair[1]);
}

// Short "which programs matched" line for a card
function matchLine(f){
  const names = [...new Set(f.m.map(x => x.p.n))];
  const head = names.slice(0, 3).map(esc).join(', ');
  return (f.exact ? '' : t('related')) + head + (names.length > 3 ? ' ' + t('more', { n:names.length - 3 }) : '');
}

let lastRows = [], lastHere = null;

function renderResults(){
  // "Your search" box
  $('sum').innerHTML = [
    [t('program'), esc(selLabel(S.sel))], [t('rscore'), S.r ?? '—'], [t('grade'), S.g != null ? S.g + ' %' : '—'],
    [t('location'), S.loc ? `${cityName(S.loc)}${S.rad ? ' · ' + S.rad + ' km' : ''}` : t('anywhere')]
  ].map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('');

  // Distance sort needs a location
  const distOpt = $('sort').querySelector('option[value="distance"]');
  distOpt.disabled = !S.loc;
  if (!S.loc && $('sort').value === 'distance') $('sort').value = 'fit';
  $('sorthint').textContent = S.loc ? '' : t('distSortHint');

  // Filter
  const here = S.loc ? CITIES[S.loc] : null;
  let all = UNIS.map(u => ({ u, f: fit(u), km: here ? km(here, u.ll) : null })).filter(x => x.f);
  if (here && S.rad) all = all.filter(x => x.km <= S.rad);
  const missing = all.filter(x => x.f.missing).length;
  const rows = all.filter(x => !x.f.missing);
  rows.forEach(x => { x.a = admInfo(x.u, x.f.m); });

  // Sort (no data always last), then number 1, 2, 3…
  const key = $('sort').value, dir = sortDir(key);
  $('sortdir').textContent = dirLabel(key, dir);
  rows.sort((a, b) => {
    if (key === 'fit') return (b.f.exact - a.f.exact) || (a.f.d - b.f.d) * dir;   // real matches always first
    const F = FIELDS[key], va = F.sort(a), vb = F.sort(b);
    if (va == null || vb == null) return (va == null) - (vb == null);
    return (va - vb) * dir || (b.f.d - a.f.d);
  });
  rows.forEach((x, i) => { x.rank = i + 1; });

  // Missing-data warning
  const other = S.r != null && S.g == null ? t('otherGrade') : t('otherR');
  $('warn').textContent = missing ? t('missing', { n:missing, u:t(missing === 1 ? 'univ1' : 'univN'), other }) : '';
  $('warn').hidden = !missing;

  // Title + cards. The sorted-by value is always shown on the right;
  // other values only for the boxes checked in "Also show".
  $('title').textContent = `${selLabel(S.sel)} · ${rows.length} ${t(rows.length === 1 ? 'univ1' : 'univN')}`;
  const ticked = [...document.querySelectorAll('#show input:checked')].map(i => i.value);
  $('showcount').textContent = ticked.length ? t('nSelected', { n:ticked.length }) : '';
  const checked = ticked.filter(k => k !== key);          // the sorted-by value is already shown
  const sortLabel = key === 'fit' ? t('vsCutoff') : t('f_' + key);
  $('list').innerHTML = rows.length ? rows.map(x => {
    const { u, f } = x;
    const extras = checked.map(k => `<span class="ex"><small>${t('f_' + k)}</small>${esc(FIELDS[k].show(x))}</span>`).join('');
    return `<button class="card" data-i="${UNIS.indexOf(u)}">
      <span class="bar8" style="background:${COLORS[f.c]}"></span>
      <span class="rank" aria-label="#${x.rank}">${x.rank}</span>
      <span class="cbody"><h4>${esc(u.name)}</h4>
        <small>${cityName(u.city)}, ${provName(u.prov)} · ${t('needs', { v:needText(u, f.cat) })}</small><br>
        <small class="match">${matchLine(f)}</small><br>
        <span class="tag" style="background:${COLORS[f.c]}">${label(f.c)}</span>
        ${extras ? `<span class="extras">${extras}</span>` : ''}</span>
      <span class="stat"><small>${sortLabel}</small>${esc(FIELDS[key].show(x))}</span></button>`;
  }).join('') : `<div class="empty">${t('empty')}</div>`;

  lastRows = rows; lastHere = here;
  drawMap();
}

/* ---------- Static map (js/mapdata.js, Natural Earth) with numbered markers ---------- */
const proj = ([la, lo]) => [(lo - MAP.lon0) * MAP.kx * MAP.s, (MAP.lat1 - la) * MAP.s];
const HOME = ['Ontario', 'Québec', 'Quebec'];
// Cities labelled on the small map (all are labelled when the map is enlarged)
const MAIN_CITIES = ['Montréal', 'Québec City', 'Ottawa', 'Toronto', 'Kingston', 'London'];

function drawMap(){
  const svg = $('map'), rows = lastRows, here = lastHere;
  if (typeof MAP === 'undefined'){ svg.innerHTML = ''; return; }
  const big = $('mapbox').classList.contains('big');
  $('mapbtn').textContent = t(big ? 'mapClose' : 'mapBig');
  // Keep markers/text the same size on screen whatever the map's displayed size
  const k = MAP.w / Math.max(svg.getBoundingClientRect().width || svg.clientWidth || 360, 1);
  const r = 9 * k, fs = 10 * k;

  let s = `<rect width="${MAP.w}" height="${MAP.h}" fill="#cfe1f3"/>`;
  s += MAP.land.map(l => `<path d="${l.d}" fill="${HOME.includes(l.n) ? '#fbfaf5' : '#ecebe3'}" stroke="#a9a596" stroke-width="${0.6 * k}" stroke-linejoin="round"/>`).join('');
  s += MAP.rivers.map(d => `<path d="${d}" fill="none" stroke="#cfe1f3" stroke-width="${1.6 * k}" stroke-linecap="round"/>`).join('');
  const region = (txt, lo, la) => { const [x, y] = proj([la, lo]); return `<text x="${x}" y="${y}" font-size="${13 * k}" font-weight="800" fill="#9aa1bd" letter-spacing="${2 * k}" text-anchor="middle">${txt}</text>`; };
  s += region('ONTARIO', -80.6, 46.7) + region(LANG === 'fr' ? 'QUÉBEC' : 'QUEBEC', -72.6, 47.15) + region(LANG === 'fr' ? 'ÉTATS-UNIS' : 'UNITED STATES', -75.8, 42.3);

  // Search radius around the chosen city
  if (here){
    const [hx, hy] = proj(here);
    if (S.rad) s += `<circle cx="${hx}" cy="${hy}" r="${S.rad / 111.32 * MAP.s}" fill="rgba(58,82,255,.07)" stroke="#3a52ff" stroke-width="${k}" stroke-dasharray="${4 * k} ${3 * k}"/>`;
    s += `<circle cx="${hx}" cy="${hy}" r="${4 * k}" fill="#fff" stroke="#12193a" stroke-width="${2 * k}"/>`;
  }

  // City labels
  Object.entries(CITIES).forEach(([c, p]) => {
    if (!big && !MAIN_CITIES.includes(c)) return;
    const [x, y] = proj(p);
    const n = rows.filter(x2 => x2.u.city === c).length;
    s += `<text x="${x}" y="${y + (n > 1 ? 2.6 : 1.9) * r + fs}" font-size="${fs}" text-anchor="middle" fill="#3b4570" stroke="#fbfaf5" stroke-width="${3 * k}" paint-order="stroke">${esc(cityName(c))}</text>`;
  });

  // Markers: universities in the same city are arranged in a small ring; #1 is drawn on top
  const byCity = {};
  rows.forEach(x => { (byCity[x.u.city] = byCity[x.u.city] || []).push(x); });
  const pos = new Map();
  Object.values(byCity).forEach(list => {
    const [cx, cy] = proj(CITIES[list[0].u.city]), n = list.length, ring = n > 1 ? r * (n > 3 ? 1.9 : 1.3) : 0;
    list.forEach((x, i) => { const a = -Math.PI / 2 + 2 * Math.PI * i / n; pos.set(x, [cx + ring * Math.cos(a), cy + ring * Math.sin(a)]); });
  });
  s += [...rows].reverse().map(x => {
    const [mx, my] = pos.get(x);
    return `<g class="mk" data-i="${UNIS.indexOf(x.u)}"><title>${x.rank}. ${esc(x.u.name)} · ${label(x.f.c)}</title>
      <circle cx="${mx}" cy="${my}" r="${r}" fill="${HEX[x.f.c]}" stroke="#fff" stroke-width="${2 * k}"/>
      <text x="${mx}" y="${my + fs * 0.36}" font-size="${fs}" font-weight="800" text-anchor="middle" fill="#fff">${x.rank}</text></g>`;
  }).join('');
  s += `<text x="${MAP.w - 6 * k}" y="${MAP.h - 6 * k}" font-size="${8 * k}" text-anchor="end" fill="#6b7290">Natural Earth</text>`;

  svg.setAttribute('viewBox', `0 0 ${MAP.w} ${MAP.h}`);
  svg.innerHTML = s;
}
// Called after the results page becomes visible / on resize
function fixMap(){ drawMap(); }

function toggleMap(open){
  const box = $('mapbox'), page = $('p1'), on = open ?? !box.classList.contains('big');
  // Pages are CSS-transformed (zoom effect), so "fixed" doesn't work: place the overlay at the current scroll position
  box.style.top = on ? (page.scrollTop + innerHeight * 0.06) + 'px' : '';
  $('mapshade').style.top = on ? page.scrollTop + 'px' : '';
  page.style.overflow = on ? 'hidden' : '';
  box.classList.toggle('big', on);
  $('mapshade').hidden = !on;
  drawMap();
}

function initResults(){
  $('sort').addEventListener('change', () => { sortRev = false; renderResults(); });   // new field: back to its default direction
  $('sortdir').addEventListener('click', () => { sortRev = !sortRev; renderResults(); });
  $('show').addEventListener('change', renderResults);
  $('list').addEventListener('click', e => { const c = e.target.closest('.card'); if (c) openUni(+c.dataset.i); });
  $('map').addEventListener('click', e => { const g = e.target.closest('.mk'); if (g){ toggleMap(false); openUni(+g.dataset.i); } });
  $('mapbtn').addEventListener('click', () => toggleMap());
  $('mapshade').addEventListener('click', () => toggleMap(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('mapbox').classList.contains('big')) toggleMap(false); });
  window.addEventListener('resize', () => { if (curPage === 1) drawMap(); });
}
