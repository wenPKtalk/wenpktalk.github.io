'use strict';

/* global hexo */
const { buildBooks } = require('../lib/books');

let cached = null;
hexo.extend.filter.register('before_generate', () => { cached = null; });

function booksOf(site) {
  if (!cached) {
    cached = buildBooks({ data: site.data && site.data.books, posts: site.posts.toArray(), pages: site.pages.toArray() });
    cached.warnings.forEach(warning => hexo.log.warn(`[codex] ${warning}`));
  }
  return cached;
}

hexo.extend.helper.register('books', function () {
  return booksOf(this.site).books;
});

// The article node (book, chapter, index, prev, next) for a post or page, or null.
hexo.extend.helper.register('book_nav', function (page) {
  if (!page || !page.source) return null;
  return booksOf(this.site).byKey.get(page.source) || null;
});

hexo.extend.generator.register('codex_books', locals => {
  const { books } = booksOf(locals);
  const bookPages = books.map(book => ({ path: `books/${book.id}/index.html`, layout: ['book'], data: { title: book.title, book } }));
  return [{ path: 'books/index.html', layout: ['books'], data: { nav_key: 'books' } }, ...bookPages];
});

// Hexo generates /categories/<name>/ and /tags/<name>/ but no index pages for them.
hexo.extend.generator.register('codex_taxonomy_indexes', () => [
  { path: 'categories/index.html', layout: ['categories'], data: { nav_key: 'categories' } },
  { path: 'tags/index.html', layout: ['tags'], data: { nav_key: 'tags' } }
]);
