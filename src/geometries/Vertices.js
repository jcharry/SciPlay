let Vertices = {
    init: function(points, body) {
    },
    rotate: function() {

    },
    update: function() {

    },
    centroid: function() {

    }
};

let vertices = function(points, body) {
    let v = Object.create(Vertices);
    v.init(points, body);
    return v;
}

