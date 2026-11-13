'use strict';

// Builds the book -> chapter -> article tree from front matter:
//   book: <id from source/_data/books.yml>, chapter: <chapter id>, order: <number>
// Pure: takes plain arrays, returns plain objects, never touches Hexo.

const naturalCompare = new Intl.Collator('en', { numeric: true, sensitivity: 'base' }).compare;
const IMPLICIT_CHAPTER = null;

function buildBooks({ data, posts = [], pages = [] }) {
  const warnings = [];
  const declared = data || {};
  const grouped = groupByBook([...posts.map(asPost), ...pages], declared, warnings);

  const books = Object.keys(declared)
    .filter(id => grouped.has(id))
    .map(id => assembleBook(id, declared[id], grouped.get(id), warnings));

  const byKey = new Map();
  books.forEach(book => book.articles.forEach(article => byKey.set(article.source, article)));
  return { books, byKey, warnings };
}

function asPost(post) {
  return { ...post, isPost: true };
}

function groupByBook(entries, declared, warnings) {
  const grouped = new Map();
  for (const entry of entries) {
    if (!entry.book) continue;
    if (!Object.prototype.hasOwnProperty.call(declared, entry.book)) {
      warnings.push(`"${entry.source}" names unknown book "${entry.book}"`);
      continue;
    }
    if (!grouped.has(entry.book)) grouped.set(entry.book, []);
    grouped.get(entry.book).push(entry);
  }
  return grouped;
}

function assembleBook(id, meta, entries, warnings) {
  const book = { id, title: meta.title || id, description: meta.description || '', chapters: [], articles: [] };
  book.chapters = buildChapters(book, meta.chapters, entries, warnings);
  book.articles = book.chapters.flatMap(chapter => chapter.articles);
  linkSequence(book.articles);
  book.updated = latestDate(book.articles);
  return book;
}

function buildChapters(book, declaredChapters, entries, warnings) {
  const chapters = (declaredChapters || []).map(({ id, title }) => ({ id: String(id), title: title || String(id), articles: [] }));
  const chapterById = new Map(chapters.map(chapter => [chapter.id, chapter]));

  for (const entry of entries) {
    const chapter = chapterFor(entry, chapters, chapterById, book, warnings);
    chapter.articles.push(toArticle(entry, book, chapter));
  }
  chapters.forEach(chapter => chapter.articles.sort(compareArticles));
  return chapters.filter(chapter => chapter.articles.length > 0);
}

function chapterFor(entry, chapters, chapterById, book, warnings) {
  const id = entry.chapter == null ? IMPLICIT_CHAPTER : String(entry.chapter);
  if (chapterById.has(id)) return chapterById.get(id);

  const isDeclaredBook = chapters.some(chapter => chapter.id !== IMPLICIT_CHAPTER);
  if (isDeclaredBook) warnings.push(`"${entry.source}" names chapter "${id}" not declared for book "${book.id}"`);

  const chapter = { id, title: id, articles: [] };
  chapters.push(chapter);
  chapterById.set(id, chapter);
  return chapter;
}

function toArticle(entry, book, chapter) {
  return {
    title: entry.title,
    path: entry.path,
    source: entry.source,
    date: entry.date,
    order: entry.order,
    isPost: Boolean(entry.isPost),
    book,
    chapter
  };
}

function compareArticles(a, b) {
  const byOrder = orderValue(a) - orderValue(b);
  if (byOrder) return byOrder;
  if (a.isPost && b.isPost) {
    const byDate = +a.date - +b.date;
    if (byDate) return byDate;
  }
  return naturalCompare(fileName(a.source), fileName(b.source));
}

function orderValue(article) {
  return typeof article.order === 'number' ? article.order : Number.POSITIVE_INFINITY;
}

function fileName(source) {
  return source.slice(source.lastIndexOf('/') + 1);
}

function linkSequence(articles) {
  articles.forEach((article, index) => {
    article.index = index;
    article.prev = articles[index - 1] || null;
    article.next = articles[index + 1] || null;
  });
}

function latestDate(articles) {
  return articles.reduce((latest, article) => (latest && +latest >= +article.date ? latest : article.date), null);
}

module.exports = { buildBooks };
