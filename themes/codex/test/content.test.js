'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { readingMinutes } = require('../lib/reading');
const { buildSearchIndex, htmlToText } = require('../lib/search');
const { renderMermaidFences, protectMath } = require('../lib/markdown');

test('reading time counts Chinese characters and English words, at least one minute', () => {
  const chinese = '<p>' + '字'.repeat(800) + '</p>';
  const english = '<p>' + 'word '.repeat(400) + '</p>';

  assert.equal(readingMinutes(chinese), 2);
  assert.equal(readingMinutes(english), 2);
  assert.equal(readingMinutes('<p>短</p>'), 1);
  assert.equal(readingMinutes(''), 1);
});

test('htmlToText drops tags, scripts and code line numbers and decodes entities', () => {
  const html = '<p>a &lt;b&gt; &amp; c&#39;s</p><script>x()</script>'
    + '<figure class="highlight"><table><tr><td class="gutter"><pre>1\n2</pre></td><td class="code"><pre>int x;</pre></td></tr></table></figure>';

  assert.equal(htmlToText(html), "a <b> & c's int x;");
});

test('search index keeps title, url, book, headings and capped text', () => {
  const index = buildSearchIndex([
    { title: 'GC', path: '2020/09/01/gc/', content: '<h2 id="a">标记清除</h2><p>' + 'x'.repeat(50) + '</p>', bookTitle: '深入理解 JVM' },
    { title: 'Empty', path: 'e/', content: '' }
  ], { maxChars: 20 });

  assert.deepEqual(index[0], { t: 'GC', u: '/2020/09/01/gc/', b: '深入理解 JVM', h: ['标记清除'], x: '标记清除 xxxxxxxxxxxxxxx' });
  assert.equal(index[1].x, '');
  assert.equal('b' in index[1], false);
});

test('mermaid fences become escaped <pre class="mermaid"> blocks', () => {
  const md = 'intro\n\n```mermaid\ngraph TD\n  A{{hex}} --> B["<b>"]\n```\n\n```js\nx\n```';

  const out = renderMermaidFences(md);

  assert.match(out, /<pre class="mermaid">graph TD\n {2}A&#123;&#123;hex&#125;&#125; --&gt; B\[&quot;&lt;b&gt;&quot;\]<\/pre>/);
  assert.match(out, /```js\nx\n```/);
});

test('math is shielded from markdown and code is left alone', () => {
  const md = 'Euler $e^{i\\pi}+1=0$ and $a_1 * b_2$.\n\n$$\n\\sum_{i=1}^n i\n$$\n\n`$HOME` costs \\$5\n\n```\n$x$\n```';

  const out = protectMath(md);

  assert.match(out, /<span class="math math-inline">e\^&#123;i&#92;pi&#125;\+1=0<\/span>/);
  assert.match(out, /<span class="math math-inline">a&#95;1 &#42; b&#95;2<\/span>/);
  assert.match(out, /\n\n<div class="math math-display">\n?&#92;sum&#95;&#123;i=1&#125;\^n i\n?<\/div>\n\n/);
  assert.match(out, /`\$HOME` costs \\\$5/);
  assert.match(out, /```\n\$x\$\n```/);
});

test('prices and lone dollar signs are not math', () => {
  const md = 'It costs $5 and $10 later.';

  assert.equal(protectMath(md), md);
});
