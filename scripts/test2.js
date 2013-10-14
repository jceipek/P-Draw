define(['zepto', 'handlers', 'htmltextbind', 'utils', 'keycodes', 'tools', 'stateutils'], function ($, handlers, tbind, utils, KEYCODE, tools, stateutils) {
  var DEBUG = true
    , G
    , interface = {};

  G = {
    two: null
  , get activeTool() {
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
      var _g = this
        , elem = document.getElementById('js-drawing-interface');
      stateutils.init(elem);
      _g.connectHandlers();
      _g.state.actionDisplay = new tbind.HTMLNode('.js-state-display');
      _g.activeTool = 'createCircle';
      tools.registerAll();
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
//     _g.state.actionDisplay.contents = _g.getMessageForCurrTool();
    }
  };

  window.G = G;

  return G;
});