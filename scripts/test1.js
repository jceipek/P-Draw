define(['zepto', 'two', 'handlers'], function ($, two, handlers) {
  var DEBUG = true
    , G;

  G = {
      two: null
    , state: {
        actionDisplay: null
      , op: {
          tool: 'createLine'
        , obj: null
        , handles: []
        }
      , ops: []
      , redoOps: []
      , snapPoints: []
      }
    , removeSnapPoint: function (pos) {
        // Removes first instance of pos in snapPoints
        var _g = this
          , i;
        for (i = 0; i < _g.state.snapPoints.length; i++) {
          if (    _g.state.snapPoints[i].x === pos.x
               && _g.state.snapPoints[i].y === pos.y) {
            _g.state.snapPoints.splice(i,1);
            return true;
          }
        }
        return false;
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
        for (i = 0; i < _g.state.snapPoints.length; i++) {
          dist = _g.distSquared(_g.state.snapPoints[i], pos);
          if (dist <= closest.dist) {
            closest.index = i;
            closest.dist = dist;
            closest.value = _g.state.snapPoints[i];
          }
        }
        return closest.value;
      }
    , distSquared: function (a, b) {
        var x = (a.x - b.x)
          , y = (a.y - b.y);
        return x*x + y*y;
      }
    , redoLast: function () {
        var _g = this
          , op = _g.state.redoOps.pop();
        if (op) {
          _g.performOp(op);
        }
      }
    , undoLast: function () {
        var _g = this
          , op = _g.state.ops.pop();
        if (op) {
          _g.state.redoOps.push(op);
          _g.undoOp(op)
        };
      }
    , performOp: function (proxyOp) {
        var _g = this
          , action = proxyOp.action
          , actions = {
            createLine: function (proxyOp) {
              var ops = _g.state.ops
                , line
                , op;
              line = _g.two.makeLine(proxyOp.params.x1, proxyOp.params.y1,
                                  proxyOp.params.x2, proxyOp.params.y2);

              _g.state.snapPoints.push( { x: proxyOp.params.x1, y: proxyOp.params.y1 }
                                      , { x: proxyOp.params.x2, y: proxyOp.params.y2 });

              line.stroke = '#000000';
              proxyOp.obj = line;
              ops.push(proxyOp);
              return proxyOp;
            }
          };
        if (actions[action]) {
          var op = actions[action](proxyOp);
          _g.state.actionDisplay.html(op.description);
          _g.two.update();
        } else {
          var actionName = "undefined";
          if (action) actionName = action.toString();
          throw "No operation defined for action '" + actionName + "'.";
        }
      }
    , undoOp: function (op) {
        var _g = this
          , action = op.action
          , params = op.params
          , description = 'Undo draw line from <'
               + params.x1 + ', '
               + params.y1 + '> to <'
               + params.x2 + ', '
               + params.y2 + '>.'
          , actions = {
            createLine: function (op) {
              _g.removeSnapPoint({ x: params.x1, y: params.y1 });
              _g.removeSnapPoint({ x: params.x2, y: params.y2 });
              _g.two.remove(op.obj);
              _g.state.actionDisplay.html(description);
            }
          };
        if (actions[action]) {
          actions[action](op);
          _g.two.update();
        } else {
          throw "Can't undo action " + action.toString();
        }
      }
    , init: function () {
        var _g = this
          elem = document.getElementById('js-drawing-interface');

        _g.two = new Two({ fullscreen: true }).appendTo(elem);
        _g.state.actionDisplay = $('.js-state-display');

        $(window).bind('contextmenu', function (e) {
          return false;
        });

        $(window).bind('mousedown', function (e) {
          if (e.button === 0) {
            var x = e.clientX
            , y = e.clientY
            , line = _g.two.makeLine(x, y, x, y)
            , c1 = _g.two.makeCircle(x, y, 4)
            , c2 = _g.two.makeCircle(x, y, 4);
            line.stroke = '#cccccc';
            c1.fill = "#79EFFF"; c2.fill = c1.fill;
            c1.noStroke(); c2.noStroke();
            _g.state.op.obj = line;
            _g.state.op.handles.push(c1);
            _g.state.op.handles.push(c2);
            _g.two.update();
          }
        });

        $(window).bind('mousemove', function (e) {
          if (_g.state.op.obj) {
            var x = e.clientX - _g.state.op.obj.translation.x
              , y = e.clientY - _g.state.op.obj.translation.y
              , description
              , x1
              , x2
              , y1
              , y2
              , closestPt
              , ecX = e.clientX
              , ecY = e.clientY;
            if (_g.state.snapPoints.length) {
              closestPt = _g.closestSnapPointTo({ x: ecX, y: ecY });
              if (_g.distSquared({ x: x, y: y }, closestPt)) {
                ecX = closestPt.x;
                ecY = closestPt.y;
              }
            }
            _g.state.op.obj.vertices[1].set(x,y);
            _g.state.op.handles[1].translation.set(ecX, ecY);
            x1 = _g.state.op.handles[0].translation.x;
            y1 = _g.state.op.handles[0].translation.y;
            x2 = _g.state.op.handles[1].translation.x;
            y2 = _g.state.op.handles[1].translation.y;
            description = 'Draw line from <'
                           + x1 + ', '
                           + y1 + '> to <'
                           + x2 + ', '
                           + y2 + '>.';
            _g.state.actionDisplay.html(description);
            _g.two.update();
          }
        });

        $(window).bind('mouseup', function (e) {
          if (_g.state.op.obj) {
            var proxyOp = {
                action: 'createLine'
              , description: 'Draw line from <'
                             + _g.state.op.handles[0].translation.x + ', '
                             + _g.state.op.handles[0].translation.y + '> to <'
                             + _g.state.op.handles[1].translation.x + ', '
                             + _g.state.op.handles[1].translation.y + '>.'
              , params: { x1: _g.state.op.handles[0].translation.x
                        , y1: _g.state.op.handles[0].translation.y
                        , x2: _g.state.op.handles[1].translation.x
                        , y2: _g.state.op.handles[1].translation.y }
              , obj: null
              };
            _g.performOp(proxyOp);

            // Currently breaks the undo tree.
            // A more interesting approach might be visual undo, with a tree?
            _g.state.redoOps.length = 0; // Clear the array
            _g.two.remove(_g.state.op.obj);
            _g.two.remove(_g.state.op.handles[0]);
            _g.two.remove(_g.state.op.handles[1]);
            _g.state.op.obj = null;
            _g.state.op.handles = [];
            _g.two.update();
          }
        });

        $(window).bind('keydown', function (e) {
          if (e.keyIdentifier === "U+005A" && e.metaKey) {
            if (e.shiftKey) {
              _g.redoLast();
            } else {
              _g.undoLast();
            }
          }
        });
      }
    };


  window.G = G;

  return G;
});