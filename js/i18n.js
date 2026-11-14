/* =====================================================
   I18N: English / French. The app always opens in English; the toggle switches for the current visit.
   - Static text in index.html uses data-i18n="key" (text), data-i18n-ph (placeholder),
     data-i18n-aria (aria-label).
   - JS uses t('key', {var}) and tx(value) for data written as {en:'…', fr:'…'}.
   ===================================================== */
let LANG = 'en';
try { localStorage.removeItem('lang'); } catch (e) {}     // forget the choice saved by older versions

const I18N = {
  en: {
    tagline:'Less searching, more discovering.', tagline2:'Find your UniVerse-ty', sub:'Quebec and Ontario, compared side by side.',
    program:'Program', progPh:'Search a program, e.g. Kinesiology, Software Engineering, Nursing',
    rscoreOpt:'R-score (optional)', gradeOpt:'Grade % (optional)', eg:'e.g. {v}',
    location:'Location', cityOpt:'City (optional)', within:'Within', anywhere:'Anywhere', search:'Search',
    language:'Language',
    errProg:'Type or pick a program.', errNoMatch:'No program matches {q}. Try another word or pick from the list.',
    errCity:'Pick a city from the list, or leave location empty.',
    allCat:'All {c} programs', univ1:'university', univN:'universities',
    moreOpts:'{n} more… keep typing to narrow down', noOpt:'No program name matches. Press Search to look for “{q}” as a keyword.',
    newSearch:'New search', yourSearch:'Your search', rscore:'R-score', grade:'Grade', sortBy:'Sort by', alsoShow:'Also show',
    map:'Map', mapBig:'⤢ Enlarge', mapClose:'✕ Close', vsCutoff:'Above / below cutoff', enterScore:'enter a score',
    nSelected:'{n} selected', sortDirHint:'Sort direction (click to reverse)',
    d_asc:'Lowest to highest', d_desc:'Highest to lowest', d_early:'Earliest to latest', d_late:'Latest to earliest',
    d_near:'Closest to farthest', d_far:'Farthest to closest', d_noFirst:'Not required first', d_yesFirst:'Required first',
    d_best:'Best to worst chance', d_worst:'Worst to best chance',
    lg_g:'You should get in', lg_o:'It depends', lg_r:'Unlikely',
    needs:'needs {v}', related:'Related: ', more:'+{n} more',
    empty:'No universities match. Try a larger distance or a different program.',
    missing:'Not all applicable universities are shown: {n} {u} offering this program don’t publish a requirement for the score you entered (Ontario universities use a grade %, Quebec universities use the R-score). Enter your {other} to see them.',
    otherGrade:'grade %', otherR:'R-score',
    // sort + also-show fields
    s_fit:'Best chance of admission', s_rscore:'R-score (0–40)', s_grade:'Grade (0–100%)', s_distance:'Distance (km)',
    s_deadline:'Admission deadline (DD/MM/YY)', s_docs:'Admission documents (Y/N + type)', s_interview:'Interview (Y/N)',
    s_tuition:'Tuition cost ($ CAD)', s_clubs:'Student clubs (number)', s_schol:'Scholarships ($ CAD)',
    s_living:'Living cost (rent + groceries)', s_success:'Success rate',
    f_rscore:'R-score required', f_grade:'Grade required', f_distance:'Distance', f_deadline:'Deadline', f_docs:'Documents',
    f_interview:'Interview', f_tuition:'Tuition', f_clubs:'Clubs', f_schol:'Top entrance scholarship', f_living:'Living cost', f_success:'Success rate',
    yes:'Yes', no:'No', some:'Some programs', na:'—', gradeOnly:'grade % only', setLoc:'set a location',
    perYear:'/yr', perMonth:'/mo', upTo:'up to {v}', from:'from {v}', distSortHint:'Pick a location on the search page to sort by distance.',
    // university page
    back:'Back to results', tLiving:'Living', tLife:'Student life', tAdm:'Admission', tProg:'Programs',
    rent:'Rent (room in shared apartment)', groceries:'Groceries', livingCost:'Living cost (rent + groceries)', dorm:'Dorm',
    transit:'Bus / metro pass', car:'Car (insurance, gas, parking)', social:'Social life', loans:'Loans and bursaries',
    clubs:'Student clubs', success:'Graduation success rate', tour:'Campus tour and map', tourLink:'Open campus tour and map',
    facilities:'Facilities', comments:'What current students say', scholarships:'Scholarships',
    cutoff:'Estimated cutoff for {p}', deadline:'Application deadline', deadlineFor:'Deadline for your program(s)',
    otherDeadlines:'Program-specific deadlines', docs:'Documents required beyond grades', noDocs:'None beyond the application and grades.',
    allProgs:'all programs', interview:'Interview / audition', ivList:'Required for: {p}', noIv:'No interview for most programs.',
    topSchol:'Top entrance scholarship', notes:'Notes', sources:'Sources', noAdm:'Admission details not available yet.',
    filterPh:'Filter {n} programs (name, option, degree…)', filterAria:'Filter programs', pcount:'{n} of {t} programs',
    cutoffNote:'Cutoffs are estimates by field of study. Always check the university’s official admission page.',
    noProgs:'Program list not available yet for this university.', noFilter:'No program matches this filter.',
    gov_QC:'Aide financière aux études (AFE): government loans and bursaries for Quebec residents, based on need.',
    gov_ON:'OSAP: Ontario Student Assistance Program, combining grants and loans based on need.'
  },
  fr: {
    tagline:'Moins de recherche, plus de découvertes.', tagline2:'Trouvez votre UniVerse-ité', sub:'Le Québec et l’Ontario, comparés côte à côte.',
    program:'Programme', progPh:'Cherchez un programme, ex. Kinésiologie, Génie logiciel, Droit',
    rscoreOpt:'Cote R (facultatif)', gradeOpt:'Moyenne % (facultatif)', eg:'ex. {v}',
    location:'Lieu', cityOpt:'Ville (facultatif)', within:'Dans un rayon de', anywhere:'Partout', search:'Rechercher',
    language:'Langue',
    errProg:'Tapez ou choisissez un programme.', errNoMatch:'Aucun programme ne correspond à {q}. Essayez un autre mot ou choisissez dans la liste.',
    errCity:'Choisissez une ville dans la liste, ou laissez le lieu vide.',
    allCat:'Tous les programmes – {c}', univ1:'université', univN:'universités',
    moreOpts:'{n} de plus… continuez à taper pour préciser', noOpt:'Aucun nom de programme ne correspond. Appuyez sur Rechercher pour chercher « {q} » comme mot-clé.',
    newSearch:'Nouvelle recherche', yourSearch:'Votre recherche', rscore:'Cote R', grade:'Moyenne', sortBy:'Trier par', alsoShow:'Afficher aussi',
    map:'Carte', mapBig:'⤢ Agrandir', mapClose:'✕ Fermer', vsCutoff:'Écart avec le seuil', enterScore:'entrez une note',
    nSelected:'{n} sélectionné(s)', sortDirHint:'Ordre de tri (cliquez pour inverser)',
    d_asc:'Du plus bas au plus élevé', d_desc:'Du plus élevé au plus bas', d_early:'Du plus tôt au plus tard', d_late:'Du plus tard au plus tôt',
    d_near:'Du plus proche au plus loin', d_far:'Du plus loin au plus proche', d_noFirst:'Non exigé d’abord', d_yesFirst:'Exigé d’abord',
    d_best:'Des meilleures aux pires chances', d_worst:'Des pires aux meilleures chances',
    lg_g:'Vous devriez être admis', lg_o:'Ça dépend', lg_r:'Peu probable',
    needs:'exige {v}', related:'Connexe : ', more:'+{n} autres',
    empty:'Aucune université ne correspond. Essayez une plus grande distance ou un autre programme.',
    missing:'Les universités applicables ne sont pas toutes affichées : {n} {u} offrant ce programme ne publient pas d’exigence pour la note saisie (les universités ontariennes utilisent la moyenne %, les universités québécoises la cote R). Entrez votre {other} pour les voir.',
    otherGrade:'moyenne %', otherR:'cote R',
    s_fit:'Meilleures chances d’admission', s_rscore:'Cote R (0–40)', s_grade:'Moyenne (0–100 %)', s_distance:'Distance (km)',
    s_deadline:'Date limite d’admission (JJ/MM/AA)', s_docs:'Documents d’admission (O/N + type)', s_interview:'Entrevue (O/N)',
    s_tuition:'Droits de scolarité ($ CA)', s_clubs:'Associations étudiantes (nombre)', s_schol:'Bourses ($ CA)',
    s_living:'Coût de la vie (loyer + épicerie)', s_success:'Taux de réussite',
    f_rscore:'Cote R exigée', f_grade:'Moyenne exigée', f_distance:'Distance', f_deadline:'Date limite', f_docs:'Documents',
    f_interview:'Entrevue', f_tuition:'Droits de scolarité', f_clubs:'Associations', f_schol:'Meilleure bourse d’admission', f_living:'Coût de la vie', f_success:'Taux de réussite',
    yes:'Oui', no:'Non', some:'Certains programmes', na:'—', gradeOnly:'moyenne % seulement', setLoc:'choisir un lieu',
    perYear:'/an', perMonth:'/mois', upTo:'jusqu’à {v}', from:'dès le {v}', distSortHint:'Choisissez un lieu sur la page de recherche pour trier par distance.',
    back:'Retour aux résultats', tLiving:'Vie quotidienne', tLife:'Vie étudiante', tAdm:'Admission', tProg:'Programmes',
    rent:'Loyer (chambre en colocation)', groceries:'Épicerie', livingCost:'Coût de la vie (loyer + épicerie)', dorm:'Résidence',
    transit:'Laissez-passer bus / métro', car:'Voiture (assurance, essence, stationnement)', social:'Vie sociale', loans:'Prêts et bourses',
    clubs:'Associations étudiantes', success:'Taux de diplomation', tour:'Visite et plan du campus', tourLink:'Ouvrir la visite et le plan du campus',
    facilities:'Installations', comments:'Ce qu’en disent les étudiants', scholarships:'Bourses',
    cutoff:'Seuil estimé pour {p}', deadline:'Date limite de demande', deadlineFor:'Date limite pour votre ou vos programmes',
    otherDeadlines:'Dates limites particulières', docs:'Documents exigés en plus des notes', noDocs:'Aucun en plus de la demande et des notes.',
    allProgs:'tous les programmes', interview:'Entrevue / audition', ivList:'Exigée pour : {p}', noIv:'Pas d’entrevue pour la plupart des programmes.',
    topSchol:'Meilleure bourse d’admission', notes:'Remarques', sources:'Sources', noAdm:'Détails d’admission pas encore disponibles.',
    filterPh:'Filtrer {n} programmes (nom, option, grade…)', filterAria:'Filtrer les programmes', pcount:'{n} sur {t} programmes',
    cutoffNote:'Les seuils sont des estimations par domaine d’études. Vérifiez toujours la page d’admission officielle de l’université.',
    noProgs:'Liste des programmes pas encore disponible pour cette université.', noFilter:'Aucun programme ne correspond à ce filtre.',
    gov_QC:'Aide financière aux études (AFE) : prêts et bourses du gouvernement pour les résidents du Québec, selon les besoins.',
    gov_ON:'RAFEO (OSAP) : Régime d’aide financière aux étudiantes et étudiants de l’Ontario, combinant bourses et prêts selon les besoins.'
  }
};

// Translate a key, filling {placeholders}
function t(key, vars){
  let s = (I18N[LANG] && I18N[LANG][key]) ?? I18N.en[key] ?? key;
  if (vars) Object.keys(vars).forEach(k => { s = s.split('{' + k + '}').join(vars[k]); });
  return s;
}
// Pick the current language from data written as {en:…, fr:…} (anything else is returned as-is)
const tx = v => (v && typeof v === 'object' && !Array.isArray(v) && ('en' in v || 'fr' in v)) ? (v[LANG] ?? v.en) : v;

// Fill static text in index.html
function applyStatic(){
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh, { v: el.dataset.v }); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  document.querySelectorAll('.lang button').forEach(b => {
    b.classList.toggle('on', b.dataset.lang === LANG);
    b.setAttribute('aria-pressed', b.dataset.lang === LANG);
  });
}

// Switch language and re-render whatever is on screen
function setLang(l){
  LANG = l;
  applyStatic();
  refreshLang();            // defined in main.js
}
