import vector from '../math/Vector';
const Solver = {
    /**
     * Resolve collision
     * @param {Collision} collision - collision object to resolve
     *
     * @todo: right now just directly manipulates position - things are
     * very jittery, but it works for now.
     */
    solve: function(collision) {
        // Solve for body collision
        let {body1, body2, MTVAxis, overlap} = collision;
        let xOverlap = Math.abs(MTVAxis.x * overlap);
        let yOverlap = Math.abs(MTVAxis.y * overlap);
        let resolutionVector = vector(xOverlap, yOverlap);

        // if there is an xOverlap
        if (xOverlap !== 0) {
            let xDir = 1;
            if (body1.aabb.min.x < body2.aabb.min.x) {
                // Move body1 to the left and body2 to the right
                xDir = -1;
            }

            if (!body1.static) {
                body1.position.x += resolutionVector.x / 2 * xDir;
            }
            if (!body2.static) {
                body2.position.x -= resolutionVector.x / 2 * xDir;
            }
        }

        // If there's a y overlap
        if (yOverlap !== 0) {
            let yDir = 1;
            // And body1 is lower on screen than body 2
            if (body1.aabb.min.y < body2.aabb.min.y) {
                // Move body 1 up and body 2 down
                yDir = -1;
            }

            if (!body1.static) {
                body1.position.y += resolutionVector.y / 2 * yDir;
            }
            if (!body2.static) {
                body2.position.y -= resolutionVector.y / 2 * yDir;
            }
        }
    }
};

const solver = function() {
    let s = Object.create(Solver);
    return s;
};

export default solver;
