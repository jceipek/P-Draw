define(['two', 'graphicsbind'], function (two, gbind) {
  var _state
    , _map
    , _two;

  var G = {
    init: function (targetElement) {
      _state = {};
      _two = new Two({ fullscreen: true, type: Two.Types.webgl }).appendTo(targetElement);
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
  };

  return G;
});