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
	
	var _Renderer = __webpack_require__(8);
	
	var _Renderer2 = _interopRequireDefault(_Renderer);
	
	var _Rect = __webpack_require__(9);
	
	var _Rect2 = _interopRequireDefault(_Rect);
	
	var _Wave = __webpack_require__(13);
	
	var _Wave2 = _interopRequireDefault(_Wave);
	
	var _Circle = __webpack_require__(14);
	
	var _Circle2 = _interopRequireDefault(_Circle);
	
	var _Polygon = __webpack_require__(15);
	
	var _Polygon2 = _interopRequireDefault(_Polygon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* BODIES */
	
	
	/* CORE OBJECTS */
	/* MATH OBJECTS */
	var sciplay = function sciplay() {
	    return {
	        Vector: _Vector.Vector, // for operations that return a new vector
	        vector: _Vector2.default, // actual vector constructor
	        renderer: _Renderer2.default,
	        ray: _Ray2.default,
	        system: _System2.default,
	        wave: _Wave2.default,
	        rect: _Rect2.default,
	        polygon: _Polygon2.default,
	        circle: _Circle2.default
	    };
	};
	
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
	    negate: function negate() {
	        this.x = -this.x;
	        this.y = -this.y;
	        return this;
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
	    },
	    distanceTo: function distanceTo(vec) {
	        return Math.sqrt((vec.x - this.x) * (vec.x - this.x) + (vec.y - this.y) * (vec.y - this.y));
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
	
	/* eslint
	    "no-unused-vars": "off",
	 */
	var Ray = {
	    /**
	     * Ray object for tracing
	     * @constructs
	     * @param {number} x - origin x
	     * @param {number} y - origin y
	     * @param {number} dir - direction in radians (or degrees if 'degrees' param
	     * = true)
	     * @param {bool} degrees - optional flag, if true, then read direction as
	     * degrees
	     */
	    init: function init(x, y, dir, degrees) {
	        if (degrees) {
	            dir = (0, _math.degToRad)(dir);
	        }
	
	        this.origin = (0, _Vector2.default)(x, y);
	        this.direction = (0, _Vector2.default)(Math.cos(dir), Math.sin(dir));
	        this.invDirection = (0, _Vector2.default)(1 / this.direction.x, 1 / this.direction.y);
	        this.outerBodies = [];
	        this.t = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight;
	        var x0 = this.origin.x,
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
	
	    trace: function trace(system) {
	        // Always use radians, regardless of mode
	        // Also angle should be in range 0 <= angle <= 2PI
	        //let angle = this.direction.getAngle();
	        this.intersectionPoint = null;
	        this.intersectingBody = null;
	        this.intersectingSegment = null;
	
	        // Iterate the rayID to ensure no duplicates
	        this.rayID = system.currentRayId++;
	        this.numTests = 0; // debugging param - how many tests are run
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
	    intersectCircle: function intersectCircle(circle) {
	        this.numTests += 1;
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
	     * Handles case of ray-polygon intersection
	     * If an intersecting segment is found,
	     * set the props accordingly
	     * @private
	     * @param {Polygon} poly - rect body object
	     * @return {bool} true if intersected, otherwise false
	     */
	    intersectPolygon: function intersectPolygon(poly) {
	        var _this = this;
	
	        this.numTests += 1;
	        if (poly.isPointInterior(this.origin)) {
	            this.outerBodies.push(poly);
	        }
	        //let segs = poly.segments;
	        var vertices = poly.vertices;
	        var vertLength = vertices.length;
	        var intersection = void 0;
	        vertices.forEach(function (vert, index, verts) {
	            var seg2 = void 0;
	            if (index === vertLength - 1) {
	                seg2 = verts[0];
	            } else {
	                seg2 = verts[index + 1];
	            }
	
	            intersection = _this.intersectSegment([vert, seg2]);
	            if (intersection) {
	                _this.updateIntersectionPoint(intersection.intPoint, intersection.segVec, poly);
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
	    intersectSegment: function intersectSegment(seg, dir) {
	        var r = dir ? (0, _Vector2.default)(dir.x * this.t, dir.y * this.t) : // Dir passed to fn
	        (0, _Vector2.default)(this.t * this.direction.x, this.t * this.direction.y); // Use ray dir
	        var p = (0, _Vector2.default)(this.origin.x, this.origin.y); // Ray origin
	        var q = (0, _Vector2.default)(seg[0].x, seg[0].y); // Segment start point
	        var s = (0, _Vector2.default)(seg[1].x - seg[0].x, seg[1].y - seg[0].y); // Segment vector
	
	        // check for intersection
	        // t = (q − p) x s / (r x s)
	        // u = (q − p) x r / (r x s)
	        var rxs = r.cross(s);
	        var tmp = _Vector.Vector.subtract(q, p);
	        var tNum = tmp.cross(s),
	            uNum = tmp.cross(r);
	
	        // t, u are distances traveled along vector
	        var t = void 0,
	            u = void 0;
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
	            var px = p.x,
	                py = p.y,
	                rx = r.x,
	                ry = r.y,
	                ix = px + t * rx,
	                iy = py + t * ry;
	
	            return {
	                intPoint: (0, _Vector2.default)(ix, iy),
	                segVec: s,
	                t: t
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
	     * THIS WORKED -> http://www.playchilla.com/ray-casting-spatial-hash-dda
	     */
	    intersectHash: function intersectHash(hash) {
	        var _this2 = this;
	
	        // TODO: Handle case where ray starts outside bounds
	
	        // Initialize variables
	        // Step 1. Initialization - determine starting voxel
	        var bucket = hash.hash(this.origin);
	        var row = bucket.row;
	        var col = bucket.col;
	
	        var X = col,
	            Y = row;
	        var tMaxX = void 0,
	            tMaxY = void 0,
	            tDeltaX = void 0,
	            tDeltaY = void 0;
	        var stepX = this.direction.x < 0 ? -1 : 1,
	            stepY = this.direction.y < 0 ? -1 : 1;
	        var cellSize = hash.cellSize;
	
	        // Row and Col offset for picking which horizontal or veritcal segments
	        // to use for intersection tests
	        // let rowOffset = stepY < 1 ? 0 : 1,
	        //     colOffset = stepX < 1 ? 0 : 1;
	
	        tDeltaX = cellSize / Math.abs(this.direction.x);
	        tDeltaY = cellSize / Math.abs(this.direction.y);
	
	        tMaxX = X * cellSize - this.origin.x;
	        tMaxY = Y * cellSize - this.origin.y;
	        if (this.direction.x >= 0) {
	            tMaxX += cellSize;
	        }
	        if (this.direction.y >= 0) {
	            tMaxY += cellSize;
	        }
	
	        tMaxX /= this.direction.x;
	        tMaxY /= this.direction.y;
	
	        while (Y < hash.numRows && Y > -1 && X < hash.numCols && X > -1) {
	            // In debug mode - Draw buckets that ray overlaps
	            if (window.renderer.debug) {
	                window.ctx.beginPath();
	                window.ctx.globalAlpha = 1;
	                window.ctx.strokeStyle = 'orange';
	                window.ctx.lineWidth = 3;
	                window.ctx.strokeRect(X * cellSize, Y * cellSize, cellSize, cellSize);
	            }
	
	            // If we've found some contents in that hash bucket...
	            if (hash.contents[Y] && hash.contents[Y][X] && hash.contents[Y][X].length !== 0) {
	                // TODO: Here's where we need to check if the object is
	                // actually intersecting the ray
	                // Intersect all objects in this voxel only
	                var contents = hash.contents[Y][X];
	                contents.forEach(function (body) {
	                    if (body.intersectionPoints[_this2.rayID]) {
	                        // Already tested this body
	                        // It either hit or missed, if it hit, grab the point
	                        if (body.intersectionPoints[_this2.rayID].status === 'hit') {
	                            _this2.updateIntersectionPoint(body.intersectionPoints[_this2.rayID].intPoint, body.intersectionPoints[_this2.rayID].segVec, body);
	                            return;
	                        }
	
	                        // It missed, so do nothing;
	                        return;
	                    }
	
	                    // If ray and body haven't been tested, then test
	                    // If it hits the AABB, then perform
	                    // actual intersection tests
	                    var hitsAABB = _this2.intersectAABB(body.aabb);
	                    if (hitsAABB) {
	                        switch (body.type) {
	                            case 'polygon':
	                            case 'rectangle':
	                                _this2.intersectPolygon(body);
	                                break;
	                            case 'circle':
	                                _this2.intersectCircle(body);
	                                break;
	                            default:
	                                break;
	                        }
	                    }
	
	                    // Flag body to know we've already tested this ray-body
	                    // combo
	                    if (_this2.intersectionPoint) {
	                        body.intersectionPoints[_this2.rayID] = {
	                            status: 'hit',
	                            intPoint: _this2.intersectionPoint,
	                            segVeg: _this2.intersectingSegment
	                        };
	                    } else {
	                        // If we missed, flag the body without
	                        // intersectionPoint
	                        body.intersectionPoints[_this2.rayID] = { status: 'miss' };
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
	                tMaxX += tDeltaX;
	                X += stepX;
	            } else if (tMaxX >= tMaxY) {
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
	
	    /**
	     * Axis-Aligned Bounding Box Intersection test
	     * @param {AABB} aabb - the box to test
	     * @return {boolean} true for hit, false for miss
	     */
	    intersectAABB: function intersectAABB(aabb) {
	        var tx1 = (aabb.min.x - this.origin.x) * this.invDirection.x;
	        var tx2 = (aabb.max.x - this.origin.x) * this.invDirection.x;
	
	        var tmin = Math.min(tx1, tx2);
	        var tmax = Math.max(tx1, tx2);
	
	        var ty1 = (aabb.min.y - this.origin.y) * this.invDirection.y;
	        var ty2 = (aabb.max.y - this.origin.y) * this.invDirection.y;
	
	        tmin = Math.max(tmin, Math.min(ty1, ty2));
	        tmax = Math.min(tmax, Math.max(ty1, ty2));
	        var didHit = tmax >= tmin && tmax >= 0;
	        return didHit;
	    },
	
	    /**
	     * Internally used to update point of intersection property
	     * @private
	     * @param {Point} intPoint - object with x and y properties representing
	     * intersection point
	     * @param {Vector} segVec - vector object that was intersected
	     * @param {Body} body - body that was intersected
	     */
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
	
	/**
	 * 'Constructor' function
	 * @public
	 * @param {number} x - origin x
	 * @param {number} y - origin y
	 * @param {number} dir - direction in radians (or degrees if 'degrees' param
	 * = true)
	 * @param {bool} degrees - optional flag, if true, then read direction as
	 * degrees
	 *
	 * @return {object} ray object
	 */
	var ray = function ray(x, y, dir, degrees) {
	    var R = Object.create(Ray);
	    R.init(x, y, dir, degrees);
	    return R;
	};
	
	exports.default = ray;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _SpatialHash = __webpack_require__(7);
	
	var _SpatialHash2 = _interopRequireDefault(_SpatialHash);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var System = {};
	System.prototype = {
	    init: function init(params) {
	        this.frames = [];
	        this.waves = [];
	        this.childWaves = [];
	        this.bodies = [];
	        this.width = params.width || 600;
	        this.height = params.height || 300;
	
	        // Cell size will adjust to fit world precisely
	        // May not be exaclty what user initialized
	        // let divisor = params.cellSize ? params.cellSize : 100;
	        this.cellSize = this.calculateCellSize(params.cellSize || 100);
	        // Initialize spatial hash
	        this.hash = this.initializeHash(this.cellSize, this.width, this.height);
	
	        // Ray ID Counter
	        this.currentRayId = 0;
	    },
	    calculateCellSize: function calculateCellSize(cellSize) {
	        var divisor = cellSize ? cellSize : 100;
	        return this.width / Math.floor(this.width / divisor);
	    },
	    initializeHash: function initializeHash(cellSize, width, height) {
	        return (0, _SpatialHash2.default)(cellSize, width, height);
	    },
	    /**
	     * Resize system - doesn't resize renderer (i.e. canvas)
	     * In event that thing should be drawn outside the system
	     * @param {number} width - new system width
	     * @param {number} height - new system height
	     * @param {number} [cellSize] - optional, new cell size
	     *
	     * @example - reset both system and canvas
	     * system.resize(500, 400, 30);
	     * renderer.resize(500, 400);
	     */
	    // resize: function(width, height, cellSize) {
	    //     this.width = width;
	    //     this.height = height;
	    //     this.cellSize = this.calculateCellSize(cellSize || this.cellSize);
	    //     this.hash = this.initializeHash(this.cellSize, width, height);
	    // },
	    // addFrame: function(frame) {
	    //     this.frames.push(frame);
	    // },
	    addChildWave: function addChildWave(wave) {
	        this.childWaves.push(wave);
	    },
	    // addBody: function(body) {
	    //     this.bodies.push(body);
	    // },
	    addObject: function addObject(obj) {
	        switch (obj.type) {
	            case 'rectangle':
	            case 'circle':
	            case 'polygon':
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
	    add: function add(b) {
	        var _this = this;
	
	        if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object' && b.length !== undefined) {
	            b.forEach(function (body) {
	                _this.addObject(body);
	            });
	        } else {
	            this.addObject(b);
	        }
	    },
	    update: function update() {
	        var _this2 = this;
	
	        // Clear out hash at the start of every update loop
	        this.hash.clear();
	
	        // Put each body into the hash
	        this.bodies.forEach(function (body) {
	            _this2.hash.insertBody(body);
	            body.update();
	        });
	
	        // Each ray needs a unique ID for collision checking
	        // Reset currentRayID during each update loop so we can reuse these
	        // ID's
	        this.currentRayId = 0;
	
	        // Remove all child waves
	        this.childWaves = [];
	
	        // Update each wave and loop through it's chilren
	        this.waves.forEach(function (wave) {
	            wave.update(_this2);
	            _this2.traverseWaves(wave);
	        });
	    },
	
	    /**
	     * Recursively loop through child waves
	     * and add them to the system
	     * @param {Wave} wave - wave object to traverse
	     */
	    traverseWaves: function traverseWaves(wave) {
	        var _this3 = this;
	
	        // If the wave has children
	        // Add each child to the system,
	        // then repeat for each child
	        // Exit condition -> When children have no children
	        if (wave.children.length !== 0) {
	            wave.children.forEach(function (child) {
	                _this3.addChildWave(child);
	                _this3.traverseWaves(child);
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
	var system = function system(params) {
	    var s = Object.create(System.prototype);
	    s.init(params);
	    return s;
	};
	
	exports.default = system;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var SpatialHash = {};
	
	SpatialHash.prototype = {
	    init: function init(cellSize, width, height) {
	        this.cellSize = cellSize;
	        this.width = width;
	        this.height = height;
	        this.numRows = Math.ceil(height / cellSize);
	        this.numCols = width / cellSize;
	        this.contents = {};
	    },
	
	    /**
	     * Return location that should store this point
	     * @param {object} point - object with x and y properties
	     * @return {object} - bucket which th epoint falls into
	     */
	    hash: function hash(point) {
	        return { col: Math.floor(point.x / this.cellSize), row: Math.floor(point.y / this.cellSize) };
	    },
	    insertBody: function insertBody(body) {
	        // Hash the vertices of the AABB
	        var min = this.hash(body.aabb.min);
	        var max = this.hash(body.aabb.max);
	
	        // Iterate over rectangular region
	        // And put the object in all buckets that
	        // it hits
	        for (var r = min.row; r < max.row + 1; r++) {
	            for (var c = min.col; c < max.col + 1; c++) {
	                if (this.contents[r]) {
	                    if (this.contents[r][c]) {
	                        this.contents[r][c].push(body);
	                    } else {
	                        this.contents[r][c] = [body];
	                    }
	                } else {
	                    this.contents[r] = {};
	                    this.contents[r][c] = [body];
	                }
	            }
	        }
	    },
	    updateBody: function updateBody(body) {
	        this.removeBody(body);
	        this.insertBody(body);
	    },
	    removeBody: function removeBody(body) {
	        var min = this.hash(body.aabb.min);
	        var max = this.hash(body.aabb.max);
	
	        // Iterate over rectangular region
	        // And remove the object from all found buckets
	        for (var r = min.row; r < max.row + 1; r++) {
	            for (var c = min.col; c < max.col + 1; c++) {
	                var idx = this.contents[r][c].indexOf(body);
	                if (idx !== -1) {
	                    this.contents[r][c].splice(idx, 1);
	                }
	            }
	        }
	    },
	    queryBody: function queryBody(body) {
	        var min = this.hash(body.aabb.min);
	        var max = this.hash(body.aabb.max);
	        var nearby = [];
	
	        // Iterate over rectangular region
	        // And put the object in all buckets that
	        // it hits
	        for (var r = min.row; r < max.row + 1; r++) {
	            for (var c = min.col; c < max.col + 1; c++) {
	                this.contents[r][c].forEach(function (b) {
	                    if (nearby.indexOf(b) === -1 && b !== body) {
	                        nearby.push(b);
	                    }
	                });
	            }
	        }
	        return nearby;
	    },
	    queryPoint: function queryPoint(point) {
	        var hash = this.hash(point);
	        return hash;
	    },
	    clear: function clear() {
	        this.contents = {};
	    }
	};
	
	var hash = function hash(cellSize, width, height) {
	    var h = Object.create(SpatialHash.prototype);
	    h.init(cellSize, width, height);
	    return h;
	};
	
	exports.default = hash;
	module.exports = exports["default"];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _math = __webpack_require__(4);
	
	var math = _interopRequireWildcard(_math);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var Renderer = {};
	Renderer.prototype = {
	    init: function init(params) {
	        this.clearBackground = true;
	        this.debug = params.debug || false;
	        this.background = params.background || 'black';
	
	        // Initialize Canvas element
	        // Pardon the ugly ternary...
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
	
	        if (this.debug) {
	            window.renderer = this;
	            window.ctx = this.canvas.getContext('2d');
	        }
	
	        //this.canvas.width = params.width || 600;
	        //this.canvas.height = params.height || 300;
	        this.ctx = this.canvas.getContext('2d');
	    },
	
	    /**
	     * Resize the canvas
	     * @param {number} width - new width of canvas
	     * @param {number} height - new height of canvas
	     */
	    resize: function resize(width, height, cellSize) {
	        this.canvas.width = width;
	        this.canvas.height = height;
	        this.system.width = width;
	        this.system.height = height;
	        this.system.cellSize = system.calculateCellSize(cellSize || this.system.cellSize);
	        this.system.hash = this.system.initializeHash(this.system.cellSize, width, height);
	    },
	
	    /**
	     * Draw a body object
	     * @private
	     * @param {Body} body - phys.system object containing all objects
	     */
	    drawBody: function drawBody(body) {
	        if (this.debug) {
	            this.ctx.beginPath();
	            this.ctx.globalAlpha = 1;
	            this.ctx.strokeStyle = 'red';
	            this.ctx.lineWidth = 1;
	
	            var aabb = body.aabb;
	            var x = aabb.min.x;
	            var y = aabb.min.y;
	            var w = aabb.max.x - x;
	            var h = aabb.max.y - y;
	            this.ctx.rect(x, y, w, h);
	            this.ctx.stroke();
	        }
	
	        // Start a new path for each body
	        this.ctx.beginPath();
	        this.ctx.globalAlpha = 1;
	        switch (body.type) {
	            case 'rectangle':
	                {
	                    this.ctx.fillStyle = body.style.fillStyle;
	                    this.ctx.lineWidth = body.style.lineWidth;
	                    this.ctx.strokeStyle = body.style.strokeStyle;
	                    var _x = void 0,
	                        _y = void 0,
	                        _w = void 0,
	                        _h = void 0;
	                    switch (body._mode) {
	                        case 'LEFT':
	                            {
	                                _x = body.position.x;
	                                _y = body.position.y;
	                                _w = body.width;
	                                _h = body.height;
	                                break;
	                            }
	                        case 'CENTER':
	                            _w = body.width;
	                            _h = body.height;
	                            _x = body.position.x - _w / 2;
	                            _y = body.position.y - _h / 2;
	                            break;
	                        case 'RIGHT':
	                            _w = body.width;
	                            _h = body.height;
	                            _x = body.position.x - _w;
	                            _y = body.position.y;
	                            break;
	                        default:
	                            break;
	                    }
	                    this.ctx.lineJoin = 'miter';
	                    this.ctx.moveTo(_x, _y);
	                    this.ctx.lineTo(_x + _w, _y);
	                    this.ctx.lineTo(_x + _w, _y + _h);
	                    this.ctx.lineTo(_x, _y + _h);
	                    this.ctx.closePath();
	                    this.ctx.fill();
	                    this.ctx.stroke();
	                    break;
	                }
	            case 'circle':
	                {
	                    this.ctx.fillStyle = body.style.fillStyle;
	                    this.ctx.lineWidth = body.style.lineWidth;
	                    this.ctx.strokeStyle = body.style.strokeStyle;
	
	                    this.ctx.ellipse(body.position.x, body.position.y, body.radius, body.radius, 0, 0, Math.PI * 2);
	                    // this.ctx.closePath();
	                    this.ctx.stroke();
	                    // this.ctx.fill();
	                    break;
	                }
	            case 'polygon':
	                {
	                    this.ctx.fillStyle = body.style.fillStyle;
	                    this.ctx.lineWidth = body.style.lineWidth;
	                    this.ctx.strokeStyle = body.style.strokeStyle;
	                    this.ctx.lineJoin = 'miter';
	                    this.ctx.moveTo(body.vertices[0].x, body.vertices[0].y);
	                    for (var i = 1; i < body.vertices.length; i++) {
	                        var v = body.vertices[i];
	                        this.ctx.lineTo(v.x, v.y);
	                    }
	                    this.ctx.closePath();
	                    this.ctx.fill();
	                    this.ctx.stroke();
	                    break;
	                }
	            default:
	                break;
	        }
	    },
	    drawWave: function drawWave(wave) {
	        // No matter what the angle mode, always use radians
	        var angle = wave.mode === 'DEGREES' ? math.degToRad(wave.direction) : wave.direction;
	
	        // Set wave style properties
	        this.ctx.fillStyle = wave.style.fillStyle;
	        this.ctx.lineWidth = wave.style.lineWidth;
	        this.ctx.strokeStyle = wave.style.strokeStyle;
	        this.ctx.globalAlpha = math.map(wave.intensity, 0, 1, 0.3, 1);
	
	        // If debug == true, draw waves in certain colors
	        if (this.debug) {
	            if (wave.type === 'incident') {
	                // Draw starting circle
	                this.ctx.beginPath();
	                this.ctx.fillStyle = 'yellow';
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
	
	        this.ctx.beginPath();
	        this.ctx.moveTo(wave.position.x, wave.position.y);
	
	        // If the wave intersects an object ahead, then
	        // only draw to that object. Otherwise draw an arbitrary length
	        if (wave.ray.intersectionPoint) {
	            this.ctx.lineTo(wave.ray.intersectionPoint.x, wave.ray.intersectionPoint.y);
	            this.ctx.stroke();
	
	            // Draw intersection points as circles
	            // when in debug mode
	            if (this.debug) {
	                this.ctx.beginPath();
	                this.ctx.strokeStyle = 'red';
	                this.ctx.lineWidth = 0.5;
	                this.ctx.ellipse(wave.ray.intersectionPoint.x, wave.ray.intersectionPoint.y, 3, 3, 0, 0, Math.PI * 2);
	                this.ctx.stroke();
	            }
	        } else {
	            this.ctx.lineTo(2000 * Math.cos(angle) + wave.position.x, 2000 * Math.sin(angle) + wave.position.y);
	            this.ctx.stroke();
	        }
	    },
	
	    render: function render(system, updateFn) {
	        var _this = this;
	
	        // The first time the system renders,
	        // capture a local reference to it
	        // to be used to restart the renderer later
	        // if it's ever stopped
	        if (!this.system) {
	            this.system = system;
	            this.canvas.width = this.system.width;
	            this.canvas.height = this.system.height;
	        }
	
	        // In order to pass 'system' into render
	        // we have to wrap it in a function before
	        // passing it to requestAnimationFrame
	        var self = this;
	        this._requestID = requestAnimationFrame(function () {
	            self.render(system, updateFn);
	        });
	
	        // Clear background
	        if (this.clearBackground) {
	            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	        }
	        // Draw background
	        this.ctx.beginPath();
	        this.ctx.globalAlpha = 1;
	        this.ctx.fillStyle = this.background;
	        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	
	        // Call user draw code
	        updateFn();
	
	        // Update the system
	        // FIXME: this.laststate isn't doing anything right now
	        this.lastState = system.update();
	
	        // Draw all objects + waves
	        system.bodies.forEach(function (body) {
	            _this.drawBody(body);
	        });
	
	        // Update all waves
	        system.waves.forEach(function (wave) {
	            _this.drawWave(wave);
	        });
	
	        // Update all child waves
	        system.childWaves.forEach(function (wave) {
	            _this.drawWave(wave);
	        });
	
	        // If in debug mode, draw spatial hash
	        // and highlight nodes that contain items in red
	        if (this.debug === true) {
	            (function () {
	                var cellSize = system.hash.cellSize;
	                _this.ctx.globalAlpha = 1;
	                _this.ctx.lineWidth = 0.5;
	                for (var i = 0; i < system.hash.width; i += cellSize) {
	                    for (var j = 0; j < system.hash.height; j += cellSize) {
	                        _this.ctx.beginPath();
	                        _this.ctx.strokeStyle = 'green';
	                        _this.ctx.rect(i, j, cellSize, cellSize);
	                        _this.ctx.stroke();
	                    }
	                }
	                Object.keys(system.hash.contents).forEach(function (row) {
	                    Object.keys(system.hash.contents[row]).forEach(function (col) {
	                        // Draw all squares
	                        _this.ctx.beginPath();
	                        // this.ctx.strokeStyle = 'green';
	                        if (system.hash.contents[row][col].length !== 0) {
	                            _this.ctx.strokeStyle = 'red';
	                        }
	                        _this.ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
	                        _this.ctx.stroke();
	                    });
	                });
	            })();
	        }
	    },
	
	    /**
	     * Set's size of renderers canvas
	     * @param {number} width - width of canvas
	     * @param {number} height - height of canvas
	     */
	    setSize: function setSize(width, height) {
	        this.canvas.width = width;
	        this.canvas.height = height;
	    },
	    /**
	     * Stop animation cycle
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
	    var R = Object.create(Renderer.prototype);
	    R.init(params);
	    return R;
	};
	
	exports.default = renderer;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Body = __webpack_require__(10);
	
	var _Body2 = _interopRequireDefault(_Body);
	
	var _AABB = __webpack_require__(12);
	
	var _AABB2 = _interopRequireDefault(_AABB);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/* eslint
	    "no-multi-spaces": "off"
	 */
	var rect = function rect(options) {
	    options = options || {};
	
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
	
	    /**
	     * Update location of vertices - used in update loop
	     */
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
	
	    /**
	     * Update segments - used in update loop
	     */
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
	
	        this.segments = [[[x, y], [x + w, y]], [[x + w, y], [x + w, y + h]], [[x + w, y + h], [x, y + h]], [[x, y + h], [x, y]]];
	    };
	
	    B.isPointInterior = function (x, y) {
	        var bx = B.position.x,
	            by = B.position.y;
	
	        if (x >= bx && x <= bx + B.width && y >= by && y <= by + B.height) {
	            return true;
	        }
	        return false;
	    };
	
	    B.updateVertices();
	    B.aabb = (0, _AABB2.default)(B);
	    return B;
	};
	
	exports.default = rect;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _materials = __webpack_require__(11);
	
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
	        this.position = (0, _Vector2.default)(options.x || 0, options.y || 0);
	        this.velocity = (0, _Vector2.default)(options.velocity && options.velocity.x || 0, options.velocity && options.velocity.y || 0);
	        this.height = options.height || 10;
	        this.width = options.width || 10;
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
	        this.position.add(this.velocity);
	
	        if (this.updateSegments) {
	            this.updateSegments();
	        }
	
	        if (this.updateVertices) {
	            this.updateVertices();
	        }
	
	        // For each update loop, reset intersection points to zero
	        this.intersectionPoints = {};
	
	        this.aabb.update();
	    }
	
	}; /* eslint "no-unused-vars": "off" */
	// What should a body be able to do?
	// 1. Attach to other bodies or surfaces
	// 2. Respond to forces (spring, friction)
	// 3. Move according to velocity and acceleration
	
	exports.default = Body;
	module.exports = exports['default'];

/***/ },
/* 11 */
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
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/* eslint
	    "no-else-return": "off"
	 */
	var AABB = {
	    init: function init(body) {
	        this.body = body;
	        var bounds = this.findMinMax(body);
	        this.max = bounds.max;
	        this.min = bounds.min;
	    },
	    /**
	     * Finds bounds of AABB
	     * Does not set any properties
	     * If you want to find and set, call AABB.update()
	     * @return {object} bounds
	     */
	    findMinMax: function findMinMax() {
	        var _this = this;
	
	        // Only deal with two types of bodies...Those with vertices, and
	        // circles
	        if (this.body.vertices) {
	            var _ret = function () {
	                var minx = void 0,
	                    miny = void 0,
	                    maxx = void 0,
	                    maxy = void 0;
	                _this.body.vertices.forEach(function (v) {
	                    var x = v.x,
	                        y = v.y;
	
	                    // If nothing has been set, then set it
	                    if (typeof minx === 'undefined') {
	                        minx = x;
	                    } else if (typeof minx !== 'undefined' && x < minx) {
	                        // Something's already there, only update if x < minx
	                        minx = x;
	                    }
	
	                    if (typeof miny === 'undefined') {
	                        miny = y;
	                    } else if (typeof miny !== 'undefined' && y < miny) {
	                        miny = y;
	                    }
	
	                    if (typeof maxx === 'undefined') {
	                        maxx = x;
	                    } else if (typeof maxx !== 'undefined' && x > maxx) {
	                        maxx = x;
	                    }
	
	                    if (typeof maxy === 'undefined') {
	                        maxy = y;
	                    } else if (typeof maxy !== 'undefined' && y > maxy) {
	                        maxy = y;
	                    }
	                });
	
	                return {
	                    v: {
	                        max: {
	                            x: maxx,
	                            y: maxy
	                        },
	                        min: {
	                            x: minx,
	                            y: miny
	                        }
	                    }
	                };
	            }();
	
	            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	        } else {
	            // Assume it's a circle
	            var cx = this.body.position.x,
	                cy = this.body.position.y,
	                r = this.body.radius;
	            return {
	                max: {
	                    x: cx + r,
	                    y: cy + r
	                },
	                min: {
	                    x: cx - r,
	                    y: cy - r
	                }
	            };
	        }
	    },
	
	    /**
	     * Returns true of point is inside AABB
	     * @param {Point} point - must contain x and y props
	     * @return {bool} true if point is inside AABB
	     */
	    contains: function contains(point) {
	        var x = point.x,
	            y = point.y;
	        if (x >= this.min.x && x <= this.max.x && y >= this.min.y && y <= this.max.y) {
	            return true;
	        }
	
	        return false;
	    },
	
	    /**
	     * Updates the AABB
	     */
	    update: function update() {
	        var bounds = this.findMinMax();
	        this.max = bounds.max;
	        this.min = bounds.min;
	    }
	};
	
	var aabb = function aabb(body) {
	    var ab = Object.create(AABB);
	    ab.init(body);
	    return ab;
	};
	
	exports.default = aabb;
	module.exports = exports['default'];

/***/ },
/* 13 */
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
	            strokeStyle: options.strokeStyle || '#456abc',
	            opacity: options.opacity || 1.0
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
	        this.n1 = options.n1 || 1;
	        this.n2 = options.n2 || 1;
	        this.lastIntersection = {};
	
	        // create ray for detecting body intersections
	        this.ray = (0, _Ray2.default)(this.position.x, this.y, this.direction, this.mode === 'DEGREES' || null);
	    },
	
	    update: function update(system) {
	        this.ray.trace(system);
	
	        // Remove children on every update
	        this.children = [];
	        // If the ray intersected a point...
	        if (this.ray.intersectionPoint) {
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
	        if (bType === 'rectangle' || bType === 'polygon') {
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
	        var tVec = _Vector.Vector.multiply(this.n1 / this.n2, this.ray.direction);
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
	
	        // TODO: Refactor this to eliminate some checks if body is a mirror
	        var R = R0 + (1 - R0) * Math.pow(_r0tmp, 5);
	        var T = 1 - R; // Refracion Coefficient
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Body = __webpack_require__(10);
	
	var _Body2 = _interopRequireDefault(_Body);
	
	var _AABB = __webpack_require__(12);
	
	var _AABB2 = _interopRequireDefault(_AABB);
	
	var _math = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var circle = function circle(options) {
	    options = options || {};
	    var B = Object.create(_Body2.default);
	    B.init(options);
	
	    B.radius = options.radius || 0;
	    B.type = 'circle';
	    B.aabb = (0, _AABB2.default)(B);
	
	    B.isPointInterior = function (x, y) {
	        var bx = B.position.x,
	            by = B.position.y;
	        if ((0, _math.distance)(x, y, bx, by) <= B.radius) {
	            return true;
	        }
	        return false;
	    };
	
	    return B;
	};
	
	exports.default = circle;
	module.exports = exports['default'];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Body = __webpack_require__(10);
	
	var _Body2 = _interopRequireDefault(_Body);
	
	var _AABB = __webpack_require__(12);
	
	var _AABB2 = _interopRequireDefault(_AABB);
	
	var _Vector = __webpack_require__(3);
	
	var _Vector2 = _interopRequireDefault(_Vector);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var polygon = function polygon(options) {
	    options = options || {};
	
	    var B = Object.create(_Body2.default);
	    if (!options.vertices) {
	        throw new Error('Polygons MUST be initialized with vertices. See docs.');
	    }
	    B.init(options);
	
	    //Initialize vetices as vectors
	    // private vertices, relative to x and y
	    B._relativeVertices = [];
	
	    // public vertices, (contain world coords);
	    B.vertices = [];
	    options.vertices.forEach(function (vert) {
	        B._relativeVertices.push((0, _Vector2.default)(vert.x, vert.y));
	        B.vertices.push((0, _Vector2.default)(options.x + vert.x, options.y + vert.y));
	    });
	
	    // Set type
	    B.type = 'polygon';
	
	    // Update all vertices based on position
	    B.updateVertices = function () {
	        B.vertices.forEach(function (vert, index) {
	            var relVert = B._relativeVertices[index];
	            vert.x = relVert.x + B.position.x;
	            vert.y = relVert.y + B.position.y;
	        });
	    };
	
	    B.isPointInterior = function (x, y) {
	        var inside = false;
	        for (var i = 0, j = B.vertices.length - 1; i < B.vertices.length; j = i++) {
	            var vi = B.vertices[i];
	            var vj = B.vertices[j];
	            var xi = vi.x,
	                yi = vi.y;
	            var xj = vj.x,
	                yj = vj.y;
	
	            var intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
	            if (intersect) {
	                inside = !inside;
	            }
	        }
	        return inside;
	    };
	
	    // Initialize...
	    B.updateVertices();
	    B.aabb = (0, _AABB2.default)(B);
	    return B;
	};
	
	exports.default = polygon;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=sciplay.js.map