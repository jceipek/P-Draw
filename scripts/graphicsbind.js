define([], function () {
  var G = {
    ObjectArray : function (two) {
      var _array = []
        , _two = two
        , _mkSnapPoint = function (snapPtData) {
            var pt = _two.makeCircle(snapPtData.x, snapPtData.y, 5);
            pt.stroke = "#79EFFF";
            pt.opacity = 1;
            return { x: snapPtData.x
                   , y: snapPtData.y
                   , ident: snapPtData.ident
                   , _obj: pt};
          }
        , _rmSnapPoint = function (snapPt) {
            two.remove(snapPt._obj);
          }

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
                  throw "Can't modify isTemp!";
                }
              });

              if (!obj._isTemp) {
                obj.getSnapPoints = function () {
                  return this._snapPoints;
                };
                obj._clearSnapPoints = function () {
                  while (this._snapPoints.length > 0) {
                    _rmSnapPoint(this._snapPoints.pop());
                  }
                };
                obj._remakeSnapPoints = function () {
                  var v1 = { x: this._x, y: this._y, ident: 'circle center' }
                    , v2 = { x: this._x, y: this._y + this._radius, ident: 'circle bottom' }
                    , v3 = { x: this._x, y: this._y - this._radius, ident: 'circle top' }
                    , v4 = { x: this._x + this._radius, y: this._y, ident: 'circle right' }
                    , v5 = { x: this._x - this._radius, y: this._y, ident: 'circle left' }
                  if (!this._snapPoints) this._snapPoints = [];
                  this._clearSnapPoints();
                  this._snapPoints.push( _mkSnapPoint(v1)
                                       , _mkSnapPoint(v2)
                                       , _mkSnapPoint(v3)
                                       , _mkSnapPoint(v4)
                                       , _mkSnapPoint(v5));
                };
              }

              obj._remake = function () {
                if (this._obj) _two.remove(this._obj);
                this._obj = _two.makeCircle(this._x, this._y, this._radius);
                if (this._isTemp) {
                  this._obj.stroke = "#CCCCCC";
                } else {
                  this._remakeSnapPoints();
                }
              };

              obj._x = params.x || 0;
              Object.defineProperty(obj, "x", {
                get: function() {
                  return this._x;
                },
                set: function(val) {
                  this._obj.translation.x = val;
                  this._x = val;
                  if (!this._isTemp) {
                    this._remakeSnapPoints();
                  }
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
                  if (!this._isTemp) {
                    this._remakeSnapPoints();
                  }
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

              if (!obj._isTemp) {
                obj.getSnapPoints = function () {
                  return this._snapPoints;
                };
                obj._clearSnapPoints = function () {
                  while (this._snapPoints.length > 0) {
                    _rmSnapPoint(this._snapPoints.pop());
                  }
                };
                obj._remakeSnapPoints = function () {
                  var v1 = { x: this._x1, y: this._y1, ident: 'line start' }
                    , v2 = { x: this._x2, y: this._y2, ident: 'line end' }
                    , v3 = { x: (this._x1 + this._x2)/2, y: (this._y1 + this._y2)/2, ident: 'line center' };
                  if (!this._snapPoints) this._snapPoints = [];
                  this._clearSnapPoints();
                  this._snapPoints.push(_mkSnapPoint(v1), _mkSnapPoint(v2), _mkSnapPoint(v3));
                };
              }

              obj._remake = function () {
                if (this._obj) _two.remove(this._obj);
                this._obj = _two.makeLine(this._x1, this._y1, this._x2, this._y2);
                if (this._isTemp) {
                  this._obj.stroke = "#CCCCCC";
                } else {
                  this._remakeSnapPoints();
                }
              };

              obj._x1 = params.x1 || 0;
              Object.defineProperty(obj, "x1", {
                get: function() {
                  return this._x1;
                },
                set: function(val) {
                  this._x1 = val;
                  this._obj.vertices[0].x = val - this._obj.translation.x;
                  if (!this._isTemp) {
                    this._remakeSnapPoints();
                  }
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
                  if (!this._isTemp) {
                    this._remakeSnapPoints();
                  }
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
                  if (!this._isTemp) {
                    this._remakeSnapPoints();
                  }
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
                  if (!this._isTemp) {
                    this._remakeSnapPoints();
                  }
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
              if (!obj._isTemp) {
                obj._clearSnapPoints();
              }
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