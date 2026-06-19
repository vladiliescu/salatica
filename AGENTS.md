# AGENTS.md — Sălățică

Guidance for AI agents working in this repo.

## What this is

A single-file salad finder: pick the ingredients you have, get matching recipes.
Romanian UI, Mediterranean/Romanian-leaning recipes, Lidl-Romania ingredients.

Everything lives in **`index.html`** — markup, CSS, and JS in one self-contained
file. There is **no build step, no framework, no dependencies** to install.
`sw.js` + `manifest.webmanifest` + `icons/` make it a PWA.

## Previewing

Just open the file in a browser — **do not start a web server**:

```sh
open index.html        # macOS
```

It's static, so `file://` is enough for a visual check. (The service worker
won't register over `file://`, but that doesn't affect previewing the UI.)

For logic checks without a browser, you can `eval` the data/helpers in Node —
see the matching simulation pattern used during development.

## Where things are (all in `index.html`)

- `CATEGORIES` — ingredient groups (with emoji) shown as sections.
- `INGREDIENTS` — every selectable chip: `{ id, name, cat }`. `id` is the slug
  recipes reference; `name` is the Romanian display label.
- `SALADS` — recipes: `{ name, ingredients: [id…], dressing, tip }`.
- `SUB_GROUPS` / `SUBS` — interchangeable ingredients (feta ⇄ telemea,
  pin ⇄ floarea ⇄ dovleac). Selecting any member satisfies a recipe calling for
  another; the card still shows the recipe's canonical ingredient + a "sau …"
  hint.
- `computeMatches` — the matching algorithm. `render*` functions build the DOM.
- `FILTERS` — a single-choice strictness radio (`activeFilter`): Toate (loose
  default) / Folosesc tot ce-am ales / Exact ce am ales / Gata de făcut. Each has
  an `info` string (tooltip + live description line). `usesAllSelected` backs the
  strict ones (substitute-aware); `applyFilters` narrows the displayed matches.
- `pickSurprise` / `renderSurpriseModal` / `closeSurprise` — "Surprinde-mă" shows
  one pick in an accessible overlay dialog (focus-trapped, Escape/backdrop close),
  separate from the results list. The dialog keydown handler is registered once,
  not per render.
- Module state: `selected` (chips), `activeFilters`, `surprise` (featured recipe
  name). A mobile-only `.results-bar` jumps to results and self-hides via an
  `IntersectionObserver` once they scroll into view.

## Invariants — check these after editing data

- **Every `id` in a recipe's `ingredients` must exist in `INGREDIENTS`**, or that
  recipe can never reach 100%.
- **No dead chips**: every ingredient in `INGREDIENTS` should be used by at least
  one recipe (or be a member of a `SUB_GROUP`).
- **Never require both members of a `SUB_GROUP`** in the same recipe (e.g. feta
  *and* telemea) — that's the "double salty-creamy" failure mode the recipes
  intentionally avoid.

Run the committed validator after any data edit — it pulls the actual arrays
out of `index.html` and checks all of the above (plus duplicate ids/names and
valid categories), exiting non-zero on any violation:

```sh
node validate.mjs
```

## Docs

- `ABOUT.md` — the live design doc. Keep it in sync when you change behavior or
  the recipe/ingredient set.
- `RECIPES.md` — **historic** snapshot of the original conversation. Do not
  update it; it's a record, not a source of truth.
