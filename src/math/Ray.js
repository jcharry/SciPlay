/* eslint
    "no-unused-vars": "off",
    "no-debugger": "off"
 */
import {distance, degToRad} from './math';
import vector, {Vector} from './Vector.js';

let Ray = {
    /**
     * Initialization
     * @param {number} x - origin x
     * @param {number} y - origin y
     * @param {number} dir - direction in radians (or degrees if 'degrees' param
     * = true)
     * @param {bool} degrees - optional flag, if true, then read direction as
     * degrees
     */
    init: function(x, y, dir, degrees) {
        if (degrees) {
            dir = degToRad(dir);
        }

        this.origin = vector(x, y);
        this.direction = vector(Math.cos(dir), Math.sin(dir));
        this.outerBodies = [];
        this.t = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight;
        let x0 = this.origin.x,
            y0 = this.origin.y,
            x1 = this.origin.x + this.direction.x * this.t,
            y1 = this.origin.y + this.direction.y * this.t;
        this.slope = (y1 - y0) / (x1 - x0);
        // TODO: Figure out a way to give each ray a unique ID
        this.rayID = Date.now();
    },

    /**
     * Return the objects from spatial hash to perform collision detection on
     * @param {SpatialHash} hash - hash from the System
     */

    trace: function(system) {
        // Always use radians, regardless of mode
        // Also angle should be in range 0 <= angle <= 2PI
        //let angle = this.direction.getAngle();
        this.intersectionPoint = null;
        this.intersectingBody = null;
        this.intersectingSegment = null;

        // Look through all bodies for segments
        // See if they intersect the ray
        system.objects.forEach(body => {
            switch (body.type) {
                case 'rectangle':
                    this.intersectRect(body);
                    break;
                case 'circle':
                    this.intersectCircle(body);
                    break;
                case 'polygon':
                    break;
                default:
                    break;
            }
        });

        // After going through all bodies and segments,
        // if an intersection point was found...
        if (this.intersectionPoint) {
            return true;
        }
    },

    /**
     * Detect if ray intersects circle
     * http://stackoverflow.com/questions/1073336/circle-line-segment-collision-detection-algorithm
     *
     * Using the following formula
     * t^2 * (r DOT r) + 2t*( f DOT r ) + ( f DOT f - radius^2 ) = 0
     * at^2 + bt + c where a = d.dot(d), b = 2*f.dot(d), c = f.dot(f)
     * - radius^2
     *      where:
     *          d = end point of ray - start point of ray
     *          t = scalar value - what we're solving for
     *          r = ray vector
     *          f = vector from center of sphere to origin of ray
     *          radius = radius of circle
     *
     * 3x HIT cases:
     *  -o->                    --|-->  |            |  --|->
     * Impale(t1 hit,t2 hit), Poke(t1 hit,t2>1), ExitWound(t1<0, t2 hit),
     *
     * 3x MISS cases:
     *     ->  o                     o ->              | -> |
     * FallShort (t1>1,t2>1), Past (t1<0,t2<0), CompletelyInside(t1<0, t2>1)
     *
     * @param {Body} circle - circle body object
     * @param {Vector} p - point of origin
     * @param {Vector} r - ray vector
     * @return {boolean} true if intersection was found, false otherwise
     */
    intersectCircle: function(circle) {
        let radius = circle.radius;

        let d = vector(this.direction.x * this.t, this.direction.y * this.t);
        let f = Vector.subtract(this.origin, circle.position);//this.origin.clone();

        // Solve the quadratic equation
        let a = d.dot(d);
        let b = 2 * f.dot(d);
        let c = f.dot(f) - radius * radius;

        // Descriminant b^2 - 4ac
        let desc = (b * b) - (4 * a * c);

        if (desc < 0) {
            // No intersection
        } else {
            // Ray hit circle
            // Two possible solutions
            desc = Math.sqrt(desc);
            let t1 = (-b - desc) / (2 * a);
            let t2 = (-b + desc) / (2 * a);
            let ix, iy;

            // If t1 intersected the circle...
            // Note: t1 is always closer than t2
            if (t1 >= 0 && t1 <= 1) {
                ix = this.origin.x + d.x * t1;
                iy = this.origin.y + d.y * t1;
                this.updateIntersectionPoint({x: ix, y: iy}, null, circle);
                return true;
            }

            // If t1 doesn't intersect, check t2
            if (t2 >= 0 && t2 <= 1) {
                ix = this.origin.x + d.x * t2;
                iy = this.origin.y + d.y * t2;
                this.updateIntersectionPoint({x: ix, y: iy}, null, circle);
                return true;
            }
        }

        return false;
    },

    /**
     * Handles case of ray-rectangle intersection
     * If an intersecting segment is found,
     * set the props accordingly
     * @private
     * @param {Rect} rect - rect body object
     * @return {bool} true if intersected, otherwise false
     */
    intersectRect: function(rect) {
        if (rect.isPointInterior(this.origin.x, this.origin.y)) {
            this.outerBodies.push(rect);
        }
        //let segs = rect.segments;
        let vertices = rect.vertices;
        let vertLength = vertices.length;
        let intersection;
        vertices.forEach((vert, index, verts) => {
            let seg2;
            if (index === vertLength - 1) {
                seg2 = verts[0];
            } else {
                seg2 = verts[index + 1];
            }
            //let segVec = vector(vert, seg2);
            intersection = this.intersectSegment([vert, seg2]);
            if (intersection) {
                this.updateIntersectionPoint(intersection.intPoint, intersection.segVec, rect);
            }
        });

        return typeof intersection !== 'undefined';
    },
    /**
     * Detects Ray-Segment intersection - Returns intersection coords
     * @param {Array} seg - segment vertices
     * @return {Object} returns intersection point with body, or false
     */
    intersectSegment: function(seg) {
        //let t1 = Math.abs(v2.cross(v1)) / (v2.dot(v3));
        //let t2 = (v1.dot(v3)) / (v2.dot(v3));
        let r = vector(this.t * this.direction.x, this.t * this.direction.y);
        let p = vector(this.origin.x, this.origin.y);
        let q = vector(seg[0].x, seg[0].y);
        let s = vector(seg[1].x - seg[0].x, seg[1].y - seg[0].y);
        //let q = vector(seg[0][0], seg[0][1]);
        //let s = vector(seg[1][0] - seg[0][0], seg[1][1] - seg[0][1]);

        // check for intersection
        // t = (q − p) x s / (r x s)
        // u = (q − p) x r / (r x s)
        let rxs = r.cross(s);
            //tmp = q.copy();
        let tmp = Vector.subtract(q, p);
        //tmp.subtract(p);
        let tNum = tmp.cross(s),
            uNum = tmp.cross(r);

        let t, u;
        if (rxs !== 0) {
            t = tNum / rxs;
            u = uNum / rxs;
        }

        // TODO: handle collinear case
        if (rxs === 0 && uNum === 0) {
            // lines are collinear
        } else if (rxs === 0 && uNum !== 0) {
            // lines are parallel and non-intersecting
            return;
        } else if (rxs !== 0 && t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            // Two lines intersect,
            // and meet at the point
            // p + tr = q + us
            let px = p.x,
                py = p.y,
                rx = r.x,
                ry = r.y,
                ix = px + t * rx,
                iy = py + t * ry;

            return {
                intPoint: vector(ix, iy),
                segVec: s,
                t
            };
        } else {
            // Line segments do not intersect
            // if we've gone through all the segments of the body,
            //intersectionPoint = null;
            return false;
        }
    },

    /**
     * Test for Ray-Hash bucket intersections
     * @param {SpatialHash} hash - system.hash object
     * @return {array} list of intersected buckets
     *
     * See here: http://www.cse.chalmers.se/edu/year/2011/course/TDA361_Computer_Graphics/grid.pdf
     */
    intersectHash: function(hash) {
        // Algorithm steps
        // Identify voxel where ray enters grid

        /*
         * The traversal algorithm consists of two phases: initialization and incremental traversal. The initialization
            phase begins by identifying the voxel in which the ray origin, →
            u, is found. If the ray origin is outside
            the grid, we find the point in which the ray enters the grid and take the adjacent voxel. The integer
            variables X and Y are initialized to the starting voxel coordinates. In addition, the variables stepX and
            stepY are initialized to either 1 or -1 indicating whether X and Y are incremented or decremented as the
            ray crosses voxel boundaries (this is determined by the sign of the x and y components of →
            v).
            Next, we determine the value of t at which the ray crosses the first vertical voxel boundary and
            store it in variable tMaxX. We perform a similar computation in y and store the result in tMaxY. The
            minimum of these two values will indicate how much we can travel along the ray and still remain in the
            current voxel.
            Finally, we compute tDeltaX and tDeltaY. TDeltaX indicates how far along the ray we must move
            (in units of t) for the horizontal component of such a movement to equal the width of a voxel. Similarly,
            we store in tDeltaY the amount of movement along the ray which has a vertical component equal to the
            height of a voxel
        */

        // Initialize variables
        let bucket = hash.hash(this.origin);
        let {row, col} = bucket;
        let X = col,
            Y = row;
        let tMaxX, tMaxY, tDeltaX, tDeltaY;
        let stepX = this.direction.x < 0 ? -1 : 1,
            stepY = this.direction.y < 0 ? -1 : 1;
        let cellSize = hash.cellSize;

        // Step 1. Initialization - determine starting voxel
        //if (hash.contents[row] && hash.contents[row][col]) {
            //// Ray origin is inside a voxel that exists
            //X = col * cellSize;
            //Y = row * cellSize;
        //} else {
            //// TODO: Figure out how to find first voxel intersected by ray
            //// Create long vertical and horizontal vectors, but the starting
            //// point will depend on the direction of the ray
        //}

        // Cast first ray!
        // TODO Finish this!
        // This should all be in a loop, right???
        let verticalSeg = [
            vector((col + stepX) * cellSize, row * cellSize),
            vector((col + stepX) * cellSize, hash.height)];
        let horizontalSeg = [
            vector(col * cellSize, (row + stepY) * cellSize),
            vector(hash.width, (row + stepY) * cellSize)];

        let vInt = this.intersectSegment(verticalSeg);
        let hInt = this.intersectSegment(horizontalSeg);
        tMaxX = distance(this.origin.x, this.origin.y, vInt.intPoint.x, vInt.intPoint.y);
        tMaxY = distance(this.origin.x, this.origin.y, hInt.intPoint.x, hInt.intPoint.y);
        tDeltaX = tMaxX;
        tDeltaY = tMaxY;
        let counter = 0;
        while (counter < 50) {
            if (hash.contents[Y] && hash.contents[Y][X] && hash.contents[Y][X].length !== 0) {
                // TODO: Here's where we need to check if the object is
                // actually intersecting the ray
                // Intersect all objects in this voxel only
                let contents = hash.contents[Y][X];
                let intersected = false;
                let numTested = 0;
                contents.forEach(body => {
                    numTested++;
                    if (body.intersectionPoints[this.rayID]) {
                        // Dont' perform intersection test, just grab the point
                        this.updateIntersectionPoint(body.intersectionPoints[this.rayID].intPoint, body.intersectionPoints[this.rayID].segVec, body);

                    }
                    switch (body.type) {
                        case 'rectangle':
                            this.intersectRect(body);
                            break;
                        case 'circle':
                            this.intersectCircle(body);
                            break;
                        default:
                            break;
                    }
                });

                // TODO: Finish this!!!!!!
                // If we've found an intersection point
                if (this.intersectionPoint) {
                    // Make sure it's in this voxel
                    if (this.intersectionPoint.x > (X + 1) * cellSize) {
                        // Intersection could't have occured in the voxel
                        // So set this intersection point on the body itself,
                        // so we dont' have to perform the intersection test
                        // again
                        this.intersectingBody.intersectionPoints[this.rayID] = this.intersectionPoint;
                        debugger;
                    }
                    //if (this.intersectionPoint.x > X * cellSize &&
                        //this.intersectionPoint.x < (X + 1) * cellSize &&
                        //this.intersectionPoint.y > Y * cellSize &&
                        //this.intersectionPoint.y)
                }
                debugger;
            }
            // This should happen in a loop...
            if (tMaxX < tMaxY) {
                //distX = distance(this.origin.x
                tMaxX += tDeltaX;
                X += stepX;
            } else {
                tMaxY += tDeltaY;
                Y += stepY;
            }

            counter++;
        }

        //let distanceToVerticalBoundary = distance(this.origin.x, this.origin.y, vertIntPoint.intPoint.x, vertIntPoint.intPoint.y);
        //let distanceToHorizontalBoundary = distance(this.origin.x, this.origin.y, horIntPoint.intPoint.x, horIntPoint.intPoint.y);
        //if (distanceToVerticalBoundary < distanceToHorizontalBoundary) {
            //distanceToHorizontalBoundary
        //} else {

        //}

        let safetyCounter = 0;
        while (safetyCounter < 10000) {
            safetyCounter++;
        }

        // Step 2. Find distances to nearest vertical and horizontal segments
        // of the voxel
        // Need to know what direction the ray is going in...
        if (this.direction.x > 0 && this.direction.y > 0) {
            // Down and to the right
            //let verticalSeg = [vector(X + cellSize),
            let verts = [vector(X + cellSize, Y), vector(X + cellSize, Y + cellSize)];
            let intersection = this.intersectSegment(verts);
        } else if (this.direction.x > 0 && this.direction.y < 0) {
            // Up and to the right
        } else if (this.direction.x < 0 && this.direction.y > 0) {
            // Down and to the left
        } else if (this.direction.x < 0 && this.direction.y < 0) {
            // Up and to the left
        }
        //
        return [];
    },

    /**
     * Simple Ray-AABB Test
     * Only returns if intersection exists, DOES NOT give distance to
     * intersection
     * 2D version of this: http://www.cg.cs.tu-bs.de/media/publications/fast-rayaxis-aligned-bounding-box-overlap-tests-using-ray-slopes.pdf
     * @param {AABB} aabb - axis-aligned bounding-box instance
     * @return {bool} did intersection occur
     */
    intersectAABB: function(aabb) {
        // Steps:
        // 1. Get slope of line from ray origin to aabb.min and aabb.max
        // 2. if slope of ray is between slopes generated in step 1, then
        // ray intersects
        //
        // Handle two cases : positive vs. negative slope
        // If slope is positive, use min + width and min + height as corners to
        // check
        // Otherwise use regular min and max
        let min, max;
        if (this.slope > 0) {
            min = {x: aabb.max.x, y: aabb.min.y};
            max = {x: aabb.min.x, y: aabb.max.y};
        } else {
            min = aabb.min;
            max = aabb.max;
        }

        let s1 = (min.y - this.origin.y) / (min.x - this.origin.x);
        let s2 = (max.y - this.origin.y) / (max.x - this.origin.x);
        let smin = Math.min(s1, s2);
        let smax = Math.max(s1, s2);

        if (this.slope < smax && this.slope > smin) {
            return true;
        }
        return false;
    },

    /**
     * Internally used to update point of intersection property
     * @param {Point} intPoint - object with x and y properties representing
     * intersection point
     * @param {Vector} segVec - vector object that was intersected
     * @param {Body} body - body that was intersected
     */
    updateIntersectionPoint: function(intPoint, segVec, body) {
        let px = this.origin.x;
        let py = this.origin.y;
        let ix = intPoint.x;
        let iy = intPoint.y;

        // If there was a previously stored intersection point,
        // check if this one is closer,
        // and if so update it's values
        if (this.intersectionPoint) {
            if (distance(px, py, ix, iy) <
                distance(px, py, this.intersectionPoint.x, this.intersectionPoint.y)) {
                this.intersectionPoint = {x: ix, y: iy};
                this.intersectingBody = body;
                this.intersectingSegment = segVec;
            }
        } else {
            // We don't yet have an intersection point, so make a new
            // one
            this.intersectionPoint = {x: ix, y: iy};
            this.intersectingBody = body;
            this.intersectingSegment = segVec;
        }
    }
};

/**
 * 'Constructor' function
 * @param {number} x - origin x
 * @param {number} y - origin y
 * @param {number} dir - direction in radians (or degrees if 'degrees' param
 * = true)
 * @param {bool} degrees - optional flag, if true, then read direction as
 * degrees
 *
 * @return {object} ray object
 */
var ray = function(x, y, dir, degrees) {
    let R = Object.create(Ray);
    R.init(x, y, dir, degrees);
    return R;
};

export default ray;
