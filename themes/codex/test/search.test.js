'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { search } = require('../source/js/search');

const INDEX = [
  { t: '深入理解JVM-垃圾回收', u: '/gc/', b: '深入理解 JVM', h: ['标记清除', '分代算法'], x: '垃圾回收器 G1 和 ZGC 的工作原理。分代算法基于弱分代假说。' },
  { t: 'Redis 数据结构', u: '/redis/', h: ['跳表'], x: 'Redis 的有序集合使用跳表。也提到了 G1？没有。' },
  { t: 'Design Pattern Summary', u: '/dp/', h: [], x: 'Strategy and Observer <script> patterns.' }
];

test('every term must match and title hits rank first', () => {
  const results = search(INDEX, '分代 算法');

  assert.deepEqual(results.map(result => result.doc.u), ['/gc/']);
});

test('matching is case-insensitive and ranks title above body', () => {
  const results = search(INDEX, 'redis');

  assert.equal(results[0].doc.u, '/redis/');
});

test('snippets are escaped and highlight the terms', () => {
  const [result] = search(INDEX, 'observer');

  assert.match(result.snippet, /<mark>Observer<\/mark>/);
  assert.match(result.snippet, /&lt;script&gt;/);
});

test('blank queries and misses return nothing', () => {
  assert.deepEqual(search(INDEX, '   '), []);
  assert.deepEqual(search(INDEX, 'kafka'), []);
});

test('results are capped by the limit', () => {
  assert.equal(search(INDEX, 'e', 2).length, 2);
});
