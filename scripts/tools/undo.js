define(['operationmanager', 'keycodes'], function (operationmanager, KEYCODE) {
  var T = {
    name: 'undo'
  , type: 'instantaneous'
  , key: KEYCODE.z
  , metaKey: true
  , shiftKey: false
  , onkeydown: function (e) {
      operationmanager.undoLast();
    }
  };
  return T;
});