/* eslint "no-unused-vars": "off" */
import {degToRad, radToDeg, crossProduct2D, dotProduct2D, distance, map} from '../math/math';
import vector, {Vector} from '../math/Vector';
import ray from '../geometries/Ray';

let Wave = {
    init: function(options) {
        options = options || {};
        const speedOfLight = 299792458;
        this.children = [];
        //this.outerBodies = [];
        this.style = {
            lineWidth: options.lineWidth || 1,
            strokeStyle: options.strokeStyle || '#456abc'
        };

        this.x = options.x || 10;
        this.y = options.y || 10;
        this.position = vector(options.x, options.y);
        this.waveSpeed = options.waveSpeed || speedOfLight;
        this.frequency = options.frequency || 1000;
        this.wavelength = this.waveSpeed / this.frequency;  // Computed Property
        this.velocity = options.velocity || vector(0, 0);
        this.direction = options.direction || 0;
        this.mode = options.mode || 'RADIAN';
        this.intensity = options.intensity || 1;
        this.type = options.type || 'incident';
        this.parent = options.parent || null;
        this.n1 = options.n1 || 1;
        this.n2 = options.n2 || 1;
        this.lastIntersection = {};

        // create ray for detecting body intersections
        this.ray = ray(this.position.x, this.y, this.direction, this.mode === 'DEGREES' || null);
    },

    update: function(system) {
        this.ray.trace(system);

        // Remove children on every update
        this.children = [];
        // If the ray intersected a point...
        if (this.ray.intersectionPoint) {
            this.lastIntersection = this.ray.intersectionPoint;
            this.children = this.createChildren();

            this.children.forEach(child => {
                child.update(system);
            });
        }
    },
    createChildren: function() {
        //Vector implementation of reflected and refracted waves here:
        //http://graphics.stanford.edu/courses/cs148-10-summer/docs/2006--degreve--reflection_refraction.pdf
        //Normalize ray vector = this.ray.direction

        // Find the normal vector (method of which depends on type of body)
        // There are two possible normal vectors, but
        // which one do we want?
        // one which dot product with ray vector < 0 is what we want
        // http://gamedev.stackexchange.com/questions/85850/collision-intersection-of-2d-ray-to-line-segment
        let normal;

        //selectNormal();
        // TODO: Wrap this in it's own function (i.e. findNormal function)
        let bType = this.ray.intersectingBody.type;
        if (bType === 'rectangle' || bType === 'polygon') {
            let intSeg = this.ray.intersectingSegment;

            intSeg.normalize();
            let dot = intSeg.dot(this.ray.direction);
            let normals = [vector(-intSeg.y, intSeg.x), vector(intSeg.y, -intSeg.x)];

            let that = this;
            normals.forEach(n => {
                if (n.dot(that.ray.direction) < 0) {
                    normal = n;
                }
            });
        } else if (bType === 'circle') {
            let cx = this.ray.intersectingBody.position.x;
            let cy = this.ray.intersectingBody.position.y;
            let ix = this.ray.intersectionPoint.x;
            let iy = this.ray.intersectionPoint.y;
            let v1 = vector(ix - cx, iy - cy),
                v2 = vector(cx - ix, cy - iy);
            v1.normalize();
            v2.normalize();
            let normals = [
                v1,
                v2
            ];
            let that = this;
            normals.forEach(function(n) {
                //n.normalize();
                if (n.dot(that.ray.direction) < 0) {
                    normal = n;
                }
            });
            if (normal === undefined) {
                // We intersect at a tangent on a circle???
                // TODO: Fix this!!!
                normal = normals[0];
            }
        }

        // child waves - reflected and refracted
        // Calculate reflected vector
        // https://en.wikipedia.org/wiki/Snell%27s_law#Vector_form
        // http://stackoverflow.com/questions/5454661/reflection-how-do-i-do-it
        // Reflected vector looks like this:
        // r = a - 2(a dot n) * n
        let tmpTerm = 2 * this.ray.direction.dot(normal);
        let tmpVec = normal.clone();
        tmpVec.multiply(2 * this.ray.direction.dot(normal));
        let rVec = this.ray.direction.clone();
        rVec.subtract(tmpVec);

        // Refracted vector
        // Are we inside a body?
        // get origin points of wave, check if they are interior to the
        // intersecting body, if so, n1 = body.refractiveIndex, if not, n1
        // takes on refractive index of outer context,
        // which we can find from it's parent wave
        // If we have a body to intersect with...
        if (this.type === 'incident' && this.ray.outerBodies.length > 0) {
            //Grab the last one (the body on top)
            this.n1 = this.ray.outerBodies[this.ray.outerBodies.length - 1].refractiveIndex;
        }

        // TODO: Figure out how to handle picking proper refractive index
        // values
        // for child rays
        if (this.ray.intersectingBody) {
            switch (this.type) {
                case 'refracted':
                    if (this.parent && this.parent.ray.intersectingBody &&
                        this.parent.ray.intersectingBody === this.ray.intersectingBody) {
                        this.n1 = this.parent.n2;
                        this.n2 = this.parent.n1;
                    } else {
                        this.n1 = this.parent.n2;
                        this.n2 = this.ray.intersectingBody.refractiveIndex;
                    }
                    break;
                case 'reflected':
                    if (this.parent && this.parent.ray.intersectingBody &&
                        this.parent.ray.intersectingBody === this.intersectingBody) {
                        this.n1 = this.parent.n1;
                        this.n2 = this.parent.n2;
                    } else {
                        this.n1 = this.parent.n1;
                        this.n2 = this.ray.intersectingBody.refractiveIndex;
                    }
                    break;
                case 'incident':
                    this.n2 = this.ray.intersectingBody.refractiveIndex;
                    break;
                default:
                    break;
            }
        } else {
            // There's no intersection point ahead of this ray, so it's
            // refractive indices are irrelevant
            this.n1 = 1;
            this.n2 = 1;
            // If the ray won't intersect another body,
            // then it must be outside of a body
            //n2 = 1;

            // n1 must take on the index of where the parent ray currently
            // exists
            //n1 = props.parent.intersectingBody.refractiveIndex;
        }

        let theta1 = Math.PI - this.ray.direction.angleTo(normal);
        let theta2 = Math.asin(this.n1 * Math.sin(theta1) / this.n2);

        // Vector formulation for refracted wave
        // t = n1/n2 * rayVector + (n1/n2 * cos(theta1) - sqrt(1
        // - sin2(theta2))) * normal
        let sin2theta2 = (this.n1 / this.n2) * (this.n1 / this.n2) * (1 - (Math.cos(theta1) * Math.cos(theta1)));
        let tVec = Vector.multiply((this.n1 / this.n2), this.ray.direction);
        let normCopy = Vector.multiply(normal, (this.n1 / this.n2) * Math.cos(theta1) - Math.sqrt(1 - sin2theta2));
        tVec.add(normCopy);

        // Reflection Coefficient
        // R = R0 + (1 - R0) * (1 - cos(theta1))^5 where R0 = (n1 - n2 / n1
        // + n2)^2
        let _r0 = (this.n1 - this.n2) / (this.n1 + this.n2);
        let R0 = _r0 * _r0;
        let _r0tmp;

        // Angles must be positive, so if we get a negative value for an
        // angle, just flip it
        if (this.n1 <= this.n2) {
            _r0tmp = (1 - (Math.cos(theta1) < 0 ? -Math.cos(theta1) : Math.cos(theta1)));
        } else if (this.n1 > this.n2) {
            _r0tmp = (1 - (Math.cos(theta2) < 0 ? -Math.cos(theta2) : Math.cos(theta2)));
        }

        // TODO: Refactor this to eliminate some checks if body is a mirror
        let R = R0 + (1 - R0) * Math.pow(_r0tmp, 5);
        let T = 1 - R;  // Refracion Coefficient
        // Total Internal Reflection
        if (Math.sin(theta1) > this.n2 / this.n1) {
            R = 0.95;
            T = 0;
        }

        // If the material should be treated as a mirror
        if (this.ray.intersectingBody.mirror === true) {
            R = 0.9;
            T = 0;
        }

        let RI = this.intensity * R;
        let TI = this.intensity * T;

        // Add 2 child waves - reflected and refracted
        // Trace reflected wave
        // Have to offset the waves by at least a pixel,
        // otherwise we'll end up in a never ending
        // call stack when each child wave always produces
        // 2 new child waves, forever...
        let rVecAngle = rVec.getAngle();
        let tVecAngle = tVec.getAngle();
        let children = [];
        if (RI > 0.01) {
            let reflectedWave = wave({ // eslint-disable-line
                x: this.ray.intersectionPoint.x + Math.cos(rVecAngle),
                y: this.ray.intersectionPoint.y + Math.sin(rVecAngle),
                direction: rVecAngle,
                intensity: RI,
                type: 'reflected',
                parent: this,
                n1: this.n1,
                n2: this.n2,
                lineWidth: this.style.lineWidth,
                strokeStyle: this.style.strokeStyle
            });
            children.push(reflectedWave);
        }

        if (TI > 0.01) {
            let refractedWave = wave({  // eslint-disable-line
                x: this.ray.intersectionPoint.x - normal.x,
                y: this.ray.intersectionPoint.y - normal.y,
                direction: tVecAngle,
                intensity: TI,
                type: 'refracted',
                parent: this,
                n1: this.n1,
                n2: this.n2,
                lineWidth: this.style.lineWidth,
                strokeStyle: this.style.strokeStyle
            });
            children.push(refractedWave);
        }
        return children;
    }
};

const wave = function(options) {
    let W = Object.create(Wave);
    W.init(options);
    return W;
};

export default wave;
