define(['zepto'
       , 'handlers'
       , 'utils'
       , 'keycodes'
       , 'tools'
       , 'stateutils'], function ($, handlers, utils, KEYCODE, tools, stateutils) {
  var DEBUG = true
    , G
    , _interface = {};

  G = {
    get activeTool() {
      var _g = this;
      console.log("Currently broken!");
      //return _g.state.op.tool;
      return null;
    }
  , set activeTool(val) {
      var _g = this;
      //$('.js-tool__panel').children('[data-tool=' + _g.state.op.tool +']').removeClass('is-active');
      //$('.js-tool__panel').children('[data-tool=' + val +']').addClass('is-active');
      //_g.state.actionDisplay.contents = _g.getMessageForCurrTool();
      //_g.state.op.tool = val;
      console.log("Currently broken!");
    }
  , state: {
      actionDisplay: null
    }
  , init: function () {
      var _g = this;
      _interface.canvas = document.getElementById('js-drawing-interface');
      _interface.statusDisplay = $('.js-status-display');
      stateutils.init(_interface.canvas);
      _g.connectHandlers();
      tools.registerAll();
      tools.connectStatusDisplaySetter(_g.updateStatusDisplay);
    }
  , updateStatusDisplay: function (message) {
      _interface.statusDisplay.html(message);
    }
  , connectHandlers: function () {
      var _g = this
        , op = _g.state.op;
      $(window).bind('contextmenu', function (e) {
        return false;
      });

      $(window).bind('mousedown', tools.onmousedown.bind(tools));
      $(window).bind('mouseup', tools.onmouseup.bind(tools));
      $(window).bind('mousemove', tools.onmousemove.bind(tools));
      $(window).bind('keydown', tools.onkeydown.bind(tools));
      $(window).bind('keyup', tools.onkeyup.bind(tools));

//     _g.generateSnapPoints();
    }
  };

  window.G = G;

  return G;
});