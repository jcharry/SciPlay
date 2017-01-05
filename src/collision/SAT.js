import {Vector} from '../math/Vector';
import collision from './Collision';

const SAT = {};

/**
 * Determine min and max projection components along a
 * given axis
 *
 * @param {Body} b - the body whos vertices to project
 * @param {Vector} axis - the axis to project onto. Should be a unit vector
 *
 * @return {Object} min and max values of projected vertices
 */
SAT.projectBody = function(b, axis) {
    if (b.type === 'rectangle' || b.type === 'polygon') {
        let min = b.vertices[0].scalarProjectUnit(axis);
        let max = min;

        for (let i = 0; i < b.vertices.length; i++) {
            let v = b.vertices[i];
            let p = v.scalarProjectUnit(axis);
            if (p < min) {
                min = p;
            } else if (p > max) {
                max = p;
            }
        }
        return {min, max};
    } else if (b.type === 'circle') {
        let p = b.position.scalarProjectUnit(axis);
        return {min: p - b.scaledRadius, max: p + b.scaledRadius};
    }
};

/**
 * @param {number} p1min - min point of 1st line
 * @param {number} p1max - max point of 1st line
 * @param {number} p2min - min point of 2nd line
 * @param {number} p2max - max point of 2nd line
 * @return {number} amount of overlap of these two lines
 *
 */
SAT.lineOverlap = function(p1min, p1max, p2min, p2max) {
    return Math.max(0, Math.min(p1max, p2max) - Math.max(p1min, p2min));
};

/**
 * Rect-Rect intersection test
 * @param {Sci.Rect} b1 - first body
 * @param {Sci.Rect} b2 - second body
 * @return {bool} true or false, if intersection occurred
 * @todo optimize like crazy, we only need to do four axes, not eight
 * see here: https://gamedevelopment.tutsplus.com/tutorials/collision-detection-using-the-separating-axis-theorem--gamedev-169
 *
 * @todo should return collision data, not just true or false
 * see here: http://www.dyn4j.org/2010/01/sat/
 */

SAT.intersect = function(b1, b2) {
    if (b1.type === 'rectangle' || b1.type === 'polygon') {
        if (b2.type === 'circle') {
            return SAT.polycircle(b1, b2);
        }

        // b2 must then be a Polygon (or a rectangle)
        return SAT.polypoly(b1, b2);
    }

    if (b1.type === 'circle') {
        if (b2.type === 'circle') {
            return SAT.circlecircle(b1, b2);
        }

        // b2 Must be a polygon or a rectangle
        return SAT.polycircle(b1, b2);
    }
};
SAT.circlecircle = function(c1, c2) {
    let v1 = Vector.subtract(c2.position, c1.position);
    let d = v1.magnitude();
    let rplusr = c1.scaledRadius + c2.scaledRadius;

    if (d < rplusr) {
        // return {MTVAxis: v1.normalize(), overlap: rplusr - d};
        return collision(c1, c2, v1.normalize(), rplusr - d);
    }
    return;
};

/**
 * @param {Polygon} p1 - first poly
 * @param {Polygon} p2 - second poly
 * @return {Object} Collision results, or undefined if no collision
 *
 * @todo Containment - doesn't appropriately handle containment
 */
SAT.polypoly = function(p1, p2) {
    // Gather all axes to test
    let axes = [],
        smallestOverlap,
        MTVAxis,
        numVerts1 = p1.vertices.length,
        numVerts2 = p2.vertices.length;

    // Get axes for rect
    // Only need two sides for testing
    if (p1.type === 'rectangle') {
        numVerts1 = 2;
    }
    for (let i = 0; i < numVerts1; i++) {
        let v1 = p1.vertices[i];
        let v2 = p1.vertices[i + 1 === p1.vertices.length ? 0 : i + 1];
        let axis = Vector.subtract(v2, v1);
        axis.normalize().perp();
        axes.push(axis);
    }

    if (p2.type === 'rectangle') {
        numVerts2 = 2;
    }
    // Get axes for polygon
    // Need all sides
    for (let i = 0; i < numVerts2; i++) {
        let v1 = p2.vertices[i];
        let v2 = p2.vertices[i + 1 === p2.vertices.length ? 0 : i + 1];
        let axis = Vector.subtract(v2, v1);
        axis.normalize().perp();
        axes.push(axis);
    }

    // Perform intersection test along all axes
    for (let i = 0; i < axes.length; i++) {
        let axis = axes[i];

        // Get min and max projectsion
        let p1Projection = this.projectBody(p1, axis);
        let p2Projection = this.projectBody(p2, axis);

        // Test for overlap of projections
        let overlap = this.lineOverlap(p1Projection.min, p1Projection.max, p2Projection.min, p2Projection.max);

        // If at any point the overlap is zero, then we're guarenteed
        // to have no collision, so exit the test
        if (overlap === 0) {
            return;
        }

        if (smallestOverlap) {
            if (overlap < smallestOverlap) {
                smallestOverlap = overlap;
                MTVAxis = axis;
            }
        } else {
            smallestOverlap = overlap;
            MTVAxis = axis;
        }
    }

    // Will return true if overlap never equals 0, meaning all
    // projections overlap to some degree, so a collision is happening
    // return {MTV: {axis: MTVAxis, magnitude: smallestOverlap}};
    return collision(p1, p2, MTVAxis, smallestOverlap);
};

SAT.polycircle = function(b1, b2) {
    let p, c;
    if (b1.type === 'circle') {
        c = b1;
        p = b2;
    } else {
        c = b2;
        p = b1;
    }

    // Gather all axes to test
    let axes = [],
        smallestOverlap,
        MTVAxis,
        numVerts1 = p.vertices.length;

    // smallest distance vector from polygon vertex to circle center
    let d;

    for (let i = 0; i < numVerts1; i++) {
        let v1 = p.vertices[i];
        let v2 = p.vertices[i + 1 === p.vertices.length ? 0 : i + 1];
        let axis = Vector.subtract(v2, v1);
        axis.normalize().perp();
        axes.push(axis);

        // Get distance of vertex to circle center
        let vc = Vector.subtract(c.position, v1);
        if (d) {
            if (vc.magnitudeSq() < d.magnitudeSq()) {
                d = vc;
            }
        } else {
            d = vc;
        }
    }

    axes.push(d.normalize());

    // Perform intersection test along all axes
    for (let i = 0; i < axes.length; i++) {
        let axis = axes[i];

        // Get min and max projectsion
        let pProjection = this.projectBody(p, axis);
        let cProjection = this.projectBody(c, axis);

        // Test for overlap of projections
        let overlap = this.lineOverlap(pProjection.min, pProjection.max, cProjection.min, cProjection.max);

        // If at any point the overlap is zero, then we're guarenteed
        // to have no collision, so exit the test
        if (overlap === 0) {
            return;
        }

        if (smallestOverlap) {
            if (overlap < smallestOverlap) {
                smallestOverlap = overlap;
                MTVAxis = axis;
            }
        } else {
            smallestOverlap = overlap;
            MTVAxis = axis;
        }
    }

    // Will return true if overlap never equals 0, meaning all
    // projections overlap to some degree, so a collision is happening
    return collision(b1, b2, MTVAxis, smallestOverlap);
};

export default SAT;
