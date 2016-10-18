let AABB = {
    init: function(x, y, width, height) {
        this.bounds = {
            min: {x: x, y: y},
            max: {x: x + width, y: y + height}
        };
    }
};

let aabb = function(params) {
    let bounds = Object.create(AABB);
    AABB.init(params);
    return bounds;
};

export default aabb;
