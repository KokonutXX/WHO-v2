/* =====================================================
   ADMISSION: which programs match the search, the green / orange / red logic,
   and program-aware admission details (deadline, documents, interview).
   Quebec schools use the R-score, Ontario schools use the grade %.
   Each program inherits the cutoff of its category at that university (UNIS[].req).
   If the user's score can't be compared (e.g. only an R-score for an Ontario school
   that only publishes a grade %), the university is hidden and counted as "missing data".
   Tolerance: 2 points for R-score, 3 points for grade. Change it below.
   ===================================================== */
const TOLERANCE = { r:2, g:3 };

// Cutoff [R-score, grade %] for a category at a university.
// If the university has no estimate for that category, use its average.
function reqFor(u, cat){
  if (u.req[cat]) return u.req[cat];
  const v = Object.values(u.req), avg = i => Math.round(v.reduce((s, x) => s + x[i], 0) / v.length);
  return [avg(0), avg(1)];
}

// Text shown as "needs ..." for a category at a university
function needText(u, cat){
  const rq = reqFor(u, cat);
  return u.prov === 'QC' && rq[0] ? t('rscore') + ' ' + rq[0] : rq[1] + ' %';
}

const hasWord = (hay, w) => (' ' + hay + ' ').includes(' ' + w + ' ');
const namesOf = p => p.e ? [norm(p.n), norm(p.e)] : [norm(p.n)];

// Does one program match the search? -> 'exact' | 'related' | null
function matchProgram(p, sel){
  if (!sel) return null;
  if (sel.type === 'cat') return p.c === sel.key ? 'exact' : null;
  const names = namesOf(p), subs = (p.s || []).map(norm);
  if (sel.type === 'prog'){
    if (names.includes(sel.key)) return 'exact';
    return names.some(n => hasWord(n, sel.key)) || subs.some(s => hasWord(s, sel.key)) ? 'related' : null;
  }
  // free text: partial words allowed
  if (names.some(n => n.includes(sel.key))) return 'exact';
  return subs.some(s => s.includes(sel.key)) ? 'related' : null;
}

// Programs at university u matching the search: [{ p, exact }]
// If any exact matches exist, related ones are dropped.
function matchesFor(u){
  const m = [];
  programsOf(u).forEach(p => { const k = matchProgram(p, S.sel); if (k) m.push({ p, exact: k === 'exact' }); });
  return m.some(x => x.exact) ? m.filter(x => x.exact) : m;
}

// Admission chance against one cutoff.
// Returns null when the user entered a score this university doesn't publish a requirement for.
function fitReq(u, rq){
  if (S.r == null && S.g == null) return { c:'o', d:-0.5, k:null };    // nothing entered
  const canR = S.r != null && rq[0] > 0, canG = S.g != null && rq[1] > 0;
  const order = u.prov === 'QC' ? ['r', 'g'] : ['g', 'r'];             // preferred score first
  const k = order.find(x => x === 'r' ? canR : canG);
  if (!k) return null;                                                 // data missing
  const d = k === 'r' ? S.r - rq[0] : S.g - rq[1];                     // how far above the requirement
  const tol = k === 'r' ? TOLERANCE.r : TOLERANCE.g;
  return { c: d >= tol ? 'g' : d >= -tol ? 'o' : 'r', d, k };          // k = score compared ('r' | 'g')
}

// Result for a university:
//   null                          -> no matching program
//   { missing:true, m }           -> offers the program, but the score entered can't be compared
//   { c, d, cat, m, exact }       -> color, distance from cutoff, category used, matches
function fit(u){
  const m = matchesFor(u);
  if (!m.length) return null;
  let best = null;
  [...new Set(m.map(x => x.p.c))].forEach(cat => {
    const r = fitReq(u, reqFor(u, cat));
    if (r && (!best || r.d > best.d)) best = Object.assign(r, { cat });
  });
  if (!best) return { missing:true, m };
  return Object.assign(best, { m, exact: m[0].exact });
}

/* ---------- Admission details (js/admissions.js) for the matched programs ---------- */
const applies = (list, p) => !!list && (list.includes('*') || list.includes(p.n));

// { deadline:{n (sortable), text, varies}, docs:{state, types[]}, iv:{state}, scholMax } or null
function admInfo(u, m){
  const A = ADMISSIONS[u.id];
  if (!A) return null;
  const P = m.map(x => x.p);
  // deadline: program override or general
  const dates = P.map(p => { const o = (A.dl || []).find(r => applies(r.p, p)); return o ? o.d : A.deadline; }).filter(Boolean);
  const nums = dates.map(dateNum).filter(x => x != null);
  const min = nums.length ? Math.min(...nums) : null;
  const first = dates.find(d => dateNum(d) === min) || A.deadline;
  const varies = new Set(nums).size > 1;
  // documents beyond grades
  const docTypes = new Set(); let withDocs = 0;
  P.forEach(p => { const ds = (A.docs || []).filter(r => applies(r.p, p)); if (ds.length) withDocs++; ds.forEach(r => docTypes.add(tx(r.t))); });
  // interview
  const withIv = P.filter(p => applies(A.iv, p)).length;
  const state = (k, n) => k === 0 ? 'no' : k === n ? 'yes' : 'some';
  return {
    deadline:{ n:min, text:first, varies },
    docs:{ state:state(withDocs, P.length), types:[...docTypes] },
    iv:{ state:state(withIv, P.length) },
    scholMax: A.scholMax ?? null
  };
}
