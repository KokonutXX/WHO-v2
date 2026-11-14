/* =====================================================
   UTILS: shared helpers, app state, page navigation
   ===================================================== */
const $ = id => document.getElementById(id);
const money = n => LANG === 'fr' ? n.toLocaleString('fr-CA') + ' $' : '$' + n.toLocaleString('en-CA');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

// Lowercase, no accents, single spaces: used to compare program names
const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[’']/g, ' ').replace(/[^a-z0-9&+]+/g, ' ').trim();

// What the user typed on page 1
//   sel.type: 'cat'  -> a whole category (sel.key = category id)
//             'prog' -> a program name picked from the list (sel.key = normalized English name)
//             'text' -> free-text keyword (sel.key = normalized text, sel.txt = what was typed)
const S = { sel:null, r:null, g:null, loc:'', rad:0 };

// Admission colors and labels (c = 'g' | 'o' | 'r')
const COLORS = { g:'var(--green)', o:'var(--orange)', r:'var(--red)' };
const HEX    = { g:'#1fa463', o:'#f08a1c', r:'#e5484d' };      // same colors, for the map markers
const label  = c => t('lg_' + c);

const provName = p => p === 'QC' ? (LANG === 'fr' ? 'Québec' : 'Quebec') : 'Ontario';
const programsOf = u => PROGRAM_DATA[u.id] || [];

// Distance in km between two [lat, lon] points
const km = (a, b) => {
  const r = x => x * Math.PI / 180, d = r(b[0]-a[0]), e = r(b[1]-a[1]);
  const h = Math.sin(d/2)**2 + Math.cos(r(a[0])) * Math.cos(r(b[0])) * Math.sin(e/2)**2;
  return 12742 * Math.asin(Math.sqrt(h));
};

// "DD/MM/YY" -> sortable number YYMMDD (null if missing)
const dateNum = s => { const m = /^(\d\d)\/(\d\d)\/(\d\d)$/.exec(s || ''); return m ? +(m[3] + m[2] + m[1]) : null; };

// Zoom navigation: earlier pages zoom past the camera, later pages wait small
let curPage = 0;
function go(n){
  curPage = n;
  document.querySelectorAll('.page').forEach((p, i) => {
    p.classList.toggle('active', i === n);
    p.classList.toggle('past', i < n);
    p.scrollTop = 0;
  });
  if (n === 1) setTimeout(fixMap, 750);     // the map must be resized once its page is visible
}
