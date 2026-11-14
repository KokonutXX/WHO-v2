/* =====================================================
   UTILS: shared helpers, app state, page navigation
   ===================================================== */
const $ = id => document.getElementById(id);
const money = n => '$' + n.toLocaleString('en-CA');

// What the user typed on page 1
const S = { prog:null, r:null, g:null, loc:'', rad:0 };

// Admission colors and labels (c = 'g' | 'o' | 'r')
const COLORS = { g:'var(--green)', o:'var(--orange)', r:'var(--red)' };
const LABELS = { g:'You should get in', o:'It depends', r:'Unlikely' };

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
