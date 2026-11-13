'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { buildBooks } = require('../lib/books');

const BOOK_DATA = {
  sys: {
    title: 'Systems',
    chapters: [
      { id: 'C1', title: '1. Intro' },
      { id: 'C2', title: '2. Memory' }
    ]
  },
  jvm: { title: 'JVM' }
};

function aPage(source, extra = {}) {
  return { source, path: source.replace(/\.md$/, '.html'), title: source, date: new Date('2026-01-01'), ...extra };
}

function aPost(slug, date, extra = {}) {
  return { source: `_posts/${slug}.md`, path: `${slug}/`, title: slug, date: new Date(date), ...extra };
}

const pages = [
  aPage('sys/C2/2.0-index.md', { book: 'sys', chapter: 'C2' }),
  aPage('sys/C1/1.10-ten.md', { book: 'sys', chapter: 'C1' }),
  aPage('sys/C1/1.2-two.md', { book: 'sys', chapter: 'C1' }),
  aPage('sys/C1/1.0-index.md', { book: 'sys', chapter: 'C1' }),
  aPage('about/index.md')
];

const posts = [
  aPost('gc', '2020-09-01', { book: 'jvm' }),
  aPost('loading', '2020-05-07', { book: 'jvm' }),
  aPost('memory', '2020-05-11', { book: 'jvm' }),
  aPost('unrelated', '2021-01-01')
];

function titlesOf(articles) {
  return articles.map(article => article.title);
}

test('orders chapters as declared and articles by natural filename order', () => {
  const { books } = buildBooks({ data: BOOK_DATA, posts, pages });
  const sys = books.find(book => book.id === 'sys');

  assert.deepEqual(sys.chapters.map(chapter => chapter.title), ['1. Intro', '2. Memory']);
  assert.deepEqual(titlesOf(sys.chapters[0].articles), ['sys/C1/1.0-index.md', 'sys/C1/1.2-two.md', 'sys/C1/1.10-ten.md']);
});

test('explicit order front matter wins over filename order', () => {
  const reordered = pages.map(page => (page.source === 'sys/C1/1.10-ten.md' ? { ...page, order: 1 } : page));
  const { books } = buildBooks({ data: BOOK_DATA, posts, pages: reordered });

  assert.equal(books.find(book => book.id === 'sys').chapters[0].articles[0].title, 'sys/C1/1.10-ten.md');
});

test('a post series without chapters is one flat chapter ordered by date', () => {
  const { books } = buildBooks({ data: BOOK_DATA, posts, pages });
  const jvm = books.find(book => book.id === 'jvm');

  assert.equal(jvm.chapters.length, 1);
  assert.equal(jvm.chapters[0].title, null);
  assert.deepEqual(titlesOf(jvm.articles), ['loading', 'memory', 'gc']);
  assert.equal(+jvm.updated, +new Date('2020-09-01'));
});

test('prev/next and position run across chapter boundaries', () => {
  const { byKey } = buildBooks({ data: BOOK_DATA, posts, pages });
  const lastOfC1 = byKey.get('sys/C1/1.10-ten.md');
  const firstOfC2 = byKey.get('sys/C2/2.0-index.md');

  assert.equal(lastOfC1.next, firstOfC2);
  assert.equal(firstOfC2.prev, lastOfC1);
  assert.equal(firstOfC2.index, 3);
  assert.equal(firstOfC2.book.articles.length, 4);
  assert.equal(byKey.get('sys/C1/1.0-index.md').prev, null);
  assert.equal(firstOfC2.next, null);
});

test('articles outside any book are not indexed', () => {
  const { byKey } = buildBooks({ data: BOOK_DATA, posts, pages });

  assert.equal(byKey.has('about/index.md'), false);
  assert.equal(byKey.has('_posts/unrelated.md'), false);
});

test('unknown book ids are skipped with a warning', () => {
  const stray = [...posts, aPost('stray', '2022-01-01', { book: 'nope' })];
  const { books, byKey, warnings } = buildBooks({ data: BOOK_DATA, posts: stray, pages });

  assert.equal(byKey.has('_posts/stray.md'), false);
  assert.equal(books.some(book => book.id === 'nope'), false);
  assert.match(warnings.join('\n'), /nope/);
});

test('an article in an undeclared chapter lands in a trailing chapter with a warning', () => {
  const stray = [...pages, aPage('sys/C9/9.0-x.md', { book: 'sys', chapter: 'C9' })];
  const { books, warnings } = buildBooks({ data: BOOK_DATA, posts, pages: stray });
  const sys = books.find(book => book.id === 'sys');
  const trailing = sys.chapters[sys.chapters.length - 1];

  assert.equal(trailing.id, 'C9');
  assert.deepEqual(titlesOf(trailing.articles), ['sys/C9/9.0-x.md']);
  assert.match(warnings.join('\n'), /C9/);
});

test('books without articles are left out and declared order is kept', () => {
  const data = { empty: { title: 'Empty' }, ...BOOK_DATA };
  const { books } = buildBooks({ data, posts, pages });

  assert.deepEqual(books.map(book => book.id), ['sys', 'jvm']);
});

test('missing data yields no books', () => {
  const { books, byKey } = buildBooks({ data: undefined, posts, pages });

  assert.deepEqual(books, []);
  assert.equal(byKey.size, 0);
});
