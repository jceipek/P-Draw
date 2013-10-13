define(['tools/createCircle'], function (createCircle) {
  var _state = null;

  var G = {
    init: function (state) {
      _state = {};
    }
  , addObj: function (obj) {
      return _state.map.push(obj);
    }
  , removeObj: function (obj) {
      return _state.map.remove(obj);
    }
  , refresh: function () {
      _state.map.update();
    }
  };

  return G;
});