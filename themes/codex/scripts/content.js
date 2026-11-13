'use strict';

/* global hexo */
const { renderMermaidFences, protectMath } = require('../lib/markdown');
const { readingMinutes } = require('../lib/reading');
const { buildSearchIndex } = require('../lib/search');

// Before Hexo's own code-block filter (priority 10): ```mermaid fences and opt-in math.
hexo.extend.filter.register('before_post_render', data => {
  const math = hexo.theme.config.math || {};
  data.content = renderMermaidFences(data.content);
  if (data.math === true || (math.auto && data.math !== false)) data.content = protectMath(data.content);
  return data;
}, 5);

hexo.extend.helper.register('reading_minutes', content => readingMinutes(content));

hexo.extend.generator.register('codex_search', locals => {
  const options = hexo.theme.config.search || {};
  if (options.enable === false) return [];
  const books = (locals.data && locals.data.books) || {};
  const bookTitle = entry => (entry.book && books[entry.book] ? books[entry.book].title : undefined);
  const searchable = entry => entry.search !== false && entry.content;
  const entries = [...locals.posts.toArray(), ...locals.pages.toArray()]
    .filter(searchable)
    .map(entry => ({ title: entry.title, path: entry.path, content: entry.content, bookTitle: bookTitle(entry) }));
  return { path: options.path || 'search.json', data: JSON.stringify(buildSearchIndex(entries, { maxChars: options.max_chars })) };
});
