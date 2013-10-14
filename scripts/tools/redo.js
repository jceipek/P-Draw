define(['operationmanager', 'keycodes', 'utils'], function (operationmanager, KEYCODE, utils) {
  var _message
    , T = {
        name: 'redo'
      , type: 'instantaneous'
      , key: KEYCODE.z
      , metaKey: true
      , shiftKey: true
      , onkeydown: function (e) {
          var message = operationmanager.redoLast();
          if (message) _message = "Redo " + utils.uncapitalized(message);
        }
      , getMessage: function () {
          return _message;
        }
      };
  return T;
});