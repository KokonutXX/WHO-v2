/* =====================================================
   ADMISSION: green / orange / red logic
   Quebec schools use the R-score, Ontario schools use the grade %.
   Tolerance: 2 points for R-score, 3 points for grade. Change it below.
   ===================================================== */
const TOLERANCE = { r:2, g:3 };

function fit(u){
  const rq = u.req[S.prog];
  if (!rq) return null;                                   // program not offered
  const useR = u.prov === 'QC' && S.r != null;
  const val  = useR ? S.r : (S.g != null ? S.g : S.r);
  if (val == null) return { c:'o', d:-0.5 };               // nothing entered
  const which = (useR || S.g == null) ? 0 : 1;            // 0 = R-score, 1 = grade
  const req = rq[which] || rq[1 - which];
  const tol = which === 0 ? TOLERANCE.r : TOLERANCE.g;
  const d = val - req;                                    // d = how far above the requirement
  return { c: d >= tol ? 'g' : d >= -tol ? 'o' : 'r', d };
}
