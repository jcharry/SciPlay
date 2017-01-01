import pair from './Pair';
const Broadphase = {
    // init: function(system) {
    //     this.system = system;
    //     this.pairs = [];
    //     this.collisionCounter = 0;
    // },
    aabbOverlap: function(body1, body2) {
        return body1.aabb.overlap(body2.aabb);
    },
    canCollide: function(body1, body2) {
        if (body1.canCollide && body2.canCollide) {
            return true;
        }
        return false;
    },

    /**
     * Get all potential collision pairs -
     *  1. They are within the same spatial bucket
     *  2. They're AABB's overlap
     *  @param {Body[]} bodies - all bodies from system
     *  @param {SpatialHash} hash - from system
     *  @return {Object} collision pairs - broadphase
     */
    getCollisionPairs: function(bodies, hash) {
        this.collisionCounter = 0;
        let collisionPairs = {};
        // let collisionPairs = [];
        for (let i = 0; i < bodies.length; i++) {
            let body = bodies[i];
            let nearby = hash.queryBody(body);

            for (let j = 0; j < nearby.length; j++) {
                let otherBody = nearby[j];
                if (this.canCollide(body, otherBody)) {
                    if (this.aabbOverlap(body, otherBody)) {
                        let id;
                        if (body.id < otherBody.id) {
                            id = `${body.id}-${otherBody.id}`;
                        } else {
                            id = `${otherBody.id}-${body.id}`;
                        }

                        let p = pair(body, otherBody, id);
                        // collisionPairs.push(p);
                        if (!collisionPairs[id]) {
                            collisionPairs[id] = p;
                        }
                    }
                }
            }
        }
        return collisionPairs;
    }
};

const broadphase = function(system) {
    let b = Object.create(Broadphase);
    // b.init(system);
    return b;
};

export default broadphase;
