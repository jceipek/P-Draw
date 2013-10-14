define(['keycodes'
       , 'operationmanager'
       , 'stateutils'
       , 'snapmanager'
       , 'utils'], function (KEYCODE, operationmanager, stateutils, snapmanager, utils) {
  var _circle = null
    , rnd = function (n) { return utils.roundToDecimals(n, 2); }
    , _center = null
    , _radius = null;
  var T = {
    name: 'createCircle'
  , key: KEYCODE.c
  , metaKey: false
  , shiftKey: false
  , activate: function () {
      snapmanager.showPoints();
    }
  , deactivate: function () {
      snapmanager.hidePoints();
    }
  , onmousedown: function (e) {
      var mPos = { x: e.clientX, y: e.clientY }
        , closest = snapmanager.closestPointTo(mPos)
        , circleData;
      if (closest) {
        mPos.x = closest.x;
        mPos.y = closest.y;
        _center = closest.ident;
      } else {
        _center = "&lt;" + rnd(mPos.x) + ", " + rnd(mPos.y) + "&gt;";
      }
      circleData = { type: 'circle', x: mPos.x, y: mPos.y, isTemp: true };
      _circle = stateutils.addObj(circleData);
      stateutils.refresh();
    }
  , onmousemove: function (e) {
      if(_circle) {
        var mPos = { x: e.clientX, y: e.clientY }
          , center = { x: _circle.x, y: _circle.y }
          , closest = snapmanager.closestPointTo(mPos);
          if (closest) {
            mPos.x = closest.x;
            mPos.y = closest.y;
            _radius = "constrained to " + closest.ident;
          } else {
            _radius = "&lt;" + rnd(Math.sqrt(utils.distSquared(center, mPos))) + "&gt;";
          }
          _circle.radius = Math.sqrt(utils.distSquared(center, mPos));
          stateutils.refresh();
      }
    }
  , onmouseup: function (e) {
      if (_circle) {
        var proxyOp = { action: 'create'
                      , obj: _circle.toJSON()
                      , message: this.getMessage() };
        stateutils.removeObj(_circle);
        operationmanager.performOp(proxyOp);
        _circle = null;
        snapmanager.hidePoints();
        stateutils.refresh();
        operationmanager.wipeRedoHistory();
      }
    }
  , getMessage: function () {
      var message;
      if (_circle) {
        message = "Draw circle centered on <span class='param'>" + _center
                + "</span> with radius <span class='param'>" + _radius + "</span>.";
      } else {
        message = "Click and drag to draw a circle.";
      }
      return message;
    }
  };
  return T;
});