define(['operationmanager', 'keycodes', 'utils'], function (operationmanager, KEYCODE, utils) {
  var _message
    , T = {
        name: 'undo'
      , type: 'instantaneous'
      , key: KEYCODE.z
      , metaKey: true
      , shiftKey: false
      , onkeydown: function (e) {
          var message = operationmanager.undoLast();
          if (message) _message = "Undo " + utils.uncapitalized(message);
        }
      , getMessage: function () {
          return _message;
        }
      };
  return T;
});