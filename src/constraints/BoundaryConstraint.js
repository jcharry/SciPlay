import constraint from './Constraint';
import {Vector} from '../math/Vector';

const boundaryConstraint = function(body, bounds, distance) {
    let C = constraint('boundary', body, null, bounds, distance);

    C.solve = function() {
        let minX = body.aabb.min.x;
        let minY = body.aabb.min.y;
        let maxX = body.aabb.max.x;
        let maxY = body.aabb.max.y;
        switch (body.type) {
            case 'circle': {
                let minX = body.aabb.min.x;
                let minY = body.aabb.min.y;
                let maxX = body.aabb.max.x;
                let maxY = body.aabb.max.y;
                let radius = body.radius;
                // Instead of setting position directly, can we apply a force?
                // get the normal direction of the velocity...
                // let normal = Vector.perp(body.velocity);
                // Satisfy condition where
                if (minX < 0) { body.setX(radius); }
                if (minY < 0) { body.setY(radius); }
                if (maxX > bounds.width) { body.setX(bounds.width - radius); }
                if (maxY > bounds.height) { body.setY(bounds.height - radius); }
                break;
            }
            case 'rectangle': {
                let width = maxX - minX;
                let height = maxY - minY;
                if (minX < 0) { body.setX((width - body.width) / 2); }
                if (minY < 0) { body.setY(height - body.height) / 2; }
                if (maxX > bounds.width) { body.setX(bounds.width - body.width - (width - body.width) / 2); }
                if (maxY > bounds.height) { body.setY(bounds.height - body.height - (height - body.height) / 2); }
                break;
            }
            case 'polygon': {
                let width = maxX - minX;
                let height = maxY - minY;
                if (minX < 0) { body.setX(0); }
                if (minY < 0) { body.setY(0); }
                if (maxX > bounds.width) { body.setX(bounds.width - body.width - (width - body.width ) / 2); }
                if (maxY > bounds.height) { body.setY(bounds.height - body.height - (height - body.height ) / 2); }
                break;
            }
            default:
                break;
        }
    }
    return C;
};

export default boundaryConstraint;
