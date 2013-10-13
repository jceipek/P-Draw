define(['zepto'], function ($) {
  var G = {
    HTMLNode : function (selector) {
      var _elem = $(selector);
      return {
          _contents: _elem.html()
        , get contents() {
            return this._contents;
          }
        , set contents(val) {
            this._contents = val;
            _elem.html(this._contents);
          }
      };
    }
  };

  return G;
});