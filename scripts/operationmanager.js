define(['stateutils', 'utils'], function (stateutils, utils) {
  var _ops = [] // Sequence of applied operations. Push to add new step.
    , _redoOps = []; // Sequence of operations that were undone. Pop and perform to redo.

  var M = {
    performOp: function (proxyOp) {
      switch (proxyOp.action) {
        case 'create':
          var obj = stateutils.addObj(proxyOp.obj)
            , op = { action: proxyOp.action, obj: obj, message: proxyOp.message };
          _ops.push(op);
          return true;
          break;
        default:
          throw "Perform: Unrecognized Operation: '" + proxyOp.action + "'!";
      }
    }
  , undoOp: function (op) {
      switch (op.action) {
        case 'create':
          stateutils.removeObj(op.obj);
          return true;
          break;
        default:
          throw "Undo: Unrecognized Operation: '" + op.action + "'!";
      }
    }
  , redoLast: function () {
      var _m = this
        , op = _redoOps.pop();
      if (op) {
        // _m.state.actionDisplay.contents = "Redo " + utils.uncapitalized(op.message);
        _m.performOp(op);
        stateutils.refresh();
        return op.message;
      }
      return false;
    }
  , undoLast: function () {
      var _m = this
        , op = _ops.pop();
      if (op) {
        // _m.state.actionDisplay.contents = "Undo " + utils.uncapitalized(op.message);
        _redoOps.push(op);
        _m.undoOp(op);
        stateutils.refresh();
        return op.message
      }
      return false;
    }
  , wipeRedoHistory: function () {
      // Currently breaks the undo tree.
      // A more interesting approach might be visual undo, with an actual tree?
      _redoOps.length = 0; // Clear the array
    }
  , _inspect: function () {
      return _ops;
    }
  };

  return M;
});