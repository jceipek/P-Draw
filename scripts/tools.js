define([ 'operationmanager'
       , 'tools/createCircle'
       , 'tools/createLine'
       , 'tools/undo'
       , 'tools/redo'
       ], function (operationmanager, createCircle, createLine, undo, redo) {
  var _state = {}
    , _keyToTools = {}
    , _activeTool = null
    , _setStatusDisplay
    , register = function (tool) {
        _keyToTools[tool.key + "," + (!!tool.metaKey) + "," + (!!tool.shiftKey)] = tool;
      };

  var G = {
    registerAll: function () {
      register(createCircle);
      register(createLine);
      register(undo);
      register(redo);
    }
  , connectStatusDisplaySetter: function (setter) {
      _setStatusDisplay = setter;
    }
  , changeActiveTool: function (tool) {
      _activeTool = tool;
    }
  , updateStatusDisplay: function () {
      if (_activeTool && _activeTool.getMessage) {
        _setStatusDisplay(_activeTool.getMessage());
      }
    }
  , onmousedown: function (e) {
      if (_activeTool && _activeTool.onmousedown) {
        _activeTool.onmousedown(e);
        this.updateStatusDisplay();
      }
    }
  , onmousemove: function (e) {
      if (_activeTool && _activeTool.onmousemove) {
        _activeTool.onmousemove(e);
        this.updateStatusDisplay();
      }
    }
  , onmouseup: function (e) {
      if (_activeTool && _activeTool.onmouseup) {
        _activeTool.onmouseup(e);
        this.updateStatusDisplay();
      }
    }
  , onkeydown: function (e) {
      // TODO: Check this logic
      var key = e.keyCode + "," + e.metaKey + "," + e.shiftKey;
      if (_keyToTools[key] && _keyToTools[key].type === 'instantaneous') {
        if (_keyToTools[key].onkeydown) {
          _keyToTools[key].onkeydown(e);
        }
      } else {
        this.changeActiveTool(_keyToTools[key]);
        this.updateStatusDisplay();
      }
    }
  , onkeyup: function (e) {
      if (_activeTool && _activeTool.onkeyup) {
        _activeTool.onkeyup(e);
        this.updateStatusDisplay();
      }
    }
  };

  return G;
});