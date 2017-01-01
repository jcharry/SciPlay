import vector, {Vector} from '../math/Vector';
const Solver = {
    init: function() {

    },

    /**
     * Resolve collision
     * @param {Collision} collision - collision object to resolve
     *
     * @todo: right now just directly manipulates position - things are
     * very jittery, but it works for now.
     */
    solve: function(collision) {
        // Solve for body collision
        let { body1, body2, MTVAxis, overlap } = collision;
        let xOverlap = Math.abs(MTVAxis.x * overlap);
        let yOverlap = Math.abs(MTVAxis.y * overlap);
        let resolutionVector = vector(xOverlap, yOverlap);

        // if there is an xOverlap
        if (xOverlap !== 0) {
            if (body1.position.x > body2.position.x) {
                // Move body1 to the right and body2 to the left
                body1.position.x += resolutionVector.x / 2;
                body2.position.x -= resolutionVector.x / 2;
            } else {
                // Move body1 to the left and body 2 to the right
                body1.position.x -= resolutionVector.x / 2;
                body2.position.x += resolutionVector.x / 2;
            }
        }

        // If there's a y overlap
        if (yOverlap !== 0) {
            // And body1 is lower on screen than body 2
            if (body1.position.y > body2.position.y) {
                // Move body 1 down and body 2 up
                body1.position.y += resolutionVector.y / 2;
                body2.position.y -= resolutionVector.y / 2;
            } else {
                body1.position.y -= resolutionVector.y / 2;
                body2.position.y += resolutionVector.y / 2;
            }
        }
    }
};

const solver = function() {
    let s = Object.create(Solver);
    return s;
};

export default solver;
