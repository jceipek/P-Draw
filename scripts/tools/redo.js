define(['operationmanager', 'keycodes'], function (operationmanager, KEYCODE) {
  var T = {
    name: 'redo'
  , type: 'instantaneous'
  , key: KEYCODE.z
  , metaKey: true
  , shiftKey: true
  , onkeydown: function (e) {
      operationmanager.redoLast();
    }
  };
  return T;
});