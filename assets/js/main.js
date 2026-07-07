/* gapp.in — vanilla JS: theme toggle, search, hover previews, lightbox */
(function () {
  'use strict';
  var BASE = window.SITE_BASEURL || '';

  /* ---------- theme toggle ---------- */
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme');
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  /* ---------- search ---------- */
  var overlay = document.getElementById('search-overlay');
  var input = document.getElementById('search-input');
  var resultsEl = document.getElementById('search-results');
  var searchBtn = document.getElementById('search-toggle');
  var index = null;
  var selected = -1;

  function openSearch() {
    overlay.hidden = false;
    input.value = '';
    resultsEl.innerHTML = '';
    selected = -1;
    input.focus();
    if (!index) {
      fetch(BASE + '/search.json')
        .then(function (r) { return r.json(); })
        .then(function (data) { index = data; });
    }
  }

  function closeSearch() { overlay.hidden = true; }

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSearch();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && overlay && overlay.hidden &&
        !/input|textarea|select/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    } else if (e.key === 'Escape' && overlay && !overlay.hidden) {
      closeSearch();
    }
  });

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function highlight(text, terms) {
    var out = escapeHtml(text);
    terms.forEach(function (t) {
      if (!t) return;
      out = out.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
    });
    return out;
  }

  function runSearch(q) {
    if (!index || q.length < 2) { resultsEl.innerHTML = ''; return; }
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    var scored = [];
    for (var i = 0; i < index.length; i++) {
      var item = index[i];
      var title = item.title.toLowerCase();
      var body = item.content.toLowerCase();
      var score = 0;
      var ok = true;
      for (var j = 0; j < terms.length; j++) {
        var t = terms[j];
        if (title.indexOf(t) !== -1) score += title === t ? 30 : (title.indexOf(t) === 0 ? 15 : 10);
        else if (body.indexOf(t) !== -1) score += 2;
        else { ok = false; break; }
      }
      if (ok) scored.push({ item: item, score: score });
    }
    scored.sort(function (a, b) { return b.score - a.score; });
    scored = scored.slice(0, 12);
    selected = -1;

    if (!scored.length) {
      resultsEl.innerHTML = '<li class="empty">no results</li>';
      return;
    }

    resultsEl.innerHTML = scored.map(function (s) {
      var it = s.item;
      var pos = it.content.toLowerCase().indexOf(terms[0]);
      var snippet = pos > -1
        ? (pos > 40 ? '…' : '') + it.content.slice(Math.max(0, pos - 40), pos + 110)
        : it.content.slice(0, 140);
      return '<li><a href="' + BASE + it.url + '">' +
        '<div class="r-title">' + highlight(it.title, terms) + '</div>' +
        '<div class="r-meta">' + escapeHtml(it.type) + '</div>' +
        '<div class="r-snippet">' + highlight(snippet, terms) + '</div>' +
        '</a></li>';
    }).join('');
  }

  if (input) {
    var debounce;
    input.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () { runSearch(input.value.trim()); }, 120);
    });
    input.addEventListener('keydown', function (e) {
      var links = resultsEl.querySelectorAll('a');
      if (!links.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        selected += e.key === 'ArrowDown' ? 1 : -1;
        selected = (selected + links.length) % links.length;
        links.forEach(function (l, i) { l.classList.toggle('selected', i === selected); });
        links[selected].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' && selected > -1) {
        e.preventDefault();
        links[selected].click();
      }
    });
  }

  /* ---------- hover preview (300ms delay) ---------- */
  var preview = document.getElementById('hover-preview');
  var hoverTimer = null;
  var cache = {};
  var currentLink = null;
  var isTouch = window.matchMedia('(hover: none)').matches;

  function isInternal(a) {
    if (a.origin !== location.origin) return false;
    var p = a.pathname;
    if (BASE && p.indexOf(BASE) !== 0) return false;
    if (/\.(png|jpe?g|gif|webp|svg|pdf|xml|json|zip|mp4)$/i.test(p)) return false;
    if (a.hasAttribute('data-lightbox') || a.closest('.hover-preview')) return false;
    // only preview links inside the page content, not nav/footer/breadcrumbs,
    // and not portfolio cards or photo grids (too distracting)
    if (!a.closest('main')) return false;
    if (a.closest('.breadcrumb, .post-nav, .card-grid, .photo-grid, .no-preview')) return false;
    return true;
  }

  function extractPreview(html, url) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    var main = doc.querySelector('main .prose') || doc.querySelector('main') || doc.body;
    var titleEl = main.querySelector('.page-title') || doc.querySelector('h1') || doc.querySelector('title');
    var title = titleEl ? titleEl.textContent.trim() : url;
    // clone the whole article, minus chrome, so the popup is fully readable
    var frag = main.cloneNode(true);
    frag.querySelectorAll('.breadcrumb, .post-nav, .post-meta, .page-title, header, script').forEach(function (n) {
      n.remove();
    });
    // skip previews with nothing worth showing (bare listing pages etc.)
    if (frag.textContent.trim().length < 60 && !frag.querySelector('img')) return null;
    return '<div class="hp-title">' + escapeHtml(title) + '</div>' + frag.innerHTML;
  }

  function showPreview(a) {
    var url = a.href.split('#')[0];
    if (url === location.href.split('#')[0]) return;

    function render(content) {
      if (content === null) return;
      if (currentLink !== a) return;
      preview.innerHTML = content;
      preview.style.maxHeight = '';
      preview.hidden = false;
      preview.scrollTop = 0;

      var rect = a.getBoundingClientRect();
      var left = rect.left + window.scrollX;
      var pw = preview.offsetWidth;
      if (left + pw > window.scrollX + document.documentElement.clientWidth - 12) {
        left = window.scrollX + document.documentElement.clientWidth - pw - 12;
      }
      if (left < 8) left = 8;

      // open on whichever side of the link has room, and clamp the popup's
      // height to that space so it never extends past the viewport edge
      var gap = 8, margin = 12;
      var spaceBelow = window.innerHeight - rect.bottom - gap - margin;
      var spaceAbove = rect.top - gap - margin;
      var h = preview.offsetHeight;
      var below = h <= spaceBelow || spaceBelow >= spaceAbove;
      var maxH = Math.max(below ? spaceBelow : spaceAbove, 140);
      if (h > maxH) {
        preview.style.maxHeight = maxH + 'px';
        h = preview.offsetHeight;
      }
      var top = below ? rect.bottom + window.scrollY + gap
                      : rect.top + window.scrollY - h - gap;

      preview.style.top = top + 'px';
      preview.style.left = left + 'px';
    }

    if (cache[url]) { render(cache[url]); return; }
    fetch(url)
      .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
      .then(function (html) {
        cache[url] = extractPreview(html, url);
        render(cache[url]);
      })
      .catch(function () { /* silently skip */ });
  }

  var hideTimer = null;

  function hidePreview() {
    clearTimeout(hoverTimer);
    clearTimeout(hideTimer);
    currentLink = null;
    if (preview) preview.hidden = true;
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hidePreview, 250); // grace period to reach the popup
  }

  if (preview && !isTouch) {
    document.addEventListener('mouseover', function (e) {
      if (preview.contains(e.target)) { clearTimeout(hideTimer); return; }
      var a = e.target.closest('a');
      if (!a || !isInternal(a)) return;
      clearTimeout(hideTimer);
      currentLink = a;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () { showPreview(a); }, 300);
    });
    document.addEventListener('mouseout', function (e) {
      if (preview.contains(e.target)) return; // handled by preview's own mouseleave
      var a = e.target.closest('a');
      if (!a) return;
      clearTimeout(hoverTimer);
      scheduleHide();
    });
    preview.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
    preview.addEventListener('mouseleave', scheduleHide);
    window.addEventListener('scroll', scheduleHide, { passive: true });
  }

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var lbVideo = lb.querySelector('video');
    var items = [];
    var idx = 0;

    function showItem() {
      var a = items[idx];
      lbVideo.pause();
      if (a.hasAttribute('data-video')) {
        lbImg.hidden = true;
        lbImg.src = '';
        lbVideo.hidden = false;
        lbVideo.src = a.href;
        lbVideo.play().catch(function () {}); // user gesture usually allows it
      } else {
        lbVideo.hidden = true;
        lbVideo.removeAttribute('src');
        lbVideo.load();
        lbImg.hidden = false;
        lbImg.src = a.href;
      }
    }

    function openLb(i) {
      idx = i;
      showItem();
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
    }

    function closeLb() {
      lb.hidden = true;
      lbImg.src = '';
      lbVideo.pause();
      lbVideo.removeAttribute('src');
      lbVideo.load();
      document.body.style.overflow = '';
    }

    function step(d) {
      if (!items.length) return;
      idx = (idx + d + items.length) % items.length;
      showItem();
    }

    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-lightbox]');
      if (!a) return;
      e.preventDefault();
      items = Array.prototype.slice.call(document.querySelectorAll('a[data-lightbox]'));
      openLb(items.indexOf(a));
    });

    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });

    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });

    // basic swipe support
    var touchX = null;
    lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) step(dx > 0 ? -1 : 1);
      touchX = null;
    }, { passive: true });
  }

  /* ---------- easter egg: console greeting ---------- */
  try {
    var ascii = [
      '',
      '   __ _  __ _ _ __  _ __  ',
      '  / _` |/ _` | \'_ \\| \'_ \\ ',
      ' | (_| | (_| | |_) | |_) |',
      '  \\__, |\\__,_| .__/| .__/ ',
      '   __/ |     | |   | |    ',
      '  |___/      |_|   |_|    ',
      ''
    ].join('\n');
    var title = 'color:#4fb3e8;font-family:monospace;';
    console.log('%c' + ascii, title);
    console.log('%cYou opened the devtools. Of course you did. Here is a Fermi question:', 'font-size:13px');
    console.log('%cHow many times will your heart beat in a lifetime?', 'font-size:13px;font-weight:bold');
    console.log('%c(answer, rot13): Nobhg guerr ovyyvba. Fvkgl orngf n zvahgr, sbe nobhg avargl lrnef. Lbhe EUE cebwrpg ohlf lbh fcner pncnpvgl.', 'color:#99a3b3;font-size:12px');
    console.log('%cDecode at rot13.com, or just be directionally correct → gapp.in/napkin', 'color:#99a3b3;font-size:12px');
  } catch (e) { /* no console, no problem */ }

  /* ---------- easter egg: birthday candle (June 12) ---------- */
  (function () {
    var now = new Date();
    if (now.getMonth() === 5 && now.getDate() === 12) {
      var candle = document.querySelector('.birthday-candle');
      if (candle) candle.hidden = false;
      // count age in exact days in the footer copyright
      var born = new Date(1986, 5, 12); // 12 June 1986
      var days = Math.floor((now - born) / 86400000);
      var span = document.querySelector('.footer-row > span');
      if (span && days > 0) {
        span.innerHTML += ' · ' + days.toLocaleString() + ' days alive today';
      }
    }
  })();

  /* ---------- easter egg: 한글 logo flip on hover ---------- */
  (function () {
    var logo = document.querySelector('.site-title');
    if (!logo) return;
    var textEl = logo.querySelector('.site-title-text');
    var hangul = logo.getAttribute('data-hangul');
    if (!textEl || !hangul) return;
    var original = textEl.textContent;
    var timer = null;
    logo.addEventListener('mouseenter', function () {
      textEl.textContent = hangul;
      clearTimeout(timer);
      timer = setTimeout(function () { textEl.textContent = original; }, 650);
    });
    logo.addEventListener('mouseleave', function () {
      clearTimeout(timer);
      textEl.textContent = original;
    });
  })();
})();
