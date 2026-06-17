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

## Invariants — check these after editing data

- **Every `id` in a recipe's `ingredients` must exist in `INGREDIENTS`**, or that
  recipe can never reach 100%.
- **No dead chips**: every ingredient in `INGREDIENTS` should be used by at least
  one recipe (or be a member of a `SUB_GROUP`).
- **Never require both members of a `SUB_GROUP`** in the same recipe (e.g. feta
  *and* telemea) — that's the "double salty-creamy" failure mode the recipes
  intentionally avoid.

A quick way to validate after changing data: extract the `INGREDIENTS` and
`SALADS` arrays and confirm there are no missing ids and no unused chips.

## Docs

- `ABOUT.md` — the live design doc. Keep it in sync when you change behavior or
  the recipe/ingredient set.
- `RECIPES.md` — **historic** snapshot of the original conversation. Do not
  update it; it's a record, not a source of truth.
