/* =====================================================
   PAGE 2: RESULTS (sidebar, sorting, cards, map)
   ===================================================== */

// What the "Also show" dropdown displays on each card
const EXTRA = {
  tuition: u => [money(u.tuition), 'per year'],
  rent:    u => [money(u.living.rent), 'per month'],
  success: u => [u.life.success + '%', 'success rate'],
  clubs:   u => [u.life.clubs, 'clubs']
};

// Map area: edit BOUNDS if you add cities outside this region
const BOUNDS = { lat:[43, 47.2], lon:[-81.5, -70.5] };

function renderResults(){
  // Sidebar summary
  $('sum').innerHTML = [
    ['Program', PROGRAMS[S.prog]], ['R-score', S.r ?? '—'], ['Grade', S.g != null ? S.g + '%' : '—'],
    ['Location', S.loc ? `${S.loc}${S.rad ? ' · ' + S.rad + ' km' : ''}` : 'Anywhere']
  ].map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('');

  // Filter + sort
  let L = UNIS.map(u => ({ u, f: fit(u) })).filter(x => x.f);
  if (S.loc && S.rad) L = L.filter(x => km(CITIES[S.loc], CITIES[x.u.city]) <= S.rad);
  const key = $('sort').value;
  L.sort((a, b) =>
    key === 'fit'     ? b.f.d - a.f.d :
    key === 'tuition' ? a.u.tuition - b.u.tuition :
    key === 'rent'    ? a.u.living.rent - b.u.living.rent :
                        b.u.life.success - a.u.life.success);

  // Title + cards
  $('title').textContent = `${PROGRAMS[S.prog]} · ${L.length} universit${L.length === 1 ? 'y' : 'ies'}`;
  const show = EXTRA[$('inc').value];
  $('list').innerHTML = L.length ? L.map(({ u, f }) => {
    const [v, l] = show(u), rq = u.req[S.prog];
    return `<button class="card" data-i="${UNIS.indexOf(u)}">
      <span class="bar8" style="background:${COLORS[f.c]}"></span>
      <span><h4>${u.name}</h4>
        <small>${u.city}, ${u.prov === 'QC' ? 'Quebec' : 'Ontario'} · needs ${u.prov === 'QC' && rq[0] ? 'R-score ' + rq[0] : rq[1] + '%'}</small><br>
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
  let s = '<text x="60" y="380" fill="#9aa6d6" font-size="40" font-weight="800">ONTARIO</text>' +
          '<text x="560" y="90" fill="#9aa6d6" font-size="40" font-weight="800">QUÉBEC</text>';
  s += L.map(({ u, f }) => {
    const [x, y] = px(CITIES[u.city]);
    const same = L.filter(o => o.u.city === u.city), k = same.findIndex(o => o.u === u);
    return `<g style="cursor:pointer" data-i="${UNIS.indexOf(u)}"><title>${u.name}</title>
      <circle cx="${x + k*18 - (same.length-1)*9}" cy="${y}" r="9" fill="${COLORS[f.c]}" stroke="#fff" stroke-width="3"/></g>`;
  }).join('');
  s += Object.entries(CITIES).map(([c, p]) => {
    const [x, y] = px(p);
    return `<text x="${x}" y="${y + 26}" font-size="12" text-anchor="middle" fill="#3b4570">${c}</text>`;
  }).join('');
  $('map').innerHTML = s;
}

function initResults(){
  ['sort', 'inc'].forEach(id => $(id).addEventListener('change', renderResults));
  $('list').addEventListener('click', e => { const c = e.target.closest('.card'); if (c) openUni(+c.dataset.i); });
  $('map').addEventListener('click', e => { const g = e.target.closest('g[data-i]'); if (g) openUni(+g.dataset.i); });
}
