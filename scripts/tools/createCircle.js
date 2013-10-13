define(['operationmanager', 'stateutils', 'utils'], function (operationmanager, stateutils, utils) {
  var _state
    , _circle = null
    , _message = "Some Message";
  var T = {
    name: 'createCircle'
  , onmousedown: function (e) {
      var mPos = { x: e.clientX, y: e.clientY }
        , circleData = { type: 'circle', x: mPos.x, y: mPos.y, isTemp: true };
      _circle = stateutils.addObj(circleData);
      //op.message = _g.getMessageForCurrTool();
      stateutils.refresh();
    }
  , onmousemove: function (e) {
      if(_circle) {
        var mPos = { x: e.clientX, y: e.clientY }
          , center = { x: _circle.x, y: _circle.y }
          _circle.radius = Math.sqrt(utils.distSquared(center, mPos));
          //op.message = _g.getMessageForCurrTool();
          //_g.state.actionDisplay.contents = op.message;
          stateutils.refresh();
      }
    }
  , onmouseup: function (e) {
      if (_circle) {
                //_g.clearSnapPoints();
        var proxyOp = { action: 'create'
                      , obj: _circle.toJSON()
                      , message: _message };
        stateutils.removeObj(_circle);
        operationmanager.performOp(proxyOp);
        console.log(operationmanager._inspect());
        _circle = null;
        stateutils.refresh();
        operationmanager.wipeRedoHistory();
      }
    }
  , init: function (state) {
      _state = state;
      stateutils.init(state);
    }
  };
  return T;
});


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