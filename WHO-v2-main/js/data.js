/* =====================================================
   DATA: edit this file to change universities & categories.
   The admission / cost numbers are placeholders. Replace with real figures.
   Program lists live in js/programs/<university id>.js
   ===================================================== */

// Fields of study. Every program belongs to one category, and inherits that
// category's admission cutoff at its university (see `req` below).
const CATEGORIES = {
  cs:'Computer Science & IT', eng:'Engineering', sci:'Natural Sciences & Math',
  nur:'Health & Medical sciences', psy:'Psychology', bus:'Business',
  soc:'Social Sciences', hum:'Humanities & Languages', art:'Arts, Design & Architecture',
  edu:'Education', law:'Law'
};

// Filled by js/programs/*.js : PROGRAM_DATA[<uni id>] = [ {n, e?, d, f, c, s:[]} , ... ]
//   n = official name, e = English name (if n is French), d = degree, f = faculty,
//   c = category key (above), s = sub-programs (options, streams, honours, co-op...)
const PROGRAM_DATA = {};

// City coordinates [lat, lon] (used for the map and the distance filter)
const CITIES = {
  'Montréal':[45.50,-73.57], 'Québec City':[46.81,-71.21], 'Sherbrooke':[45.40,-71.89],
  'Ottawa':[45.42,-75.70], 'Toronto':[43.65,-79.38], 'Kingston':[44.23,-76.49],
  'Hamilton':[43.26,-79.87], 'Waterloo':[43.47,-80.52], 'London':[42.98,-81.25],
  'St. Catharines':[43.16,-79.24]
};

// Government loans & bursaries, by province
const GOV = {
  QC:'Aide financière aux études (AFE): government loans and bursaries for Quebec residents, based on need.',
  ON:'OSAP: Ontario Student Assistance Program, combining grants and loans based on need.'
};

/* Universities
   id:     matches the file name in js/programs/
   req:    category -> [minimum R-score, minimum grade %]  (estimates, inherited by every program in that category)
   living: rent / dorm / transit pass / car (all $ per month) + social text
   life:   clubs, success (% graduating), facilities, schol (scholarships), tour (link), comments */
const UNIS = [
 { id:'mcgill', name:'McGill University', city:'Montréal', prov:'QC', tuition:9500,
   req:{cs:[34,92],eng:[33,91],sci:[31,88],nur:[31,88],psy:[32,89],bus:[33,90],soc:[30,87],hum:[28,85],art:[28,84],edu:[27,83],law:[34,92]},
   living:{rent:1150,dorm:900,transit:94,car:650,social:'Plateau and downtown nightlife, big international crowd.'},
   life:{clubs:300,success:89,facilities:['Computing labs','Redpath library','Sports complex'],schol:['Entrance excellence award','Faculty bursaries'],tour:'https://www.mcgill.ca',comments:['“Great research access, heavy workload.”','“The city is the best part.”']}},
 { id:'udem', name:'Université de Montréal', city:'Montréal', prov:'QC', tuition:3200,
   req:{cs:[31,88],eng:[31,88],sci:[29,85],nur:[29,85],psy:[30,86],bus:[30,86],soc:[28,84],hum:[26,80],art:[26,80],edu:[26,80],law:[32,90]},
   living:{rent:1000,dorm:650,transit:94,car:620,social:'Student bars near Côte-des-Neiges and lots of French-language events.'},
   life:{clubs:250,success:84,facilities:['Science labs','Mount Royal-side campus','Clinical simulation center'],schol:['Excellence scholarships','Program bursaries'],tour:'https://www.umontreal.ca',comments:['“Big campus, friendly profs.”']}},
 { id:'concordia', name:'Concordia University', city:'Montréal', prov:'QC', tuition:7800,
   req:{cs:[29,85],eng:[29,86],sci:[26,80],nur:[27,82],psy:[28,83],bus:[28,83],soc:[25,78],hum:[24,76],art:[25,78],edu:[24,76],law:[26,80]},
   living:{rent:1050,dorm:700,transit:94,car:630,social:'Downtown campus, strong arts and club scene.'},
   life:{clubs:200,success:78,facilities:['Hive makerspace','Computer labs','Library'],schol:['Entrance scholarships','Co-op awards'],tour:'https://www.concordia.ca',comments:['“Flexible schedules and real city life.”']}},
 { id:'uqam', name:'Université du Québec à Montréal (UQAM)', city:'Montréal', prov:'QC', tuition:3200,
   req:{cs:[26,80],eng:[27,82],sci:[25,78],nur:[26,80],psy:[29,85],bus:[25,78],soc:[25,78],hum:[23,75],art:[24,76],edu:[25,78],law:[27,82]},
   living:{rent:1000,dorm:650,transit:94,car:620,social:'Right in the Quartier latin and Quartier des spectacles: festivals, cafés and a very active student union.'},
   life:{clubs:150,success:76,facilities:['Cœur des sciences','Central library','Sports centre'],schol:['Fondation UQAM scholarships','Excellence bursaries'],tour:'https://uqam.ca',comments:['“Downtown everything, very affordable.”']}},
 { id:'ets', name:'École de technologie supérieure (ÉTS)', city:'Montréal', prov:'QC', tuition:3300,
   req:{cs:[26,80],eng:[26,80],sci:[25,78],art:[25,78]},
   living:{rent:1050,dorm:700,transit:94,car:630,social:'Griffintown campus surrounded by new condos, cafés and the Lachine Canal.'},
   life:{clubs:60,success:80,facilities:['Student technical clubs workshops','Engineering labs','On-campus residences'],schol:['Entrance scholarships','Co-op internship pay'],tour:'https://www.etsmtl.ca',comments:['“Hands-on engineering with mandatory paid internships.”']}},
 { id:'ulaval', name:'Université Laval', city:'Québec City', prov:'QC', tuition:3100,
   req:{cs:[28,84],eng:[29,85],sci:[27,82],nur:[28,84],psy:[28,83],bus:[27,82],soc:[26,80],hum:[25,78],art:[25,78],edu:[26,80],law:[30,86]},
   living:{rent:800,dorm:520,transit:95,car:560,social:'Compact student community and a lively old city.'},
   life:{clubs:280,success:82,facilities:['Sports complex PEPS','Research labs','Library'],schol:['Excellence awards','Mobility grants'],tour:'https://www.ulaval.ca',comments:['“Cheaper rent and a strong sense of community.”']}},
 { id:'usherbrooke', name:'Université de Sherbrooke', city:'Sherbrooke', prov:'QC', tuition:3100,
   req:{cs:[27,82],eng:[28,84],sci:[26,80],nur:[28,83],psy:[27,81],bus:[26,80],soc:[25,78],hum:[24,76],art:[24,76],edu:[25,78],law:[29,85]},
   living:{rent:650,dorm:450,transit:60,car:520,social:'Small city, very student-centered.'},
   life:{clubs:150,success:85,facilities:['Co-op engineering labs','Library','Sports center'],schol:['Merit scholarships','Co-op bursaries'],tour:'https://www.usherbrooke.ca',comments:['“Everyone knows each other. Great co-op.”']}},
 { id:'uoft', name:'University of Toronto', city:'Toronto', prov:'ON', tuition:14500,
   req:{cs:[0,93],eng:[0,92],sci:[0,88],nur:[0,88],psy:[0,89],bus:[0,91],soc:[0,86],hum:[0,85],art:[0,85],edu:[0,85],law:[0,90]},
   living:{rent:1500,dorm:1100,transit:156,car:900,social:'Huge city, endless clubs and events.'},
   life:{clubs:1000,success:91,facilities:['Research labs','Robarts library','Athletic centre'],schol:['Lester B. Pearson','Faculty awards'],tour:'https://www.utoronto.ca',comments:['“Competitive but incredible opportunities.”']}},
 { id:'york', name:'York University', city:'Toronto', prov:'ON', tuition:12500,
   req:{cs:[0,82],eng:[0,83],sci:[0,80],nur:[0,85],psy:[0,80],bus:[0,88],soc:[0,77],hum:[0,75],art:[0,78],edu:[0,80],law:[0,80]},
   living:{rent:1400,dorm:950,transit:156,car:900,social:'Large Keele campus with its own subway stations, plus the bilingual Glendon campus.'},
   life:{clubs:350,success:80,facilities:['Lassonde engineering labs','Scott library','Tait McKenzie athletic centre'],schol:['Entrance scholarships','Global leader of tomorrow award'],tour:'https://www.yorku.ca',comments:['“Huge choice of programs and a very diverse campus.”']}},
 { id:'uwaterloo', name:'University of Waterloo', city:'Waterloo', prov:'ON', tuition:17000,
   req:{cs:[0,95],eng:[0,94],sci:[0,88],nur:[0,85],psy:[0,86],bus:[0,89],soc:[0,83],hum:[0,80],art:[0,82],edu:[0,82],law:[0,85]},
   living:{rent:900,dorm:850,transit:90,car:700,social:'Tech-focused student town with famous co-op.'},
   life:{clubs:250,success:92,facilities:['Engineering labs','Velocity incubator','Library'],schol:['President’s Scholarship','Co-op awards'],tour:'https://uwaterloo.ca',comments:['“Co-op is the whole point. Busy but rewarding.”']}},
 { id:'western', name:'Western University', city:'London', prov:'ON', tuition:14000,
   req:{cs:[0,87],eng:[0,88],sci:[0,86],nur:[0,90],psy:[0,85],bus:[0,90],soc:[0,84],hum:[0,82],art:[0,82],edu:[0,84],law:[0,85]},
   living:{rent:850,dorm:1000,transit:80,car:600,social:'Classic campus town with a big Richmond Row bar scene and strong school spirit.'},
   life:{clubs:230,success:90,facilities:['Western Student Recreation Centre','Weldon library','Research labs'],schol:['Western Scholarship of Excellence','National scholarships'],tour:'https://www.uwo.ca',comments:['“Beautiful campus, great residence life.”']}},
 { id:'uottawa', name:'University of Ottawa', city:'Ottawa', prov:'ON', tuition:9800,
   req:{cs:[0,86],eng:[0,87],sci:[0,82],nur:[0,85],psy:[0,83],bus:[0,85],soc:[0,80],hum:[0,78],art:[0,78],edu:[0,80],law:[0,85]},
   living:{rent:1100,dorm:850,transit:130,car:700,social:'Bilingual campus close to downtown and the Rideau canal.'},
   life:{clubs:300,success:83,facilities:['Labs','Morisset library','Sports complex'],schol:['Admission scholarships','Excellence awards'],tour:'https://www.uottawa.ca',comments:['“Great for bilingual students.”']}},
 { id:'queens', name:'Queen’s University', city:'Kingston', prov:'ON', tuition:15000,
   req:{cs:[0,90],eng:[0,90],sci:[0,87],nur:[0,88],psy:[0,88],bus:[0,92],soc:[0,86],hum:[0,84],art:[0,84],edu:[0,86],law:[0,88]},
   living:{rent:850,dorm:900,transit:70,car:600,social:'Tight-knit campus with lots of traditions.'},
   life:{clubs:250,success:93,facilities:['Engineering labs','Stauffer library','Athletics center'],schol:['Chancellor’s scholarship','Entrance awards'],tour:'https://www.queensu.ca',comments:['“Strong school spirit.”']}},
 { id:'mcmaster', name:'McMaster University', city:'Hamilton', prov:'ON', tuition:13500,
   req:{cs:[0,89],eng:[0,90],sci:[0,87],nur:[0,90],psy:[0,86],bus:[0,89],soc:[0,84],hum:[0,82],art:[0,82],edu:[0,84],law:[0,85]},
   living:{rent:900,dorm:850,transit:110,car:650,social:'Campus-centered life, close to Toronto by GO train.'},
   life:{clubs:350,success:90,facilities:['Health sciences labs','Mills library','Fitness centre'],schol:['Entrance scholarships','Faculty awards'],tour:'https://www.mcmaster.ca',comments:['“Great for health sciences.”']}},
 { id:'brock', name:'Brock University', city:'St. Catharines', prov:'ON', tuition:12000,
   req:{cs:[0,78],eng:[0,80],sci:[0,77],nur:[0,82],psy:[0,78],bus:[0,78],soc:[0,75],hum:[0,74],art:[0,75],edu:[0,80],law:[0,78]},
   living:{rent:750,dorm:800,transit:70,car:600,social:'Niagara region: wineries, Niagara Falls nearby and an affordable student town.'},
   life:{clubs:200,success:78,facilities:['Cairns science complex','Walker sports complex','Marilyn I. Walker School of Fine Arts'],schol:['Entrance scholarships','Brock Leaders award'],tour:'https://brocku.ca',comments:['“Smaller classes and a friendly campus.”']}}
];
