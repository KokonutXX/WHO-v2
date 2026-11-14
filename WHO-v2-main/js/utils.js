/* =====================================================
   UTILS: shared helpers, app state, page navigation
   ===================================================== */
const $ = id => document.getElementById(id);
const money = n => '$' + n.toLocaleString('en-CA');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

// Lowercase, no accents, single spaces: used to compare program names
const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[’']/g, ' ').replace(/[^a-z0-9&+]+/g, ' ').trim();

// What the user typed on page 1
//   sel.type: 'cat'  -> a whole category (sel.key = category id)
//             'prog' -> a program name picked from the list (sel.key = normalized name)
//             'text' -> free-text keyword (sel.key = normalized text)
const S = { sel:null, r:null, g:null, loc:'', rad:0 };

// Admission colors and labels (c = 'g' | 'o' | 'r')
const COLORS = { g:'var(--green)', o:'var(--orange)', r:'var(--red)' };
const LABELS = { g:'You should get in', o:'It depends', r:'Unlikely' };

const provName = p => p === 'QC' ? 'Quebec' : 'Ontario';
const programsOf = u => PROGRAM_DATA[u.id] || [];

// Distance in km between two [lat, lon] points
const km = (a, b) => {
  const t = x => x * Math.PI / 180, d = t(b[0]-a[0]), e = t(b[1]-a[1]);
  const h = Math.sin(d/2)**2 + Math.cos(t(a[0])) * Math.cos(t(b[0])) * Math.sin(e/2)**2;
  return 12742 * Math.asin(Math.sqrt(h));
};

// Zoom navigation: earlier pages zoom past the camera, later pages wait small
function go(n){
  document.querySelectorAll('.page').forEach((p, i) => {
    p.classList.toggle('active', i === n);
    p.classList.toggle('past', i < n);
    p.scrollTop = 0;
  });
}
