'use strict';

const CJK_CHARS_PER_MINUTE = 400;
const WORDS_PER_MINUTE = 200;
const CJK = /[㐀-鿿豈-﫿぀-ヿ가-힯]/g;
const WORD = /[A-Za-z0-9][A-Za-z0-9'’-]*/g;

// Estimated minutes to read rendered HTML, never less than one.
function readingMinutes(html) {
  const text = String(html || '').replace(/<[^>]+>/g, ' ');
  const cjkCount = (text.match(CJK) || []).length;
  const wordCount = (text.replace(CJK, ' ').match(WORD) || []).length;
  return Math.max(1, Math.ceil(cjkCount / CJK_CHARS_PER_MINUTE + wordCount / WORDS_PER_MINUTE));
}

module.exports = { readingMinutes };
