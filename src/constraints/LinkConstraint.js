import constraint from './Constraint';
import vector, {Vector} from '../math/Vector';

const linkConstraint = function(body1, body2, dist) {
    let C = constraint('link', body1, body2, dist);
    C.type = 'link';

    C.solve = function() {
        // Just try and solve this one constraint
        if (body2.type === 'point') {
            // let fc = {x: 0, y: 0};
            let p = body2.position.clone();
            p.subtract(body1.interpolatedPosition);
            let v = body1.velocity;
            let fext = body1.force;
            let mass = body1.mass;

            let lambda = (p.dot(fext) - (v.dot(v) * mass)) / (p.dot(p));
            // let lambda = -(p.x * v.x + p.y * v.y + 1)*mass / (2 * (p.x * p.x + p.y * p.y));

            let pc = {
                x: p.x * lambda,
                y: p.y * lambda
            };
        };

    };

    return C;
};

export default linkConstraint;
