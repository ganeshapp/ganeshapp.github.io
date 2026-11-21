const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');

// Run the real WASM engines and page adapter. Only browser drawing/DOM services
// are stubbed; moves, generation, difficulty, history and solving are real.
async function openPuzzle(mobile) {
  let resolve, reject, context;
  const loaded = new Promise((r, j) => { resolve = r; reject = j; });
  function element() {
    const events = {};
    const el = {
      style: {setProperty() {}}, dataset: {}, attributes: {}, events,
      classList: {add() {}, remove() {}}, clientWidth: 380, clientHeight: 420,
      addEventListener(type, fn) { (events[type] ||= []).push(fn); },
      dispatch(type, data = {}) {
        const event = {isPrimary: true, pointerId: 1, button: 0, preventDefault() {}, ...data};
        if (this['on' + type]) this['on' + type](event);
        for (const fn of events[type] || []) fn(event);
      },
      setAttribute(k, v) { this.attributes[k] = v; },
      getAttribute(k) { return this.attributes[k]; },
      getBoundingClientRect() { return {left: 0, top: 0, width: 380, height: 420}; },
      setPointerCapture() {}, focus() {}, contains() { return false; },
      closest() { return null; }, querySelectorAll() { return []; },
      querySelector() { return element(); }, appendChild() {}, remove() {}, cloneNode: element
    };
    el.parentNode = {removeChild() {}};
    el.getContext = () => new Proxy({
      canvas: el, measureText: () => ({width: 40}),
      getImageData: (x, y, w, h) => ({data: new Uint8Array(w * h * 4)})
    }, {get: (o, k) => k in o ? o[k] : () => {}});
    return el;
  }
  const ids = Object.fromEntries([
    'puzzlecanvas', 'puzzlecanvascontain', 'gamemenu', 'puzzle', 'undo', 'redo',
    'restart', 'solve', 'statusbar', 'puzzle-loading', 'puzzle-title',
    'puzzle-description', 'map-instructions', 'undead-instructions',
    'monster-controls', 'monster-hint', 'pencil-mode'
  ].map(id => [id, element()]));
  const section = element(); section.dataset.engineUrl = 'http://test/assets/puzzles/engine.js';
  const monsters = ['g', 'v', 'z', 'Backspace'].map(monster => {
    const el = element(); el.dataset.monster = monster; return el;
  });
  const document = {
    getElementById: id => ids[id] || null,
    createElement: element,
    querySelector: selector => selector === '.puzzle-section' ? section : null,
    querySelectorAll: selector => selector === '[data-monster]' ? monsters : [],
    documentElement: element(), addEventListener() {},
    currentScript: {src: section.dataset.engineUrl},
    body: {appendChild(el) {
      if (!el.src) return;
      const ready = context.GappPuzzle.ready;
      context.GappPuzzle.ready = () => { try { ready(); resolve(); } catch (error) { reject(error); } };
      vm.runInContext(fs.readFileSync(path.join(root, 'assets/puzzles/engine.js'), 'utf8'), context);
    }}
  };
  const requested = [];
  context = vm.createContext({
    document, location: {href: 'http://test/a/missing/page#invalid', pathname: '/a/missing/page', hash: '#invalid'},
    getComputedStyle: () => ({fontStyle: 'normal', fontWeight: '400', fontFamily: 'monospace',
      backgroundColor: 'rgb(36, 41, 53)', getPropertyValue: () => '#242935'}),
    console, WebAssembly, TextDecoder, TextEncoder, Uint8Array, ArrayBuffer, Response,
    fetch: async url => {
      requested.push(url);
      return new Response(fs.readFileSync(path.join(root, 'assets/puzzles', path.basename(url))),
        {headers: {'Content-Type': 'application/wasm'}});
    },
    localStorage: {getItem: () => null}, setTimeout, clearTimeout, performance,
    requestAnimationFrame: () => 1, cancelAnimationFrame() {}, addEventListener() {},
    MutationObserver: class {observe() {}},
    matchMedia: () => ({matches: mobile, addListener() {}, removeListener() {}}),
    devicePixelRatio: 1, alert: message => { throw Error(message); }
  });
  context.window = context;
  vm.runInContext(fs.readFileSync(path.join(root, 'assets/js/puzzle-404.js'), 'utf8'), context);
  await loaded;
  function save() {
    const ptr = context.Module._get_save_file();
    const text = context.UTF8ToString(ptr);
    context.Module._free_save_file(ptr);
    return text;
  }
  function field(name) { return save().match(new RegExp('^' + name + '\\s*:\\d+:(.*)$', 'm'))?.[1]; }
  function tap(col, row) { ids.puzzlecanvas.dispatch('pointerdown', {clientX: (col + 1.75) * 40, clientY: (row + 2.75) * 40}); }
  return {context, ids, monsters, requested, save, field, tap,
    click: id => ids[id].dispatch('click'),
    monster: index => monsters[index].dispatch('click')};
}

for (const [mobile, name, params] of [[false, 'Map', '30x25n75dh'], [true, 'Undead', '7x7dt']]) {
  test(`${name}: fixed difficulty, fresh generation, solve, undo, redo and restart`, async () => {
    const p = await openPuzzle(mobile);
    assert.equal(p.field('GAME'), name);
    assert.equal(p.field('PARAMS'), params);
    assert.equal(p.requested.length, 1, 'load only the selected WASM');
    const description = p.field('DESC');
    p.click('solve');
    assert.match(p.save(), /^SOLVE\s*:/m);
    assert.equal(p.ids.undo.disabled, false);
    p.click('undo');
    assert.equal(p.field('STATEPOS'), '1');
    assert.equal(p.ids.redo.disabled, false);
    p.click('redo');
    assert.equal(p.field('STATEPOS'), '2');
    p.click('restart');
    assert.equal(p.field('DESC'), description, 'restart preserves the original puzzle');
    assert.match(p.save(), /^RESTART\s*:/m);
    p.context.Module._rescale_puzzle();
    assert.equal(p.field('DESC'), description, 'resize/theme repaint preserves the puzzle');
    const next = await openPuzzle(mobile);
    assert.notEqual(next.field('DESC'), description, 'a fresh visit generates another puzzle');
  });
}

test('Undead: tap, drag, erase, pencil marks and cancelled drags use real engine moves', async () => {
  const p = await openPuzzle(true);
  p.monster(0);
  assert.equal(p.field('STATEPOS'), '1', 'no selection does not place a monster');
  let cell;
  for (let row = 0; row < 7 && !cell; row++) for (let col = 0; col < 7 && !cell; col++) {
    p.tap(col, row); p.monster(0);
    if (p.field('STATEPOS') !== '1') cell = {col, row};
  }
  assert.ok(cell, 'a tap and icon click place a ghost');
  assert.match(p.save(), /^MOVE\s*:\d+:G\d+$/m);
  p.monster(3);
  assert.match(p.save(), /^MOVE\s*:\d+:E\d+$/m);
  p.click('pencil-mode'); p.monster(0); p.monster(2);
  assert.match(p.save(), /^MOVE\s*:\d+:g\d+$/m);
  assert.match(p.save(), /^MOVE\s*:\d+:z\d+$/m);
  const before = Number(p.field('STATEPOS'));
  p.monster(2);
  assert.equal(Number(p.field('STATEPOS')), before + 1, 'same pencil icon removes its mark');
  p.click('pencil-mode');
  const vampire = p.monsters[1];
  vampire.dispatch('pointerdown', {clientX: 130, clientY: 450});
  const target = {clientX: (cell.col + 1.75) * 40, clientY: (cell.row + 2.75) * 40};
  vampire.dispatch('pointermove', target); vampire.dispatch('pointerup', target); vampire.dispatch('click');
  assert.match(p.save(), /^MOVE\s*:\d+:V\d+$/m);
  const after = p.save();
  vampire.dispatch('pointerdown', {clientX: 130, clientY: 450});
  vampire.dispatch('pointermove', {clientX: -50, clientY: -50});
  vampire.dispatch('pointerup', {clientX: -50, clientY: -50}); vampire.dispatch('click');
  assert.equal(p.save(), after, 'dropping outside the board has no effect');
  vampire.dispatch('pointerdown'); vampire.dispatch('pointercancel'); vampire.dispatch('click');
  assert.equal(p.save(), after, 'cancelled pointer input has no effect');
  p.click('pencil-mode'); p.click('restart'); p.tap(cell.col, cell.row); p.monster(1);
  assert.match(p.save().trim().split('\n').at(-1), /^MOVE\s*:\d+:v\d+$/, 'pencil mode remains consistent after restart');
});
