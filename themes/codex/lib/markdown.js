'use strict';

// Markdown pre-processing that must happen before Hexo highlights code and marked parses emphasis.

const zlib = require('node:zlib');

const MERMAID_FENCE = /^(```|~~~)mermaid[ \t]*\n([\s\S]*?)\n\1[ \t]*$/gm;
const PLANTUML_FENCE = /^(```|~~~)(?:plantuml|puml|uml)[ \t]*\n([\s\S]*?)\n\1[ \t]*$/gm;
// PlantUML's own base64 alphabet (https://plantuml.com/text-encoding)
const PLANTUML_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
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

// Deflate, then 6 bits per character from PLANTUML_ALPHABET (zero-padded to whole 3-byte groups).
function encodePlantuml(text) {
  const bytes = zlib.deflateRawSync(Buffer.from(text, 'utf8'), { level: 9 });
  let encoded = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const [b1, b2 = 0, b3 = 0] = bytes.subarray(i, i + 3);
    encoded += PLANTUML_ALPHABET[b1 >> 2]
      + PLANTUML_ALPHABET[((b1 & 0x3) << 4) | (b2 >> 4)]
      + PLANTUML_ALPHABET[((b2 & 0xf) << 2) | (b3 >> 6)]
      + PLANTUML_ALPHABET[b3 & 0x3f];
  }
  return encoded;
}

function withStartEnd(code) {
  const trimmed = code.trim();
  return /^@start/.test(trimmed) ? trimmed : `@startuml\n${trimmed}\n@enduml`;
}

// ```plantuml / ```puml / ```uml fences become <img> tags rendered by a PlantUML server (the source goes to that server).
function renderPlantumlFences(markdown, server) {
  const base = String(server || '').replace(/\/+$/, '');
  return markdown.replace(PLANTUML_FENCE, (whole, fence, code) =>
    `<figure class="plantuml"><img src="${base}/svg/${encodePlantuml(withStartEnd(code))}" alt="PlantUML diagram" loading="lazy"></figure>`);
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

module.exports = { renderMermaidFences, protectMath, renderPlantumlFences, encodePlantuml };
