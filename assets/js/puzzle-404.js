/* Fixed 404 puzzles, using the locally hosted Simon Tatham engines. */
(function () {
  'use strict';
  var section = document.querySelector('.puzzle-section');
  if (!section) return;

  // Choose once. Resizing or rotating should never discard a player's progress.
  var mobile = window.matchMedia('(max-width: 760px), (hover: none) and (pointer: coarse)').matches;
  var game = mobile ? 'undead' : 'map';
  var canvas = document.getElementById('puzzlecanvas');
  var loading = document.getElementById('puzzle-loading');
  var puzzle = document.getElementById('puzzle');
  var ready = false;
  section.dataset.game = game;
  document.getElementById('puzzle-invitation').textContent = mobile ? 'Place the monsters.' : 'Color the map.';
  document.getElementById(game + '-instructions').hidden = false;
  document.getElementById('monster-controls').hidden = !mobile;
  canvas.setAttribute('aria-label', mobile ? 'Undead puzzle board' : 'Maps puzzle board');
  if (mobile) document.querySelector('.puzzle-stage').appendChild(document.getElementById('gamemenu'));

  function fitBoard() {
    var board = document.querySelector('.puzzle-board');
    var viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    var top = board.getBoundingClientRect().top + window.scrollY;
    var reserve = 12;
    if (!mobile) {
      // Leave room for the recovery links and footer below the whole game.
      ['.error-recovery', '.site-footer'].forEach(function (selector) {
        var element = document.querySelector(selector);
        var style = getComputedStyle(element);
        reserve += element.getBoundingClientRect().height +
          (parseFloat(style.marginTop) || 0) + (parseFloat(style.marginBottom) || 0);
      });
      reserve += parseFloat(getComputedStyle(document.querySelector('.content')).paddingBottom) || 0;
    }
    // Keep cells usable in very short windows; normal page scrolling remains
    // available for zoom/accessibility and landscape phone viewports.
    section.style.setProperty('--board-height', Math.floor(Math.max(mobile ? 240 : 260, viewportHeight - top - reserve)) + 'px');
  }
  fitBoard();
  window.addEventListener('resize', fitBoard);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', fitBoard);

  function fail() {
    clearTimeout(loadTimeout);
    loading.hidden = false;
    loading.textContent = 'The puzzle could not load. Refresh to try again, or use the links below to head back.';
    puzzle.hidden = true;
    puzzle.setAttribute('aria-busy', 'false');
  }
  var loadTimeout = setTimeout(fail, 30000);

  function applyTheme() {
    var style = getComputedStyle(document.documentElement);
    var css = function (name) { return style.getPropertyValue(name).trim(); };
    var light = document.documentElement.getAttribute('data-theme') === 'light';
    // Colour indices are the engines' COL_* enums (see assets/puzzles/README.txt).
    var palette = mobile ? [
      css('--bg-raised'), css('--text-muted'), css('--text'), '#e87575',
      light ? '#c2e1f0' : '#354e67', css('--accent'),
      '#70c9cc', '#96c786', '#d9a8c0', css('--text-faint')
    ] : [
      css('--bg-raised'), light ? '#475569' : '#7b879d',
      '#58a9d0', '#dba866', '#a994cf', '#7db79b', '#d95c69', '#ffffff'
    ];
    palette.forEach(function (colour, index) { window.colours[index] = colour; });
    window.Module._rescale_puzzle(); // Repaint without changing the game or undo history.
  }

  function start() {
    clearTimeout(loadTimeout);
    ready = true;
    loading.hidden = true;
    puzzle.hidden = false;
    puzzle.style.visibility = '';
    puzzle.setAttribute('aria-busy', 'false');
    fitBoard();
    applyTheme();
    new ResizeObserver(function () {
      window.Module._rescale_puzzle();
    }).observe(document.getElementById('puzzlecanvascontain'));
    document.getElementById('restart').disabled = false;
    document.getElementById('solve').disabled = false;
    // Handle history shortcuts across the board and its touch controls. The
    // original engine recognises Ctrl but not the Mac Command modifier.
    puzzle.addEventListener('keydown', function (event) {
      if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        event.stopImmediatePropagation();
        var button = document.getElementById(event.shiftKey ? 'redo' : 'undo');
        if (!button.disabled) button.click();
      }
    }, true);
    // A new puzzle is intentionally available only by reloading the page.
    canvas.addEventListener('keydown', function (event) {
      if (event.key.toLowerCase() === 'n') {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }, true);
    new MutationObserver(applyTheme).observe(document.documentElement, {
      attributes: true, attributeFilter: ['data-theme']
    });
    if (mobile) enableMonsterControls();
  }

  function enableMonsterControls() {
    var down = window.Module.cwrap('mousedown', 'boolean', ['number', 'number', 'number']);
    var up = window.Module.cwrap('mouseup', 'boolean', ['number', 'number', 'number']);
    var key = window.Module.cwrap('key', 'boolean', ['number', 'string', 'string', 'number', 'number', 'number']);
    var pencil = false;
    var enginePencil = false;
    var selected = null;
    var hint = document.getElementById('monster-hint');
    var pencilButton = document.getElementById('pencil-mode');
    var drag = null;
    var ghost = null;

    function point(event) {
      var rect = canvas.getBoundingClientRect();
      return {x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height};
    }
    function clickAt(position, button) {
      down(position.x * canvas.width, position.y * canvas.height, button);
      up(position.x * canvas.width, position.y * canvas.height, button);
    }
    function sendKey(value) {
      key(value === 'Backspace' ? 8 : 0, value, '', 0, 0, 0);
    }
    function select(position) {
      // Use the engine's persistent keyboard cursor for touch selection. Mouse
      // selection toggles off on repeat clicks and disappears after each move.
      // Moving from the top-left also makes this independent of prior key input.
      for (var i = 0; i < 7; i++) sendKey('ArrowLeft');
      for (var j = 0; j < 7; j++) sendKey('ArrowUp');
      var column = Math.floor(position.x * 9.5 - 1.25);
      var row = Math.floor(position.y * 10.5 - 2.25);
      for (i = 0; i < column; i++) sendKey('ArrowRight');
      for (j = 0; j < row; j++) sendKey('ArrowDown');
      if (enginePencil !== pencil) { sendKey('Enter'); enginePencil = pencil; }
    }
    function inGrid(position) {
      // Undead's board has a quarter-tile border, one clue column either side,
      // and two rows above the grid (monster totals, then clues).
      return position.x > 1.25 / 9.5 && position.x < 8.25 / 9.5 &&
        position.y > 2.25 / 10.5 && position.y < 9.25 / 10.5;
    }
    function place(monster) {
      if (!selected) {
        hint.textContent = 'Tap an empty square first, or drag a monster onto one.';
        return;
      }
      // Erasing should work on a filled cell even when pencil mode is on.
      var wasPencil = pencil;
      if (monster === 'Backspace') pencil = false;
      select(selected);
      sendKey(monster);
      pencil = wasPencil;
      select(selected);
      hint.textContent = pencil ? 'Pencil marks on. Tap a monster to add or remove a possibility.' : 'Tap another square, or drag a monster onto it.';
    }

    // Use pointer events directly: no synthetic mouse click and no soft keyboard.
    canvas.onmousedown = canvas.onmousemove = canvas.onmouseup = null;
    canvas.onpointerdown = function (event) {
      if (!event.isPrimary) return;
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      canvas.focus({preventScroll: true});
      var position = point(event);
      if (inGrid(position)) {
        selected = position;
        select(position);
        hint.textContent = pencil ? 'Choose a possible monster above.' : 'Choose a monster above, or Erase.';
      } else {
        selected = null;
        clickAt(position, 0); // Edge clues can still be marked done.
      }
    };

    pencilButton.addEventListener('click', function () {
      pencil = !pencil;
      pencilButton.setAttribute('aria-pressed', String(pencil));
      pencilButton.setAttribute('title', 'Pencil marks ' + (pencil ? 'on' : 'off'));
      if (selected) select(selected);
      hint.textContent = pencil ? 'Mark possible monsters in an empty square.' : 'Tap a square, then a monster. Or drag a monster onto a square.';
    });

    function finishDrag() {
      if (ghost) ghost.remove();
      ghost = null;
      drag = null;
    }
    document.querySelectorAll('[data-monster]').forEach(function (button) {
      var suppressClick = false;
      button.addEventListener('click', function () {
        if (suppressClick) { suppressClick = false; return; }
        place(button.dataset.monster);
      });
      button.addEventListener('pointerdown', function (event) {
        if (!event.isPrimary || event.button !== 0) return;
        suppressClick = false;
        drag = {id: event.pointerId, x: event.clientX, y: event.clientY, moved: false};
        button.setPointerCapture(event.pointerId);
      });
      button.addEventListener('pointermove', function (event) {
        if (!drag || event.pointerId !== drag.id) return;
        if (!drag.moved && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 8) return;
        drag.moved = true;
        if (!ghost) {
          ghost = document.createElement('div');
          ghost.className = 'monster-drag';
          ghost.setAttribute('aria-hidden', 'true');
          ghost.appendChild(button.querySelector('svg').cloneNode(true));
          document.body.appendChild(ghost);
        }
        ghost.style.transform = 'translate(' + (event.clientX - 27) + 'px,' + (event.clientY - 64) + 'px)';
      });
      button.addEventListener('pointerup', function (event) {
        if (!drag || event.pointerId !== drag.id) return;
        if (drag.moved) {
          suppressClick = true;
          var position = point(event);
          if (inGrid(position)) { selected = position; place(button.dataset.monster); }
        }
        finishDrag();
      });
      button.addEventListener('pointercancel', function () { suppressClick = true; finishDrag(); });
      button.addEventListener('lostpointercapture', finishDrag);
      button.addEventListener('contextmenu', function (event) { event.preventDefault(); });
    });
    ['restart', 'undo', 'redo', 'solve'].forEach(function (id) {
      document.getElementById(id).addEventListener('click', function () {
        selected = null;
        hint.textContent = 'Tap a square, then a monster. Or drag a monster onto a square.';
      });
    });
  }

  window.GappPuzzle = {game: game, params: mobile ? '7x7dt' : '30x25n75dh', ready: start, fail: fail};
  var engine = document.createElement('script');
  engine.src = section.dataset.engineUrl;
  engine.onerror = fail;
  document.body.appendChild(engine);
  // bfcache restores are visits too; ordinary resize/theme changes retain state.
  window.addEventListener('pageshow', function (event) { if (event.persisted && ready) window.location.reload(); });
})();
