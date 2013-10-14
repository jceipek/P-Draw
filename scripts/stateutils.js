define(['two', 'graphicsbind'], function (two, gbind) {
  var _state
    , _map
    , _two;

  var G = {
    init: function (targetElement) {
      _state = {};
      _two = new Two({ fullscreen: true, type: Two.Types.canvas }).appendTo(targetElement);
      _map = new gbind.ObjectArray(_two);
    }
  , addObj: function (obj) {
      return _map.push(obj);
    }
  , removeObj: function (obj) {
      return _map.remove(obj);
    }
  , refresh: function () {
      _map.update();
    }
  , performFnOnSnapPoints: function (fn) {
      var objects = _map.inspect();
      for (var objIdx = 0; objIdx < objects.length; objIdx++) {
        var obj = objects[objIdx];
        if (obj.getSnapPoints) {
          var snapPoints = obj.getSnapPoints();
          for (var ptIdx = 0; ptIdx < snapPoints.length; ptIdx++) {
            fn(snapPoints[ptIdx]);
          }
        }

      }
    }
  };

  return G;
});