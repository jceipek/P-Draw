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
      if (_activeTool && _activeTool.deactivate) _activeTool.deactivate();
      _activeTool = tool;
      if (tool && tool.activate) tool.activate();
    }
  , updateStatusDisplay: function (tool) {
      if (tool && tool.getMessage) {
        var message = tool.getMessage();
        if (message) _setStatusDisplay(message);
      }
    }
  , onmousedown: function (e) {
      if (_activeTool && _activeTool.onmousedown) {
        _activeTool.onmousedown(e);
        this.updateStatusDisplay(_activeTool);
      }
    }
  , onmousemove: function (e) {
      if (_activeTool && _activeTool.onmousemove) {
        _activeTool.onmousemove(e);
        this.updateStatusDisplay(_activeTool);
      }
    }
  , onmouseup: function (e) {
      if (_activeTool && _activeTool.onmouseup) {
        _activeTool.onmouseup(e);
        this.updateStatusDisplay(_activeTool);
      }
    }
  , onkeydown: function (e) {
      // TODO: Check this logic
      var key = e.keyCode + "," + e.metaKey + "," + e.shiftKey
        , tool = _keyToTools[key];
      if (tool && tool.type === 'instantaneous') {
        if (tool.onkeydown) {
          tool.onkeydown(e);
          this.updateStatusDisplay(tool);
        }
      } else {
        this.changeActiveTool(tool);
        this.updateStatusDisplay(tool);
      }
    }
  , onkeyup: function (e) {
      if (_activeTool && _activeTool.onkeyup) {
        _activeTool.onkeyup(e);
        this.updateStatusDisplay(_activeTool);
      }
    }
  };

  return G;
});