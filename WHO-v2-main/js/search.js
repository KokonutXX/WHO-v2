/* =====================================================
   PAGE 1: SEARCH (program combo box + form)
   The combo box lists the categories plus every distinct program name found in
   js/programs/*.js (French programs are listed under their English name and also
   findable by their French name). Free text also works (keyword search).
   ===================================================== */
const MAX_OPTS = 60;

// Build the program index: normalized English name -> { label, cat, alt (other names), unis }
const PROGRAM_INDEX = (() => {
  const idx = new Map();
  UNIS.forEach(u => programsOf(u).forEach(p => {
    const label = p.e || p.n, key = norm(label);
    if (!key) return;
    if (!idx.has(key)) idx.set(key, { key, label, cats:{}, alt:new Set(), unis:new Set() });
    const it = idx.get(key);
    it.cats[p.c] = (it.cats[p.c] || 0) + 1;
    it.unis.add(u.id);
    if (p.e && norm(p.n) !== key) it.alt.add(p.n);
  }));
  const list = [...idx.values()];
  list.forEach(it => {
    it.cat = Object.entries(it.cats).sort((a, b) => b[1] - a[1])[0][0];
    it.alt = [...it.alt];
    it.search = [it.key, ...it.alt.map(norm)];
  });
  return list.sort((a, b) => a.label.localeCompare(b.label));
})();

const CAT_ITEMS = Object.entries(CATEGORIES).map(([k, n]) => ({ type:'cat', key:k, label:`All ${n} programs` }));
let picked = null, active = -1, shown = [];

function fillOpts(){
  const q = norm($('prog').value);
  const cats = CAT_ITEMS.filter(c => !q || norm(c.label).includes(q));
  const progs = q ? PROGRAM_INDEX.filter(it => it.search.some(s => s.includes(q)))
    .sort((a, b) => (b.key.startsWith(q) - a.key.startsWith(q)) || (b.unis.size - a.unis.size) || a.label.localeCompare(b.label))
    : [...PROGRAM_INDEX].sort((a, b) => b.unis.size - a.unis.size);
  shown = [...cats, ...progs.slice(0, MAX_OPTS).map(it => ({ type:'prog', key:it.key, label:it.label, it }))];
  active = -1;
  $('opts').innerHTML = shown.length ? shown.map((o, i) => o.type === 'cat'
      ? `<li data-i="${i}" class="cat">${esc(o.label)}</li>`
      : `<li data-i="${i}">${esc(o.label)}${o.it.alt.length ? ` <i>${esc(o.it.alt.slice(0, 2).join(' · '))}</i>` : ''}
           <small>${esc(CATEGORIES[o.it.cat])} · ${o.it.unis.size} universit${o.it.unis.size === 1 ? 'y' : 'ies'}</small></li>`).join('')
      + (progs.length > MAX_OPTS ? `<li class="more">${progs.length - MAX_OPTS} more… keep typing to narrow down</li>` : '')
    : `<li class="more">No program name matches. Press Search to look for “${esc($('prog').value)}” as a keyword.</li>`;
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
  if (picked && picked.label === txt) return { type:picked.type, key:picked.key, label:picked.type === 'cat' ? CATEGORIES[picked.key] : picked.label };
  const c = CAT_ITEMS.find(c => norm(c.label) === q || norm(CATEGORIES[c.key]) === q);
  if (c) return { type:'cat', key:c.key, label:CATEGORIES[c.key] };
  const it = PROGRAM_INDEX.find(it => it.search.includes(q));
  if (it) return { type:'prog', key:it.key, label:it.label };
  return { type:'text', key:q, label:`“${txt}”` };
}

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
  $('cities').innerHTML = Object.keys(CITIES).map(c => `<option value="${c}">`).join('');

  $('form').addEventListener('submit', e => {
    e.preventDefault();
    const sel = readSelection();
    const loc = Object.keys(CITIES).find(c => c.toLowerCase() === $('loc').value.trim().toLowerCase());
    if (!sel){ $('prog').classList.add('bad'); $('err').textContent = 'Type or pick a program.'; return; }
    if (!UNIS.some(u => programsOf(u).some(p => matchProgram(p, sel)))){
      $('prog').classList.add('bad'); $('err').textContent = `No program matches ${sel.label}. Try another word or pick from the list.`; return;
    }
    if ($('loc').value.trim() && !loc){ $('err').textContent = 'Pick a city from the list, or leave location empty.'; return; }
    $('prog').classList.remove('bad'); $('err').textContent = '';
    S.sel = sel;
    S.r = $('rs').value === '' ? null : +$('rs').value;
    S.g = $('gr').value === '' ? null : +$('gr').value;
    S.loc = loc || ''; S.rad = +$('rad').value;
    renderResults(); go(1);
  });
}
