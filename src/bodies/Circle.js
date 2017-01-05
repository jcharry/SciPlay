import Body from './Body';
import aabb from '../geometries/AABB';
import {distance} from '../math/math';

let circle = function(options) {
    options = options || {};
    let B = Object.create(Body);
    B.init(options);

    B.radius = options.radius || 10;
    B.scaledRadius = B.radius;
    B.type = 'circle';
    B.aabb = aabb(B);

    B.inertia = B.mass * B.radius * B.radius / 2;
    B.invInertia = 1 / B.inertia;

    B.isPointInterior = function(x, y) {
        let bx = B.position.x,
            by = B.position.y;
        if (distance(x, y, bx, by) <= B.scaledRadius) {
            return true;
        }
        return false;
    };

    return B;
};

export default circle;
