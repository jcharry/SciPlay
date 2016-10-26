import Body from './Body';
import aabb from '../geometries/AABB';

let circle = function(options) {
    let B = Object.create(Body);
    B.init(options);

    B.radius = options.radius || 0;
    B.type = 'circle';
    B.aabb = aabb(B);

    return B;
};

export default circle;
