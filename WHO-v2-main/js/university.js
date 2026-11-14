/* =====================================================
   PAGE 3: UNIVERSITY (Living tab + Student life tab + Programs tab)
   ===================================================== */
const tile = (h, body, wide) => `<div class="tile${wide ? ' wide' : ''}"><h5>${h}</h5>${body}</div>`;
const big  = v => `<div class="big">${v}</div>`;
const list = a => `<ul>${a.map(x => `<li>${x}</li>`).join('')}</ul>`;
const TABS = ['living', 'life', 'programs'];
let curUni = null;

function openUni(i){
  const u = UNIS[i], f = fit(u), lv = u.living, lf = u.life;
  curUni = u;

  // Header
  $('usub').textContent = `${u.city}, ${provName(u.prov)} · ${S.sel.label}`;
  $('uname').textContent = u.name;
  $('ufit').textContent = LABELS[f.c];
  $('ufit').style.background = COLORS[f.c];

  // Living tab
  $('living').innerHTML =
    tile('Rent (shared apartment)', big(money(lv.rent) + '/mo')) +
    tile('Dorm', big(money(lv.dorm) + '/mo')) +
    tile('Bus / metro pass', big(money(lv.transit) + '/mo')) +
    tile('Car (insurance, gas, parking)', big(money(lv.car) + '/mo')) +
    tile('Social life', `<p>${lv.social}</p>`) +
    tile('Loans and bursaries', `<p>${GOV[u.prov]}</p>`);

  // Student life tab
  $('life').innerHTML =
    tile('Student clubs', big(lf.clubs)) +
    tile('Graduation success rate', big(lf.success + '%')) +
    tile('Campus tour and map', `<p><a href="${lf.tour}" target="_blank" rel="noopener">Open campus tour and map</a></p>`) +
    tile('Facilities', list(lf.facilities)) +
    tile('Scholarships', list(lf.schol)) +
    tile('What current students say', list(lf.comments), true);

  // Programs tab
  const P = programsOf(u);
  $('programs').innerHTML = `<div class="tile wide">
    <div class="ptop">
      <input id="pfilter" type="search" placeholder="Filter ${P.length} programs (name, option, degree…)" aria-label="Filter programs">
      <span class="hint" id="pcount"></span>
    </div>
    <p class="hint">Cutoffs are estimates by field of study. Always check the university’s official admission page.</p>
    <div id="plist"></div></div>`;
  $('pfilter').addEventListener('input', renderPrograms);
  renderPrograms();

  showTab('living');
  go(2);
}

// Program list of the open university, grouped by faculty, filtered by the text box
function renderPrograms(){
  const u = curUni, P = programsOf(u), q = norm($('pfilter').value);
  if (!P.length){ $('plist').innerHTML = '<p class="hint">Program list not available yet for this university.</p>'; $('pcount').textContent = ''; return; }
  const hit = p => !q || [p.n, p.e || '', p.d || '', p.f || '', ...(p.s || [])].some(x => norm(x).includes(q));
  const groups = {};
  let n = 0;
  P.forEach(p => { if (hit(p)){ (groups[p.f || 'Other'] = groups[p.f || 'Other'] || []).push(p); n++; } });
  const faculties = Object.keys(groups);
  $('pcount').textContent = `${n} of ${P.length} programs`;
  $('plist').innerHTML = n ? faculties.map(fac => {
    const ps = groups[fac], anyMatch = ps.some(p => matchProgram(p, S.sel));
    const open = q || anyMatch || faculties.length <= 2;
    return `<details class="fac"${open ? ' open' : ''}><summary>${esc(fac)} <span class="hint">${ps.length}</span></summary>
      ${ps.map(p => `<div class="prog${matchProgram(p, S.sel) ? ' hit' : ''}">
        <div class="phead"><b>${esc(p.n)}</b>${p.e ? ` <span class="hint">${esc(p.e)}</span>` : ''}
          <span class="pmeta">${esc(p.d || '')} · ${CATEGORIES[p.c] || p.c} · needs ${needText(u, p.c)}</span></div>
        ${p.s && p.s.length ? `<div class="chips">${p.s.map(s => `<span>${esc(s)}</span>`).join('')}</div>` : ''}
      </div>`).join('')}</details>`;
  }).join('') : '<p class="hint">No program matches this filter.</p>';
}

function showTab(name){
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === name));
  TABS.forEach(k => $(k).classList.toggle('on', k === name));
}

function initUniversity(){
  document.querySelector('.tabs').addEventListener('click', e => { if (e.target.dataset.tab) showTab(e.target.dataset.tab); });
}
