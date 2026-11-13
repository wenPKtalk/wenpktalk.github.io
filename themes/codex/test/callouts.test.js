'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { renderCallouts } = require('../lib/callouts');

const LABELS = { note: '注', tip: '提示', warning: '警告', important: '重要', caution: '注意' };

test('turns a [!NOTE] quote into a callout and keeps a nested quote intact', () => {
  const html = [
    '<blockquote>',
    '<p>[!NOTE] 译注 · 栈<br>正文一行</p>',
    '<blockquote>',
    '<p>English original</p>',
    '</blockquote>',
    '</blockquote>',
    '<p>after</p>'
  ].join('\n');

  const out = renderCallouts(html, LABELS);

  assert.match(out, /^<div class="callout callout-note"><p class="callout-title">译注 · 栈<\/p><p>正文一行<\/p>/);
  assert.match(out, /<blockquote>\n<p>English original<\/p>\n<\/blockquote>\n<\/div>\n<p>after<\/p>$/);
});

test('a callout without a title gets the label for its type', () => {
  const out = renderCallouts('<blockquote>\n<p>[!TIP]<br>body</p>\n</blockquote>', LABELS);

  assert.equal(out, '<div class="callout callout-tip"><p class="callout-title">提示</p><p>body</p>\n</div>');
});

test('a title-only first paragraph does not leave an empty paragraph', () => {
  const out = renderCallouts('<blockquote>\n<p>[!WARNING] 小心</p>\n<p>body</p>\n</blockquote>', LABELS);

  assert.equal(out, '<div class="callout callout-warning"><p class="callout-title">小心</p>\n<p>body</p>\n</div>');
});

test('plain quotes and unknown markers stay untouched', () => {
  const plain = '<blockquote>\n<p>quoted</p>\n</blockquote>';
  const unknown = '<blockquote>\n<p>[!FOO] x</p>\n</blockquote>';

  assert.equal(renderCallouts(plain, LABELS), plain);
  assert.equal(renderCallouts(unknown, LABELS), unknown);
});

test('consecutive callouts are all converted', () => {
  const html = '<blockquote>\n<p>[!NOTE] a</p>\n</blockquote>\n<blockquote>\n<p>[!TIP] b</p>\n</blockquote>';

  const out = renderCallouts(html, LABELS);

  assert.equal((out.match(/class="callout /g) || []).length, 2);
  assert.equal(out.includes('<blockquote>'), false);
});

test('an unbalanced quote is left as it is', () => {
  const broken = '<blockquote>\n<p>[!NOTE] x</p>';

  assert.equal(renderCallouts(broken, LABELS), broken);
});
