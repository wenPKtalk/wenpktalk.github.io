'use strict';

// GitHub-style alerts in rendered HTML:
//   <blockquote><p>[!NOTE] Title<br>body…</p>…</blockquote>
//   -> <div class="callout callout-note"><p class="callout-title">Title</p><p>body…</p>…</div>
// Nested quotes inside a callout (e.g. an English original) are kept as quotes.

// The title runs to the first <br> or </p> and may contain inline tags such as <code>.
const OPENING = /<blockquote>\s*<p>\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\][ \t]*([^\n]*?)\s*(<br\s*\/?>\s*|<\/p>)/i;
const QUOTE_TAG = /<blockquote\b[^>]*>|<\/blockquote>/gi;

function renderCallouts(html, labels = {}) {
  let output = html;
  let searchFrom = 0;
  for (;;) {
    const opening = findOpening(output, searchFrom);
    if (!opening) return output;
    const closeIndex = findMatchingClose(output, opening.index);
    if (closeIndex < 0) return output;
    output = replaceCallout(output, opening, closeIndex, labels);
    searchFrom = opening.index;
  }
}

function findOpening(html, fromIndex) {
  const match = OPENING.exec(html.slice(fromIndex));
  if (!match) return null;
  return {
    index: fromIndex + match.index,
    length: match[0].length,
    type: match[1].toLowerCase(),
    title: match[2].trim(),
    endsParagraph: match[3].startsWith('</p')
  };
}

function findMatchingClose(html, openIndex) {
  QUOTE_TAG.lastIndex = openIndex;
  let depth = 0;
  for (let tag = QUOTE_TAG.exec(html); tag; tag = QUOTE_TAG.exec(html)) {
    depth += tag[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return tag.index;
  }
  return -1;
}

function replaceCallout(html, opening, closeIndex, labels) {
  const title = opening.title || labels[opening.type] || opening.type;
  const head = `<div class="callout callout-${opening.type}"><p class="callout-title">${title}</p>${opening.endsParagraph ? '' : '<p>'}`;
  const body = html.slice(opening.index + opening.length, closeIndex);
  const tail = html.slice(closeIndex + '</blockquote>'.length);
  return html.slice(0, opening.index) + head + body + '</div>' + tail;
}

module.exports = { renderCallouts };
