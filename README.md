# UniVerse

For that moment when you want to compare universities in Quebec and Ontario. You start your search by selecting the program u want to go to, and putting in your R-score (and grade percentage if you're a Quebec student aiming for out of province ;) ).

There's three pages: Search brings you to Results which then lets you choose a University


## Project structure
```
index.html          the 3 pages (markup only)
css/
  base.css          theme colors, zoom transition, shared parts
  search.css        page 1
  results.css       page 2
  university.css    page 3
js/
  data.js           we can edit programs, cities and universities here
  utils.js          helpers, state, page navigation
  admission.js      green / orange / red logic for how easily accepted
  search.js         page 1 behavior
  results.js        page 2 behavior, sorting, map
  university.js     page 3 behavior
  main.js           starts the app


## Common edits
````
 **Real data:** `js/data.js` (all numbers are placeholders).
- **Add a university:** copy one entry in `UNIS`.
- **Add a program:** add it to `PROGRAMS`, then add `req` values to each university.
- **Add a city:** add it to `CITIES` (and widen `BOUNDS` in `js/results.js` if it falls outside the map).
- **Colors:** `:root` in `css/base.css`.
- **Green/orange/red tolerance:** `TOLERANCE` in `js/admission.js`.
- **Transition speed:** `.page` in `css/base.css`.
