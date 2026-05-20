# Planet Nine Daily Tracker

A static webapp tracking the hypothetical Planet Nine — predicted sky location, orbital distance, position over time, and the latest research papers.

🛰️ **Live site:** https://planet-nine-tracker-daveq.web.app

## What's on the page

- **Status** — Hypothesis context (Batygin & Brown 2016) with estimated mass, semi-major axis, orbital period, eccentricity, inclination
- **Distance from Earth** — Current ~600 AU, perihelion ~300 AU, aphelion ~1200 AU, plus conversions to km and light-travel time
- **Solar system map** — Top-down view with Planet 9's predicted orbit, current position, ~10,000-years-ago marker, and closest-approach marker
- **Probable sky location** — Predicted RA/Dec ranges with an inline sky map
- **Recent research** — Live arXiv API query for papers mentioning "Planet Nine"
- **News & discussion** — Search links to Google News, Reddit, Wikipedia, Caltech, and arXiv

## Stack

Pure static — no build step, no framework, no dependencies.

- `index.html` — markup + inline SVG diagrams
- `styles.css` — dark space-themed CSS
- `app.js` — vanilla JS for arXiv fetch + date stamping
- `logo.svg` — site logo / favicon

## Local development

Just open `index.html` in a browser, or for live API fetches (CORS-friendly):

```sh
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

Hosted on Firebase Hosting. To redeploy after changes:

```sh
firebase deploy --only hosting
```

The `.firebaserc` file pins the target project to `planet-nine-tracker-daveq`.

## Caveat

All orbital figures (300 AU perihelion, 600 AU current, 1200 AU aphelion, ~5500 BCE last perihelion, 10k–20k year orbital period) are **static estimates** from Batygin & Brown's published predictions — Planet Nine has never been directly observed, so this is not a live ephemeris. If refined predictions are published, both the SVG markers in `index.html` and the stat cards need to be updated together.
