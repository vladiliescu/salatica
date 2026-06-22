# AGENTS.md — Sălățică

Guidance for AI agents working in this repo. This file is meant to stay
**stable** — it describes how to work here, not what every feature does. For the
living description of behavior, the recipe/ingredient set, and where things live
in the code, read **`ABOUT.md`** and keep *that* in sync as you change the app.

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
node scripts/validate.mjs
```

## Docs

- `ABOUT.md` — the **live design doc and code map**. It documents the data model,
  the matching algorithm, every UI behavior (filters, "Surprinde-mă", the mobile
  results bar, accessibility), and where each thing lives in `index.html`. This
  is the doc that moves as the app moves — update it when behavior changes, and
  leave AGENTS.md alone.
- `RECIPES.md` — **historic** snapshot of the original conversation. Do not
  update it; it's a record, not a source of truth.
