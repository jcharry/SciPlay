import {distance, degToRad} from './math';
import vector, {Vector} from './Vector.js';

let Ray = {
    init: function(x, y, dir, degrees) {
        if (degrees) {
            dir = degToRad(dir);
        }

        this.origin = vector(x, y);
        this.direction = vector(Math.cos(dir), Math.sin(dir));
        this.outerBodies = [];
        this.t = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight;
    },
    trace: function(system) {
        // Always use radians, regardless of mode
        // Also angle should be in range 0 <= angle <= 2PI
        //let angle = this.direction.getAngle();
        //angle = angle < 0 ? Math.PI * 2 + angle : angle;
        this.intersectionPoint = null;
        this.intersectingBody = null;
        this.intersectingSegment = null;
        //let children = [];

        // Get ray vector -> p1 - p0 (end of ray - origin of ray)
        //let p0x = this.origin.x;
        //let p0y = this.origin.y;

        // Abitrarily large number to ensure ray extends passed edge of canvas
        //let p1x = 2000 * Math.cos(angle) + this.origin.x;
        //let p1y = 2000 * Math.sin(angle) + this.origin.y;
        //let p = vector(props.x, props.y);
        //let r = vector(p1x - props.x, p1y - props.y);
        //this.rayVector = r.copy();

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
            // Vector implementation of reflected and refracted waves here:
            // http://graphics.stanford.edu/courses/cs148-10-summer/docs/2006--degreve--reflection_refraction.pdf
            // Normalize ray vector
            //this.rayVector.normalize();

            //// Find the normal vector (method of which depends on type of body)
            //// There are two possible normal vectors, but
            //// which one do we want?
            //// one which dot product with ray vector < 0 is what we want
            //// http://gamedev.stackexchange.com/questions/85850/collision-intersection-of-2d-ray-to-line-segment
            //let normal;
            //let bType = props.intersectingBody.get('type');
            //if (bType === 'rectangle') {
                //let intSeg = props.intersectingSegment.copy();

                //intSeg.normalize();
                //let dot = intSeg.dot(this.rayVector);
                //let normals = [vector(-intSeg.getY(), intSeg.getX()), vector(intSeg.getY(), -intSeg.getX())];

                //normals.forEach(n => {
                    //if (n.dot(this.rayVector) < 0) {
                        //normal = n;
                    //}
                //});
            //} else if (bType === 'circle') {
                //let cx = props.intersectingBody.get('pos').getX();
                //let cy = props.intersectingBody.get('pos').getY();
                //let ix = props.intersectionPoint.x;
                //let iy = props.intersectionPoint.y;
                //let v1 = vector(ix - cx, iy - cy),
                    //v2 = vector(cx - ix, cy - iy);
                //v1.normalize();
                //v2.normalize();
                //let normals = [
                    //v1,
                    //v2
                //];
                //normals.forEach(function(n) {
                    ////n.normalize();
                    //if (n.dot(this.rayVector) < 0) {
                        //normal = n;
                    //}
                //});
            //}

            //// Get angle of incidence
            ////let intX = props.intersectingSegment.getX(),
                ////intY = props.intersectingSegment.getY(),
                ////intSeg = props.intersectingSegment.copy(),
                ////normal;
            //// XXX: Can probably take out the copy of intersectingSegment
            ////intSeg.normalize();
            ////let normals = [vector(-intSeg.getY(), intSeg.getX()), vector(intSeg.getY(), -intSeg.getX())];
            ////let dot = intSeg.dot(rayVector);

            ////normals.forEach(n => {
                ////if (n.dot(rayVector) < 0) {
                    ////normal = n;
                ////}
            ////});

            //// child waves - reflected and refracted
            ////createChildren();
            //// Calculate reflected vector
            //// https://en.wikipedia.org/wiki/Snell%27s_law#Vector_form
            //// http://stackoverflow.com/questions/5454661/reflection-how-do-i-do-it
            //// Reflected vector looks like this:
            //// r = a - 2(a dot n) * n
            //let tmpTerm = 2 * this.rayVector.dot(normal);
            //let tmpVec = normal.copy();
            //tmpVec.multiply(2 * this.rayVector.dot(normal));
            //let rVec = this.rayVector.copy();
            //rVec.subtract(tmpVec);

            //// Refracted vector
            //// Are we inside a body?
            //// get origin points of wave, check if they are interior to the
            //// intersecting body, if so, n1 = body.refractiveIndex, if not, n1
            //// takes on refractive index of outer context,
            //// which we can find from it's parent wave
            //// If we have a body to intersect with...
            //let n1 = props.n1,
                //n2 = props.n2;
            //if (props.type === 'incident' && this.outerBodies.length > 0) {
                ////Grab the last one (the body on top)
                //n1 = this.outerBodies[this.outerBodies.length - 1].get('refractiveIndex');
            //}

            //// TODO: Figure out how to handle picking proper refractive index
            //// values
            //// for child rays
            //if (props.intersectingBody) {
                //switch (props.type) {
                    //case 'refracted':
                        //if (props.parent && props.parent.props.intersectingBody &&
                            //props.parent.props.intersectingBody === props.intersectingBody) {
                            //n1 = props.parent.get('n2');
                            //n2 = props.parent.get('n1');
                        //} else {
                            //n1 = props.parent.get('n2');
                            //n2 = props.intersectingBody.get('refractiveIndex');
                        //}
                        //break;
                    //case 'reflected':
                        //if (props.parent && props.parent.props.intersectingBody &&
                            //props.parent.props.intersectingBody === props.intersectingBody) {
                            //n1 = props.parent.get('n1');
                            //n2 = props.parent.get('n2');
                        //} else {
                            //n1 = props.parent.get('n1');
                            //n2 = props.intersectingBody.get('refractiveIndex');
                        //}
                        //break;
                    //case 'incident':
                        //n2 = props.intersectingBody.get('refractiveIndex');
                        //break;
                    //default:
                        //break;
                //}
            //} else {
                //// There's no intersection point ahead of this ray, so it's
                //// refractive indices are irrelevant
                //n1 = 1;
                //n2 = 2;
                //// If the ray won't intersect another body,
                //// then it must be outside of a body
                ////n2 = 1;

                //// n1 must take on the index of where the parent ray currently
                //// exists
                ////n1 = props.parent.intersectingBody.refractiveIndex;
            //}

            //// Store on props so children have access
            //props.n1 = n1;
            //props.n2 = n2;

            ////n1 = 1;
            ////n2 = intersectingBody ? intersectingBody.get('refractiveIndex') : 1;
            //let theta1 = Math.PI - this.rayVector.angleTo(normal);
            //let theta2 = Math.asin(n1 * Math.sin(theta1) / n2);

            //// Vector formulation for refracted wave
            //// t = n1/n2 * rayVector + (n1/n2 * cos(theta1) - sqrt(1
            //// - sin2(theta2))) * normal
            //let sin2theta2 = (n1 / n2) * (n1 / n2) * (1 - (Math.cos(theta1) * Math.cos(theta1)));
            //let tVec = this.rayVector.copy();
            //tVec.multiply(n1 / n2);
            //let normCopy = normal.copy();
            //normCopy.multiply((n1 / n2) * Math.cos(theta1) - Math.sqrt(1 - sin2theta2));
            //tVec.add(normCopy);

            //// Reflection Coefficient
            //// R = R0 + (1 - R0) * (1 - cos(theta1))^5 where R0 = (n1 - n2 / n1
            //// + n2)^2
            //let _r0 = (n1 - n2) / (n1 + n2);
            //let R0 = _r0 * _r0;
            //let _r0tmp;

            //// Angles must be positive, so if we get a negative value for an
            //// angle, just flip it
            //if (n1 <= n2) {
                //_r0tmp = (1 - (Math.cos(theta1) < 0 ? -Math.cos(theta1) : Math.cos(theta1)));
            //} else if (n1 > n2) {
                //_r0tmp = (1 - (Math.cos(theta2) < 0 ? -Math.cos(theta2) : Math.cos(theta2)));
            //}

            //let R = R0 + (1 - R0) * Math.pow(_r0tmp, 5);
            //let T = 1 - R;  // Refracion Coefficient
            //// Total Internal Reflection
            //if (Math.sin(theta1) > n2 / n1) {
                //R = 1;
                //T = 0;
            //}
            //let RI = props.intensity * R;
            //let TI = props.intensity * T;

            //// Add 2 child waves - reflected and refracted
            //// Trace reflected wave
            //// Have to offset the waves by at least a pixel,
            //// otherwise we'll end up in a never ending
            //// call stack when each child wave always produces
            //// 2 new child waves, forever...
            //let rVecAngle = rVec.getAngle();
            //let tVecAngle = tVec.getAngle();
            //if (RI > 0.02) {
                //let reflectedWave = wave({
                    //x: props.intersectionPoint.x + Math.cos(rVecAngle),
                    //y: props.intersectionPoint.y + Math.sin(rVecAngle),
                    //direction: rVecAngle,
                    //intensity: RI,
                    //type: 'reflected',
                    //parent: this,
                    //n1: props.n1,
                    //n2: props.n2
                //});
                //this.children.push(reflectedWave);
            //}

            //if (TI > 0.02) {
                //let refractedWave = wave({
                    //x: props.intersectionPoint.x + Math.cos(tVecAngle),
                    //y: props.intersectionPoint.y + Math.sin(tVecAngle),
                    //direction: tVecAngle,
                    //intensity: TI,
                    //type: 'refracted',
                    //parent: this,
                    //n1: props.n1,
                    //n2: props.n2
                //});
                //this.children.push(refractedWave);
            //}
            //drawChildren(system, ctx);
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
     * Detect if ray intersects circle
     * see this skecth: http://www.openprocessing.org/sketch/45537
     *
     * @param {Body} circle - circle body object
     */
    //intersectCircle: function(circle) {
        //let radius = circle.radius;

        ////let f = this.origin.copy();
        ////f.subtract(circle.get('pos'));
        //let f = Vector.subtract(circle.position, this.origin);
        //let lf = f.dot(this.direction);
        //let s = radius * radius - f.dot(f) + lf * lf;

        //if (s < 0) {
            //return false;
        //}

        //s = Math.sqrt(s);
        //if (lf < s) {
            //if (lf + s >= 0) {
                //s = -s;
                //this.outerBodies.push(circle);
            //}
        //}

        //let t1 = Vector.multiply(this.direction, (lf - s));
        //t1.add(this.origin);
        //// That works!
        //this.updateIntersectionPoint({x: t1.x, y: t1.y}, null, circle);
        //return;
    //},
    /**
     * Handles case of ray-rectangle intersection
     * If an intersecting segment is found,
     * set the props accordingly
     * @private
     * @param {Rect} rect - rect body object
     */
    intersectRect: function(rect) {
        if (rect.isPointInterior(this.origin.x, this.origin.y)) {
            this.outerBodies.push(rect);
        }
        //let segs = rect.segments;
        let vertices = rect.vertices;
        let vertLength = vertices.length;
        vertices.forEach((vert, index, verts) => {
            let seg2;
            if (index === vertLength - 1) {
                seg2 = verts[0];
            } else {
                seg2 = verts[index + 1];
            }
            //let segVec = vector(vert, seg2);
            let intersection = this.intersectSegment([vert, seg2]);
            if (intersection) {
                this.updateIntersectionPoint(intersection.intPoint, intersection.segVec, rect);
            }
        });

        //segs.forEach(seg => {
            //var intersection = this.intersectSegment(seg);
            //if (intersection) {
                //this.updateIntersectionPoint(intersection.intPoint, intersection.segVec, rect);
            //}
        //});
    },
    /**
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
                segVec: s
            };
        } else {
            // Line segments do not intersect
            // if we've gone through all the segments of the body,
            //intersectionPoint = null;
            return false;
        }
    },
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

var ray = function(x, y, dir, degrees) {
    let R = Object.create(Ray);
    R.init(x, y, dir, degrees);
    return R;
    //return new Ray(x, y, dir, degrees);
};

export default ray;
