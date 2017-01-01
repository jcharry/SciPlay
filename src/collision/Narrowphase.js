import SAT from './SAT';
const Narrowphase = {
    // init: function(hash) {
    //     this.hash = hash;
    // },
    checkForCollisions: function(pairs) {
        // Object
        let collisions = [];
        if (typeof pairs === 'object' && pairs.length === undefined) {
            let keys = Object.keys(pairs);
            for (let i = 0; i < keys.length; i++) {
                let pair = pairs[keys[i]];
                let b1 = pair.bodies[0];
                let b2 = pair.bodies[1];
                let collision = SAT.intersect(b1, b2);

                if (collision) {
                    b1.colliderList.push(collision);
                    b2.colliderList.push(collision);
                    collisions.push(collision);
                }
            }
        } else if (typeof pairs === 'object' && pairs.length > 0) {
            // Array
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i];
                let b1 = pair.bodies[0];
                let b2 = pair.bodies[1];
                let collision = SAT.intersect(b1, b2);

                if (collision) {
                    b1.colliderList.push(collision);
                    collisions.push(collision);
                }
            }
        }
        return collisions;
    }
};

const narrowphase = function() {
    let n = Object.create(Narrowphase);
    // n.init(hash);
    return n;
};

export default narrowphase;
