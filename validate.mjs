#!/usr/bin/env node
// Validates the data invariants baked into index.html so a bad recipe edit
// fails loudly instead of silently producing a recipe that can never reach
// 100% or a chip no recipe uses. Run with: `node validate.mjs`.
//
// The data lives inside the single-file app (index.html). Rather than keep a
// second copy in sync, we pull the actual arrays out of the page's <script>
// and evaluate them in an isolated VM with a stubbed DOM, so we check exactly
// what ships.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const htmlPath = join(here, 'index.html');
const html = readFileSync(htmlPath, 'utf8');

// Tolerate attributes on the tag (e.g. `<script defer>`) so a future tweak to
// the tag doesn't make this report "no data" when the data is fine.
const scriptMatch = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error('✗ Could not find a <script> block in index.html');
  process.exit(1);
}

// We only want the data layer. Everything the validator needs (CATEGORIES,
// INGREDIENTS, SALADS, SUB_GROUPS) is declared above the `// ─── RENDER` marker,
// and that prefix is DOM-free — so we evaluate only it. This keeps a *data*
// check from breaking when *UI* code (render/DOM/service worker) changes. If the
// marker ever moves, we fall back to the whole script under a stubbed DOM.
const full = scriptMatch[1];
const renderIdx = full.indexOf('// ─── RENDER');
const dataSource = renderIdx >= 0 ? full.slice(0, renderIdx) : full;

// Minimal DOM/BOM stubs, only exercised by the whole-script fallback path.
const noop = () => {};
const fakeEl = { innerHTML: '', addEventListener: noop, querySelectorAll: () => [], classList: { toggle: noop } };
const sandbox = {
  document: { getElementById: () => fakeEl, querySelectorAll: () => [], addEventListener: noop },
  navigator: {},
  window: { addEventListener: noop },
  console,
};

// Top-level `const`s aren't exposed on the VM global, so append a line that
// hands the arrays back out from inside the script's own scope.
const source = `${dataSource}\n;globalThis.__data = { CATEGORIES, INGREDIENTS, SALADS, SUB_GROUPS };`;

try {
  vm.runInNewContext(source, sandbox, { filename: 'index.html#script' });
} catch (err) {
  console.error('✗ index.html data block threw while evaluating:', err.message);
  process.exit(1);
}

const { CATEGORIES, INGREDIENTS, SALADS, SUB_GROUPS } = sandbox.__data;
const errors = [];

const ingredientIds = new Set();
const categoryIds = new Set(CATEGORIES.map(c => c.id));

// Ingredient ids must be unique, and each must sit in a real category.
for (const ing of INGREDIENTS) {
  if (ingredientIds.has(ing.id)) errors.push(`Duplicate ingredient id: "${ing.id}"`);
  ingredientIds.add(ing.id);
  if (!categoryIds.has(ing.cat)) {
    errors.push(`Ingredient "${ing.id}" has unknown category "${ing.cat}"`);
  }
}

// Sub-group members must be real ingredients; track them so they don't count
// as "dead chips" even when no recipe names them directly.
const subGroupMembers = new Set();
for (const group of SUB_GROUPS) {
  for (const id of group.ids) {
    subGroupMembers.add(id);
    if (!ingredientIds.has(id)) {
      errors.push(`Sub-group references unknown ingredient "${id}"`);
    }
  }
}

// Every id a recipe uses must exist, or the recipe can never hit 100%.
// Also: a recipe must never require two members of the same sub-group
// (the "double salty-creamy" failure mode the recipes intentionally avoid).
const usedIds = new Set();
const recipeNames = new Set();
for (const salad of SALADS) {
  if (recipeNames.has(salad.name)) errors.push(`Duplicate recipe name: "${salad.name}"`);
  recipeNames.add(salad.name);

  for (const id of salad.ingredients) {
    usedIds.add(id);
    if (!ingredientIds.has(id)) {
      errors.push(`Recipe "${salad.name}" uses unknown ingredient "${id}"`);
    }
  }

  for (const group of SUB_GROUPS) {
    const overlap = group.ids.filter(id => salad.ingredients.includes(id));
    if (overlap.length > 1) {
      errors.push(
        `Recipe "${salad.name}" requires multiple members of one sub-group: ${overlap.join(', ')}`,
      );
    }
  }
}

// No dead chips: every ingredient should be used by a recipe or be a swap option.
for (const ing of INGREDIENTS) {
  if (!usedIds.has(ing.id) && !subGroupMembers.has(ing.id)) {
    errors.push(`Dead chip: ingredient "${ing.id}" is in no recipe and no sub-group`);
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} data invariant${errors.length > 1 ? 's' : ''} violated:`);
  for (const e of errors) console.error(`  • ${e}`);
  process.exit(1);
}

console.log(
  `✓ Data OK — ${INGREDIENTS.length} ingredients, ${SALADS.length} recipes, ` +
  `${SUB_GROUPS.length} sub-groups, no violations.`,
);
