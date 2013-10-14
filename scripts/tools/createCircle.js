define(['keycodes', 'operationmanager', 'stateutils', 'utils'], function (KEYCODE, operationmanager, stateutils, utils) {
  var _circle = null
    , rnd = function (n) { return utils.roundToDecimals(n, 2); };
  var T = {
    name: 'createCircle'
  , key: KEYCODE.c
  , metaKey: false
  , shiftKey: false
  , onmousedown: function (e) {
      var mPos = { x: e.clientX, y: e.clientY }
        , circleData = { type: 'circle', x: mPos.x, y: mPos.y, isTemp: true };
      _circle = stateutils.addObj(circleData);
      stateutils.refresh();
    }
  , onmousemove: function (e) {
      if(_circle) {
        var mPos = { x: e.clientX, y: e.clientY }
          , center = { x: _circle.x, y: _circle.y }
          _circle.radius = Math.sqrt(utils.distSquared(center, mPos));
          stateutils.refresh();
      }
    }
  , onmouseup: function (e) {
      if (_circle) {
                //_g.clearSnapPoints();
        var proxyOp = { action: 'create'
                      , obj: _circle.toJSON()
                      , message: this.getMessage() };
        stateutils.removeObj(_circle);
        operationmanager.performOp(proxyOp);
        _circle = null;
        stateutils.refresh();
        operationmanager.wipeRedoHistory();
      }
    }
  , getMessage: function () {
      var message;
      if (_circle) {
        message = "Draw circle at <span class='param'>&lt;" + rnd(_circle.x) + ", " + rnd(_circle.y)
                + "&gt;</span> with radius <span class='param'>&lt;" + rnd(_circle.radius) + "&gt;</span>.";
      } else {
        message = "Click and drag to draw a circle.";
      }
      return message;
    }
  };
  return T;
});