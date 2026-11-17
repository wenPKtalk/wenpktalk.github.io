/* codex site search: loads /search.json on first use; the search function also runs under node for tests. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else if (typeof document !== 'undefined') api.initUi(document);
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var TITLE_WEIGHT = 10;
  var HEADING_WEIGHT = 4;
  var BODY_HIT_CAP = 3;
  var SNIPPET_RADIUS = 60;
  var DEFAULT_LIMIT = 20;

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function termsOf(query) {
    return String(query || '').toLowerCase().split(/\s+/).filter(Boolean);
  }

  function countHits(haystack, term) {
    var count = 0;
    for (var at = haystack.indexOf(term); at !== -1 && count < BODY_HIT_CAP; at = haystack.indexOf(term, at + term.length)) count++;
    return count;
  }

  function scoreDoc(doc, terms) {
    var title = doc.t.toLowerCase();
    var headings = (doc.h || []).join('\n').toLowerCase();
    var body = (doc.x || '').toLowerCase();
    var score = 0;
    for (var i = 0; i < terms.length; i++) {
      var term = terms[i];
      var inTitle = title.indexOf(term) !== -1;
      var inHeadings = headings.indexOf(term) !== -1;
      var bodyHits = countHits(body, term);
      if (!inTitle && !inHeadings && !bodyHits) return 0;
      score += (inTitle ? TITLE_WEIGHT : 0) + (inHeadings ? HEADING_WEIGHT : 0) + bodyHits;
    }
    return score;
  }

  function highlight(text, terms) {
    var escaped = escapeHtml(text);
    terms.forEach(function (term) {
      var pattern = new RegExp(escapeHtml(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      escaped = escaped.replace(pattern, function (match) { return '<mark>' + match + '</mark>'; });
    });
    return escaped;
  }

  function snippetOf(doc, terms) {
    var body = doc.x || '';
    var at = body.toLowerCase().indexOf(terms[0]);
    if (at === -1) at = 0;
    var start = Math.max(0, at - SNIPPET_RADIUS);
    var text = (start > 0 ? '…' : '') + body.slice(start, at + SNIPPET_RADIUS * 2) + (at + SNIPPET_RADIUS * 2 < body.length ? '…' : '');
    return highlight(text, terms);
  }

  function search(index, query, limit) {
    var terms = termsOf(query);
    if (!terms.length) return [];
    return index
      .map(function (doc) { return { doc: doc, score: scoreDoc(doc, terms) }; })
      .filter(function (result) { return result.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, limit || DEFAULT_LIMIT)
      .map(function (result) {
        return { doc: result.doc, score: result.score, title: highlight(result.doc.t, terms), snippet: snippetOf(result.doc, terms) };
      });
  }

  function initUi(doc) {
    var dialog = doc.querySelector('[data-search-dialog]');
    var input = dialog && dialog.querySelector('input');
    var list = dialog && dialog.querySelector('[data-search-results]');
    if (!dialog || !input || !list || typeof dialog.showModal !== 'function') return;

    var indexPromise = null;
    var selected = -1;

    function loadIndex() {
      if (!indexPromise) {
        indexPromise = fetch(dialog.getAttribute('data-index')).then(function (response) {
          if (!response.ok) throw new Error('search index ' + response.status);
          return response.json();
        });
      }
      return indexPromise;
    }

    function render(results) {
      selected = results.length ? 0 : -1;
      list.innerHTML = results.map(function (result, i) {
        return '<li><a href="' + escapeHtml(result.doc.u) + '"' + (i === 0 ? ' class="selected"' : '') + '>'
          + '<span class="search-title">' + result.title + '</span>'
          + (result.doc.b ? '<span class="search-book">' + escapeHtml(result.doc.b) + '</span>' : '')
          + '<span class="search-snippet">' + result.snippet + '</span></a></li>';
      }).join('') || (input.value.trim() ? '<li class="search-empty">' + escapeHtml(dialog.getAttribute('data-empty')) + '</li>' : '');
    }

    function move(step) {
      var links = list.querySelectorAll('a');
      if (!links.length) return;
      links[selected].classList.remove('selected');
      selected = (selected + step + links.length) % links.length;
      links[selected].classList.add('selected');
      links[selected].scrollIntoView({ block: 'nearest' });
    }

    function open() {
      dialog.showModal();
      input.select();
      loadIndex().catch(function () { list.innerHTML = '<li class="search-empty">' + escapeHtml(dialog.getAttribute('data-error')) + '</li>'; });
    }

    input.addEventListener('input', function () {
      loadIndex().then(function (index) { render(search(index, input.value)); });
    });
    input.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown') { event.preventDefault(); move(1); }
      if (event.key === 'ArrowUp') { event.preventDefault(); move(-1); }
      if (event.key === 'Enter' && selected >= 0) { event.preventDefault(); list.querySelectorAll('a')[selected].click(); }
    });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) dialog.close(); });
    doc.querySelectorAll('[data-search-open]').forEach(function (button) { button.addEventListener('click', open); });
    doc.addEventListener('keydown', function (event) {
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(doc.activeElement && doc.activeElement.tagName);
      if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !typing)) {
        event.preventDefault();
        open();
      }
    });
  }

  return { search: search, initUi: initUi };
});
