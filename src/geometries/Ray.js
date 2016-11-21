/* eslint
    "no-unused-vars": "off",
 */
import {distance, degToRad} from '../math/math';
import vector, {Vector} from '../math/Vector.js';

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
        this.invDirection = vector(1 / this.direction.x, 1 / this.direction.y);
        this.outerBodies = [];
        this.t = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight;
        let x0 = this.origin.x,
            y0 = this.origin.y,
            x1 = this.origin.x + this.direction.x * this.t,
            y1 = this.origin.y + this.direction.y * this.t;
        this.slope = (y1 - y0) / (x1 - x0);
        // TODO: Figure out a way to give each ray a unique ID
        this.numTests = 0;
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

        // Iterate the rayID to ensure no duplicates
        this.rayID = system.currentRayId++;
        this.numTests = 0;      // debugging param - how many tests are run
        this.intersectHash(system.hash);

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
        this.numTests += 1;
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
     * Handles case of ray-polygon intersection
     * If an intersecting segment is found,
     * set the props accordingly
     * @private
     * @param {Polygon} poly - rect body object
     * @return {bool} true if intersected, otherwise false
     */
    intersectPolygon: function(poly) {
        this.numTests += 1;
        if (poly.isPointInterior(this.origin)) {
            this.outerBodies.push(poly);
        }
        //let segs = poly.segments;
        let vertices = poly.vertices;
        let vertLength = vertices.length;
        let intersection;
        vertices.forEach((vert, index, verts) => {
            let seg2;
            if (index === vertLength - 1) {
                seg2 = verts[0];
            } else {
                seg2 = verts[index + 1];
            }

            intersection = this.intersectSegment([vert, seg2]);
            if (intersection) {
                this.updateIntersectionPoint(intersection.intPoint, intersection.segVec, poly);
            }
        });

        return typeof intersection !== 'undefined';
    },
    /**
     * Detects Ray-Segment intersection - Returns intersection coords
     * @param {Array} seg - segment vertices
     * @param {Vector} dir - optional direction to use, otherwise use
     * this.direction
     * @return {Object} returns intersection point with body, or false
     */
    intersectSegment: function(seg, dir) {
        let r = dir ?
            vector(dir.x * this.t, dir.y * this.t) :  // Dir passed to fn
            vector(this.t * this.direction.x, this.t * this.direction.y);   // Use ray dir
        let p = vector(this.origin.x, this.origin.y);                           // Ray origin
        let q = vector(seg[0].x, seg[0].y);                                     // Segment start point
        let s = vector(seg[1].x - seg[0].x, seg[1].y - seg[0].y);               // Segment vector

        // check for intersection
        // t = (q − p) x s / (r x s)
        // u = (q − p) x r / (r x s)
        let rxs = r.cross(s);
        let tmp = Vector.subtract(q, p);
        let tNum = tmp.cross(s),
            uNum = tmp.cross(r);

        // t, u are distances traveled along vector
        let t, u;
        if (rxs !== 0) {
            t = tNum / rxs;
            u = uNum / rxs;
        }

        // TODO: handle collinear case
        if (rxs === 0 && uNum === 0) {
            // lines are collinear
            return;
        } else if (rxs === 0 && uNum !== 0) {
            // lines are parallel and non-intersecting
            return false;
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
        }

        // Line segments do not intersect
        // if we've gone through all the segments of the body,
        //intersectionPoint = null;
        return false;
    },

    /**
     * Test for Ray-Hash bucket intersections
     * @param {SpatialHash} hash - system.hash object
     * @return {array} list of intersected buckets
     *
     * See here: http://www.cse.chalmers.se/edu/year/2011/course/TDA361_Computer_Graphics/grid.pdf
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
        *
     */
    intersectHash: function(hash) {
        // TODO: Handle case where ray starts outside bounds

        // Initialize variables
        // Step 1. Initialization - determine starting voxel
        let bucket = hash.hash(this.origin);
        let {row, col} = bucket;
        let X = col,
            Y = row;
        let tMaxX, tMaxY, tDeltaX, tDeltaY;
        let stepX = this.direction.x < 0 ? -1 : 1,
            stepY = this.direction.y < 0 ? -1 : 1;
        let cellSize = hash.cellSize;

        // Row and Col offset for picking which horizontal or veritcal segments
        // to use for intersection tests
        let rowOffset = stepY < 1 ? 0 : 1,
            colOffset = stepX < 1 ? 0 : 1;

        // FIXME: There's an issue when the ray starts inside a voxel -> it's
        // tMaxX and tMaxY values should represent the distance to cross an
        // entire voxel, not the distance from the origin to the nearest edge.
        // To solve this, we could project backwards until we hit the opposite
        // edges of the voxel, get the starting coordinates, then go from there

        // Project Backwards
        let backDir = this.direction.clone().negate();
        let backSegH, backSegV;
        if (stepX === 1 && stepY === 1) {
            // Right and Down
            // Intersect backDir with col and row, as is
            backSegV = [vector(col * cellSize, 0), vector(col * cellSize, hash.height)];
            backSegH = [vector(0, row * cellSize), vector(hash.width, row * cellSize)];
        } else if (stepX === 1 && stepY === -1) {
            // Right and Up
            // Intersect backDir with col and row + 1
            backSegV = [vector(col * cellSize, 0), vector(col * cellSize, hash.height)];
            backSegH = [vector(0, (row + 1) * cellSize), vector(hash.width, (row + 1) * cellSize)];
        } else if (stepX === -1 && stepY === 1) {
            // Left and Down
            // Intersect with col and row
            backSegV = [vector((col + 1) * cellSize, 0), vector((col + 1) * cellSize, hash.height)];
            backSegH = [vector(0, row * cellSize), vector(hash.width, row * cellSize)];
        } else if (stepX === -1 && stepY === -1) {
            // Left and Up
            // intersect with col + 1 and row + 1
            backSegV = [vector((col + 1) * cellSize, 0), vector((col + 1) * cellSize, hash.height)];
            backSegH = [vector(0, (row + 1) * cellSize), vector(hash.width, (row + 1) * cellSize)];
        }

        // Trace backwards
        let backVInt = this.intersectSegment(backSegV, backDir);
        let backHInt = this.intersectSegment(backSegH, backDir);
        let tMaxOrigin;

        // Which is closer - backH or backV segment?
        if (backVInt.intPoint === undefined && backHInt.intPoint === undefined) {
            return;
            // FIXME: Handle the case where ray is outside and pointing at the
            // grid
        } else if (backVInt.intPoint === undefined && backHInt.intPoint) {
            tMaxOrigin = backHInt.intPoint;
        } else if (backHInt.intPoint === undefined && backVInt.intPoint) {
            tMaxOrigin = backVInt.intPoint;
        } else if (backHInt.intPoint && backVInt.intPoint) {
            let vDist = distance(this.origin.x, this.origin.y, backVInt.intPoint.x, backVInt.intPoint.y);
            let hDist = distance(this.origin.x, this.origin.y, backHInt.intPoint.x, backHInt.intPoint.y);
            if (vDist >= hDist) {
                tMaxOrigin = backHInt.intPoint;
            } else {
                tMaxOrigin = backVInt.intPoint;
            }
        }

        // Hash segments to test for distance to intersection
        let verticalSeg = [
                vector((col + colOffset) * cellSize, 0),
                vector((col + colOffset) * cellSize, hash.height)
            ],
            horizontalSeg = [
                vector(0, (row + rowOffset) * cellSize),
                vector(hash.width, (row + rowOffset) * cellSize)
            ];

        // Step 2. Get distance to both vertical and horizontal hash segments
        // Run hash intersection tests
        let vInt = this.intersectSegment(verticalSeg),
            hInt = this.intersectSegment(horizontalSeg);

        if (window.sciDebug) {
            if (vInt.intPoint && hInt.intPoint) {
                window.ctx.beginPath();
                window.ctx.strokeStyle = 'yellow';
                window.ctx.ellipse(vInt.intPoint.x, vInt.intPoint.y, 8, 8, 0, 0, Math.PI * 2);
                window.ctx.stroke();
                window.ctx.beginPath();
                window.ctx.strokeStyle = 'red';
                window.ctx.ellipse(hInt.intPoint.x, hInt.intPoint.y, 8, 8, 0, 0, Math.PI * 2);
                window.ctx.stroke();
            }

            if (backVInt.intPoint && backHInt.intPoint) {
                window.ctx.beginPath();
                window.ctx.strokeStyle = 'yellow';
                window.ctx.ellipse(backVInt.intPoint.x, backVInt.intPoint.y, 8, 8, 0, 0, Math.PI * 2);
                window.ctx.stroke();
                window.ctx.beginPath();
                window.ctx.strokeStyle = 'red';
                window.ctx.ellipse(backHInt.intPoint.x, backHInt.intPoint.y, 8, 8, 0, 0, Math.PI * 2);
                window.ctx.stroke();
                window.ctx.beginPath();
                window.ctx.ellipse(tMaxOrigin.x, tMaxOrigin.y, 8, 8, 0, 0, Math.PI * 2);
                window.ctx.stroke();
            }
        }

        // It's possible that ray doesn't intersect a segment, so doublecheck
        // Then get distance to intersection point
        let tx, ty;
        if (vInt) {
            tMaxX = distance(tMaxOrigin.x, tMaxOrigin.y, vInt.intPoint.x, vInt.intPoint.y);
            // tx = distance(tMaxOrigin.x, tMaxOrigin.y, vInt.intPoint.x, vInt.intPoint.y);
            // tMaxX = distance(this.origin.x, this.origin.y, vInt.intPoint.x, vInt.intPoint.y);
        }
        if (hInt) {
            tMaxY = distance(tMaxOrigin.x, tMaxOrigin.y, hInt.intPoint.x, hInt.intPoint.y);
            // ty = distance(tMaxOrigin.x, tMaxOrigin.y, hInt.intPoint.x, hInt.intPoint.y);
            // tMaxY = distance(this.origin.x, this.origin.y, hInt.intPoint.x, hInt.intPoint.y);
        }

        // FIXME: Left here on 11/21 - Somethings' not working and I'm not sure
        // what.......
        // Store distances on separate var to hold onto values
        tDeltaX = tMaxX;
        tDeltaY = tMaxY;

        // Step 3. Loop - step through hash, only if X and Y are within the right range
        // TODO: Fix this - negative rays are not tracing
        // FIXME: see todo
        // through hash properly....not sure why
        while (Y < hash.numRows &&
                Y > -1 &&
                X < hash.numCols &&
                X > -1) {
            // Draw buckets that ray overlaps
            if (window.sciDebug) {
                window.ctx.beginPath();
                window.ctx.strokeStyle = 'orange';
                window.ctx.lineWidth = 3;
                window.ctx.strokeRect(X * cellSize, Y * cellSize, cellSize, cellSize);
            }

            // If we've found some contents in that hash bucket...
            if (hash.contents[Y] && hash.contents[Y][X] && hash.contents[Y][X].length !== 0) {
                // TODO: Here's where we need to check if the object is
                // actually intersecting the ray
                // Intersect all objects in this voxel only
                let contents = hash.contents[Y][X];
                contents.forEach(body => {
                    if (body.intersectionPoints[this.rayID]) {
                        // Already tested this body
                        // It either hit or missed, if it hit, grab the point
                        if (body.intersectionPoints[this.rayID].status === 'hit') {
                            this.updateIntersectionPoint(
                                body.intersectionPoints[this.rayID].intPoint,
                                body.intersectionPoints[this.rayID].segVec,
                                body
                            );
                            return;
                        }

                        // It missed, so do nothing;
                        return;
                    }

                    // If ray and body haven't been tested, then test
                    // If it hits the AABB, then perform
                    // actual intersection tests
                    let hitsAABB = this.intersectAABB(body.aabb);
                    if (hitsAABB) {
                        switch (body.type) {
                            case 'polygon':
                            case 'rectangle':
                                this.intersectPolygon(body);
                                break;
                            case 'circle':
                                this.intersectCircle(body);
                                break;
                            default:
                                break;
                        }
                    }

                    // Flag body to know we've already tested this ray-body
                    // combo
                    if (this.intersectionPoint) {
                        body.intersectionPoints[this.rayID] = {
                            status: 'hit',
                            intPoint: this.intersectionPoint,
                            segVeg: this.intersectingSegment
                        };
                    } else {
                        // If we missed, flag the body without
                        // intersectionPoint
                        body.intersectionPoints[this.rayID] = {status: 'miss'};
                    }
                });
            }

            // Increment X or Y step
            if (tMaxX === undefined && tMaxY === undefined) {
                break;
            } else if (tMaxX === undefined) {
                tMaxY += tDeltaY;
                Y += stepY;
            } else if (tMaxY === undefined) {
                tMaxX += tDeltaX;
                X += stepX;
            } else if (tMaxX < tMaxY) {
                // tMaxY += tDeltaY;
                // Y += stepY;
                tMaxX += tDeltaX;
                X += stepX;
            } else if (tMaxX >= tMaxY) {
                // tMaxX += tDeltaX;
                // X += stepX;
                tMaxY += tDeltaY;
                Y += stepY;
            }
        }

        return {
            hashCoordinates: {
                x: X,
                y: Y
            },
            intPoint: this.intersectionPoint
        };
    },

    intersectAABB: function(aabb) {
        //let tmin, tmax, tymin, tymax;

        //let divx = this.invDirection.x;
        //let divy = this.invDirection.y;
        //if (divx >= 0) {
            //tmin = (aabb.min.x - this.origin.x) * divx;
            //tmax = (aabb.max.x - this.origin.x) * divx;
        //} else {
            //tmin = (aabb.max.x - this.origin.x) * divx;
            //tmax = (aabb.min.x - this.origin.x) * divx;
        //}
        //if (divy >= 0) {
            //tymin = (aabb.min.y - this.origin.y) * divy;
            //tymax = (aabb.max.y - this.origin.y) * divy;
        //} else {
            //tymin = (aabb.max.y - this.origin.y) * divy;
            //tymax = (aabb.min.y - this.origin.y) * divy;
        //}
        let tx1 = (aabb.min.x - this.origin.x) * this.invDirection.x;
        let tx2 = (aabb.max.x - this.origin.x) * this.invDirection.x;

        let tmin = Math.min(tx1, tx2);
        let tmax = Math.max(tx1, tx2);

        let ty1 = (aabb.min.y - this.origin.y) * this.invDirection.y;
        let ty2 = (aabb.max.y - this.origin.y) * this.invDirection.y;

        tmin = Math.max(tmin, Math.min(ty1, ty2));
        tmax = Math.min(tmax, Math.max(ty1, ty2));
        let hit = tmax >= tmin && tmax >= 0;
        return hit;
    },
/*AABB.prototype.intersectSegment = function(pos, delta) {
      var farTime, farTimeX, farTimeY, hit, nearTime, nearTimeX, nearTimeY, scaleX, scaleY, signX, signY;

      scaleX = 1.0 / delta.x;
      scaleY = 1.0 / delta.y;
      signX = sign(scaleX);
      signY = sign(scaleY);
      nearTimeX = (this.pos.x - signX * (this.half.x + paddingX) - pos.x) * scaleX;
      nearTimeY = (this.pos.y - signY * (this.half.y + paddingY) - pos.y) * scaleY;
      farTimeX = (this.pos.x + signX * (this.half.x + paddingX) - pos.x) * scaleX;
      farTimeY = (this.pos.y + signY * (this.half.y + paddingY) - pos.y) * scaleY;
      if (nearTimeX > farTimeY || nearTimeY > farTimeX) {
        return null;
      }
      nearTime = nearTimeX > nearTimeY ? nearTimeX : nearTimeY;
      farTime = farTimeX < farTimeY ? farTimeX : farTimeY;
      if (nearTime >= 1 || farTime <= 0) {
        return null;
      }
      hit = new Hit(this);
      hit.time = clamp(nearTime, 0, 1);
      if (nearTimeX > nearTimeY) {
        hit.normal.x = -signX;
        hit.normal.y = 0;
      } else {
        hit.normal.x = 0;
        hit.normal.y = -signY;
      }
      hit.delta.x = hit.time * delta.x;
      hit.delta.y = hit.time * delta.y;
      hit.pos.x = pos.x + hit.delta.x;
      hit.pos.y = pos.y + hit.delta.y;
      return hit;
    };*/
    /**
     * Simple Ray-AABB Test
     * Only returns if intersection exists, DOES NOT give distance to
     * intersection
     * 2D version of this: http://www.cg.cs.tu-bs.de/media/publications/fast-rayaxis-aligned-bounding-box-overlap-tests-using-ray-slopes.pdf
     * @param {AABB} aabb - axis-aligned bounding-box instance
     * @return {bool} did intersection occur
     */
    //intersectAABB: function(aabb) {
        //// Low hanging fruit, if ray origin is inside aabb, then automatic
        //// intersection
        //if (aabb.contains(this.origin)) {
            //return true;
        //}

        //// Steps:
        //// 1. Get slope of line from ray origin to aabb.min and aabb.max
        //// 2. if slope of ray is between slopes generated in step 1, then
        //// ray intersects
        ////
        //// Handle two cases : positive vs. negative slope
        //// If slope is positive, use min + width and min + height as corners to
        //// check
        //// Otherwise use regular min and max
        //let min, max;
        //if (this.slope > 0) {
            //min = {x: aabb.max.x, y: aabb.min.y};
            //max = {x: aabb.min.x, y: aabb.max.y};
        //} else {
            //min = aabb.min;
            //max = aabb.max;
        //}

        //let s1 = (min.y - this.origin.y) / (min.x - this.origin.x);
        //let s2 = (max.y - this.origin.y) / (max.x - this.origin.x);
        //let smin = Math.min(s1, s2);
        //let smax = Math.max(s1, s2);

        //if (this.slope < smax && this.slope > smin) {
            //return true;
        //}
        //return false;
    //},

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
