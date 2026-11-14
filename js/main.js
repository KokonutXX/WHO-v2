/* =====================================================
   MAIN: starts everything
   ===================================================== */

// Re-render everything that's on screen after a language switch
function refreshLang(){
  refreshSearch();
  if (S.sel) renderResults();
  if (curUni){
    const f = fit(curUni), pf = $('pfilter') ? $('pfilter').value : '';
    if (f && !f.missing){ renderUni(); showTab(curTab); if (pf){ $('pfilter').value = pf; renderPrograms(); } }
  }
}

applyStatic();
initSearch();
initResults();
initUniversity();
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(+b.dataset.go)));
document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
