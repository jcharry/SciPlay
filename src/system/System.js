import hash from '../geometries/SpatialHash';
import broadphase from '../collision/Broadphase';
import narrowphase from '../collision/Narrowphase';
import solver from '../collision/Solver';

// const System = {};
const System = {
    init: function(params) {
        this.frames = [];
        this.waves = [];
        this.childWaves = [];
        this.bodies = [];
        this.width = params.width || 600;
        this.height = params.height || 300;
        this.collisionPairs = {};
        this.nextBodyId = 0;

        // Cell size will adjust to fit world precisely
        // May not be exaclty what user initialized
        // let divisor = params.cellSize ? params.cellSize : 100;
        this.cellSize = this.calculateCellSize(params.cellSize || 100);
        // Initialize spatial hash
        this.hash = this.initializeHash(this.cellSize, this.width, this.height);

        // Initialize Collision objects
        this.broadphase = broadphase();
        this.narrowphase = narrowphase();
        this.solver = solver();

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

    addChildWave: function(wave) {
        this.childWaves.push(wave);
    },

    addObject: function(obj) {
        switch (obj.type) {
            case 'rectangle':
            case 'circle':
            case 'polygon':
                obj.id = this.nextBodyId++;
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

    /**
     * Remove an object from the system
     * @param {Body} b - the body object to remove
     * @return {This} for chaining
     */
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

        return this;
    },

    /**
     * Update loop
     * Update all bodies, waves, run collision tests if necessary, and keep
     * track of rayID's on potentially colliding bodies
     * @return {This} for chaining, or getting checking last state of system
     */
    update: function() {
        // Clear out hash at the start of every update loop
        this.hash.clear();

        // Put each body into the hash
        this.bodies.forEach(body => {
            body.update();
            this.hash.insertBody(body);
        });

        let pairs = this.broadphase.getCollisionPairs(this.bodies, this.hash);
        let collisions;

        if (pairs && Object.keys(pairs).length > 0) {
            collisions = this.narrowphase.checkForCollisions(pairs);
        }

        // FIXME: MTV for two rectangles turns out to be the same axis, so they
        // move in the same direction when we try to resolve the collision
        if (collisions && collisions.length > 0) {
            // Solve for collisions!
            collisions.forEach(coll => {
                this.solver.solve(coll);
                // let {MTVAxis, overlap, body2} = coll;
                // body2.position.add(MTVAxis.multiply(overlap));
            });
        }

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
     * @private
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
    const s = Object.create(System);
    s.init(params);
    return s;
};

export default system;
