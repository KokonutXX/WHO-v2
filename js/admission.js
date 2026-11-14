/* =====================================================
   ADMISSION: which programs match the search, and the green / orange / red logic
   Quebec schools use the R-score, Ontario schools use the grade %.
   Each program inherits the cutoff of its category at that university (UNIS[].req).
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
  return u.prov === 'QC' && rq[0] ? 'R-score ' + rq[0] : rq[1] + '%';
}

const hasWord = (hay, w) => (' ' + hay + ' ').includes(' ' + w + ' ');
const namesOf = p => p.e ? [norm(p.n), norm(p.e)] : [norm(p.n)];

// Does one program match the current search? -> 'exact' | 'related' | null
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

// Admission chance against one cutoff
function fitReq(u, rq){
  const useR = u.prov === 'QC' && S.r != null;
  const val  = useR ? S.r : (S.g != null ? S.g : S.r);
  if (val == null) return { c:'o', d:-0.5 };               // nothing entered
  const which = (useR || S.g == null) ? 0 : 1;            // 0 = R-score, 1 = grade
  const req = rq[which] || rq[1 - which];
  const tol = which === 0 ? TOLERANCE.r : TOLERANCE.g;
  const d = val - req;                                    // d = how far above the requirement
  return { c: d >= tol ? 'g' : d >= -tol ? 'o' : 'r', d };
}

// Result for a university: null if nothing matches, otherwise
// { c, d, cat (category used), m (matching programs), exact (true if a real match) }
function fit(u){
  const m = matchesFor(u);
  if (!m.length) return null;
  let best = null;
  [...new Set(m.map(x => x.p.c))].forEach(cat => {
    const r = fitReq(u, reqFor(u, cat));
    if (!best || r.d > best.d) best = Object.assign(r, { cat });
  });
  return Object.assign(best, { m, exact: m[0].exact });
}
