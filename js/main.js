/* =====================================================
   MAIN: starts everything
   ===================================================== */
initSearch();
initResults();
initUniversity();
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(+b.dataset.go)));
