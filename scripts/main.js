"use strict";

require.config({
  paths: {
    zepto: '3rdparty/zepto.min'
  , pixi: '3rdparty/pixi'
  , two: '3rdparty/two.min'
  },
  shim: {
    zepto: {
      exports: '$'
    }
  , pixi: {
      exports: 'PIXI'
    }
  }
});

require(['3rdparty/domReady!', 'test2'], function(_, G) {
  G.init();
});
