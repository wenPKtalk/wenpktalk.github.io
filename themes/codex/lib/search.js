'use strict';

// Builds the compact JSON index served at /search.json:
//   { t: title, u: url, b?: book title, h: [headings], x: plain text (capped) }

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const HEADING = /<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi;

function decodeEntities(text) {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (whole, name) => {
    if (name[0] !== '#') return ENTITIES[name.toLowerCase()] || whole;
    const code = name[1].toLowerCase() === 'x' ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
    return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
  });
}

function htmlToText(html) {
  const withoutNoise = String(html || '')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<td class="gutter">[\s\S]*?<\/td>/gi, ' ');
  return decodeEntities(withoutNoise.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function headingsOf(html) {
  return Array.from(String(html || '').matchAll(HEADING), match => htmlToText(match[1])).filter(Boolean);
}

function toUrl(path) {
  return '/' + String(path).replace(/^\/+/, '').replace(/index\.html$/, '');
}

function buildSearchIndex(entries, { maxChars = 20000 } = {}) {
  return entries.map(entry => {
    const doc = { t: entry.title || '', u: toUrl(entry.path) };
    if (entry.bookTitle) doc.b = entry.bookTitle;
    doc.h = headingsOf(entry.content);
    doc.x = htmlToText(entry.content).slice(0, maxChars);
    return doc;
  });
}

module.exports = { buildSearchIndex, htmlToText };
