/* =====================================================
   PAGE 3: UNIVERSITY (Living / Student life / Admission / Programs tabs)
   ===================================================== */
const tile = (h, body, wide) => `<div class="tile${wide ? ' wide' : ''}"><h5>${h}</h5>${body}</div>`;
const big  = v => `<div class="big">${v}</div>`;
const list = a => `<ul>${a.map(x => `<li>${x}</li>`).join('')}</ul>`;
const TABS = ['living', 'life', 'adm', 'programs'];
let curUni = null;

function openUni(i){
  curUni = UNIS[i];
  renderUni();
  showTab('living');
  go(2);
}

function renderUni(){
  const u = curUni, f = fit(u), lv = u.living, lf = u.life;
  if (!f || f.missing) return;

  // Header
  $('usub').textContent = `${cityName(u.city)}, ${provName(u.prov)} · ${selLabel(S.sel)}`;
  $('uname').textContent = u.name;
  $('ufit').textContent = label(f.c);
  $('ufit').style.background = COLORS[f.c];

  // Living tab
  $('living').innerHTML =
    tile(t('rent'), big(money(lv.rent) + t('perMonth'))) +
    tile(t('groceries'), big(money(lv.groceries || 0) + t('perMonth'))) +
    tile(t('livingCost'), big(money(lv.rent + (lv.groceries || 0)) + t('perMonth'))) +
    tile(t('dorm'), big(money(lv.dorm) + t('perMonth'))) +
    tile(t('transit'), big(money(lv.transit) + t('perMonth'))) +
    tile(t('car'), big(money(lv.car) + t('perMonth'))) +
    tile(t('social'), `<p>${tx(lv.social)}</p>`) +
    tile(t('loans'), `<p>${t('gov_' + u.prov)}</p>`);

  // Student life tab
  $('life').innerHTML =
    tile(t('clubs'), big(lf.clubs)) +
    tile(t('success'), big(lf.success + ' %')) +
    tile(t('tour'), `<p><a href="${lf.tour}" target="_blank" rel="noopener">${t('tourLink')}</a></p>`) +
    tile(t('facilities'), list(tx(lf.facilities))) +
    tile(t('comments'), list(tx(lf.comments)), true);

  renderAdmission(u, f);

  // Programs tab
  const P = programsOf(u);
  $('programs').innerHTML = `<div class="tile wide">
    <div class="ptop">
      <input id="pfilter" type="search" placeholder="${esc(t('filterPh', { n:P.length }))}" aria-label="${esc(t('filterAria'))}">
      <span class="hint" id="pcount"></span>
    </div>
    <p class="hint">${t('cutoffNote')}</p>
    <div id="plist"></div></div>`;
  $('pfilter').addEventListener('input', renderPrograms);
  renderPrograms();
}

// Admission tab: cutoff, deadlines, documents, interview, scholarships (from js/admissions.js)
function renderAdmission(u, f){
  const A = ADMISSIONS[u.id], a = admInfo(u, f.m);
  const cutoff = tile(t('cutoff', { p:esc(selLabel(S.sel)) }), big(needText(u, f.cat)) + `<p class="hint">${catName(f.cat)}</p>`);
  if (!A){ $('adm').innerHTML = cutoff + tile(t('notes'), `<p>${t('noAdm')}</p>`); return; }
  const progs = ps => ps.includes('*') ? t('allProgs') : ps.map(esc).join(', ');
  const mine = a.deadline.text ? (a.deadline.varies ? t('from', { v:a.deadline.text }) : a.deadline.text) : t('na');
  const docs = (A.docs || []).length
    ? list(A.docs.map(d => `<b>${esc(tx(d.t))}</b><br><span class="hint">${progs(d.p)}</span>`))
    : `<p>${t('noDocs')}</p>`;
  $('adm').innerHTML = cutoff +
    tile(t('deadlineFor'), big(mine) + `<p class="hint">${t('deadline')}: ${A.deadline}</p>`) +
    tile(t('interview'), big(yesNo(a.iv.state)) + `<p class="hint">${(A.iv || []).length ? t('ivList', { p:progs(A.iv) }) : t('noIv')}</p>`) +
    tile(t('topSchol'), big(A.scholMax ? t('upTo', { v:money(A.scholMax) }) : t('na'))) +
    ((A.dl || []).length ? tile(t('otherDeadlines'), list(A.dl.map(r => `<b>${r.d}</b> · ${progs(r.p)}`)), true) : '') +
    tile(t('docs'), docs, true) +
    tile(t('scholarships'), list(tx(u.life.schol)), true) +
    tile(t('notes'), `<p>${esc(tx(A.note) || '')}</p><p class="hint">${t('sources')}: ${(A.src || []).map((s, i) => `<a href="${esc(s)}" title="${esc(s)}" target="_blank" rel="noopener">${i + 1}. ${esc(s.replace(/^https?:\/\/(www\.)?/, '').split('/')[0])}</a>`).join(' · ')}</p>`, true);
}

// Program list of the open university, grouped by faculty, filtered by the text box
function renderPrograms(){
  const u = curUni, P = programsOf(u), q = norm($('pfilter').value);
  if (!P.length){ $('plist').innerHTML = `<p class="hint">${t('noProgs')}</p>`; $('pcount').textContent = ''; return; }
  const hit = p => !q || [p.n, p.e || '', p.d || '', p.f || '', ...(p.s || [])].some(x => norm(x).includes(q));
  const groups = {};
  let n = 0;
  P.forEach(p => { if (hit(p)){ (groups[p.f || '—'] = groups[p.f || '—'] || []).push(p); n++; } });
  const faculties = Object.keys(groups);
  $('pcount').textContent = t('pcount', { n, t:P.length });
  $('plist').innerHTML = n ? faculties.map(fac => {
    const ps = groups[fac], anyMatch = ps.some(p => matchProgram(p, S.sel));
    const open = q || anyMatch || faculties.length <= 2;
    return `<details class="fac"${open ? ' open' : ''}><summary>${esc(fac)} <span class="hint">${ps.length}</span></summary>
      ${ps.map(p => {
        // Show the official name first; the English equivalent (if any) is shown as a hint in English mode
        const sub = p.e && LANG === 'en' ? ` <span class="hint">${esc(p.e)}</span>` : '';
        return `<div class="prog${matchProgram(p, S.sel) ? ' hit' : ''}">
        <div class="phead"><b>${esc(p.n)}</b>${sub}
          <span class="pmeta">${esc(p.d || '')} · ${catName(p.c)} · ${t('needs', { v:needText(u, p.c) })}</span></div>
        ${p.s && p.s.length ? `<div class="chips">${p.s.map(s => `<span>${esc(s)}</span>`).join('')}</div>` : ''}
      </div>`; }).join('')}</details>`;
  }).join('') : `<p class="hint">${t('noFilter')}</p>`;
}

let curTab = 'living';
function showTab(name){
  curTab = name;
  document.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === name));
  TABS.forEach(k => $(k).classList.toggle('on', k === name));
}

function initUniversity(){
  document.querySelector('.tabs').addEventListener('click', e => { if (e.target.dataset.tab) showTab(e.target.dataset.tab); });
}
