define(['keycodes'
       , 'operationmanager'
       , 'stateutils'
       , 'snapmanager'
       , 'utils'], function (KEYCODE, operationmanager, stateutils, snapmanager, utils) {
  var _line = null
    , rnd = function (n) { return utils.roundToDecimals(n, 2); }
    , _start = null
    , _end = null;
  var T = {
    name: 'createLine'
  , key: KEYCODE.l
  , metaKey: false
  , shiftKey: false
  , activate: function () {
      snapmanager.showPoints();
    }
  , deactivate: function () {
      snapmanager.hidePoints();
    }
  , onmousedown: function (e) {
      snapmanager.showPoints();
      var mPos = { x: e.clientX, y: e.clientY }
        , closest = snapmanager.closestPointTo(mPos)
        , lineData;
      if (closest) {
        mPos.x = closest.x;
        mPos.y = closest.y;
        _start = closest.ident;
      } else {
        _start = "&lt;" + rnd(mPos.x) + ", " + rnd(mPos.y) + "&gt;";
      }
      lineData = { type: 'line', x1: mPos.x, y1: mPos.y, x2: mPos.x, y2: mPos.y, isTemp: true };
      _line = stateutils.addObj(lineData);
      stateutils.refresh();
    }
  , onmousemove: function (e) {
      if(_line) {
        var mPos = { x: e.clientX, y: e.clientY }
          , closest = snapmanager.closestPointTo(mPos);
        if (closest) {
          mPos.x = closest.x;
          mPos.y = closest.y;
          _end = closest.ident;
        } else {
          _end = "&lt;" + rnd(mPos.x) + ", " + rnd(mPos.y) + "&gt;";
        }
        _line.x2 = mPos.x;
        _line.y2 = mPos.y;
        stateutils.refresh();
      }
    }
  , onmouseup: function (e) {
      if (_line) {
        snapmanager.hidePoints();
        var proxyOp = { action: 'create'
                      , obj: _line.toJSON()
                      , message: this.getMessage() };
        stateutils.removeObj(_line);
        operationmanager.performOp(proxyOp);
        _line = null;
        snapmanager.showPoints();
        stateutils.refresh();
        operationmanager.wipeRedoHistory();
      }
    }
  , getMessage: function () {
      var message;
      if (_line) {
        message = "Draw line from <span class='param'>" + _start + "</span> to <span class='param'>" + _end + "</span>.";
      } else {
        message = "Click and drag to draw a line.";
      }
      return message;
    }
  };
  return T;
});