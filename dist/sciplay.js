(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("sciplay", [], factory);
	else if(typeof exports === 'object')
		exports["sciplay"] = factory();
	else
		root["sciplay"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	/* eslint "max-len": "off" */
	// Request animation frame shim
	(function () {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	    }
	
	    if (!window.requestAnimationFrame) {
	        window.requestAnimationFrame = function (callback, element) {
	            var currTime = new Date().getTime();
	            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	            var id = window.setTimeout(function () {
	                callback(currTime + timeToCall);
	            }, timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	    }
	
	    if (!window.cancelAnimationFrame) {
	        window.cancelAnimationFrame = function (id) {
	            clearTimeout(id);
	        };
	    }
	})();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Vector = __webpack_require__(3);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	var _Ray = __webpack_require__(5);
	
	var _Ray2 = _interopRequireDefault(_Ray);
	
	var _System = __webpack_require__(6);
	
	var _System2 = _interopRequireDefault(_System);
	
	var _Renderer = __webpack_require__(7);
	
	var _Renderer2 = _interopRequireDefault(_Renderer);
	
	var _Rect = __webpack_require__(8);
	
	var _Rect2 = _interopRequireDefault(_Rect);
	
	var _Wave = __webpack_require__(11);
	
	var _Wave2 = _interopRequireDefault(_Wave);
	
	var _Circle = __webpack_require__(12);
	
	var _Circle2 = _interopRequireDefault(_Circle);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var sciplay = function sciplay() {
	    return {
	        Vector: _Vector.Vector, // for operations that return a new vector
	        vector: _Vector2.default, // actual vector constructor
	        renderer: _Renderer2.default,
	        ray: _Ray2.default,
	        system: _System2.default,
	        wave: _Wave2.default,
	        rect: _Rect2.default,
	        circle: _Circle2.default
	    };
	};
	
	/* BODIES */
	
	
	/* CORE OBJECTS */
	/* MATH OBJECTS */
	exports.default = sciplay;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Vector = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _math = __webpack_require__(4);
	
	var Vector = exports.Vector = function Vector(x, y) {
	    this.x = x || 0;
	    this.y = y || 0;
	};
	
	Vector.prototype = {
	    clone: function clone() {
	        return new Vector(this.x, this.y);
	    },
	    /**
	     * Generic Setter
	     * @param {string} prop - property to set
	     * @param {*} val - value to set
	     */
	    set: function set(prop, val) {
	        if (prop === 'x') {
	            this.x = val;
	        } else if (prop === 'y') {
	            this.y = val;
	        }
	    },
	    add: function add(vec) {
	        this.x += vec.x;
	        this.y += vec.y;
	    },
	    subtract: function subtract(vec) {
	        this.x -= vec.x;
	        this.y -= vec.y;
	    },
	    multiply: function multiply(vec) {
	        if ((typeof vec === 'undefined' ? 'undefined' : _typeof(vec)) === 'object') {
	            this.x *= vec.getX();
	            this.y *= vec.getY();
	        } else if (typeof vec === 'number') {
	            this.x *= vec;
	            this.y *= vec;
	        }
	    },
	    magnitude: function magnitude() {
	        return Math.sqrt(this.x * this.x + this.y * this.y);
	    },
	    magnitudeSq: function magnitudeSq() {
	        return this.x * this.x + this.y * this.y;
	    },
	    dot: function dot(vec) {
	        return this.x * vec.x + this.y * vec.y;
	    },
	    cross: function cross(vec) {
	        return this.x * vec.y - this.y * vec.x;
	    },
	    angleTo: function angleTo(vec) {
	        var a = this.magnitude();
	        var b = vec.magnitude();
	        var d = this.dot(vec);
	
	        var theta = Math.acos(d / (a * b));
	        return theta;
	    },
	    getAngle: function getAngle(mode) {
	        if (mode === 'DEGREES') {
	            return (0, _math.radToDeg)(Math.atan(this.y / this.x));
	        }
	        var a = Math.atan2(this.y, this.x);
	        //return a;
	        return a < 0 ? Math.PI * 2 + a : a;
	    },
	    normalize: function normalize(vec) {
	        var mag = this.magnitude();
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
	Vector.add = function (v1, v2) {
	    return new Vector(v1.x + v2.x, v1.y + v2.y);
	};
	Vector.subtract = function (v1, v2) {
	    return new Vector(v1.x - v2.x, v1.y - v2.y);
	};
	Vector.multiply = function (v1, v2) {
	    if (typeof v1 === 'number' && typeof v2 === 'number') {
	        return v1 * v2;
	    }
	
	    if ((typeof v1 === 'undefined' ? 'undefined' : _typeof(v1)) === 'object' && typeof v2 === 'number') {
	        return new Vector(v1.x * v2, v1.y * v2);
	    }
	
	    if ((typeof v2 === 'undefined' ? 'undefined' : _typeof(v2)) === 'object' && typeof v1 === 'number') {
	        return new Vector(v1 * v2.x, v1 * v2.y);
	    }
	};
	Vector.dot = function (v1, v2) {
	    return v1.x * v2.x + v1.y * v2.y;
	};
	Vector.angleBetween = function (v1, v2) {
	    var a = v1.magnitude();
	    var b = v2.magnitude();
	    var d = v1.dot(v2);
	
	    var theta = Math.acos(d / (a * b));
	    return theta;
	};
	
	var vector = function vector(x, y) {
	    return new Vector(x, y);
	};
	
	exports.default = vector;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var degToRad = exports.degToRad = function degToRad(angle) {
	    return angle * Math.PI / 180;
	};
	
	var radToDeg = exports.radToDeg = function radToDeg(angle) {
	    return angle * 180 / Math.PI;
	};
	
	var distance = exports.distance = function distance(x1, y1, x2, y2) {
	    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	};
	
	var map = exports.map = function map(value, low1, high1, low2, high2) {
	    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _math = __webpack_require__(4);
	
	var _Vector = __webpack_require__(3);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Ray = {
	    init: function init(x, y, dir, degrees) {
	        if (degrees) {
	            dir = (0, _math.degToRad)(dir);
	        }
	
	        this.origin = (0, _Vector2.default)(x, y);
	        this.direction = (0, _Vector2.default)(Math.cos(dir), Math.sin(dir));
	        this.outerBodies = [];
	        this.t = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight;
	    },
	    trace: function trace(system) {
	        var _this = this;
	
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
	        system.objects.forEach(function (body) {
	            switch (body.type) {
	                case 'rectangle':
	                    _this.intersectRect(body);
	                    break;
	                case 'circle':
	                    _this.intersectCircle(body);
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
	    intersectCircle: function intersectCircle(circle) {
	        var radius = circle.radius;
	
	        var d = (0, _Vector2.default)(this.direction.x * this.t, this.direction.y * this.t);
	        var f = _Vector.Vector.subtract(this.origin, circle.position); //this.origin.clone();
	
	        // Solve the quadratic equation
	        var a = d.dot(d);
	        var b = 2 * f.dot(d);
	        var c = f.dot(f) - radius * radius;
	
	        // Descriminant b^2 - 4ac
	        var desc = b * b - 4 * a * c;
	
	        if (desc < 0) {
	            // No intersection
	        } else {
	            // Ray hit circle
	            // Two possible solutions
	            desc = Math.sqrt(desc);
	            var t1 = (-b - desc) / (2 * a);
	            var t2 = (-b + desc) / (2 * a);
	            var ix = void 0,
	                iy = void 0;
	
	            // If t1 intersected the circle...
	            // Note: t1 is always closer than t2
	            if (t1 >= 0 && t1 <= 1) {
	                ix = this.origin.x + d.x * t1;
	                iy = this.origin.y + d.y * t1;
	                this.updateIntersectionPoint({ x: ix, y: iy }, null, circle);
	                return true;
	            }
	
	            // If t1 doesn't intersect, check t2
	            if (t2 >= 0 && t2 <= 1) {
	                ix = this.origin.x + d.x * t2;
	                iy = this.origin.y + d.y * t2;
	                this.updateIntersectionPoint({ x: ix, y: iy }, null, circle);
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
	    intersectRect: function intersectRect(rect) {
	        var _this2 = this;
	
	        if (rect.isPointInterior(this.origin.x, this.origin.y)) {
	            this.outerBodies.push(rect);
	        }
	        //let segs = rect.segments;
	        var vertices = rect.vertices;
	        var vertLength = vertices.length;
	        vertices.forEach(function (vert, index, verts) {
	            var seg2 = void 0;
	            if (index === vertLength - 1) {
	                seg2 = verts[0];
	            } else {
	                seg2 = verts[index + 1];
	            }
	            //let segVec = vector(vert, seg2);
	            var intersection = _this2.intersectSegment([vert, seg2]);
	            if (intersection) {
	                _this2.updateIntersectionPoint(intersection.intPoint, intersection.segVec, rect);
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
	    intersectSegment: function intersectSegment(seg) {
	        //let t1 = Math.abs(v2.cross(v1)) / (v2.dot(v3));
	        //let t2 = (v1.dot(v3)) / (v2.dot(v3));
	        var r = (0, _Vector2.default)(this.t * this.direction.x, this.t * this.direction.y);
	        var p = (0, _Vector2.default)(this.origin.x, this.origin.y);
	        var q = (0, _Vector2.default)(seg[0].x, seg[0].y);
	        var s = (0, _Vector2.default)(seg[1].x - seg[0].x, seg[1].y - seg[0].y);
	        //let q = vector(seg[0][0], seg[0][1]);
	        //let s = vector(seg[1][0] - seg[0][0], seg[1][1] - seg[0][1]);
	
	        // check for intersection
	        // t = (q − p) x s / (r x s)
	        // u = (q − p) x r / (r x s)
	        var rxs = r.cross(s);
	        //tmp = q.copy();
	        var tmp = _Vector.Vector.subtract(q, p);
	        //tmp.subtract(p);
	        var tNum = tmp.cross(s),
	            uNum = tmp.cross(r);
	
	        var t = void 0,
	            u = void 0;
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
	            var px = p.x,
	                py = p.y,
	                rx = r.x,
	                ry = r.y,
	                ix = px + t * rx,
	                iy = py + t * ry;
	
	            return {
	                intPoint: (0, _Vector2.default)(ix, iy),
	                segVec: s
	            };
	        } else {
	            // Line segments do not intersect
	            // if we've gone through all the segments of the body,
	            //intersectionPoint = null;
	            return false;
	        }
	    },
	    updateIntersectionPoint: function updateIntersectionPoint(intPoint, segVec, body) {
	        var px = this.origin.x;
	        var py = this.origin.y;
	        var ix = intPoint.x;
	        var iy = intPoint.y;
	
	        // If there was a previously stored intersection point,
	        // check if this one is closer,
	        // and if so update it's values
	        if (this.intersectionPoint) {
	            if ((0, _math.distance)(px, py, ix, iy) < (0, _math.distance)(px, py, this.intersectionPoint.x, this.intersectionPoint.y)) {
	                this.intersectionPoint = { x: ix, y: iy };
	                this.intersectingBody = body;
	                this.intersectingSegment = segVec;
	            }
	        } else {
	            // We don't yet have an intersection point, so make a new
	            // one
	            this.intersectionPoint = { x: ix, y: iy };
	            this.intersectingBody = body;
	            this.intersectingSegment = segVec;
	        }
	    }
	};
	
	var ray = function ray(x, y, dir, degrees) {
	    var R = Object.create(Ray);
	    R.init(x, y, dir, degrees);
	    return R;
	    //return new Ray(x, y, dir, degrees);
	};
	
	exports.default = ray;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var System = function System() {
	    this.frames = [];
	    this.objects = [];
	    this.waves = [];
	    this.childWaves = [];
	    this.rays = [];
	};
	System.prototype = {
	    addFrame: function addFrame(frame) {
	        this.frames.push(frame);
	    },
	    addRay: function addRay(ray) {
	        this.rays.push(ray);
	    },
	    addWave: function addWave(wave) {
	        this.waves.push(wave);
	    },
	    addChildWave: function addChildWave(wave) {
	        this.childWaves.push(wave);
	    },
	
	    /**
	     * Add objects to the system
	     * Objects not added will not be rendered
	     * or updated
	     *
	     * @param {Body|Body[]} b - a body object, or array of body objects
	     */
	    addObject: function addObject(b) {
	        var _this = this;
	
	        if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object' && b.length !== undefined) {
	            // b is an array
	            b.forEach(function (body) {
	                _this.objects.push(body);
	            });
	        } else {
	            this.objects.push(b);
	        }
	    },
	    update: function update() {
	        var _this2 = this;
	
	        this.objects.forEach(function (body) {
	            body.update();
	        });
	
	        this.childWaves = [];
	        this.waves.forEach(function (wave) {
	            wave.update(_this2);
	            _this2.traverseWaves(wave);
	        });
	    },
	    traverseWaves: function traverseWaves(wave) {
	        var _this3 = this;
	
	        if (wave.children.length !== 0) {
	            wave.children.forEach(function (child) {
	                _this3.addChildWave(child);
	                _this3.traverseWaves(child);
	            });
	        }
	    }
	};
	
	var system = function system() {
	    return new System();
	};
	exports.default = system;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _math = __webpack_require__(4);
	
	var Renderer = {
	    init: function init(params) {
	        this.clearBackground = true;
	        this.debug = params.debug || false;
	        this.background = params.background || 'black';
	        this.canvas = typeof params.canvas === 'undefined' ? function () {
	            var c = document.createElement('canvas');
	            c.id = 'canvas';
	            // Set default size
	            document.body.appendChild(c);
	            return c;
	        }() : function () {
	            // Default values for canvas size
	            var c = document.getElementById(params.canvas);
	            return c;
	        }();
	
	        this.canvas.width = params.width || 600;
	        this.canvas.height = params.height || 300;
	        this.ctx = this.canvas.getContext('2d');
	    },
	    /**
	     * Draw bodies and waves
	     * @private
	     * @param {object} system - phys.system object containing all objects
	     */
	    renderObjects: function renderObjects(system) {
	        var _this = this;
	
	        system.objects.forEach(function (body) {
	            _this.draw(body);
	            //body.draw(this.ctx);
	        });
	
	        system.waves.forEach(function (wave) {
	            wave.trace(system, _this.ctx);
	            wave.draw(_this.ctx);
	        });
	
	        //system.rays.forEach(ray => {
	        //ray.draw(ctx);
	        //});
	    },
	    drawBody: function drawBody(body) {
	        switch (body.type) {
	            case 'rectangle':
	                {
	                    this.ctx.fillStyle = body.style.fillStyle;
	                    this.ctx.lineWidth = body.style.lineWidth;
	                    this.ctx.strokeStyle = body.style.strokeStyle;
	                    var x = void 0,
	                        y = void 0,
	                        w = void 0,
	                        h = void 0;
	                    switch (body._mode) {
	                        case 'LEFT':
	                            {
	                                x = body.position.x;
	                                y = body.position.y;
	                                w = body.width;
	                                h = body.height;
	                                break;
	                            }
	                        case 'CENTER':
	                            w = body.width;
	                            h = body.height;
	                            x = body.position.x - w / 2;
	                            y = body.position.y - h / 2;
	                            break;
	                        case 'RIGHT':
	                            w = body.width;
	                            h = body.height;
	                            x = body.position.x - w;
	                            y = body.position.y;
	                            break;
	                        default:
	                            break;
	                    }
	                    this.ctx.lineJoin = 'miter';
	                    this.ctx.beginPath();
	                    this.ctx.moveTo(x, y);
	                    this.ctx.lineTo(x + w, y);
	                    this.ctx.lineTo(x + w, y + h);
	                    this.ctx.lineTo(x, y + h);
	                    this.ctx.closePath();
	                    this.ctx.stroke();
	                    break;
	                }
	            case 'circle':
	                {
	                    this.ctx.fillStyle = body.style.fillStyle;
	                    this.ctx.lineWidth = body.style.lineWidth;
	                    this.ctx.strokeStyle = body.style.strokeStyle;
	
	                    this.ctx.beginPath();
	                    this.ctx.ellipse(body.position.x, body.position.y, body.radius, body.radius, 0, 0, Math.PI * 2);
	                    this.ctx.closePath();
	                    this.ctx.stroke();
	                    this.ctx.fill();
	                }
	                break;
	            default:
	                break;
	        }
	    },
	    drawWave: function drawWave(wave) {
	        // No matter what the angle mode, always use radians
	        var angle = wave.mode === 'DEGREES' ? (0, _math.degToRad)(wave.direction) : wave.direction;
	        this.ctx.fillStyle = wave.style.fillStyle;
	        this.ctx.lineWidth = wave.style.lineWidth;
	        this.ctx.strokeStyle = wave.style.strokeStyle;
	        this.ctx.beginPath();
	
	        // If debug == true, draw waves in certain colors
	        if (this.debug) {
	            if (wave.type === 'incident') {
	                // Draw starting circle
	                this.ctx.strokeStyle = 'yellow';
	                this.ctx.fillStyle = 'yellow';
	                this.ctx.beginPath();
	                this.ctx.ellipse(wave.position.x, wave.y, 3, 3, 0, 0, Math.PI * 2);
	                this.ctx.fill();
	                this.ctx.stroke();
	                this.ctx.strokeStyle = 'green';
	            } else if (wave.type === 'refracted') {
	                this.ctx.strokeStyle = 'blue';
	            } else if (wave.type === 'reflected') {
	                this.ctx.strokeStyle = 'orange';
	            }
	        }
	
	        //this.ctx.globalAlpha = map(wave.intensity, 0, 1, 0.3, 1);
	        this.ctx.moveTo(wave.position.x, wave.position.y);
	
	        // If the wave intersects an object ahead, then
	        // only draw to that object. Otherwise draw an arbitrary length
	        if (wave.ray.intersectionPoint) {
	            this.ctx.lineTo(wave.ray.intersectionPoint.x, wave.ray.intersectionPoint.y);
	            this.ctx.stroke();
	            this.ctx.beginPath();
	            this.ctx.strokeStyle = 'red';
	            this.ctx.ellipse(wave.ray.intersectionPoint.x, wave.ray.intersectionPoint.y, 3, 3, 0, 0, Math.PI * 2);
	            //this.ctx.stroke();
	        } else {
	            this.ctx.lineTo(2000 * Math.cos(angle) + wave.position.x, 2000 * Math.sin(angle) + wave.position.y);
	            this.ctx.stroke();
	        }
	    },
	    //draw: function(obj) {
	    //if (obj.type === 'rectangle' ||
	    //obj.type === 'circle' ||
	    //obj.type === 'polygon' ||
	    //obj.type === 'triangle') {
	    //this.drawBody(obj);
	    //}
	    //},
	    render: function render(system) {
	        var _this2 = this;
	
	        // The first time the system renders,
	        // capture a local reference to it
	        // to be used to restart the renderer later
	        // if it's ever stopped
	        if (this.system) {
	            this.system = system;
	        }
	
	        // In order to pass 'system' into render
	        // we have to wrap it in a function before
	        // passing it to requestAnimationFrame
	        var self = this;
	        this._requestID = requestAnimationFrame(function () {
	            self.render(system);
	        });
	
	        // Clear background
	        if (this.clearBackground) {
	            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	        }
	        // Draw background
	        this.ctx.beginPath();
	        this.ctx.fillStyle = this.background;
	        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	
	        // Update the system
	        system.update();
	
	        system.objects.forEach(function (obj) {
	            _this2.drawBody(obj);
	        });
	
	        system.waves.forEach(function (wave) {
	            _this2.drawWave(wave);
	        });
	        system.childWaves.forEach(function (wave) {
	            _this2.drawWave(wave);
	        });
	
	        // Render bodies
	        //this.renderObjects(system);
	    },
	    /**
	     * Set's size of renderers canvas
	     * @param {number} width - width of canvas
	     * @param {number} height - height of canvas
	     */
	    setSize: function setSize(width, height) {
	        this.canvas.width = width;
	        this.canvas.height = height;
	        //if (shouldUpdateStyle) {
	        //canvas.style.width = `${width}px`;
	        //canvas.style.height = `${height}px`;
	        //}
	    },
	    /**
	     * Stop animation cycle
	     * @public
	     */
	    stop: function stop() {
	        cancelAnimationFrame(this.requestID);
	    },
	
	    /**
	     * Restart animation cycle
	     */
	    start: function start() {
	        this.render(this.system);
	    }
	};
	
	var renderer = function renderer(params) {
	    var R = Object.create(Renderer);
	    R.init(params);
	    return R;
	};
	
	exports.default = renderer;
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Body = __webpack_require__(9);
	
	var _Body2 = _interopRequireDefault(_Body);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var rect = function rect(options) {
	    var B = Object.create(_Body2.default);
	    B.init(options);
	    B.type = 'rectangle';
	    B._mode = options.mode || 'LEFT';
	
	    // Define getters and setters for mode
	    Object.defineProperty(B, 'mode', {
	        get: function get() {
	            return this._mode;
	        },
	        set: function set(m) {
	            if (this._mode !== m && this.type === 'rectangle') {
	                switch (m) {
	                    case 'LEFT':
	                    case 'CENTER':
	                    case 'RIGHT':
	                        this._mode = m;
	                        this.updateVertices();
	                        break;
	                    default:
	                        console.warn('Cannot set mode to ' + m);
	                        break;
	                }
	            } else {
	                console.warn('\'mode\' is only available on rectangles');
	            }
	        }
	    });
	
	    B.updateVertices = function () {
	        var w = this.width,
	            h = this.height,
	            x = void 0,
	            y = void 0;
	        switch (this._mode) {
	            case 'LEFT':
	                x = this.position.x;
	                y = this.position.y;
	                break;
	            case 'CENTER':
	                x = this.position.x - w / 2;
	                y = this.position.y - h / 2;
	                break;
	            case 'RIGHT':
	                x = this.x - w;
	                y = this.y;
	                break;
	            default:
	                break;
	        }
	        this.vertices = [{ x: x, y: y }, { x: x + w, y: y }, { x: x + w, y: y + h }, { x: x, y: y + h }];
	    };
	
	    B.updateSegments = function () {
	        // What mode are we in?
	        var x = void 0,
	            y = void 0,
	            w = void 0,
	            h = void 0;
	        //let pos = this.position;
	        switch (this._mode) {
	            case 'LEFT':
	                x = this.position.x;
	                y = this.position.y;
	                w = this.width;
	                h = this.height;
	                break;
	            case 'CENTER':
	                w = this.width;
	                h = this.height;
	                x = this.position.x - w / 2;
	                y = this.position.y - h / 2;
	                break;
	            case 'RIGHT':
	                w = this.width;
	                h = this.height;
	                x = this.x - w;
	                y = this.y;
	                break;
	            default:
	                break;
	        }
	
	        //this.vertices = [
	        //{x: x,     y: y},
	        //{x: x + w, y: y},
	        //{x: x + w, y: y + h},
	        //{x: x,     y: y + h}
	        //];
	        this.segments = [[[x, y], [x + w, y]], [[x + w, y], [x + w, y + h]], [[x + w, y + h], [x, y + h]], [[x, y + h], [x, y]]];
	    };
	
	    B.updateVertices();
	    return B;
	}; /* eslint
	       "no-multi-spaces": "off"
	    */
	exports.default = rect;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _materials = __webpack_require__(10);
	
	var _materials2 = _interopRequireDefault(_materials);
	
	var _Vector = __webpack_require__(3);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	var _math = __webpack_require__(4);
	
	var math = _interopRequireWildcard(_math);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Convenience Function so user doesn't have use 'new' keyword
	 * @param {object} options - initialization options
	 * @return {Body} instance of Body
	 */
	
	var Body = {
	    init: function init(options) {
	        options = options || {};
	        this.style = {
	            fillStyle: options.fillStyle || 'rgba(0,0,0,0)',
	            lineWidth: options.lineWidth || 2,
	            strokeStyle: options.strokeStyle || '#abcabc'
	        };
	        this.mass = options.mass || 0;
	        this.position = (0, _Vector2.default)(options.x || 0, options.y || 0);
	        this.velocity = (0, _Vector2.default)(options.velocity && options.velocity.x || 0, options.velocity && options.velocity.y || 0);
	        this.height = options.height || 10;
	        this.width = options.width || 10;
	        this.refractiveIndex = options.refractiveIndex || 1;
	        this.material = options.material || 'GLASS';
	        this.materialColor = options.fillStyle || 'black';
	        this.mirror = options.mirror || false;
	
	        // If the material is provided, set refractive index based on materials
	        // database
	        // TODO: Make setting either refractive index or material possible!!!
	        if (options.material && options.refractiveIndex) {
	            this.refractiveIndex = options.refractiveIndex;
	            this.material = options.material;
	            console.warn('Setting both the material and the refractive index at the same time may cause some unexpected behavior'); //eslint-disable-line
	        } else if (options.material) {
	            // Check to make sure the material exists in the database
	            if (_materials2.default[this.material]) {
	                this.refractiveIndex = _materials2.default[this.material].refractiveIndex;
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
	    },
	
	    // Should use a raycasting technique to accomodate
	    // arbitrary polygons
	    isPointInterior: function isPointInterior(x, y) {
	        var bx = this.position.x;
	        var by = this.position.y;
	        switch (this.type) {
	            case 'rectangle':
	                if (x >= bx && x <= bx + this.width && y >= by && y <= by + this.height) {
	                    return true;
	                }
	                return false;
	            case 'circle':
	                if (math.distance(x, y, bx, by) <= this.radius) {
	                    return true;
	                }
	                return false;
	            default:
	                break;
	        }
	    },
	    freeze: function freeze() {
	        this._cachedVelocity = this.velocity.clone();
	        this.velocity.x = 0;
	        this.velocity.y = 0;
	    },
	
	    unfreeze: function unfreeze() {
	        if (this._cachedVelocity) {
	            this.velocity.x = this._cachedVelocity.x;
	            this.velocity.y = this._cachedVelocity.y;
	        } else {
	            console.warn('cannot unfreeze a non-frozen object');
	        }
	    },
	
	    update: function update() {
	        if (this.updateSegments) {
	            this.updateSegments();
	        }
	
	        if (this.updateVertices) {
	            this.updateVertices();
	        }
	
	        this.position.add(this.velocity);
	    },
	
	    aabb: function aabb() {
	        switch (this.type) {}
	    }
	}; /* eslint "no-unused-vars": "off" */
	// What should a body be able to do?
	// 1. Attach to other bodies or surfaces
	// 2. Respond to forces (spring, friction)
	// 3. Move according to velocity and acceleration
	
	exports.default = Body;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = {
		"GLASS": {
			"refractiveIndex": 1.5
		},
		"AIR": {
			"refractiveIndex": 1.000277
		}
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _math = __webpack_require__(4);
	
	var _Vector = __webpack_require__(3);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	var _Ray = __webpack_require__(5);
	
	var _Ray2 = _interopRequireDefault(_Ray);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Wave = {
	    init: function init(options) {
	        options = options || {};
	        var speedOfLight = 299792458;
	        this.children = [];
	        //this.outerBodies = [];
	        this.style = {
	            lineWidth: options.lineWidth || 1,
	            strokeStyle: options.strokeStyle || '#456abc'
	        };
	
	        this.x = options.x || 10;
	        this.y = options.y || 10;
	        this.position = (0, _Vector2.default)(options.x, options.y);
	        this.waveSpeed = options.waveSpeed || speedOfLight;
	        this.frequency = options.frequency || 1000;
	        this.wavelength = this.waveSpeed / this.frequency; // Computed Property
	        this.velocity = options.velocity || (0, _Vector2.default)(0, 0);
	        this.direction = options.direction || 0;
	        this.mode = options.mode || 'RADIAN';
	        this.intensity = options.intensity || 1;
	        this.type = options.type || 'incident';
	        this.parent = options.parent || null;
	        //this.intersectingBody = {};
	        //this.intersectionPoint = {};
	        //this.intersectingSegment = {};
	        this.n1 = options.n1 || 1;
	        this.n2 = options.n2 || 1;
	        this.lastIntersection = {};
	        //this.type = 'wave';
	
	        // create ray for detecting body intersections
	        this.ray = (0, _Ray2.default)(this.position.x, this.y, this.direction, this.mode === 'DEGREES' || null);
	    },
	
	    update: function update(system) {
	        this.ray.trace(system);
	
	        // Remove children on every update
	        this.children = [];
	        if (this.ray.intersectionPoint && this.ray.intersectionPoint !== this.lastIntersection) {
	            this.lastIntersection = this.ray.intersectionPoint;
	            this.children = this.createChildren();
	
	            this.children.forEach(function (child) {
	                child.update(system);
	            });
	        }
	    },
	    createChildren: function createChildren() {
	        var _this = this;
	
	        //Vector implementation of reflected and refracted waves here:
	        //http://graphics.stanford.edu/courses/cs148-10-summer/docs/2006--degreve--reflection_refraction.pdf
	        //Normalize ray vector = this.ray.direction
	
	        // Find the normal vector (method of which depends on type of body)
	        // There are two possible normal vectors, but
	        // which one do we want?
	        // one which dot product with ray vector < 0 is what we want
	        // http://gamedev.stackexchange.com/questions/85850/collision-intersection-of-2d-ray-to-line-segment
	        var normal = void 0;
	
	        //selectNormal();
	        // TODO: Wrap this in it's own function (i.e. findNormal function)
	        var bType = this.ray.intersectingBody.type;
	        if (bType === 'rectangle') {
	            (function () {
	                var intSeg = _this.ray.intersectingSegment;
	
	                intSeg.normalize();
	                var dot = intSeg.dot(_this.ray.direction);
	                var normals = [(0, _Vector2.default)(-intSeg.y, intSeg.x), (0, _Vector2.default)(intSeg.y, -intSeg.x)];
	
	                var that = _this;
	                normals.forEach(function (n) {
	                    if (n.dot(that.ray.direction) < 0) {
	                        normal = n;
	                    }
	                });
	            })();
	        } else if (bType === 'circle') {
	            (function () {
	                var cx = _this.ray.intersectingBody.position.x;
	                var cy = _this.ray.intersectingBody.position.y;
	                var ix = _this.ray.intersectionPoint.x;
	                var iy = _this.ray.intersectionPoint.y;
	                var v1 = (0, _Vector2.default)(ix - cx, iy - cy),
	                    v2 = (0, _Vector2.default)(cx - ix, cy - iy);
	                v1.normalize();
	                v2.normalize();
	                var normals = [v1, v2];
	                var that = _this;
	                normals.forEach(function (n) {
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
	            })();
	        }
	
	        // Get angle of incidence
	        //let intX = props.intersectingSegment.getX(),
	        //intY = props.intersectingSegment.getY(),
	        //intSeg = props.intersectingSegment.copy(),
	        //normal;
	        // XXX: Can probably take out the copy of intersectingSegment
	        //intSeg.normalize();
	        //let normals = [vector(-intSeg.getY(), intSeg.getX()), vector(intSeg.getY(), -intSeg.getX())];
	        //let dot = intSeg.dot(rayVector);
	
	        //normals.forEach(n => {
	        //if (n.dot(rayVector) < 0) {
	        //normal = n;
	        //}
	        //});
	
	        // child waves - reflected and refracted
	        // Calculate reflected vector
	        // https://en.wikipedia.org/wiki/Snell%27s_law#Vector_form
	        // http://stackoverflow.com/questions/5454661/reflection-how-do-i-do-it
	        // Reflected vector looks like this:
	        // r = a - 2(a dot n) * n
	        var tmpTerm = 2 * this.ray.direction.dot(normal);
	        var tmpVec = normal.clone();
	        tmpVec.multiply(2 * this.ray.direction.dot(normal));
	        var rVec = this.ray.direction.clone();
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
	                    if (this.parent && this.parent.ray.intersectingBody && this.parent.ray.intersectingBody === this.ray.intersectingBody) {
	                        this.n1 = this.parent.n2;
	                        this.n2 = this.parent.n1;
	                    } else {
	                        this.n1 = this.parent.n2;
	                        this.n2 = this.ray.intersectingBody.refractiveIndex;
	                    }
	                    break;
	                case 'reflected':
	                    if (this.parent && this.parent.ray.intersectingBody && this.parent.ray.intersectingBody === this.intersectingBody) {
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
	
	        var theta1 = Math.PI - this.ray.direction.angleTo(normal);
	        var theta2 = Math.asin(this.n1 * Math.sin(theta1) / this.n2);
	
	        // Vector formulation for refracted wave
	        // t = n1/n2 * rayVector + (n1/n2 * cos(theta1) - sqrt(1
	        // - sin2(theta2))) * normal
	        var sin2theta2 = this.n1 / this.n2 * (this.n1 / this.n2) * (1 - Math.cos(theta1) * Math.cos(theta1));
	        //let tVec = this.rayVector.copy();
	        var tVec = _Vector.Vector.multiply(this.n1 / this.n2, this.ray.direction);
	        //tVec.multiply(n1 / n2);
	        //let normCopy = normal.copy();
	        var normCopy = _Vector.Vector.multiply(normal, this.n1 / this.n2 * Math.cos(theta1) - Math.sqrt(1 - sin2theta2));
	        tVec.add(normCopy);
	
	        // Reflection Coefficient
	        // R = R0 + (1 - R0) * (1 - cos(theta1))^5 where R0 = (n1 - n2 / n1
	        // + n2)^2
	        var _r0 = (this.n1 - this.n2) / (this.n1 + this.n2);
	        var R0 = _r0 * _r0;
	        var _r0tmp = void 0;
	
	        // Angles must be positive, so if we get a negative value for an
	        // angle, just flip it
	        if (this.n1 <= this.n2) {
	            _r0tmp = 1 - (Math.cos(theta1) < 0 ? -Math.cos(theta1) : Math.cos(theta1));
	        } else if (this.n1 > this.n2) {
	            _r0tmp = 1 - (Math.cos(theta2) < 0 ? -Math.cos(theta2) : Math.cos(theta2));
	        }
	
	        var R = R0 + (1 - R0) * Math.pow(_r0tmp, 5);
	        var T = 1 - R; // Refracion Coefficient
	        // Total Internal Reflection
	        if (Math.sin(theta1) > this.n2 / this.n1) {
	            R = 1;
	            T = 0;
	        }
	
	        // If the material should be treated as a mirror
	        if (this.ray.intersectingBody.mirror === true) {
	            R = 0.9;
	            T = 0;
	        }
	
	        var RI = this.intensity * R;
	        var TI = this.intensity * T;
	
	        // Add 2 child waves - reflected and refracted
	        // Trace reflected wave
	        // Have to offset the waves by at least a pixel,
	        // otherwise we'll end up in a never ending
	        // call stack when each child wave always produces
	        // 2 new child waves, forever...
	        var rVecAngle = rVec.getAngle();
	        var tVecAngle = tVec.getAngle();
	        var children = [];
	        if (RI > 0.01) {
	            var reflectedWave = wave({ // eslint-disable-line
	                x: this.ray.intersectionPoint.x + Math.cos(rVecAngle), //normal.x,//Math.cos(rVecAngle),
	                y: this.ray.intersectionPoint.y + Math.sin(rVecAngle), //normal.y, //Math.sin(rVecAngle),
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
	            var refractedWave = wave({ // eslint-disable-line
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
	}; /* eslint "no-unused-vars": "off" */
	
	
	var wave = function wave(options) {
	    var W = Object.create(Wave);
	    W.init(options);
	    return W;
	};
	
	exports.default = wave;
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Body = __webpack_require__(9);
	
	var _Body2 = _interopRequireDefault(_Body);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var circle = function circle(options) {
	    var B = Object.create(_Body2.default);
	    B.init(options);
	
	    B.radius = options.radius || 0;
	    B.type = 'circle';
	
	    return B;
	};
	
	exports.default = circle;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=sciplay.js.map