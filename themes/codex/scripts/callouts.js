'use strict';

/* global hexo */
const { renderCallouts } = require('../lib/callouts');

hexo.extend.filter.register('after_post_render', data => {
  data.content = renderCallouts(data.content, hexo.theme.config.callout_titles || {});
  return data;
});
