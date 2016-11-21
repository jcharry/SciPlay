import Body from './Body';
import aabb from '../geometries/AABB';
import {distance} from '../math/math';

let circle = function(options) {
    options = options || {};
    let B = Object.create(Body);
    B.init(options);

    B.radius = options.radius || 0;
    B.type = 'circle';
    B.aabb = aabb(B);

    B.isPointInterior = function(x, y) {
        let bx = B.position.x,
            by = B.position.y;
        if (distance(x, y, bx, by) <= B.radius) {
            return true;
        }
        return false;
    };

    return B;
};

export default circle;
