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
      offsetWidth: 380, offsetHeight: 420,
      addEventListener(type, fn) { (events[type] ||= []).push(fn); },
      dispatch(type, data = {}) {
        const event = {isPrimary: true, pointerId: 1, button: 0, preventDefault() {}, stopImmediatePropagation() {}, ...data};
        if (this['on' + type]) this['on' + type](event);
        for (const fn of events[type] || []) fn(event);
      },
      click() { this.dispatch('click'); },
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
    'restart', 'solve', 'statusbar', 'puzzle-loading', 'puzzle-invitation',
    'map-instructions', 'undead-instructions',
    'monster-controls', 'monster-hint', 'pencil-mode', 'map-pencil-control', 'map-pencil-mode'
  ].map(id => [id, element()]));
  const section = element(); section.dataset.engineUrl = 'http://test/assets/puzzles/engine.js';
  const monsters = ['g', 'v', 'z', 'Backspace'].map(monster => {
    const el = element(); el.dataset.monster = monster; return el;
  });
  const document = {
    getElementById: id => ids[id] || null,
    createElement: element,
    querySelector: selector => selector === '.puzzle-section' ? section : element(),
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
    MutationObserver: class {observe() {}}, ResizeObserver: class {observe() {}},
    innerHeight: 720, scrollY: 0,
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
    p.ids.puzzle.dispatch('keydown', {key: 'z', metaKey: true});
    assert.equal(p.field('STATEPOS'), '1', 'Command+Z undoes the move');
    p.ids.puzzle.dispatch('keydown', {key: 'Z', metaKey: true, shiftKey: true});
    assert.equal(p.field('STATEPOS'), '2', 'Command+Shift+Z redoes the move');
    p.ids.puzzle.dispatch('keydown', {key: 'z', ctrlKey: true});
    assert.equal(p.field('STATEPOS'), '1', 'Control+Z still works');
    p.ids.puzzle.dispatch('keydown', {key: 'z', ctrlKey: true, shiftKey: true});
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

test('Map: pencil toggle supports left-drag, history and the original right/Ctrl-drag', async () => {
  const p = await openPuzzle(false);
  const button = p.ids['map-pencil-mode'];
  assert.equal(p.ids['map-pencil-control'].hidden, false);
  const points = [];
  for (let row = 0; row < 25; row++) for (let col = 0; col < 30; col++) {
    points.push({pageX: (col + 1) * 380 / 31, pageY: (row + 1) * 420 / 26});
  }
  function drag(from, to, modifiers = {}) {
    p.ids.puzzlecanvas.dispatch('mousedown', {...from, ...modifiers});
    p.ids.puzzlecanvas.dispatch('mousemove', {...to, ...modifiers});
    p.ids.puzzlecanvas.dispatch('mouseup', {...to, ...modifiers});
  }
  p.click('map-pencil-mode');
  assert.equal(button.getAttribute('aria-pressed'), 'true');
  assert.match(button.getAttribute('title'), /Pencil marks on/);
  // Find a given colour and an empty region in this freshly generated board.
  let source, target;
  findMove: for (const from of points) for (const to of points) {
    drag(from, to);
    if (p.field('STATEPOS') !== '1') { source = from; target = to; break findMove; }
  }
  assert.ok(source, 'a normal drag creates a pencil mark');
  const mark = p.field('MOVE');
  assert.match(mark, /^p[0-3]:\d+$/);
  p.click('undo'); assert.equal(p.field('STATEPOS'), '1');
  p.click('redo'); assert.equal(p.field('STATEPOS'), '2');
  drag(source, target);
  assert.equal(p.field('STATEPOS'), '3', 'repeating the drag removes the dot');
  assert.equal(p.save().trim().split('\n').at(-1).split(':').slice(2).join(':'), mark);
  p.click('map-pencil-mode');
  assert.equal(button.getAttribute('aria-pressed'), 'false');
  drag(source, target);
  assert.match(p.save().trim().split('\n').at(-1), /^MOVE\s*:\d+:[0-3]:\d+$/, 'mode off fills with colour');
  p.click('undo');
  drag(source, target, {button: 2});
  assert.match(p.save().trim().split('\n').at(-1), /^MOVE\s*:\d+:p[0-3]:\d+$/, 'right-drag still adds dots');
  drag(source, target, {ctrlKey: true});
  assert.equal(p.field('STATEPOS'), '5', 'Ctrl-drag removes the dot again');
  p.click('map-pencil-mode'); p.click('restart');
  drag(source, target);
  assert.match(p.save().trim().split('\n').at(-1), /^MOVE\s*:\d+:p[0-3]:\d+$/, 'pencil mode survives restart');
});

test('Undead: tap, drag, erase, pencil marks and cancelled drags use real engine moves', async () => {
  const p = await openPuzzle(true);
  assert.equal(p.ids['map-pencil-control'].hidden, true);
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
  assert.equal(p.ids['pencil-mode'].getAttribute('aria-pressed'), 'true');
  assert.equal(p.ids['pencil-mode'].getAttribute('title'), 'Pencil marks on');
  assert.match(p.save(), /^MOVE\s*:\d+:g\d+$/m);
  assert.match(p.save(), /^MOVE\s*:\d+:z\d+$/m);
  const before = Number(p.field('STATEPOS'));
  p.monster(2);
  assert.equal(Number(p.field('STATEPOS')), before + 1, 'same pencil icon removes its mark');
  p.click('pencil-mode');
  assert.equal(p.ids['pencil-mode'].getAttribute('aria-pressed'), 'false');
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
