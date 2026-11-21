404 puzzle engines
==================

map.wasm and undead.wasm are unmodified copies from:
https://github.com/ganeshapp/games
Commit: 66467b3fe964f20173e86fcd3809785ec106b2fb

These are Simon Tatham's Portable Puzzle Collection, under the MIT license
in LICENSE.txt. Upstream source: https://git.tartarus.org/simon/puzzles.git
Project: https://www.chiark.greenend.org.uk/~sgtatham/puzzles/

engine.js is that commit's map.js. undead.js differs only in the WASM filename,
so a single shared loader serves both. Local changes:
- Read the WASM filename and fixed parameters from window.GappPuzzle.
- Ignore the page's URL fragment, so every visit generates a fresh puzzle.
- Call page ready/error hooks and remove the global error-alert handler.
- Allow the preset menu to be absent.
- Do not autofocus the canvas on page load, or scroll it into view on commands.

The separate assets/js/puzzle-404.js adapter chooses the game once at load,
updates the palette on theme changes, fits the board to the viewport, and adds
pointer-based Undead controls and a Maps pencil toggle for ordinary left-drags.
Maps right-drags and Ctrl-drags still mark possibilities in either mode.
Command/Ctrl+Z and Command/Ctrl+Shift+Z route to
Undo and Redo while the board or its controls have focus.
WASM files sit next to engine.js because Emscripten resolves them relative to
the loader URL. All three must be deployed together, including under a baseurl.

Fixed game IDs (parameters only, no seed or description):
Map: 30x25n75dh (30 columns, 25 rows, 75 regions, Hard)
Undead: 7x7dt (7 columns, 7 rows, Tricky)

Palette indices come from the engines' COL_* enumerations:
Map: background, grid, colour 0/1/2/3, error, error text.
Undead: background, grid, text, error, highlight, flash, ghost, zombie,
vampire, done. The adapter repaints via rescale_puzzle, retaining undo history.

To update: obtain both engines from a matching games build, compare the shared
JS loaders, reapply the small changes listed above, and verify palette indices,
fixed parameters, generation, solve/undo/restart, and mobile tap/drag/pencil
input. Run node --test test/*.test.cjs and a production Jekyll build.
