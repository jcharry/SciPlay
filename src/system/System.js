import hash from '../geometries/SpatialHash';
import SAT from '../collision/SAT';

const System = {};
System.prototype = {
    init: function(params) {
        this.frames = [];
        this.waves = [];
        this.childWaves = [];
        this.bodies = [];
        this.width = params.width || 600;
        this.height = params.height || 300;

        // Cell size will adjust to fit world precisely
        // May not be exaclty what user initialized
        // let divisor = params.cellSize ? params.cellSize : 100;
        this.cellSize = this.calculateCellSize(params.cellSize || 100);
        // Initialize spatial hash
        this.hash = this.initializeHash(this.cellSize, this.width, this.height);

        // Ray ID Counter
        this.currentRayId = 0;
    },
    calculateCellSize: function(cellSize) {
        let divisor = cellSize ? cellSize : 100;
        return this.width / Math.floor(this.width / divisor);
    },
    initializeHash: function(cellSize, width, height) {
        return hash(cellSize, width, height);
    },
    /**
     * Resize system - doesn't resize renderer (i.e. canvas)
     * In event that thing should be drawn outside the system
     * @param {number} width - new system width
     * @param {number} height - new system height
     * @param {number} [cellSize] - optional, new cell size
     *
     * @example - reset both system and canvas
     * system.resize(500, 400, 30);
     * renderer.resize(500, 400);
     */
    // resize: function(width, height, cellSize) {
    //     this.width = width;
    //     this.height = height;
    //     this.cellSize = this.calculateCellSize(cellSize || this.cellSize);
    //     this.hash = this.initializeHash(this.cellSize, width, height);
    // },
    // addFrame: function(frame) {
    //     this.frames.push(frame);
    // },
    addChildWave: function(wave) {
        this.childWaves.push(wave);
    },
    // addBody: function(body) {
    //     this.bodies.push(body);
    // },
    addObject: function(obj) {
        switch (obj.type) {
            case 'rectangle':
            case 'circle':
            case 'polygon':
                this.bodies.push(obj);
                break;
            case 'incident':
            case 'wave':
                this.waves.push(obj);
                break;
            default:
                throw new Error('tried to add something that\'s not a body or a wave');
        }
    },
    /**
     * Add objects to the system
     * Objects not added will not be rendered
     * or updated
     *
     * @param {Sci.Object|Sci.Object[]} b - a body or wave object, or array of body objects
     */
    add: function(b) {
        if (typeof b === 'object' && b.length !== undefined) {
            b.forEach(body => {
                this.addObject(body);
            });
        } else {
            this.addObject(b);
        }
    },

    remove: function(b) {
        if (typeof b === 'object' && b.length !== undefined) {
            // We have an array of things to remove
            b.forEach(body => {
                let idx = this.bodies.indexOf(body);
                if (idx !== -1) {
                    this.bodies.splice(idx, 1);
                }
            });
        } else {
            let idx = this.bodies.indexOf(b);
            if (idx !== -1) {
                this.bodies.splice(idx, 1);
            }
        }
    },

    /**
     * Update loop
     * Update all bodies, waves, run collision tests if necessary, and keep
     * track of rayID's on potentially colliding bodies
     * @return {This} System
     */
    update: function() {
        // Clear out hash at the start of every update loop
        this.hash.clear();

        // Put each body into the hash
        this.bodies.forEach(body => {
            body.update();
            this.hash.insertBody(body);
        });

        // Brodaphase collision
        this.bodies.forEach(body => {
            // Make sure this body can collide
            if (body.canCollide) {
                // Perform broadphase search of nearby hash objects
                let broadphase = this.hash.queryBody(body);

                // Reset body colliders to empty
                body.colliders = [];

                // Nearphase detection
                if (broadphase.length > 0) {
                    let collision;

                    // Go through each nearby object
                    for (let i = 0; i < broadphase.length; i++) {
                        let b = broadphase[i];
                        //
                        // Make sure other object can collide as well
                        if (b.canCollide) {
                            // Check aabb overlap before SAT
                            if (body.aabb.overlap(b.aabb)) {
                                // Finally perform actual SAT intersection test
                                collision = SAT.intersect(body, b);
                                if (collision) {
                                    body.colliders.push(b);
                                }
                            }
                        }
                    }
                    // if (body.colliders.length > 0) {
                    //     if (body.type === 'circle') {
                    //         // body.position.add(collision.MTVAxis.multiply(collision.overlap));
                    //     }
                    //     // Move the body out of the way of the collision
                    // } else {
                    //     // body.style.strokeStyle = 'white';
                    // }
                }
            }
        });

        // Each ray needs a unique ID for collision checking
        // Reset currentRayID during each update loop so we can reuse these
        // ID's
        this.currentRayId = 0;

        // Remove all child waves
        this.childWaves = [];

        // Update each wave and loop through it's chilren
        this.waves.forEach(wave => {
            wave.update(this);
            this.traverseWaves(wave);
        });

        return this;
    },

    /**
     * Recursively loop through child waves
     * and add them to the system
     * @param {Wave} wave - wave object to traverse
     */
    traverseWaves: function(wave) {
        // If the wave has children
        // Add each child to the system,
        // then repeat for each child
        // Exit condition -> When children have no children
        if (wave.children.length !== 0) {
            wave.children.forEach(child => {
                this.addChildWave(child);
                this.traverseWaves(child);
            });
        }
    }
};

/**
 * @public
 * @param {object} params - initialization parameters
 * @return {System}
 *
 * params
 *  - width: int - width of entire system (usually canvas width)
 *  - height: number - height of entire system
 *  - cellSize: number - requested cellSize, (system will choose closest value
 *          that precisely fits into the system width)
 */
const system = function(params) {
    const s = Object.create(System.prototype);
    s.init(params);
    return s;
};

export default system;
