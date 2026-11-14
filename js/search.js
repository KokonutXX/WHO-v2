/* =====================================================
   PAGE 1: SEARCH (program combo box + form)
   ===================================================== */
const programList = Object.entries(PROGRAMS);

function fillOpts(){
  const q = $('prog').value.toLowerCase();
  $('opts').innerHTML = programList
    .filter(([, n]) => n.toLowerCase().includes(q))
    .map(([k, n]) => `<li data-k="${k}">${n}</li>`).join('');
  $('opts').classList.add('open');
}

function initSearch(){
  $('prog').addEventListener('focus', fillOpts);
  $('prog').addEventListener('input', fillOpts);
  $('prog').addEventListener('blur', () => setTimeout(() => $('opts').classList.remove('open'), 120));
  $('opts').addEventListener('mousedown', e => {
    const li = e.target.closest('li');
    if (li){ $('prog').value = PROGRAMS[li.dataset.k]; $('opts').classList.remove('open'); }
  });
  $('cities').innerHTML = Object.keys(CITIES).map(c => `<option value="${c}">`).join('');

  $('form').addEventListener('submit', e => {
    e.preventDefault();
    const hit = programList.find(([, n]) => n.toLowerCase() === $('prog').value.trim().toLowerCase());
    const loc = Object.keys(CITIES).find(c => c.toLowerCase() === $('loc').value.trim().toLowerCase());
    if (!hit){ $('prog').classList.add('bad'); $('err').textContent = 'Pick a program from the list.'; return; }
    if ($('loc').value.trim() && !loc){ $('err').textContent = 'Pick a city from the list, or leave location empty.'; return; }
    $('prog').classList.remove('bad'); $('err').textContent = '';
    S.prog = hit[0];
    S.r = $('rs').value === '' ? null : +$('rs').value;
    S.g = $('gr').value === '' ? null : +$('gr').value;
    S.loc = loc || ''; S.rad = +$('rad').value;
    renderResults(); go(1);
  });
}
