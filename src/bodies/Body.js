/* eslint "no-unused-vars": "off" */
// What should a body be able to do?
// 1. Attach to other bodies or surfaces
// 2. Respond to forces (spring, friction)
// 3. Move according to velocity and acceleration

import materials from '../extras/materials.json';
import vector from '../math/Vector';
import * as math from '../math/math';

/**
 * Convenience Function so user doesn't have use 'new' keyword
 * @param {object} options - initialization options
 * @return {Body} instance of Body
 */

let Body = {
    init: function(options) {
        options = options || {};

        // Warn user if a body object is initialized with nothing or an empty
        // object
        if (Object.keys(options).length === 0 && options.constructor === Object) {
            console.warn('You probably should initialize body objects with some values...just sayin');
        }

        this.style = {
            fillStyle: options.fillStyle || 'rgba(0,0,0,0)',
            lineWidth: options.lineWidth || 2,
            strokeStyle: options.strokeStyle || '#abcabc'
        };
        this.mass = options.mass || 0;
        this.position = vector(options.x || 0, options.y || 0);
        this.canCollide = options.canCollide || true;
        this.colliders = [];
        this.velocity = vector(
            (options.velocity && options.velocity.x) || 0,
            (options.velocity && options.velocity.y) || 0
        );
        this.height = options.height || 10;
        this.width = options.width || 10;
        this._scale = 1;
        this._rotation = options.rotation || 0; // <-- Private prop - DO NOT SET THIS DIRECTLY, use getter and setter for
        this.angularVelocity = options.angularVelocity || 0;
        this.refractiveIndex = options.refractiveIndex || 1;
        this.material = options.material || 'GLASS';
        this.materialColor = options.fillStyle || 'black';
        this.mirror = options.mirror || false;
        this.intersectionPoints = {};

         // If the material is provided, set refractive index based on materials
         // database
        // TODO: Make setting either refractive index or material possible!!!
        if (options.material && options.refractiveIndex) {
            this.refractiveIndex = options.refractiveIndex;
            this.material = options.material;
            console.warn('Setting both the material and the refractive index at the same time may cause some unexpected behavior'); //eslint-disable-line
        } else if (options.material) {
            // Check to make sure the material exists in the database
            if (materials[this.material]) {
                this.refractiveIndex = materials[this.material].refractiveIndex;
            } else if (this.material === undefined || this.material === null) {
                this.material = 'default';
                this.refractiveIndex = 1;
            } else {
                console.error('the material ' + this.material + ' is not recognized. See the docs for supported default materials'); //eslint-disable-line
            }
        } else if (options.refractiveIndex) {
            this.refractiveIndex = options.refractiveIndex;
        } else {
            this.refractiveIndex = 1.33;
        }
        return this;
    },

    freeze: function() {
        this._cachedVelocity = this.velocity.clone();
        this.velocity.x = 0;
        this.velocity.y = 0;
        return this;
    },

    unfreeze: function() {
        if (this._cachedVelocity) {
            this.velocity.x = this._cachedVelocity.x;
            this.velocity.y = this._cachedVelocity.y;
        } else {
            console.warn('cannot unfreeze a non-frozen object');
        }
        return this;
    },

    translate: function(x, y) {
        this.position.x += x;
        this.position.y += y;

        if (this.updateVertices) {
            this.updateVertices();
        }
        return this;
    },

    rotate: function(angle) {
        this.rotation += angle;
        return this;
    },

    update: function() {
        this.position.add(this.velocity);
        this.rotation += this.angularVelocity;

        // if (this.updateSegments) {
        //     this.updateSegments();
        // }

        if (this.updateVertices) {
            this.updateVertices();
        }

        // if (this.vertices) {
        //     this.vertices.update();
        // }

        // For each update loop, reset intersection points to zero
        this.intersectionPoints = {};

        this.aabb.update();
        return this;
    }
};

Object.defineProperty(Body, 'rotation', {
    get: function() {
        return this._rotation;
    },
    set: function(angle) {
        this._rotation = angle;
        if (this.updateVertices) {
            this.updateVertices();
        }
    }
});

Object.defineProperty(Body, 'scale', {
    get: function() {
        return this._scale;
    },
    set: function(scaleFactor) {
        this._scale = scaleFactor;
        if (this.updateVertices) {
            this.updateVertices();
        } else if (this.type === 'circle') {
            this.scaledRadius = this.radius * scaleFactor;
        }
    }
});

export default Body;
