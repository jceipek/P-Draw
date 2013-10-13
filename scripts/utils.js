define(['zepto'], function ($) {
  var G = {
    roundToDecimals: function (number, decimals) {
      var exp = Math.pow(10, decimals)
      return Math.round(number * exp) / exp;
    }
  , distSquared: function (a, b) {
      var x = (a.x - b.x)
        , y = (a.y - b.y);
      return x*x + y*y;
    }
  , uncapitalized: function (s) {
      if (s.length > 0) {
        var rest = s.substring(1)
          , first = s[0];
        return first.toLowerCase() + rest;
      } else {
        return s;
      }
    }
  };

  return G;
});