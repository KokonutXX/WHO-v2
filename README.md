# UniVerse

Compare universities in Québec and Ontario by program, R-score and grade, in English or French.
Three zoom-transition pages: **Search → Results → University**.

## Run it
Open `index.html` in a browser. No build step, works offline.
The map is a static drawing of southern Quebec / Ontario (`js/mapdata.js`, generated from
[Natural Earth](https://www.naturalearthdata.com) public-domain data), with numbered markers matching the results list.

## Put it on GitHub Pages
1. Push this folder to a GitHub repository.
2. Repo **Settings → Pages → Deploy from a branch → `main` / `(root)`**.
3. Your site appears at `https://<username>.github.io/<repo>/`.

## Project structure
```
index.html          the 3 pages (markup only, text keys for translation)
img/logo.svg        logo + browser-tab icon
css/
  base.css          theme colors, zoom transition, shared parts, language toggle
  search.css        page 1
  results.css       page 2
  university.css    page 3
js/
  i18n.js           EDIT HERE: every English / French interface text
  data.js           EDIT HERE: categories, cities, universities, cutoffs, costs
  programs/*.js     EDIT HERE: full undergraduate program list, one file per university
  admissions.js     EDIT HERE: deadlines, documents, interviews, scholarships, rent & groceries
  utils.js          helpers, state, page navigation
  admission.js      program matching, green / orange / red logic, missing-data rule
  search.js         page 1 behavior
  mapdata.js        map shapes (provinces, states, lakes, rivers); generated, don't edit by hand
  places.js         EDIT HERE: extra towns users can type as their location (name, lat, lon, province)
  results.js        page 2: sort fields + direction, numbered cards, "also show" checklist, map
  university.js     page 3: Living / Student life / Admission / Programs tabs
  main.js           starts the app, re-renders on language change
```
Script order in `index.html` matters: each file uses the ones above it.

## Common edits
- **Translations:** add the same key to both `en` and `fr` in `js/i18n.js`. In HTML use `data-i18n="key"`;
  in JS use `t('key')`. Data shown to users is written `{en:'…', fr:'…'}` (read with `tx()`).
- **Real data:** `js/data.js` (cutoffs, tuition, clubs and success rates are estimates/placeholders).
  `js/admissions.js` holds researched data (retrieved 2026-11-14, sources in each entry) and overrides
  rent, groceries and scholarship names from `data.js`.
- **Admission rules per program:** in `js/admissions.js`, `dl` / `docs` / `iv` list exact program names
  (the `n` value in `js/programs/<id>.js`), or `"*"` for all programs. The results page then shows
  Yes / No / Some programs for whatever the user searched.
- **Add a university:** copy one entry in `UNIS` (unique `id`, campus `ll` coordinates), create
  `js/programs/<id>.js`, add its `<script>` tag in `index.html`, and add an entry in `js/admissions.js`.
- **Add or fix a program:** edit `js/programs/<id>.js`. Each line is
  `{n:"Name", e:"English name (only if n is French)", d:"B.Sc.", f:"Faculty", c:"cs", s:["Honours","Co-op option"]}`.
  `c` is a category key from `CATEGORIES`; the program inherits that category's cutoff (`req`).
  Use double quotes and no trailing commas.
- **Missing data:** if the user enters only an R-score, universities that only publish a grade % (and vice
  versa) are hidden and a warning explains why, instead of marking them "Unlikely".
- **Green/orange/red tolerance:** `TOLERANCE` in `js/admission.js`.
- **Colors:** `:root` in `css/base.css`. **Transition speed:** `.page` in `css/base.css`.
