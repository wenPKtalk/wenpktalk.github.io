/* codex — small progressive enhancements; the site works without this file. */
(function () {
  'use strict';

  var root = document.documentElement;
  var THEME_KEY = 'codex-theme';

  function currentTheme() {
    var chosen = root.getAttribute('data-theme');
    if (chosen) return chosen;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* private mode: keep it for this page only */ }
    syncGiscusTheme(theme);
  }

  function initThemeToggle() {
    var button = document.querySelector('[data-theme-toggle]');
    if (!button) return;
    button.addEventListener('click', function () {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  function initCodeBlocks() {
    var labels = { copy: document.documentElement.lang.indexOf('zh') === 0 ? '复制' : 'Copy', copied: document.documentElement.lang.indexOf('zh') === 0 ? '已复制' : 'Copied' };
    document.querySelectorAll('figure.highlight').forEach(function (figure) {
      var language = figure.className.replace('highlight', '').trim();
      if (language && language !== 'plaintext' && language !== 'plain') {
        var tag = document.createElement('span');
        tag.className = 'code-lang';
        tag.textContent = language;
        figure.appendChild(tag);
      }
      var code = figure.querySelector('td.code pre') || figure.querySelector('pre');
      if (!code || !navigator.clipboard) return;
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'code-copy';
      button.textContent = labels.copy;
      button.addEventListener('click', function () {
        navigator.clipboard.writeText(code.innerText.replace(/\n$/, '')).then(function () {
          button.textContent = labels.copied;
          setTimeout(function () { button.textContent = labels.copy; }, 1500);
        });
      });
      figure.appendChild(button);
    });
  }

  function initTocSpy() {
    var links = document.querySelectorAll('.page-toc a[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var byId = {};
    links.forEach(function (link) { byId[decodeURIComponent(link.getAttribute('href').slice(1))] = link; });
    var headings = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) { link.classList.remove('active'); });
        byId[entry.target.id].classList.add('active');
      });
    }, { rootMargin: '0px 0px -75% 0px' });
    headings.forEach(function (heading) { observer.observe(heading); });
  }

  function initBookNav() {
    var toggle = document.querySelector('[data-book-nav-toggle]');
    var close = document.querySelector('[data-book-nav-close]');
    function setOpen(open) {
      document.body.classList.toggle('book-nav-open', open);
      if (toggle) toggle.setAttribute('aria-expanded', String(open));
    }
    if (toggle) toggle.addEventListener('click', function () { setOpen(!document.body.classList.contains('book-nav-open')); });
    if (close) close.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') setOpen(false); });

    var current = document.querySelector('.book-sidebar .current');
    if (current) current.scrollIntoView({ block: 'center' });
  }

  function loadGiscus() {
    var host = document.querySelector('[data-giscus]');
    if (!host) return;
    var script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    var settings = {
      repo: host.dataset.repo, 'repo-id': host.dataset.repoId,
      category: host.dataset.category, 'category-id': host.dataset.categoryId,
      mapping: 'pathname', strict: '1', 'reactions-enabled': '1', 'emit-metadata': '0',
      'input-position': 'top', theme: currentTheme(), lang: host.dataset.lang, loading: 'lazy'
    };
    Object.keys(settings).forEach(function (key) { script.setAttribute('data-' + key, settings[key]); });
    host.appendChild(script);
  }

  function syncGiscusTheme(theme) {
    var frame = document.querySelector('iframe.giscus-frame');
    if (frame) frame.contentWindow.postMessage({ giscus: { setConfig: { theme: theme } } }, 'https://giscus.app');
  }

  initThemeToggle();
  initCodeBlocks();
  initTocSpy();
  initBookNav();
  loadGiscus();
})();
