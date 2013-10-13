define(['tools/createCircle', 'tools/createLine'], function (createCircle, createLine) {
  var _state = null
    , _tools = {}
    , register = function (tool) {
        _tools[tool.name] = tool;
        tool.init(_state);
      };

  var _sillytest = 0;

  var G = {
    registerAll: function (state) {
      var _g = this;
      _state = state;
      register(createCircle);
      register(createLine);
    }
  , onmousedown: function (e) {
      if (_sillytest % 2 === 0) {
        _tools['createCircle'].onmousedown(e);
      } else {
        _tools['createLine'].onmousedown(e);
      }
    }
  , onmousemove: function (e) {
      if (_sillytest % 2 === 0) {
        _tools['createCircle'].onmousemove(e);
      } else {
        _tools['createLine'].onmousemove(e);
      }
    }
  , onmouseup: function (e) {
      if (_sillytest % 2 === 0) {
        _tools['createCircle'].onmouseup(e);
        console.log('Circle');
      } else {
        _tools['createLine'].onmouseup(e);
        console.log('Line');
      }
      _sillytest += 1;
    }
  , onkeydown: function (e) {

    }
  };

  return G;
});

      // $(window).bind('mousedown', function (e) {
      //   if (e.button === 0) {
      //     _g.generateSnapPoints();
      //     var mPos = { x: e.clientX, y: e.clientY }
      //       , snap = _g.closestSnapPointTo({x: mPos.x, y: mPos.y});
      //     if (snap) {
      //       mPos.x = snap.x;
      //       mPos.y = snap.y;
      //     }
      //     switch (_g.activeTool) {
      //       case 'createCircle':
      //         op.ref = { type: 'circle', x: mPos.x, y: mPos.y, isTemp: true };
      //         op.ref = _g.addObj(op.ref);
      //         op.message = _g.getMessageForCurrTool();
      //         _g.refresh();
      //         break;
      //       case 'createLine':
      //         op.ref = { type: 'line', x1: mPos.x, y1: mPos.y, x2: mPos.x, y2: mPos.y, isTemp: true };
      //         op.ref = _g.addObj(op.ref);
      //         op.message = _g.getMessageForCurrTool();
      //         _g.refresh();
      //         break;
      //     default:
      //       throw "Unrecognized tool: '" + _g.activeTool + "'!";
      //     }
      //   }
      // });

      // $(window).bind('mousemove', function (e) {
      //   if (op.ref) {
      //     var mPos = { x: e.clientX, y: e.clientY }
      //       , snap = _g.closestSnapPointTo({x: mPos.x, y: mPos.y});
      //     if (snap) {
      //       mPos.x = snap.x;
      //       mPos.y = snap.y;
      //     }
      //     switch (op.tool) {
      //       case 'createCircle':
      //         var center = { x: op.ref.x, y: op.ref.y };
      //         radius = Math.sqrt(utils.distSquared(center, mPos));
      //         op.ref.radius = radius;
      //         op.message = _g.getMessageForCurrTool();
      //         _g.state.actionDisplay.contents = op.message;
      //         _g.refresh();
      //         break;
      //       case 'createLine':
      //         op.ref.x2 = mPos.x;
      //         op.ref.y2 = mPos.y;
      //         op.message = _g.getMessageForCurrTool();
      //         _g.state.actionDisplay.contents = op.message;
      //         _g.refresh();
      //         break;
      //       default:
      //         throw "Unrecognized tool: '" + type + "'!";
      //     }
      //   }
      // });

      // $(window).bind('mouseup', function (e) {
      //   if (op.ref) {
      //     switch (op.tool) {
      //       case 'createLine':
      //         // Same as circle
      //       case 'createCircle':
      //         _g.clearSnapPoints();
      //         var proxyOp = { action: 'create'
      //                       , obj: op.ref.toJSON()
      //                       , message: op.message };
      //         _g.removeObj(op.ref);
      //         _g.performOp(proxyOp);
      //         op.ref = null;
      //         _g.refresh();
      //         // Currently breaks the undo tree.
      //         // A more interesting approach might be visual undo, with an actual tree?
      //         _g.state.redoOps.length = 0; // Clear the array
      //         break;
      //       default:
      //         throw "Unrecognized tool: '" + type + "'!";
      //     }
      //   }
      // });