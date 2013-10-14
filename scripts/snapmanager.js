define(['stateutils', 'utils'], function (stateutils, utils) {
  var _points = [] // Used for temporary references to snap locations
    , M = {
      closestPointTo: function (pos) {
        var i
          , dist
          , closest = {
              index: 0
            , dist: Infinity
            , value: null
          };
        for (i = 0; i < _points.length; i++) {
          dist = utils.distSquared(_points[i], pos);
          if (dist <= closest.dist && dist < 1000) {
            closest.index = i;
            closest.dist = dist;
            closest.value = _points[i];
          }
        }
        return closest.value;
      }
    , hidePoints: function () {
        while(_points.length) {
          stateutils.removeObj(_points.pop());
        }
      }
    , showPoints: function () {
        if (_points.length) { return; }
        stateutils.performFnOnScene(function (scene) {
          for (var childKey in scene.children) {
            if (scene.children.hasOwnProperty(childKey)) {
              var child = scene.children[childKey];
              var verts = child.vertices;
              for (var j = 0; j < verts.length; j++) {
                var pt = { type: 'circle'
                         , x: verts[j].x + child.translation.x
                         , y: verts[j].y + child.translation.y
                         , isSnapGuide: true };
                _points.push(stateutils.addObj(pt));
                pt = { type: 'circle'
                         , x: child.translation.x
                         , y: child.translation.y
                         , isSnapGuide: true };
                _points.push(stateutils.addObj(pt));
              }
            }
          };
        });
        stateutils.refresh();
      }
    };

  return M;
});