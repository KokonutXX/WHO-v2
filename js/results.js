/* =====================================================
   PAGE 2: RESULTS (sidebar, sorting, cards, map)
   ===================================================== */

// What the "Also show" dropdown displays on each card
const EXTRA = {
  tuition:  u => [money(u.tuition), 'per year'],
  rent:     u => [money(u.living.rent), 'per month'],
  success:  u => [u.life.success + '%', 'success rate'],
  clubs:    u => [u.life.clubs, 'clubs'],
  programs: (u, f) => [f.m.length, f.m.length === 1 ? 'matching program' : 'matching programs']
};

// Map area: edit BOUNDS if you add cities outside this region
const BOUNDS = { lat:[42.6, 47.2], lon:[-81.8, -70.5] };
// City label placement on the map [dx, dy, anchor] (default: centered below the dot)
const LABEL_POS = { 'Toronto':[0,-16,'middle'], 'Hamilton':[-14,4,'end'], 'Waterloo':[-14,4,'end'], 'Montréal':[0,-16,'middle'] };

// Short "which programs matched" line for a card
function matchLine(f){
  const names = [...new Set(f.m.map(x => x.p.n))];
  const head = names.slice(0, 3).map(esc).join(', ');
  return (f.exact ? '' : 'Related: ') + head + (names.length > 3 ? ` +${names.length - 3} more` : '');
}

function renderResults(){
  // Sidebar summary
  $('sum').innerHTML = [
    ['Program', esc(S.sel.label)], ['R-score', S.r ?? '—'], ['Grade', S.g != null ? S.g + '%' : '—'],
    ['Location', S.loc ? `${S.loc}${S.rad ? ' · ' + S.rad + ' km' : ''}` : 'Anywhere']
  ].map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('');

  // Filter + sort
  let L = UNIS.map(u => ({ u, f: fit(u) })).filter(x => x.f);
  if (S.loc && S.rad) L = L.filter(x => km(CITIES[S.loc], CITIES[x.u.city]) <= S.rad);
  const key = $('sort').value;
  L.sort((a, b) =>
    key === 'fit'     ? (b.f.exact - a.f.exact) || (b.f.d - a.f.d) :
    key === 'tuition' ? a.u.tuition - b.u.tuition :
    key === 'rent'    ? a.u.living.rent - b.u.living.rent :
                        b.u.life.success - a.u.life.success);

  // Title + cards
  $('title').textContent = `${S.sel.label} · ${L.length} universit${L.length === 1 ? 'y' : 'ies'}`;
  const show = EXTRA[$('inc').value];
  $('list').innerHTML = L.length ? L.map(({ u, f }) => {
    const [v, l] = show(u, f);
    return `<button class="card" data-i="${UNIS.indexOf(u)}">
      <span class="bar8" style="background:${COLORS[f.c]}"></span>
      <span><h4>${esc(u.name)}</h4>
        <small>${u.city}, ${provName(u.prov)} · needs ${needText(u, f.cat)}</small><br>
        <small class="match">${matchLine(f)}</small><br>
        <span class="tag" style="background:${COLORS[f.c]}">${LABELS[f.c]}</span></span>
      <span class="stat">${v}<small>${l}</small></span></button>`;
  }).join('') : '<div class="empty">No universities match. Try a larger distance or a different program.</div>';

  drawMap(L);
}

// Simple SVG map: one colored dot per university
function drawMap(L){
  const px = ([la, lo]) => [
    (lo - BOUNDS.lon[0]) / (BOUNDS.lon[1] - BOUNDS.lon[0]) * 740 + 20,
    (BOUNDS.lat[1] - la) / (BOUNDS.lat[1] - BOUNDS.lat[0]) * 380 + 20];
  let s = '<text x="40" y="90" fill="#9aa6d6" font-size="40" font-weight="800">ONTARIO</text>' +
          '<text x="470" y="75"fill="#9aa6d6" font-size="40" font-weight="800">QUÉBEC</text>';
  s += L.map(({ u, f }) => {
    const [x, y] = px(CITIES[u.city]);
    const same = L.filter(o => o.u.city === u.city), k = same.findIndex(o => o.u === u);
    return `<g style="cursor:pointer" data-i="${UNIS.indexOf(u)}"><title>${esc(u.name)}</title>
      <circle cx="${x + k*18 - (same.length-1)*9}" cy="${y}" r="9" fill="${COLORS[f.c]}" stroke="#fff" stroke-width="3"/></g>`;
  }).join('');
  s += Object.entries(CITIES).map(([c, p]) => {
    const [x, y] = px(p), [dx, dy, a] = LABEL_POS[c] || [0, 26, 'middle'];
    return `<text x="${x + dx}" y="${y + dy}" font-size="12" text-anchor="${a}" fill="#3b4570">${c}</text>`;
  }).join('');
  $('map').innerHTML = s;
}

function initResults(){
  ['sort', 'inc'].forEach(id => $(id).addEventListener('change', renderResults));
  $('list').addEventListener('click', e => { const c = e.target.closest('.card'); if (c) openUni(+c.dataset.i); });
  $('map').addEventListener('click', e => { const g = e.target.closest('g[data-i]'); if (g) openUni(+g.dataset.i); });
}
