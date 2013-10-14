define(['keycodes', 'operationmanager', 'stateutils', 'utils'], function (KEYCODE, operationmanager, stateutils, utils) {
  var _line = null
    , rnd = function (n) { return utils.roundToDecimals(n, 2); };
  var T = {
    name: 'createLine'
  , key: KEYCODE.l
  , metaKey: false
  , shiftKey: false
  , onmousedown: function (e) {
      var mPos = { x: e.clientX, y: e.clientY }
        , circleData = { type: 'line', x1: mPos.x, y1: mPos.y, x2: mPos.x, y2: mPos.y, isTemp: true };
      _line = stateutils.addObj(circleData);
      stateutils.refresh();
    }
  , onmousemove: function (e) {
      if(_line) {
        var mPos = { x: e.clientX, y: e.clientY };
        _line.x2 = mPos.x;
        _line.y2 = mPos.y;
        stateutils.refresh();
      }
    }
  , onmouseup: function (e) {
      if (_line) {
        //_g.clearSnapPoints();
        var proxyOp = { action: 'create'
                      , obj: _line.toJSON()
                      , message: this.getMessage() };
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
        message = "Draw line from <" + rnd(_line.x1) + ", " + rnd(_line.y1)
                + "> to <" + rnd(_line.x2) + ", " + rnd(_line.y2) + ">.";
      } else {
        message = "Click and drag to draw a line.";
      }
      return message;
    }
  };
  return T;
});