import hash from '../geometries/SpatialHash';
import broadphase from '../collision/Broadphase';
import narrowphase from '../collision/Narrowphase';
import solver from '../collision/Solver';
import Constraint from '../constraints/Constraint';
import boundaryConstraint from '../constraints/BoundaryConstraint';
// import linkConstraint from '../constraints/LinkConstraint';
import {GRAVITY} from '../constants/CONSTANTS';

// const System = {};
// TODO: rename params to options to be consistent with other objects
const System = {
    init: function(loop, params) {
        // Allow for no loop to be passed
        if (typeof loop === 'function') {
            this.loop = loop;
        } else {
            params = loop;
        }

        this._gravityOn = true;
        this.frames = [];
        this.waves = [];
        this.childWaves = [];
        this.bodies = [];
        this.points = [];
        this.anchors = [];
        this.width = params.width || 600;
        this.height = params.height || 300;
        // this.collisionPairs = {};
        this.nextBodyId = 0;
        this.collisions = [];
        this.constraints = [];

        this.collideBoundary = params.collideBoundary === undefined ? true : params.collideBoundary;
        console.log('can collide with boundary', this.collideBoundary);

        // Cell size will adjust to fit world precisely
        // May not be exaclty what user initialized
        // let divisor = params.cellSize ? params.cellSize : 100;
        this.cellSize = this.calculateCellSize(params.cellSize || 100);
        // Initialize spatial hash
        this.hash = this.initializeHash(this.cellSize, this.width, this.height);

        //
        this._gravity = params.gravity === undefined ? GRAVITY.LIGHT : params.gravity;
        // Initialize Collision objects
        this.broadphase = broadphase();
        this.narrowphase = narrowphase();
        this.solver = solver();
        this.worldForce = {
            x: 0,
            y: 0
        };

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
                // Initialize new bodies with an ID use for ray intersection
                // tests
                obj.id = this.nextBodyId++;

                if (this._gravityOn) {
                    obj.addForce(0, this.gravity);
                }
                // Initialize new bodies with world force
                // obj.addForce(this.worldForce.x, this.worldForce.y);
                this.bodies.push(obj);
                break;
            case 'point':
                this.points.push(obj);
                break;
            case 'anchor':
                this.anchors.push(obj);
                break;
            case 'incident':
            case 'wave':
                this.waves.push(obj);
                break;
            case 'link':
            case 'boundary':
                this.constraints.push(obj);
                break;
            default:
                throw new Error('tried to add something that you\'re totally not allowed to add');
        }
    },

    /**
     * Add objects to the system
     * Objects not added will not be rendered
     * or updated
     *
     * @param {Sci.Object|Sci.Object[]} b - a body or wave, or constraint, or array of any of those things
     */
    add: function(obj) {
        if (typeof obj === 'object' && obj.length !== undefined) {
            // We have an array
            obj.forEach(o => {
                this.addObject(o);
            });
        } else {
            this.addObject(obj);
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

    _integratePosition: function(dt) {
        this.bodies.forEach(body => {
            if (!body.static) {
                body.update(dt)
            }
        });
    },

    _populateGrid: function(bodies) {
        this.bodies.forEach(body => {
            this.hash.insertBody(body);
        });
    },

    _updateWorldForces: function() {
        // Update forces if need be
        if (this.worldForceNeedsSet) {
            this.bodies.forEach(body => {
                body.setForce(this.worldForce.x, this.worldForce.y);
            });
            this.worldForceNeedsSet = false;
        }
        if (this.worldForceNeedsUpdate) {
            this.bodies.forEach(body => {
                body.addForce(this.worldForce.x, this.worldForce.y);
            });
            this.worldForceNeedsUpdate = false;
        }
    },
    _getCollisionPairs: function() {
        // Perform broadphase
        this.pairs = this.broadphase.getCollisionPairs(this.bodies, this.hash);

        // Perform narrowphase detection on potential pairs
        if (this.pairs && Object.keys(this.pairs).length > 0) {
            this.collisions = this.narrowphase.checkForCollisions(this.pairs);
        }
    },
    /**
     * Update loop
     * Update all bodies, waves, run collision tests if necessary, and keep
     * track of rayID's on potentially colliding bodies
     * @param {number} dt - time step for system update (defaults to 16.666 ms)
     * @return {This} for chaining, or getting checking last state of system
     */
    update: function(dt) {
        // 1. Reset State for next loop
        this.hash.clear();

        // Update world forces, if necessary
        this._updateWorldForces();

        // Update bodies with verlet integration
        // And insert into hash
        this._integratePosition(dt);

        // Run User Loop (they may want to change position somehow)
        if (this.loop) { this.loop(); }

        // Add bodies to collision grid
        this._populateGrid();

        // Get broadphase collision pairs
        this._getCollisionPairs();

        // Solve collisions and constraints
        this.solver.solve(this.collisions, this.constraints, dt);

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
    },

    addWorldForce: function(x, y) {
        this.worldForce.x += x;
        this.worldForce.y += y;
        this.worldForceNeedsUpdate = true;
    },

    setWorldForce: function(x, y) {
        this.worldForce.x = x;
        this.worldForce.y = y;
        this.worldForceNeedsSet = true;
    }
};

Object.defineProperty(System, 'gravityOn', {
    get: function() {
        return this._gravityOn;
    },
    set: function(isOn) {
        if (this._gravityOn && !isOn) {
            // turn gravity off
            this._gravityOn = false;
            this.worldForce.y -= this.gravity;
            this.bodies.forEach(body => {
                body.addForce(0, -this.gravity);
            });
        } else if (!this._gravityOn && isOn) {
            // turn gravity on
            this._gravityOn = true;
            this.worldForce.y += this.gravity;
            this.bodies.forEach(body => {
                body.addForce(0, this.gravity);
            });
        }
    }
});

Object.defineProperty(System, 'gravity', {
    get: function() {
        return this._gravity;
    },
    set: function(value) {
        // Capture current gravity
        let gravDiff = value - this._gravity;
        this.worldForce.y += gravDiff;
        this._gravity += gravDiff;
        this.bodies.forEach(body => {
            body.addForce(0, gravDiff);
        });
    }
});

// const CONSTANTS = {
//     GRAVITY: 0.00004
// };

/**
 * @public
 * @param {function} loop - your update loop - used to update body states
 * @param {object} params - initialization parameters
 * @return {System}
 *
 * params
 *  - width: int - width of entire system (usually canvas width)
 *  - height: number - height of entire system
 *  - cellSize: number - requested cellSize, (system will choose closest value
 *          that precisely fits into the system width)
 */
const system = function(loop, params) {
    const s = Object.create(System);
    s.init(loop, params);
    return s;
};

export default system;
