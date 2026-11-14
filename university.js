/* =====================================================
   PAGE 3: UNIVERSITY (Living tab + Student life tab)
   ===================================================== */
const tile = (h, body, wide) => `<div class="tile${wide ? ' wide' : ''}"><h5>${h}</h5>${body}</div>`;
const big  = v => `<div class="big">${v}</div>`;
const list = a => `<ul>${a.map(x => `<li>${x}</li>`).join('')}</ul>`;

function openUni(i){
  const u = UNIS[i], f = fit(u), lv = u.living, lf = u.life;

  // Header
  $('usub').textContent = `${u.city}, ${u.prov === 'QC' ? 'Quebec' : 'Ontario'} · ${PROGRAMS[S.prog]}`;
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

  showTab('living');
  go(2);
}

function showTab(name){
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === name));
  ['living', 'life'].forEach(k => $(k).classList.toggle('on', k === name));
}

function initUniversity(){
  document.querySelector('.tabs').addEventListener('click', e => { if (e.target.dataset.tab) showTab(e.target.dataset.tab); });
}
