import {distance} from '../math/math';
let Edge = {
    init: function(v1, v2) {

        this.v1 = v1;
        this.v2 = v2;
        this.originalLength = distance(v1.x, v1.y, v2.x, v2.y);
    }
}

function edge(v1, v2) {
    let e = Object.create(Edge);
    e.init(v1, v2);
}
