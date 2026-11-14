/* =====================================================
   PAGE 1: SEARCH (program combo box + form)
   The combo box lists the categories plus every distinct program name found in
   js/programs/*.js. Programs are grouped by English name; in French the French
   name is shown first when one exists. Free text also works (keyword search).
   ===================================================== */
const MAX_OPTS = 60;

// Program index: normalized English name -> { key, label (English), alt (French/other names), cat, unis }
const PROGRAM_INDEX = (() => {
  const idx = new Map();
  UNIS.forEach(u => programsOf(u).forEach(p => {
    const label = p.e || p.n, key = norm(label);
    if (!key) return;
    if (!idx.has(key)) idx.set(key, { key, label, cats:{}, alt:{}, unis:new Set() });
    const it = idx.get(key);
    it.cats[p.c] = (it.cats[p.c] || 0) + 1;
    it.unis.add(u.id);
    if (p.e && norm(p.n) !== key) it.alt[p.n] = (it.alt[p.n] || 0) + 1;
  }));
  const list = [...idx.values()];
  list.forEach(it => {
    it.cat = Object.entries(it.cats).sort((a, b) => b[1] - a[1])[0][0];
    it.alt = Object.entries(it.alt).sort((a, b) => b[1] - a[1]).map(x => x[0]);   // most common first
    it.search = [it.key, ...it.alt.map(norm)];
  });
  return list.sort((a, b) => a.label.localeCompare(b.label));
})();
const INDEX_BY_KEY = new Map(PROGRAM_INDEX.map(it => [it.key, it]));

// Name shown for a program index item in the current language, and its other names
const itemLabel = it => LANG === 'fr' && it.alt.length ? it.alt[0] : it.label;
const itemAlt   = it => LANG === 'fr' && it.alt.length ? [it.label, ...it.alt.slice(1)] : it.alt;

// Display label of a search selection (changes with the language)
function selLabel(sel){
  if (!sel) return '';
  if (sel.type === 'cat') return catName(sel.key);
  if (sel.type === 'prog') { const it = INDEX_BY_KEY.get(sel.key); return it ? itemLabel(it) : sel.key; }
  return LANG === 'fr' ? `« ${sel.txt} »` : `“${sel.txt}”`;
}

const catItems = () => Object.keys(CATEGORIES).map(k => ({ type:'cat', key:k, label:t('allCat', { c:catName(k) }) }));
let picked = null, active = -1, shown = [];

function fillOpts(){
  const raw = $('prog').value, q = norm(raw);
  const cats = catItems().filter(c => !q || norm(c.label).includes(q));
  const progs = q ? PROGRAM_INDEX.filter(it => it.search.some(s => s.includes(q)))
    .sort((a, b) => (b.search.some(s => s.startsWith(q)) - a.search.some(s => s.startsWith(q))) || (b.unis.size - a.unis.size) || itemLabel(a).localeCompare(itemLabel(b)))
    : [...PROGRAM_INDEX].sort((a, b) => b.unis.size - a.unis.size);
  shown = [...cats, ...progs.slice(0, MAX_OPTS).map(it => ({ type:'prog', key:it.key, label:itemLabel(it), it }))];
  active = -1;
  $('opts').innerHTML = shown.length ? shown.map((o, i) => {
      if (o.type === 'cat') return `<li data-i="${i}" class="cat" role="option">${esc(o.label)}</li>`;
      const alt = itemAlt(o.it), n = o.it.unis.size;
      return `<li data-i="${i}" role="option">${esc(o.label)}${alt.length ? ` <i>${esc(alt.slice(0, 2).join(' · '))}</i>` : ''}
           <small>${esc(catName(o.it.cat))} · ${n} ${t(n === 1 ? 'univ1' : 'univN')}</small></li>`;
    }).join('') + (progs.length > MAX_OPTS ? `<li class="more">${t('moreOpts', { n:progs.length - MAX_OPTS })}</li>` : '')
    : `<li class="more">${t('noOpt', { q:esc(raw) })}</li>`;
  $('opts').classList.add('open');
}

function pick(o){
  picked = o; $('prog').value = o.label;
  $('opts').classList.remove('open'); $('prog').classList.remove('bad'); $('err').textContent = '';
}

function moveActive(step){
  const lis = $('opts').querySelectorAll('li[data-i]');
  if (!lis.length) return;
  active = (active + step + lis.length) % lis.length;
  lis.forEach((li, i) => li.classList.toggle('on', i === active));
  lis[active].scrollIntoView({ block:'nearest' });
}

// Turn what's in the box into a search selection (or null)
function readSelection(){
  const txt = $('prog').value.trim(), q = norm(txt);
  if (!q) return null;
  if (picked && picked.label === txt) return { type:picked.type, key:picked.key };
  const c = Object.keys(CATEGORIES).find(k => [CATEGORIES[k].en, CATEGORIES[k].fr, I18N.en.allCat.replace('{c}', CATEGORIES[k].en), I18N.fr.allCat.replace('{c}', CATEGORIES[k].fr)].some(s => norm(s) === q));
  if (c) return { type:'cat', key:c };
  const it = PROGRAM_INDEX.find(it => it.search.includes(q));
  if (it) return { type:'prog', key:it.key };
  return { type:'text', key:q, txt };
}

// Every place the user can type as a location: university cities (CITIES) + other towns (js/places.js)
// name -> { ll:[lat, lon], prov }
const placeKey = s => norm(s).replace(/\bste\b/g, 'sainte').replace(/\bst\b/g, 'saint');   // "St-Jérôme" = "Saint-Jérôme"
const ALL_PLACES = (() => {
  const m = new Map(), seen = new Set();
  Object.entries(CITIES).forEach(([c, ll]) => { m.set(c, { ll, prov:(UNIS.find(u => u.city === c) || {}).prov }); seen.add(placeKey(c)); seen.add(placeKey(CITY_FR[c] || c)); });
  (typeof PLACES !== 'undefined' ? PLACES : []).forEach(([n, la, lo, pr]) => { if (!seen.has(placeKey(n))){ m.set(n, { ll:[la, lo], prov:pr }); seen.add(placeKey(n)); } });
  return m;
})();
const placeLL = name => (ALL_PLACES.get(name) || {}).ll || null;

// Place typed in either language (accents, hyphens and St/Saint don't matter) -> ALL_PLACES key
const findCity = s => { const q = placeKey(s); if (!q) return undefined; return [...ALL_PLACES.keys()].find(c => placeKey(c) === q || placeKey(CITY_FR[c] || c) === q); };
const fillCities = () => {
  $('cities').innerHTML = [...ALL_PLACES.keys()].sort((a, b) => cityName(a).localeCompare(cityName(b), LANG))
    .map(c => `<option value="${esc(cityName(c))}">${ALL_PLACES.get(c).prov ? provName(ALL_PLACES.get(c).prov) : ''}</option>`).join('');
};

function initSearch(){
  $('prog').addEventListener('focus', fillOpts);
  $('prog').addEventListener('input', () => { picked = null; fillOpts(); });
  $('prog').addEventListener('blur', () => setTimeout(() => $('opts').classList.remove('open'), 120));
  $('prog').addEventListener('keydown', e => {
    if (!$('opts').classList.contains('open')) return;
    if (e.key === 'ArrowDown'){ e.preventDefault(); moveActive(1); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); moveActive(-1); }
    else if (e.key === 'Escape') $('opts').classList.remove('open');
    else if (e.key === 'Enter' && active >= 0){ e.preventDefault(); pick(shown[active]); }
  });
  $('opts').addEventListener('mousedown', e => {
    const li = e.target.closest('li[data-i]');
    if (li) pick(shown[+li.dataset.i]); else e.preventDefault();
  });
  fillCities();

  $('form').addEventListener('submit', e => {
    e.preventDefault();
    const sel = readSelection();
    const loc = findCity($('loc').value);
    if (!sel){ $('prog').classList.add('bad'); $('err').textContent = t('errProg'); return; }
    if (!UNIS.some(u => programsOf(u).some(p => matchProgram(p, sel)))){
      $('prog').classList.add('bad'); $('err').textContent = t('errNoMatch', { q:selLabel(sel) }); return;
    }
    if ($('loc').value.trim() && !loc){ $('err').textContent = t('errCity'); return; }
    $('prog').classList.remove('bad'); $('err').textContent = '';
    S.sel = sel;
    S.r = $('rs').value === '' ? null : +$('rs').value;
    S.g = $('gr').value === '' ? null : +$('gr').value;
    S.loc = loc || ''; S.rad = +$('rad').value;
    resetMapView();
    renderResults(); go(1);
  });
}

// Language changed: keep the typed program in sync with the new language
function refreshSearch(){
  fillCities();
  if (picked){ picked.label = picked.type === 'cat' ? t('allCat', { c:catName(picked.key) }) : itemLabel(INDEX_BY_KEY.get(picked.key)); $('prog').value = picked.label; }
  const loc = findCity($('loc').value); if (loc) $('loc').value = cityName(loc);
  if ($('opts').classList.contains('open')) fillOpts();
  if ($('err').textContent) $('err').textContent = '';
}
