# Campus Compare

Compare universities in Québec and Ontario by program, R-score and grade.
Three zoom-transition pages: **Search → Results → University**.

## Run it
Open `index.html` in a browser. No build step, no dependencies.

## Put it on GitHub Pages
1. Push this folder to a GitHub repository.
2. Repo **Settings → Pages → Deploy from a branch → `main` / `(root)`**.
3. Your site appears at `https://<username>.github.io/<repo>/`.

## Project structure
```
index.html          the 3 pages (markup only)
css/
  base.css          theme colors, zoom transition, shared parts
  search.css        page 1
  results.css       page 2
  university.css    page 3
js/
  data.js           EDIT HERE: categories, cities, universities, cutoffs
  programs/*.js     EDIT HERE: full undergraduate program list, one file per university
  utils.js          helpers, state, page navigation
  admission.js      program matching, green / orange / red logic and tolerance
  search.js         page 1 behavior
  results.js        page 2 behavior, sorting, map
  university.js     page 3 behavior
  main.js           starts the app
```
Script order in `index.html` matters: each file uses the ones above it.

## Common edits
- **Real data:** `js/data.js` (cost and cutoff numbers are placeholders/estimates).
- **Add a university:** copy one entry in `UNIS` (give it a unique `id`), create `js/programs/<id>.js`, and add its `<script>` tag in `index.html`.
- **Add or fix a program:** edit `js/programs/<id>.js`. Each line is
  `{n:"Name", e:"English name (only if n is French)", d:"B.Sc.", f:"Faculty", c:"cs", s:["Honours","Co-op option"]}`.
  `c` is a category key from `CATEGORIES` in `js/data.js`; the program inherits that category's cutoff (`req`) at its university.
  Use double quotes and no trailing commas.
- **Add a category:** add it to `CATEGORIES`, then add `req` values to each university (missing ones fall back to the university's average).
- **Search behaviour:** the program box lists categories and every distinct program name (French programs appear under their English name). Free text also works as a keyword search, including options/streams.
- **Add a city:** add it to `CITIES` (and widen `BOUNDS` in `js/results.js` if it falls outside the map).
- **Colors:** `:root` in `css/base.css`.
- **Green/orange/red tolerance:** `TOLERANCE` in `js/admission.js`.
- **Transition speed:** `.page` in `css/base.css`.
