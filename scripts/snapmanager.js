define(['stateutils', 'utils'], function (stateutils, utils) {
  var _points = [] // Used for temporary references to snap locations
    , M = {
      closestPointTo: function (pos) {
        var i
          , dist
          , closest = {
              dist: Infinity
            , value: null
          };
        stateutils.performFnOnSnapPoints(function (pt) {
          dist = utils.distSquared(pt, pos);
          if (dist <= closest.dist && dist < 1000) {
             closest.dist = dist;
             closest.value = pt;
          }
        });
        return closest.value;
      }
    , hidePoints: function () {
        stateutils.performFnOnSnapPoints(function (pt) {
          pt._obj.opacity = 0; // XXX: Tight coupling!
        });
      }
    , showPoints: function () {
        stateutils.performFnOnSnapPoints(function (pt) {
          pt._obj.opacity = 1; // XXX: Tight coupling!
        });
      }
    };

  return M;
});