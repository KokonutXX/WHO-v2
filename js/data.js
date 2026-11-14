/* =====================================================
   DATA: edit this file to change universities & categories.
   Text shown to users is written {en:'…', fr:'…'}.
   Cost / cutoff numbers are estimates or placeholders. Replace with real figures.
   Program lists live in js/programs/<university id>.js
   Admission deadlines / documents / interviews live in js/admissions.js
   ===================================================== */

// Fields of study. Every program belongs to one category, and inherits that
// category's admission cutoff at its university (see `req` below).
const CATEGORIES = {
  cs:{en:'Computer Science & IT', fr:'Informatique et TI'}, eng:{en:'Engineering', fr:'Génie'},
  sci:{en:'Natural Sciences & Math', fr:'Sciences naturelles et mathématiques'},
  nur:{en:'Health & Medical sciences', fr:'Sciences de la santé'}, psy:{en:'Psychology', fr:'Psychologie'},
  bus:{en:'Business', fr:'Administration et gestion'}, soc:{en:'Social Sciences', fr:'Sciences sociales'},
  hum:{en:'Humanities & Languages', fr:'Lettres, langues et sciences humaines'},
  art:{en:'Arts, Design & Architecture', fr:'Arts, design et architecture'},
  edu:{en:'Education', fr:'Éducation'}, law:{en:'Law', fr:'Droit'}
};
const catName = k => CATEGORIES[k] ? tx(CATEGORIES[k]) : k;

// Filled by js/programs/*.js : PROGRAM_DATA[<uni id>] = [ {n, e?, d, f, c, s:[]} , ... ]
//   n = official name, e = English name (if n is French), d = degree, f = faculty,
//   c = category key (above), s = sub-programs (options, streams, honours, co-op...)
const PROGRAM_DATA = {};
// Filled by js/admissions.js : ADMISSIONS[<uni id>] = { deadline, dl, docs, iv, scholMax, note, src }
const ADMISSIONS = {};

// City coordinates [lat, lon] (used for the distance filter). fr = French name if different.
const CITIES = {
  'Montréal':[45.50,-73.57], 'Québec City':[46.81,-71.21], 'Sherbrooke':[45.40,-71.89],
  'Ottawa':[45.42,-75.70], 'Toronto':[43.65,-79.38], 'Kingston':[44.23,-76.49],
  'Hamilton':[43.26,-79.87], 'Waterloo':[43.47,-80.52], 'London':[42.98,-81.25],
  'St. Catharines':[43.16,-79.24]
};
const CITY_FR = { 'Québec City':'Québec' };
const cityName = c => LANG === 'fr' ? (CITY_FR[c] || c) : c;

/* Universities
   id:     matches the file names in js/programs/ and the keys in js/admissions.js
   ll:     campus coordinates [lat, lon] (map marker + distance)
   req:    category -> [minimum R-score, minimum grade %]  (estimates, inherited by every program in that category)
   living: rent / groceries / dorm / transit pass / car (all $ per month) + social text
   life:   clubs, success (% graduating), facilities, schol (scholarship names), tour (link), comments */
const UNIS = [
 { id:'mcgill', name:'McGill University', city:'Montréal', prov:'QC', ll:[45.5048,-73.5772], tuition:9500,
   req:{cs:[34,92],eng:[33,91],sci:[31,88],nur:[31,88],psy:[32,89],bus:[33,90],soc:[30,87],hum:[28,85],art:[28,84],edu:[27,83],law:[34,92]},
   living:{rent:1150,groceries:400,dorm:900,transit:94,car:650,social:{en:'Plateau and downtown nightlife, big international crowd.',fr:'Vie nocturne du Plateau et du centre-ville, grande communauté internationale.'}},
   life:{clubs:300,success:89,facilities:{en:['Computing labs','Redpath library','Sports complex'],fr:['Laboratoires informatiques','Bibliothèque Redpath','Complexe sportif']},schol:{en:['Entrance excellence award','Faculty bursaries'],fr:['Bourse d’excellence d’admission','Bourses facultaires']},tour:'https://www.mcgill.ca',comments:{en:['“Great research access, heavy workload.”','“The city is the best part.”'],fr:['« Excellent accès à la recherche, charge de travail élevée. »','« La ville est le meilleur atout. »']}}},
 { id:'udem', name:'Université de Montréal', city:'Montréal', prov:'QC', ll:[45.5017,-73.6153], tuition:3200,
   req:{cs:[31,88],eng:[31,88],sci:[29,85],nur:[29,85],psy:[30,86],bus:[30,86],soc:[28,84],hum:[26,80],art:[26,80],edu:[26,80],law:[32,90]},
   living:{rent:1000,groceries:400,dorm:650,transit:94,car:620,social:{en:'Student bars near Côte-des-Neiges and lots of French-language events.',fr:'Bars étudiants près de Côte-des-Neiges et nombreux événements en français.'}},
   life:{clubs:250,success:84,facilities:{en:['Science labs','Mount Royal-side campus','Clinical simulation center'],fr:['Laboratoires de sciences','Campus au flanc du mont Royal','Centre de simulation clinique']},schol:{en:['Excellence scholarships','Program bursaries'],fr:['Bourses d’excellence','Bourses de programme']},tour:'https://www.umontreal.ca',comments:{en:['“Big campus, friendly profs.”'],fr:['« Grand campus, profs sympathiques. »']}}},
 { id:'concordia', name:'Concordia University', city:'Montréal', prov:'QC', ll:[45.4972,-73.5790], tuition:7800,
   req:{cs:[29,85],eng:[29,86],sci:[26,80],nur:[27,82],psy:[28,83],bus:[28,83],soc:[25,78],hum:[24,76],art:[25,78],edu:[24,76],law:[26,80]},
   living:{rent:1050,groceries:400,dorm:700,transit:94,car:630,social:{en:'Downtown campus, strong arts and club scene.',fr:'Campus au centre-ville, scène artistique et associative très active.'}},
   life:{clubs:200,success:78,facilities:{en:['Hive makerspace','Computer labs','Library'],fr:['Atelier de fabrication Hive','Laboratoires informatiques','Bibliothèque']},schol:{en:['Entrance scholarships','Co-op awards'],fr:['Bourses d’admission','Bourses de stages coop']},tour:'https://www.concordia.ca',comments:{en:['“Flexible schedules and real city life.”'],fr:['« Horaires flexibles et vraie vie urbaine. »']}}},
 { id:'uqam', name:'Université du Québec à Montréal (UQAM)', city:'Montréal', prov:'QC', ll:[45.5130,-73.5600], tuition:3200,
   req:{cs:[26,80],eng:[27,82],sci:[25,78],nur:[26,80],psy:[29,85],bus:[25,78],soc:[25,78],hum:[23,75],art:[24,76],edu:[25,78],law:[27,82]},
   living:{rent:1000,groceries:400,dorm:650,transit:94,car:620,social:{en:'Right in the Quartier latin and Quartier des spectacles: festivals, cafés and a very active student union.',fr:'En plein Quartier latin et Quartier des spectacles : festivals, cafés et vie associative très active.'}},
   life:{clubs:150,success:76,facilities:{en:['Cœur des sciences','Central library','Sports centre'],fr:['Cœur des sciences','Bibliothèque centrale','Centre sportif']},schol:{en:['Fondation UQAM scholarships','Excellence bursaries'],fr:['Bourses de la Fondation UQAM','Bourses d’excellence']},tour:'https://uqam.ca',comments:{en:['“Downtown everything, very affordable.”'],fr:['« Tout est au centre-ville, très abordable. »']}}},
 { id:'ets', name:'École de technologie supérieure (ÉTS)', city:'Montréal', prov:'QC', ll:[45.4946,-73.5622], tuition:3300,
   req:{cs:[26,80],eng:[26,80],sci:[25,78],art:[25,78]},
   living:{rent:1050,groceries:400,dorm:700,transit:94,car:630,social:{en:'Griffintown campus surrounded by new condos, cafés and the Lachine Canal.',fr:'Campus de Griffintown entouré de cafés, de nouveaux condos et du canal de Lachine.'}},
   life:{clubs:60,success:80,facilities:{en:['Student technical clubs workshops','Engineering labs','On-campus residences'],fr:['Ateliers des clubs scientifiques','Laboratoires de génie','Résidences sur le campus']},schol:{en:['Entrance scholarships','Co-op internship pay'],fr:['Bourses d’admission','Stages coopératifs rémunérés']},tour:'https://www.etsmtl.ca',comments:{en:['“Hands-on engineering with mandatory paid internships.”'],fr:['« Du génie concret avec des stages rémunérés obligatoires. »']}}},
 { id:'ulaval', name:'Université Laval', city:'Québec City', prov:'QC', ll:[46.7817,-71.2747], tuition:3100,
   req:{cs:[28,84],eng:[29,85],sci:[27,82],nur:[28,84],psy:[28,83],bus:[27,82],soc:[26,80],hum:[25,78],art:[25,78],edu:[26,80],law:[30,86]},
   living:{rent:800,groceries:380,dorm:520,transit:95,car:560,social:{en:'Compact student community and a lively old city.',fr:'Communauté étudiante tissée serré et une vieille ville animée.'}},
   life:{clubs:280,success:82,facilities:{en:['Sports complex PEPS','Research labs','Library'],fr:['Complexe sportif PEPS','Laboratoires de recherche','Bibliothèque']},schol:{en:['Excellence awards','Mobility grants'],fr:['Bourses d’excellence','Bourses de mobilité']},tour:'https://www.ulaval.ca',comments:{en:['“Cheaper rent and a strong sense of community.”'],fr:['« Loyers moins chers et fort sentiment d’appartenance. »']}}},
 { id:'usherbrooke', name:'Université de Sherbrooke', city:'Sherbrooke', prov:'QC', ll:[45.3786,-71.9283], tuition:3100,
   req:{cs:[27,82],eng:[28,84],sci:[26,80],nur:[28,83],psy:[27,81],bus:[26,80],soc:[25,78],hum:[24,76],art:[24,76],edu:[25,78],law:[29,85]},
   living:{rent:650,groceries:370,dorm:450,transit:60,car:520,social:{en:'Small city, very student-centered.',fr:'Petite ville, très axée sur les étudiants.'}},
   life:{clubs:150,success:85,facilities:{en:['Co-op engineering labs','Library','Sports center'],fr:['Laboratoires de génie coop','Bibliothèque','Centre sportif']},schol:{en:['Merit scholarships','Co-op bursaries'],fr:['Bourses au mérite','Bourses coop']},tour:'https://www.usherbrooke.ca',comments:{en:['“Everyone knows each other. Great co-op.”'],fr:['« Tout le monde se connaît. Excellent régime coop. »']}}},
 { id:'uoft', name:'University of Toronto', city:'Toronto', prov:'ON', ll:[43.6629,-79.3957], tuition:14500,
   req:{cs:[0,93],eng:[0,92],sci:[0,88],nur:[0,88],psy:[0,89],bus:[0,91],soc:[0,86],hum:[0,85],art:[0,85],edu:[0,85],law:[0,90]},
   living:{rent:1500,groceries:450,dorm:1100,transit:156,car:900,social:{en:'Huge city, endless clubs and events.',fr:'Immense ville, clubs et événements à l’infini.'}},
   life:{clubs:1000,success:91,facilities:{en:['Research labs','Robarts library','Athletic centre'],fr:['Laboratoires de recherche','Bibliothèque Robarts','Centre sportif']},schol:{en:['Lester B. Pearson','Faculty awards'],fr:['Bourse Lester B. Pearson','Bourses facultaires']},tour:'https://www.utoronto.ca',comments:{en:['“Competitive but incredible opportunities.”'],fr:['« Compétitif, mais des occasions incroyables. »']}}},
 { id:'york', name:'York University', city:'Toronto', prov:'ON', ll:[43.7735,-79.5019], tuition:12500,
   req:{cs:[0,82],eng:[0,83],sci:[0,80],nur:[0,85],psy:[0,80],bus:[0,88],soc:[0,77],hum:[0,75],art:[0,78],edu:[0,80],law:[0,80]},
   living:{rent:1400,groceries:450,dorm:950,transit:156,car:900,social:{en:'Large Keele campus with its own subway stations, plus the bilingual Glendon campus.',fr:'Grand campus Keele avec ses propres stations de métro, et le campus bilingue Glendon.'}},
   life:{clubs:350,success:80,facilities:{en:['Lassonde engineering labs','Scott library','Tait McKenzie athletic centre'],fr:['Laboratoires de génie Lassonde','Bibliothèque Scott','Centre sportif Tait McKenzie']},schol:{en:['Entrance scholarships','Global leader of tomorrow award'],fr:['Bourses d’admission','Bourse Global Leader of Tomorrow']},tour:'https://www.yorku.ca',comments:{en:['“Huge choice of programs and a very diverse campus.”'],fr:['« Énorme choix de programmes et campus très diversifié. »']}}},
 { id:'uwaterloo', name:'University of Waterloo', city:'Waterloo', prov:'ON', ll:[43.4723,-80.5449], tuition:17000,
   req:{cs:[0,95],eng:[0,94],sci:[0,88],nur:[0,85],psy:[0,86],bus:[0,89],soc:[0,83],hum:[0,80],art:[0,82],edu:[0,82],law:[0,85]},
   living:{rent:900,groceries:400,dorm:850,transit:90,car:700,social:{en:'Tech-focused student town with famous co-op.',fr:'Ville étudiante axée sur la techno, célèbre pour son régime coop.'}},
   life:{clubs:250,success:92,facilities:{en:['Engineering labs','Velocity incubator','Library'],fr:['Laboratoires de génie','Incubateur Velocity','Bibliothèque']},schol:{en:['President’s Scholarship','Co-op awards'],fr:['Bourse du président','Bourses coop']},tour:'https://uwaterloo.ca',comments:{en:['“Co-op is the whole point. Busy but rewarding.”'],fr:['« Le coop, c’est tout l’intérêt. Exigeant mais gratifiant. »']}}},
 { id:'western', name:'Western University', city:'London', prov:'ON', ll:[43.0096,-81.2737], tuition:14000,
   req:{cs:[0,87],eng:[0,88],sci:[0,86],nur:[0,90],psy:[0,85],bus:[0,90],soc:[0,84],hum:[0,82],art:[0,82],edu:[0,84],law:[0,85]},
   living:{rent:850,groceries:400,dorm:1000,transit:80,car:600,social:{en:'Classic campus town with a big Richmond Row bar scene and strong school spirit.',fr:'Ville universitaire classique, bars animés sur Richmond Row et grande fierté étudiante.'}},
   life:{clubs:230,success:90,facilities:{en:['Western Student Recreation Centre','Weldon library','Research labs'],fr:['Centre récréatif étudiant de Western','Bibliothèque Weldon','Laboratoires de recherche']},schol:{en:['Western Scholarship of Excellence','National scholarships'],fr:['Bourse d’excellence de Western','Bourses nationales']},tour:'https://www.uwo.ca',comments:{en:['“Beautiful campus, great residence life.”'],fr:['« Magnifique campus, superbe vie en résidence. »']}}},
 { id:'uottawa', name:'University of Ottawa', city:'Ottawa', prov:'ON', ll:[45.4231,-75.6831], tuition:9800,
   req:{cs:[0,86],eng:[0,87],sci:[0,82],nur:[0,85],psy:[0,83],bus:[0,85],soc:[0,80],hum:[0,78],art:[0,78],edu:[0,80],law:[0,85]},
   living:{rent:1100,groceries:420,dorm:850,transit:130,car:700,social:{en:'Bilingual campus close to downtown and the Rideau canal.',fr:'Campus bilingue près du centre-ville et du canal Rideau.'}},
   life:{clubs:300,success:83,facilities:{en:['Labs','Morisset library','Sports complex'],fr:['Laboratoires','Bibliothèque Morisset','Complexe sportif']},schol:{en:['Admission scholarships','Excellence awards'],fr:['Bourses d’admission','Bourses d’excellence']},tour:'https://www.uottawa.ca',comments:{en:['“Great for bilingual students.”'],fr:['« Idéal pour les étudiants bilingues. »']}}},
 { id:'queens', name:'Queen’s University', city:'Kingston', prov:'ON', ll:[44.2253,-76.4951], tuition:15000,
   req:{cs:[0,90],eng:[0,90],sci:[0,87],nur:[0,88],psy:[0,88],bus:[0,92],soc:[0,86],hum:[0,84],art:[0,84],edu:[0,86],law:[0,88]},
   living:{rent:850,groceries:400,dorm:900,transit:70,car:600,social:{en:'Tight-knit campus with lots of traditions.',fr:'Campus tissé serré, riche en traditions.'}},
   life:{clubs:250,success:93,facilities:{en:['Engineering labs','Stauffer library','Athletics center'],fr:['Laboratoires de génie','Bibliothèque Stauffer','Centre sportif']},schol:{en:['Chancellor’s scholarship','Entrance awards'],fr:['Bourse du chancelier','Bourses d’admission']},tour:'https://www.queensu.ca',comments:{en:['“Strong school spirit.”'],fr:['« Grande fierté étudiante. »']}}},
 { id:'mcmaster', name:'McMaster University', city:'Hamilton', prov:'ON', ll:[43.2609,-79.9192], tuition:13500,
   req:{cs:[0,89],eng:[0,90],sci:[0,87],nur:[0,90],psy:[0,86],bus:[0,89],soc:[0,84],hum:[0,82],art:[0,82],edu:[0,84],law:[0,85]},
   living:{rent:900,groceries:400,dorm:850,transit:110,car:650,social:{en:'Campus-centered life, close to Toronto by GO train.',fr:'Vie centrée sur le campus, près de Toronto en train GO.'}},
   life:{clubs:350,success:90,facilities:{en:['Health sciences labs','Mills library','Fitness centre'],fr:['Laboratoires des sciences de la santé','Bibliothèque Mills','Centre de conditionnement physique']},schol:{en:['Entrance scholarships','Faculty awards'],fr:['Bourses d’admission','Bourses facultaires']},tour:'https://www.mcmaster.ca',comments:{en:['“Great for health sciences.”'],fr:['« Excellent pour les sciences de la santé. »']}}},
 { id:'brock', name:'Brock University', city:'St. Catharines', prov:'ON', ll:[43.1176,-79.2477], tuition:12000,
   req:{cs:[0,78],eng:[0,80],sci:[0,77],nur:[0,82],psy:[0,78],bus:[0,78],soc:[0,75],hum:[0,74],art:[0,75],edu:[0,80],law:[0,78]},
   living:{rent:750,groceries:380,dorm:800,transit:70,car:600,social:{en:'Niagara region: wineries, Niagara Falls nearby and an affordable student town.',fr:'Région du Niagara : vignobles, chutes Niagara à proximité et ville étudiante abordable.'}},
   life:{clubs:200,success:78,facilities:{en:['Cairns science complex','Walker sports complex','Marilyn I. Walker School of Fine Arts'],fr:['Complexe scientifique Cairns','Complexe sportif Walker','École des beaux-arts Marilyn I. Walker']},schol:{en:['Entrance scholarships','Brock Leaders award'],fr:['Bourses d’admission','Bourse Brock Leaders']},tour:'https://brocku.ca',comments:{en:['“Smaller classes and a friendly campus.”'],fr:['« Petites classes et campus chaleureux. »']}}}
];
