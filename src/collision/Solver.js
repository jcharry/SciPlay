import vector from '../math/Vector';

const Solver = {
    // Collision Types
    INELASTIC: 'inelastic',
    ELASTIC: 'elastic',

    getCollisionType: function(b1, b2) {
        if (b1.collisionType === 'inelastic' || b2.collisionType === 'inelastic') {
            return this.INELASTIC;
        }
        return this.ELASTIC;
    },

    /**
     * Resolve collision
     * @param {Collision} collision - collision object to resolve
     *
     * @todo: right now just directly manipulates position - things are
     * very jittery, but it works for now.
     */
    solveCollision: function(collision) {
        // Solve for body collision
        let {body1, body2, mtvaxis, overlap} = collision;
        let resolutionVector = vector(mtvaxis.x * overlap, mtvaxis.y * overlap);
        // let collisionType = this.getCollisionType(body1, body2);

        // if there is an xOverlap
        let damping = 1;

        // First resolve position entirely (i.e. move it out of collision)
        body1.position.x += resolutionVector.x / 2 + .001;
        body1.position.y += resolutionVector.y / 2 + .001;
        body2.position.x -= resolutionVector.x / 2 + .001;
        body2.position.y -= resolutionVector.y / 2 + .001;

        // Set previous position (so it's velocity is zero)
        body1.positionPrev = body1.position.clone();
        body2.positionPrev = body2.position.clone();

        let e = Math.max(body1.restitution, body2.restitution);

        // Give it some velocity based on coefficient of restitution and some
        // arbitrary damping (this needs to be tuned so the collision feels
        // realistic!) TODO: Figure out how to make them more realistic
        body1.positionPrev.x -= resolutionVector.x / 2 * e * damping;
        body1.positionPrev.y -= resolutionVector.y / 2 * e * damping;
        body2.positionPrev.x += resolutionVector.x / 2 * e * damping;
        body2.positionPrev.y += resolutionVector.y / 2 * e * damping;

        // Preserve impulse? See here: http://codeflow.org/entries/2010/nov/29/verlet-collision-with-impulse-preservation/
        // let damping = 0.5;
        // let f1 = (damping*(resolutionVector.x * body1.velocity.x + resolutionVector.y * body1.velocity.y))/resolutionVector.magnitudeSq();
        // // var f2 = (damping*(resolutionVector.x*v2x+y*v2y))/slength;
        // let f2 = (damping*(resolutionVector.x * body2.velocity.x + resolutionVector.y * body2.velocity.y))/resolutionVector.magnitudeSq();

        // Swap the projected components
        // let v1x = body1.velocity.x + f2 * resolutionVector.x - f1 * resolutionVector.x;
        // let v2x = body2.velocity.x + f1 * resolutionVector.x - f2 * resolutionVector.x;
        // let v1y = body1.velocity.y + f2 * resolutionVector.y - f1 * resolutionVector.y;
        // let v2y = body2.velocity.y + f1 * resolutionVector.y - f2 * resolutionVector.y;
        //
        // body1.positionPrev.x = body1.position.x - v1x;
        // body1.positionPrev.y = body1.position.y - v1y;
        // body2.positionPrev.x = body2.position.x - v2x;
        // body2.positionPrev.y = body2.position.y - v2y;

        // update vertices and aabb's
        body1.updateVertices();
        body2.updateVertices();
    },
    solveCollisions: function(collisions) {
        collisions.forEach(c => this.solveCollision(c));
    },
    solveConstraints: function(constraints) {
        constraints.forEach(c => c.solve());
    },
    solve: function(collisions, constraints, dt) {
        this.dt = dt;
        this.solveConstraints(constraints);
        this.solveCollisions(collisions);
    }
};

const solver = function() {
    let s = Object.create(Solver);
    return s;
};

export default solver;
