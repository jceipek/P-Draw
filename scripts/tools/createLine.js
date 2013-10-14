define(['keycodes', 'operationmanager', 'stateutils', 'utils'], function (KEYCODE, operationmanager, stateutils, utils) {
  var _state
    , _line = null
    , _message = "Some Message";
  var T = {
    name: 'createLine'
  , key: KEYCODE.l
  , metaKey: false
  , shiftKey: false
  , onmousedown: function (e) {
      var mPos = { x: e.clientX, y: e.clientY }
        , circleData = { type: 'line', x1: mPos.x, y1: mPos.y, x2: mPos.x, y2: mPos.y, isTemp: true };
      _line = stateutils.addObj(circleData);
      //op.message = _g.getMessageForCurrTool();
      stateutils.refresh();
    }
  , onmousemove: function (e) {
      if(_line) {
        var mPos = { x: e.clientX, y: e.clientY };
        _line.x2 = mPos.x;
        _line.y2 = mPos.y;
        //op.message = _g.getMessageForCurrTool();
        //_g.state.actionDisplay.contents = op.message;
        stateutils.refresh();
      }
    }
  , onmouseup: function (e) {
      if (_line) {
        //_g.clearSnapPoints();
        var proxyOp = { action: 'create'
                      , obj: _line.toJSON()
                      , message: _message };
        stateutils.removeObj(_line);
        operationmanager.performOp(proxyOp);
        _line = null;
        stateutils.refresh();
        operationmanager.wipeRedoHistory();
      }
    }
  , getMessage: function () {
      var message;
      if (_line) {
        message = "Draw line from <" + rnd(obj.x1) + ", " + rnd(obj.y1)
                + "> to <" + rnd(obj.x2) + ", " + rnd(obj.y2) + ">.";
      } else {
        message = "Click and drag to draw a line.";
      }
      return message;
    }
  };
  return T;
});