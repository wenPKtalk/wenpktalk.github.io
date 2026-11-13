'use strict';

// Markdown pre-processing that must happen before Hexo highlights code and marked parses emphasis.

const MERMAID_FENCE = /^(```|~~~)mermaid[ \t]*\n([\s\S]*?)\n\1[ \t]*$/gm;
const CODE_FENCE = /^(```|~~~)[^\n]*\n[\s\S]*?\n\1[ \t]*$/gm;
const INLINE_CODE = /(`+)[\s\S]*?\1/g;
const DISPLAY_MATH = /\$\$([\s\S]+?)\$\$/g;
// $...$ on one line; no space just inside the dollars, so "$5 and $10" is not math
const INLINE_MATH = /(^|[^\\$])\$(?=\S)([^$\n]*?\S)\$(?!\d)/g;
// Characters marked or Nunjucks would act on, written as numeric entities; textContent restores them.
const SHIELDED = /[\\*_[\](){}~`|$#<>&"]/g;

function shield(text) {
  return text.replace(SHIELDED, ch => `&#${ch.codePointAt(0)};`);
}

function escapeForHtml(text) {
  return text.replace(/[&<>"{}]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '{': '&#123;', '}': '&#125;' })[ch]);
}

function renderMermaidFences(markdown) {
  return markdown.replace(MERMAID_FENCE, (whole, fence, code) => `<pre class="mermaid">${escapeForHtml(code)}</pre>`);
}

// Applies `transform` only to the parts of `text` that are not fenced or inline code.
function outsideCode(text, transform) {
  return splitBy(text, CODE_FENCE, prose => splitBy(prose, INLINE_CODE, transform));
}

function splitBy(text, pattern, transform) {
  let output = '';
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    output += transform(text.slice(last, match.index)) + match[0];
    last = match.index + match[0].length;
  }
  return output + transform(text.slice(last));
}

function protectMath(markdown) {
  return outsideCode(markdown, prose => prose
    .replace(DISPLAY_MATH, (whole, tex) => `\n\n<div class="math math-display">${shield(tex.trim())}</div>\n\n`)
    .replace(INLINE_MATH, (whole, before, tex) => `${before}<span class="math math-inline">${shield(tex)}</span>`));
}

module.exports = { renderMermaidFences, protectMath };
