import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

function loadApp() {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const script = html.match(/<script\b[^>]*>([\s\S]*?)<\/script>/)[1];
  const bootScript = script.split('// Initial render')[0];
  const sandbox = {
    document: { getElementById: () => ({}) },
    localStorage: { getItem: () => '{}', setItem: () => {} },
  };

  vm.createContext(sandbox);
  vm.runInContext(`${bootScript}
    globalThis.__test = {
      setSelected(ids) { selected = new Set(ids); },
      setActiveFilter(id) { activeFilter = id; },
      filterIds() { return FILTERS.map(f => f.id); },
      visible() { return applyFilters(computeMatches(selected)); },
      renderVisible() { return renderResults(applyFilters(computeMatches(selected))); },
      selectedUseCount,
    };
  `, sandbox);

  return sandbox.__test;
}

test('drops the exact-match filter', () => {
  const app = loadApp();

  assert.deepEqual(Array.from(app.filterIds()), ['all', 'usesall', 'ready']);
});

test('Toate ranks recipes that use every selected ingredient above partial matches', () => {
  const app = loadApp();
  app.setSelected(['rosii', 'oua', 'ceapa']);
  app.setActiveFilter('all');

  const names = app.visible().map(s => s.name);

  assert.deepEqual(Array.from(names.slice(0, 2)), [
    'Spinach cu Avocado, Kalamata și Ou',
    'Spinach cu Roșii Cherry, Telemea și Ou',
  ]);
  assert.ok(names.indexOf('Năut Nord-African') > 1);
});

test('Toate renders selected-ingredient groups before partial matches', () => {
  const app = loadApp();
  app.setSelected(['rosii', 'oua', 'ceapa']);
  app.setActiveFilter('all');

  const html = app.renderVisible();

  assert.ok(html.indexOf('Cu tot ce-ai ales') < html.indexOf('Cu 2 din 3 ingrediente alese'));
  assert.ok(html.indexOf('Spinach cu Avocado, Kalamata și Ou') < html.indexOf('Năut Nord-African'));
});

test('Toate keeps higher selected-ingredient coverage above easier partial matches', () => {
  const app = loadApp();
  app.setSelected(['spinach', 'naut', 'fasole-rosie', 'rosii']);
  app.setActiveFilter('all');

  const html = app.renderVisible();
  const strongerIntent = html.indexOf('Spinach cu Feta și Năut');
  const easierPartial = html.indexOf('Năut Nord-African');

  assert.ok(html.indexOf('Cu 3 din 4 ingrediente alese') < html.indexOf('Cu 2 din 4 ingrediente alese'));
  assert.ok(strongerIntent !== -1);
  assert.ok(easierPartial !== -1);
  assert.ok(strongerIntent < easierPartial);
});

test('Folosesc tot ce-am ales keeps completion-first ranking', () => {
  const app = loadApp();
  app.setSelected(['rosii', 'ceapa']);
  app.setActiveFilter('usesall');

  const names = app.visible().map(s => s.name);

  assert.deepEqual(Array.from(names.slice(0, 2)), [
    'Năut Nord-African',
    'Salată de Năut Românească',
  ]);
});

test('Gata de făcut ranks ready recipes by how many selected ingredients they use', () => {
  const app = loadApp();
  app.setSelected(['spinach', 'avocado', 'kalamata', 'oua', 'rosii', 'ceapa', 'naut', 'coriandru']);
  app.setActiveFilter('ready');

  const matches = app.visible();
  const chickpeaIndex = matches.findIndex(s => s.name === 'Năut Nord-African');

  assert.equal(matches[0].name, 'Spinach cu Avocado, Kalamata și Ou');
  assert.equal(app.selectedUseCount(matches[0]), 6);
  assert.ok(chickpeaIndex > 0);
});
