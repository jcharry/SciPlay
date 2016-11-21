import {radToDeg} from './math';

export const Vector = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Vector.prototype = {
    clone: function() {
        return new Vector(this.x, this.y);
    },
    /**
     * Generic Setter
     * @param {string} prop - property to set
     * @param {*} val - value to set
     */
    set: function(prop, val) {
        if (prop === 'x') {
            this.x = val;
        } else if (prop === 'y') {
            this.y = val;
        }
    },
    add: function(vec) {
        this.x += vec.x;
        this.y += vec.y;
    },
    subtract: function(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
    },
    multiply: function(vec) {
        if (typeof vec === 'object') {
            this.x *= vec.getX();
            this.y *= vec.getY();
        } else if (typeof vec === 'number') {
            this.x *= vec;
            this.y *= vec;
        }
    },
    magnitude: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    magnitudeSq: function() {
        return this.x * this.x + this.y * this.y;
    },
    negate: function() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    },
    dot: function(vec) {
        return this.x * vec.x + this.y * vec.y;
    },
    cross: function(vec) {
        return this.x * vec.y - this.y * vec.x;
    },
    angleTo: function(vec) {
        let a = this.magnitude();
        let b = vec.magnitude();
        let d = this.dot(vec);

        let theta = Math.acos(d / (a * b));
        return theta;
    },
    getAngle: function(mode) {
        if (mode === 'DEGREES') {
            return radToDeg(Math.atan(this.y / this.x));
        }
        let a = Math.atan2(this.y, this.x);
        //return a;
        return a < 0 ? Math.PI * 2 + a : a;
    },
    normalize: function(vec) {
        let mag = this.magnitude();
        this.x /= mag;
        this.y /= mag;
    }
};

// ---------- Static Methods -----------//
/**
 * @static
 * @param {Vector} v1 - first Vector obj
 * @param {Vector} v2 - second Vector obj
 * @return {Vector}
 *
 * Adds two vectors, and returns a new one
 */
Vector.add = function(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
};
Vector.subtract = function(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
};
Vector.multiply = function(v1, v2) {
    if (typeof v1 === 'number' && typeof v2 === 'number') {
        return v1 * v2;
    }

    if (typeof v1 === 'object' && typeof v2 === 'number') {
        return new Vector(v1.x * v2, v1.y * v2);
    }

    if (typeof v2 === 'object' && typeof v1 === 'number') {
        return new Vector(v1 * v2.x, v1 * v2.y);
    }
};
Vector.dot = function(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
};
Vector.angleBetween = function(v1, v2) {
    let a = v1.magnitude();
    let b = v2.magnitude();
    let d = v1.dot(v2);

    let theta = Math.acos(d / (a * b));
    return theta;
};

var vector = function(x, y) {
    return new Vector(x, y);
};

export default vector;
