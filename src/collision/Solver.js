import vector, {Vector} from '../math/Vector';

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
    solve: function(collision) {
        // Solve for body collision
        let {body1, body2, mtvaxis, overlap} = collision;
        let xOverlap = Math.abs(mtvaxis.x * overlap);
        let yOverlap = Math.abs(mtvaxis.y * overlap);
        let resolutionVector = vector(xOverlap, yOverlap);
        let collisionType = this.getCollisionType(body1, body2);

        // SEE HERE:
        // https://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
        // let b1Mass = body1.mass;
        // let b1InvMass = body1.invMass;
        // let b2Mass = body2.mass;
        // let b2InvMass = body2.invMass;
        // //
        // // Vec2 rv = B.velocity - A.velocity
        // let relVel = Vector.subtract(body2.velocity, body1.velocity);
        //
        // // Calculate relative velocity in terms of the normal direction
        // // float velAlongNormal = DotProduct( rv, normal )
        // let velAlongNormal = Vector.dot(relVel, mtvaxis);
        //
        // if (velAlongNormal > 0) {
        //     return;
        // }
        //
        // // Min restitution
        // let e = Math.min(body1.restitution, body2.restitution);
        //
        // let j = -(1 + e) * velAlongNormal;
        // j /= body1.invMass + body2.invMass;
        //
        // // impulse vector
        // let impulse = Vector.multiply(mtvaxis, j);
        //
        // // Apply impulse
        // body1.velocity.x -= impulse.x * body1.invMass;
        // body1.velocity.y -= impulse.y * body1.invMass;
        // body2.velocity.x += impulse.x * body2.invMass;
        // body2.velocity.y += impulse.y * body2.invMass;

        // body2.velocity.add()


        // // Calculate impulse scalar
        // float j = -(1 + e) * velAlongNormal
        // j /= 1 / A.mass + 1 / B.mass
        //
        // // Apply impulse
        // Vec2 impulse = j * normal
        // A.velocity -= 1 / A.mass * impulse
        // B.velocity += 1 / B.mass * impulse




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

        // body1.constraints.forEach(constraint => {
        //     constraint.solve();
        // });
        // body2.constraints.forEach(constraint => {
        //     constraint.solve();
        // });
    },
    solveConstraint: function(constraint) {
        constraint.solve();
    }
};

const solver = function() {
    let s = Object.create(Solver);
    return s;
};

export default solver;
