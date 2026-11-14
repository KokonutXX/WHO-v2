/* =====================================================
   DATA: edit this file to change universities & programs.
   The numbers are placeholders. Replace with real figures.
   ===================================================== */

// Programs shown in the search dropdown (id: display name)
const PROGRAMS = { cs:'Computer Science', nur:'Health & Medical sciences', bus:'Business', eng:'Engineering', psy:'Psychology' };

// City coordinates [lat, lon] (used for the map and the distance filter)
const CITIES = {
  'Montréal':[45.50,-73.57], 'Québec City':[46.81,-71.21], 'Sherbrooke':[45.40,-71.89],
  'Ottawa':[45.42,-75.70], 'Toronto':[43.65,-79.38], 'Kingston':[44.23,-76.49],
  'Hamilton':[43.26,-79.87], 'Waterloo':[43.47,-80.52]
};

// Government loans & bursaries, by province
const GOV = {
  QC:'Aide financière aux études (AFE): government loans and bursaries for Quebec residents, based on need.',
  ON:'OSAP: Ontario Student Assistance Program, combining grants and loans based on need.'
};

/* Universities
   req:    program id -> [minimum R-score, minimum grade %]
   living: rent / dorm / transit pass / car (all $ per month) + social text
   life:   clubs, success (% graduating), facilities, schol (scholarships), tour (link), comments */
const UNIS = [
 { name:'McGill University', city:'Montréal', prov:'QC', tuition:9500,
   req:{cs:[34,92],nur:[31,88],bus:[33,90],eng:[33,91],psy:[32,89]},
   living:{rent:1150,dorm:900,transit:94,car:650,social:'Plateau and downtown nightlife, big international crowd.'},
   life:{clubs:300,success:89,facilities:['Computing labs','Redpath library','Sports complex'],schol:['Entrance excellence award','Faculty bursaries'],tour:'https://www.mcgill.ca',comments:['“Great research access, heavy workload.”','“The city is the best part.”']}},
 { name:'Université de Montréal', city:'Montréal', prov:'QC', tuition:3200,
   req:{cs:[31,88],nur:[29,85],bus:[30,86],eng:[31,88],psy:[30,86]},
   living:{rent:1000,dorm:650,transit:94,car:620,social:'Student bars near Côte-des-Neiges and lots of French-language events.'},
   life:{clubs:250,success:84,facilities:['Science labs','Mount Royal-side campus','Clinical simulation center'],schol:['Excellence scholarships','Program bursaries'],tour:'https://www.umontreal.ca',comments:['“Big campus, friendly profs.”']}},
 { name:'Concordia University', city:'Montréal', prov:'QC', tuition:7800,
   req:{cs:[29,85],bus:[28,83],eng:[29,86],psy:[28,83]},
   living:{rent:1050,dorm:700,transit:94,car:630,social:'Downtown campus, strong arts and club scene.'},
   life:{clubs:200,success:78,facilities:['Hive makerspace','Computer labs','Library'],schol:['Entrance scholarships','Co-op awards'],tour:'https://www.concordia.ca',comments:['“Flexible schedules and real city life.”']}},
 { name:'Université Laval', city:'Québec City', prov:'QC', tuition:3100,
   req:{cs:[28,84],nur:[28,84],bus:[27,82],eng:[29,85],psy:[28,83]},
   living:{rent:800,dorm:520,transit:95,car:560,social:'Compact student community and a lively old city.'},
   life:{clubs:280,success:82,facilities:['Sports complex PEPS','Research labs','Library'],schol:['Excellence awards','Mobility grants'],tour:'https://www.ulaval.ca',comments:['“Cheaper rent and a strong sense of community.”']}},
 { name:'Université de Sherbrooke', city:'Sherbrooke', prov:'QC', tuition:3100,
   req:{cs:[27,82],nur:[28,83],bus:[26,80],eng:[28,84],psy:[27,81]},
   living:{rent:650,dorm:450,transit:60,car:520,social:'Small city, very student-centered.'},
   life:{clubs:150,success:85,facilities:['Co-op engineering labs','Library','Sports center'],schol:['Merit scholarships','Co-op bursaries'],tour:'https://www.usherbrooke.ca',comments:['“Everyone knows each other. Great co-op.”']}},
 { name:'University of Toronto', city:'Toronto', prov:'ON', tuition:14500,
   req:{cs:[0,93],nur:[0,88],bus:[0,91],eng:[0,92],psy:[0,89]},
   living:{rent:1500,dorm:1100,transit:156,car:900,social:'Huge city, endless clubs and events.'},
   life:{clubs:1000,success:91,facilities:['Research labs','Robarts library','Athletic centre'],schol:['Lester B. Pearson','Faculty awards'],tour:'https://www.utoronto.ca',comments:['“Competitive but incredible opportunities.”']}},
 { name:'University of Waterloo', city:'Waterloo', prov:'ON', tuition:17000,
   req:{cs:[0,95],bus:[0,89],eng:[0,94],psy:[0,86]},
   living:{rent:900,dorm:850,transit:90,car:700,social:'Tech-focused student town with famous co-op.'},
   life:{clubs:250,success:92,facilities:['Engineering labs','Velocity incubator','Library'],schol:['President’s Scholarship','Co-op awards'],tour:'https://uwaterloo.ca',comments:['“Co-op is the whole point. Busy but rewarding.”']}},
 { name:'University of Ottawa', city:'Ottawa', prov:'ON', tuition:9800,
   req:{cs:[0,86],nur:[0,85],bus:[0,85],eng:[0,87],psy:[0,83]},
   living:{rent:1100,dorm:850,transit:130,car:700,social:'Bilingual campus close to downtown and the Rideau canal.'},
   life:{clubs:300,success:83,facilities:['Labs','Morisset library','Sports complex'],schol:['Admission scholarships','Excellence awards'],tour:'https://www.uottawa.ca',comments:['“Great for bilingual students.”']}},
 { name:'Queen’s University', city:'Kingston', prov:'ON', tuition:15000,
   req:{cs:[0,90],nur:[0,88],bus:[0,92],eng:[0,90],psy:[0,88]},
   living:{rent:850,dorm:900,transit:70,car:600,social:'Tight-knit campus with lots of traditions.'},
   life:{clubs:250,success:93,facilities:['Engineering labs','Stauffer library','Athletics center'],schol:['Chancellor’s scholarship','Entrance awards'],tour:'https://www.queensu.ca',comments:['“Strong school spirit.”']}},
 { name:'McMaster University', city:'Hamilton', prov:'ON', tuition:13500,
   req:{cs:[0,89],nur:[0,90],bus:[0,89],eng:[0,90],psy:[0,86]},
   living:{rent:900,dorm:850,transit:110,car:650,social:'Campus-centered life, close to Toronto by GO train.'},
   life:{clubs:350,success:90,facilities:['Health sciences labs','Mills library','Fitness centre'],schol:['Entrance scholarships','Faculty awards'],tour:'https://www.mcmaster.ca',comments:['“Great for health sciences.”']}}
];
