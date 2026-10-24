const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const test = require('node:test');
function search() {
  let resolveFetch, pendingTimer, calls = 0;
  const element = () => ({hidden: true, innerHTML: '', value: '', events: {},
    addEventListener(k, fn) { this.events[k] = fn; }, focus() {}});
  const overlay = element(), input = element(), results = element(), button = element();
  const elements = {'search-overlay': overlay, 'search-input': input, 'search-results': results, 'search-toggle': button};
  vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname, '../assets/js/main.js'), 'utf8'), {
    window: {SITE_BASEURL: '', matchMedia: () => ({matches: true})},
    document: {getElementById: k => elements[k] || null, addEventListener() {}, querySelector() {return null;}},
    fetch: () => { calls++; return new Promise(r => resolveFetch = r); },
    clearTimeout() {}, setTimeout(fn) { pendingTimer = fn; return 1; }, console: {log() {}}, Date,
  });
  return {input, results, open: () => button.events.click(),
    type(q) { input.value = q; input.events.input(); pendingTimer(); },
    resolve(r) { resolveFetch(r); }, calls: () => calls};
}
const settle = () => new Promise(r => setImmediate(r));
test('first query runs when a slow search index arrives', async () => {
  const s = search(); s.open(); s.open(); s.type('piano');
  assert.equal(s.calls(), 1);
  s.resolve({ok: true, json: async () => [{title: 'Piano', content: 'Music', url: '/wiki/piano/', type: 'wiki'}]});
  await settle();
  assert.match(s.results.innerHTML, /Piano/);
});
test('failed fetch shows a retry message and reopening retries', async () => {
  const s = search(); s.open(); s.resolve({ok: false}); await settle();
  assert.match(s.results.innerHTML, /could not load/);
  s.open(); assert.equal(s.calls(), 2);
});
