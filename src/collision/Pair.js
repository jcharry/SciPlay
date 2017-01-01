const Pair = {
    init: function(b1, b2, index) {
        this.bodies = [b1, b2];
        this.index = index;
    }
};

const pair = function(b1, b2, index) {
    let p = Object.create(Pair);
    p.init(b1, b2, index);
    return p;
};

export default pair;
