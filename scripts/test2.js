define(['zepto', 'two', 'handlers', 'graphicsbind', 'htmltextbind', 'utils', 'keycodes'], function ($, two, handlers, gbind, tbind, utils, KEYCODE) {
  var DEBUG = true
    , G;

  G = {
    two: null
  , get activeTool() {
      var _g = this;
      return _g.state.op.tool;
    }
  , set activeTool(val) {
      var _g = this;
      $('.js-tool__panel').children('[data-tool=' + _g.state.op.tool +']').removeClass('is-active');
      $('.js-tool__panel').children('[data-tool=' + val +']').addClass('is-active');
      _g.state.actionDisplay.contents = _g.getMessageForCurrTool();
      _g.state.op.tool = val;
    }
  , state: {
      actionDisplay: null
    , map: null
    , op: { tool: 'createCircle'
          , ref: null
          , message: ""
          }
    , ops: [] // Sequence of applied operations. Push to add new step.
    , redoOps: [] // Sequence of operations that were undone. Pop and perform to redo.
    , tempSnapPoints: [] // Used for temporary references to snap locations
    }
  , closestSnapPointTo: function (pos) {
      var _g = this
        , i
        , dist
        , closest = {
            index: 0
          , dist: Infinity
          , value: null
        };
      for (i = 0; i < _g.state.tempSnapPoints.length; i++) {
        dist = utils.distSquared(_g.state.tempSnapPoints[i], pos);
        if (dist <= closest.dist && dist < 1000) {
          closest.index = i;
          closest.dist = dist;
          closest.value = _g.state.tempSnapPoints[i];
        }
      }
      return closest.value;
    }
  , clearSnapPoints: function () {
      var _g = this;
      while(_g.state.tempSnapPoints.length) {
        _g.removeObj(_g.state.tempSnapPoints.pop());
      }
    }
  , generateSnapPoints: function () {
      var _g = this;
      if (_g.state.tempSnapPoints.length) { return; }
      for (var childKey in G.two.scene.children) {
        if (G.two.scene.children.hasOwnProperty(childKey)) {
          var child = G.two.scene.children[childKey];
          var verts = child.vertices;
          for (var j = 0; j < verts.length; j++) {
            var pt = { type: 'circle'
                     , x: verts[j].x + child.translation.x
                     , y: verts[j].y + child.translation.y
                     , isSnapGuide: true };
            _g.state.tempSnapPoints.push(_g.addObj(pt));
            pt = { type: 'circle'
                     , x: child.translation.x
                     , y: child.translation.y
                     , isSnapGuide: true };
            _g.state.tempSnapPoints.push(_g.addObj(pt));
          }
        }
      };
      _g.refresh();
    }
  , getMessageForCurrTool: function () {
      var _g = this
        , op = _g.state.op
        , rnd = function (n) { return utils.roundToDecimals(n, 2); };
      //if (!(_g.activeTool)) { return; };
      switch (_g.activeTool) {
        case 'createCircle':
          var obj = op.ref
            , message;
          if (obj) {
            message = "Draw circle at <" + rnd(obj.x) + ", " + rnd(obj.y)
                    + "> with radius <" + rnd(obj.radius) + ">.";
          } else {
            message = "Click and drag to draw a circle.";
          }
          return message;
          break;
        case 'createLine':
          var obj = op.ref
            , message;
          if (obj) {
            message = "Draw line from <" + rnd(obj.x1) + ", " + rnd(obj.y1)
                    + "> to <" + rnd(obj.x2) + ", " + rnd(obj.y2) + ">.";
          } else {
            message = "Click and drag to draw a line.";
          }

          return message;
          break;
        default:
          throw "Update Message: Unrecognized Tool: '" + _g.activeTool + "'!";
      }

    }
  , redoLast: function () {
      var _g = this
        , op = _g.state.redoOps.pop();
      if (op) {
        _g.state.actionDisplay.contents = "Redo " + utils.uncapitalized(op.message);
        _g.performOp(op);
      }
    }
  , undoLast: function () {
      var _g = this
        , op = _g.state.ops.pop();
      if (op) {
        _g.state.actionDisplay.contents = "Undo " + utils.uncapitalized(op.message);
        _g.state.redoOps.push(op);
        _g.undoOp(op);
      };
    }
  , performOp: function (proxyOp) {
      var _g = this
        , ops = _g.state.ops;
      switch (proxyOp.action) {
        case 'create':
          var obj = _g.addObj(proxyOp.obj)
            , op = { action: proxyOp.action, obj: obj, message: proxyOp.message };
          ops.push(op);
          return true;
          break;
        default:
          throw "Perform: Unrecognized Operation: '" + proxyOp.action + "'!";
      }
    }
  , undoOp: function (op) {
      var _g = this;
      switch (op.action) {
        case 'create':
          _g.removeObj(op.obj);
          return true;
          break;
        default:
          throw "Undo: Unrecognized Operation: '" + proxyOp.action + "'!";
      }
    }
  , init: function () {
      var _g = this
        elem = document.getElementById('js-drawing-interface');

      _g.two = new Two({ fullscreen: true, type: Two.Types.webgl }).appendTo(elem);
      _g.state.map = new gbind.ObjectArray(_g.two);
      _g.connectHandlers();
      _g.state.actionDisplay = new tbind.HTMLNode('.js-state-display');
      _g.activeTool = 'createCircle';
      _g.refresh();
    }
  , addObj: function (obj) {
      var _g = this;
      return _g.state.map.push(obj);
    }
  , removeObj: function (obj) {
      var _g = this;
      return _g.state.map.remove(obj);
    }
  , refresh: function () {
      var _g = this;
      _g.state.map.update();
    }
  , connectHandlers: function () {
      var _g = this
        , op = _g.state.op;
      $(window).bind('contextmenu', function (e) {
        return false;
      });

      $(window).bind('mousedown', function (e) {
        if (e.button === 0) {
          _g.generateSnapPoints();
          var mPos = { x: e.clientX, y: e.clientY }
            , snap = _g.closestSnapPointTo({x: mPos.x, y: mPos.y});
          if (snap) {
            mPos.x = snap.x;
            mPos.y = snap.y;
          }
          switch (_g.activeTool) {
            case 'createCircle':
              op.ref = { type: 'circle', x: mPos.x, y: mPos.y, isTemp: true };
              op.ref = _g.addObj(op.ref);
              op.message = _g.getMessageForCurrTool();
              _g.refresh();
              break;
            case 'createLine':
              op.ref = { type: 'line', x1: mPos.x, y1: mPos.y, x2: mPos.x, y2: mPos.y, isTemp: true };
              op.ref = _g.addObj(op.ref);
              op.message = _g.getMessageForCurrTool();
              _g.refresh();
              break;
          default:
            throw "Unrecognized tool: '" + _g.activeTool + "'!";
          }
        }
      });

      $(window).bind('mousemove', function (e) {
        if (op.ref) {
          var mPos = { x: e.clientX, y: e.clientY }
            , snap = _g.closestSnapPointTo({x: mPos.x, y: mPos.y});
          if (snap) {
            mPos.x = snap.x;
            mPos.y = snap.y;
          }
          switch (op.tool) {
            case 'createCircle':
              var center = { x: op.ref.x, y: op.ref.y };
              radius = Math.sqrt(utils.distSquared(center, mPos));
              op.ref.radius = radius;
              op.message = _g.getMessageForCurrTool();
              _g.state.actionDisplay.contents = op.message;
              _g.refresh();
              break;
            case 'createLine':
              op.ref.x2 = mPos.x;
              op.ref.y2 = mPos.y;
              op.message = _g.getMessageForCurrTool();
              _g.state.actionDisplay.contents = op.message;
              _g.refresh();
              break;
            default:
              throw "Unrecognized tool: '" + type + "'!";
          }
        }
      });

      $(window).bind('mouseup', function (e) {
        if (op.ref) {
          switch (op.tool) {
            case 'createLine':
              // Same as circle
            case 'createCircle':
              _g.clearSnapPoints();
              var proxyOp = { action: 'create'
                            , obj: op.ref.toJSON()
                            , message: op.message };
              _g.removeObj(op.ref);
              _g.performOp(proxyOp);
              op.ref = null;
              _g.refresh();
              // Currently breaks the undo tree.
              // A more interesting approach might be visual undo, with an actual tree?
              _g.state.redoOps.length = 0; // Clear the array
              break;
            default:
              throw "Unrecognized tool: '" + type + "'!";
          }
        }
      });

      $(window).bind('keydown', function (e) {
        if (e.keyCode === KEYCODE.z && e.metaKey) {
          if (e.shiftKey) {
            _g.redoLast();
            _g.refresh();
          } else {
            _g.undoLast();
            _g.refresh();
          }
        }

        var switchTool = false;
        switch (e.keyCode) {
          case KEYCODE.c:
            _g.activeTool = 'createCircle';
            switchTool = true;
            break;
          case KEYCODE.l:
            _g.activeTool = 'createLine';
            switchTool = true;
            break;
          default:
            break;
        }
        if (switchTool) {
          _g.generateSnapPoints();
          _g.state.actionDisplay.contents = _g.getMessageForCurrTool();
        }
      });

      $(window).bind('keyup', function (e) {
        switch (e.keyCode) {
          case KEYCODE.c:
            // _g.activeTool = null;
            break;
          case KEYCODE.l:
            // _g.activeTool = null;
            break;
          default:
            break;
        }
      });
    }
  };

  window.G = G;

  return G;
});