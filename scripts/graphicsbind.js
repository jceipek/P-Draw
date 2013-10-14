define([], function () {
  var G = {
    ObjectArray : function (two) {
      var _array = []
        , _two = two;

      return {
        extend: function (objArray) {
          _array.push.apply(_array, objArray);
        }
      , push: function (params) {
          var type = params.type
            , obj = {
                _type: params.type || 'Unknown'
              , get type() {
                  return this._type;
                }
              , set type(val) {
                  throw "Can't modify object type!";
                }
              , _obj: null
              };

          switch (type) {
            case "circle":
              obj.toJSON = function () {
                return { type: this._type, x: this._x, y: this._y, radius: this._radius };
              }

              obj._isTemp = params.isTemp || false;
              Object.defineProperty(obj, "isTemp", {
               get: function() {
                return this._isTemp;
               },
               set: function(val) {
                this._isTemp = val;
                this._remake();
               }
              });

              obj._isSnapGuide = params.isSnapGuide || false;
              Object.defineProperty(obj, "isSnapGuide", {
               get: function() {
                return this._isSnapGuide;
               },
               set: function(val) {
                throw "Can't modify isSnapGuide!";
               }
              });

              obj._remake = function () {
                if (this._obj) _two.remove(this._obj);
                this._obj = _two.makeCircle(this._x, this._y, this._radius);
                if (this._isSnapGuide) {
                  this._obj.stroke = "#79EFFF";
                }
                if (this._isTemp) {
                  this._obj.stroke = "#CCCCCC";
                }
              }

              obj._x = params.x || 0;
              Object.defineProperty(obj, "x", {
               get: function() {
                return this._x;
               },
               set: function(val) {
                this._obj.translation.x = val;
                this._x = val;
               }
              });

              obj._y = params.y || 0;
              Object.defineProperty(obj, "y", {
               get: function() {
                return this._y;
               },
               set: function(val) {
                this._obj.translation.y = val;
                this._y = val;
               }
              });

              obj._radius = params.radius || 5;
              Object.defineProperty(obj, "radius", {
               get: function() {
                return this._radius;
               },
               set: function(val) {
                // TODO: Make this more efficient somehow?
                this._radius = val;
                this._remake();
               }
              });

              obj._remake();
              break;
            case "line":
              obj.toJSON = function () {
                return { type: this._type, x1: this._x1, y1: this._y1, x2: this._x2, y2: this._y2 };
              }

              obj._isTemp = params.isTemp || false;
              Object.defineProperty(obj, "isTemp", {
               get: function() {
                return this._isTemp;
               },
               set: function(val) {
                this._isTemp = val;
                this._remake();
               }
              });

              obj._remake = function () {
                if (this._obj) _two.remove(this._obj);
                this._obj = _two.makeLine(this._x1, this._y1, this._x2, this._y2);
                if (this._isTemp) {
                  this._obj.stroke = "#CCCCCC";
                }
              }

              obj._x1 = params.x1 || 0;
              Object.defineProperty(obj, "x1", {
               get: function() {
                return this._x1;
               },
               set: function(val) {
                this._x1 = val;
                this._obj.vertices[0].x = val - this._obj.translation.x;
               }
              });

              obj._y1 = params.y1 || 0;
              Object.defineProperty(obj, "y1", {
               get: function() {
                return this._y1;
               },
               set: function(val) {
                this._y1 = val;
                this._obj.vertices[0].y = val - this._obj.translation.y;
               }
              });

              obj._x2 = params.x2 || 0;
              Object.defineProperty(obj, "x2", {
               get: function() {
                return this._x2;
               },
               set: function(val) {
                this._x2 = val;
                this._obj.vertices[1].x = val - this._obj.translation.x;
               }
              });

              obj._y2 = params.y2 || 0;
              Object.defineProperty(obj, "y2", {
               get: function() {
                return this._y2;
               },
               set: function(val) {
                this._y2 = val;
                this._obj.vertices[1].y = val - this._obj.translation.y;
               }
              });

              obj._remake();
              break;
            default:
              throw "Unable to recognize type '" + type + "'!";
          }
          _array.push(obj);
          return obj;
        }
      , remove: function (obj) {
          var i = -1;
          for (i = 0; i < _array.length; i++) {
            if (_array[i]._obj === obj._obj) {
              _two.remove(obj._obj);
              break;
            }
          }
          if (_array.length && i > -1) {
            _array.splice(i, 1);
          }
        }
      , inspect: function (obj) {
          return _array;
        }
      , update: function (obj) {
          _two.update();
        }
      };
    }
  };

  return G;
});