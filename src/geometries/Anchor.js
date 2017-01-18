import vector from '../math/Vector';

const Anchor = {
    init: function(x, y) {
        this.position = vector(x, y);
        this.type = 'anchor';
        this.static = true;
        this.centroid = {x:this.position.x, y: this.position.y};
    }
};

const anchor = function(x, y) {
    let p = Object.create(Anchor);
    p.init(x, y);
    return p;
};

export default anchor;
